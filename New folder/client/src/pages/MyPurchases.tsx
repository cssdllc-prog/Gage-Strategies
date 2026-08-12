import { useLocation } from "wouter";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, Package, XCircle, RotateCcw, FileText, ExternalLink, Receipt, CreditCard, Filter, FileDown, CheckSquare, Square, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export default function MyPurchases() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [bulkDownloading, setBulkDownloading] = useState(false);

  const utils = trpc.useUtils();
  const { data: purchases = [], isLoading } = trpc.purchases.myPurchases.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: invoices = [], isLoading: invoicesLoading } = trpc.purchases.billingHistory.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const cancelMutation = trpc.purchases.cancelSubscription.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.purchases.myPurchases.invalidate();
      setCancelDialogOpen(false);
      setSelectedPurchase(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cancel subscription");
    },
  });

  const resumeMutation = trpc.purchases.resumeSubscription.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.purchases.myPurchases.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resume subscription");
    },
  });

  const bulkDownloadMutation = trpc.assets.bulkBrandedDownload.useMutation({
    onSuccess: (data) => {
      if (data.files.length === 0) {
        const failMsg = data.failures?.length
          ? `Failed: ${data.failures.map((f: any) => f.productName).join(", ")}`
          : "No downloadable files found for selected products.";
        toast.error(failMsg);
        setBulkDownloading(false);
        return;
      }
      let downloadCount = 0;
      for (const file of data.files) {
        if (file.type === "html") {
          const blob = new Blob([file.content], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = file.fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          downloadCount++;
        } else if (file.type === "redirect") {
          window.open(file.content, "_blank");
          downloadCount++;
        }
      }
      const successMsg = `Downloaded ${downloadCount} branded file${downloadCount !== 1 ? "s" : ""}!`;
      if (data.failures?.length > 0) {
        toast.warning(`${successMsg} (${data.failures.length} product${data.failures.length !== 1 ? "s" : ""} failed)`);
      } else {
        toast.success(successMsg);
      }
      setSelectedProducts(new Set());
      setBulkDownloading(false);
    },
    onError: (error) => {
      toast.error(error.message || "Bulk download failed");
      setBulkDownloading(false);
    },
  });

  const handleToggleProduct = useCallback((productId: number) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedProducts.size === purchases.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(purchases.map((p: any) => p.productId)));
    }
  }, [purchases, selectedProducts.size]);

  const handleBulkDownload = () => {
    if (selectedProducts.size === 0) {
      toast.error("Select at least one product to download.");
      return;
    }
    setBulkDownloading(true);
    bulkDownloadMutation.mutate({ productIds: Array.from(selectedProducts) });
  };

  const handleResume = (purchase: any) => {
    resumeMutation.mutate({ purchaseId: purchase.id });
  };

  const billingPortalMutation = trpc.purchases.createBillingPortalSession.useMutation({
    onSuccess: (data) => {
      window.open(data.url, '_blank');
      toast.success("Opening Stripe billing portal...");
      setPaymentMethodDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to open billing portal");
      setPaymentMethodDialogOpen(false);
    },
  });

  const handleCancelClick = (purchase: any) => {
    setSelectedPurchase(purchase);
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (selectedPurchase) {
      cancelMutation.mutate({ purchaseId: selectedPurchase.id });
    }
  };

  // Filtered and sorted invoices
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];
    if (statusFilter !== "all") {
      result = result.filter((inv: any) => inv.status === statusFilter);
    }
    if (sortOrder === "newest") {
      result.sort((a: any, b: any) => b.created - a.created);
    } else if (sortOrder === "oldest") {
      result.sort((a: any, b: any) => a.created - b.created);
    } else if (sortOrder === "amount_high") {
      result.sort((a: any, b: any) => b.amountPaid - a.amountPaid);
    } else if (sortOrder === "amount_low") {
      result.sort((a: any, b: any) => a.amountPaid - b.amountPaid);
    }
    return result;
  }, [invoices, statusFilter, sortOrder]);

  // CSV export handler
  const handleExportCSV = () => {
    if (invoices.length === 0) {
      toast.error("No invoices to export");
      return;
    }
    const headers = ["Invoice Number", "Date", "Amount", "Currency", "Status", "Product"];
    const rows = filteredInvoices.map((inv: any) => [
      inv.number || inv.id,
      new Date(inv.created * 1000).toLocaleDateString(),
      `$${(inv.amountPaid / 100).toFixed(2)}`,
      (inv.currency || "usd").toUpperCase(),
      inv.status || "unknown",
      inv.productName || "",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row: string[]) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `billing-history-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Billing history exported as CSV");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-24 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Sign In Required</h2>
          <p className="text-foreground/70 mb-8">Please sign in to view your purchases.</p>
          <Button
            onClick={() => { window.location.href = getLoginUrl(); }}
            className="bg-accent hover:bg-accent/90 text-foreground font-semibold"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Purchases</h1>
        <p className="text-foreground/70 mb-8">View and access all your purchased solutions</p>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-6 rounded-lg border border-border bg-card">
                <div className="h-5 bg-muted rounded w-1/3 mb-3" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-lg bg-card">
            <Package className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No purchases yet</h3>
            <p className="text-foreground/70 mb-6">Browse our Solutions Hub to find tools that fit your business.</p>
            <Button
              onClick={() => navigate("/solutions")}
              className="bg-accent hover:bg-accent/90 text-foreground font-semibold"
            >
              Browse Solutions
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bulk Download Toolbar */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedProducts.size === purchases.length && purchases.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
                <span className="text-sm text-foreground/70">
                  {selectedProducts.size > 0
                    ? `${selectedProducts.size} of ${purchases.length} selected`
                    : "Select products for bulk download"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDownload}
                disabled={selectedProducts.size === 0 || bulkDownloading}
                className="border-primary/30 text-primary hover:bg-primary/5"
              >
                {bulkDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-1" />
                    Download Selected ({selectedProducts.size})
                  </>
                )}
              </Button>
            </div>

            {purchases.map((purchase: any) => (
              <div key={purchase.id} className={`p-6 rounded-lg border bg-card transition-colors ${selectedProducts.has(purchase.productId) ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedProducts.has(purchase.productId)}
                      onCheckedChange={() => handleToggleProduct(purchase.productId)}
                      aria-label={`Select ${purchase.productName}`}
                    />
                    <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">{purchase.productName || `Product #${purchase.productId}`}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        purchase.status === "active" ? "bg-green-100 text-green-800" :
                        purchase.status === "pending_cancel" ? "bg-yellow-100 text-yellow-800" :
                        purchase.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {purchase.status === "pending_cancel" ? "Cancels at period end" : purchase.status}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        purchase.type === "subscription" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {purchase.type === "subscription" ? "Monthly" : "One-time"}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/60">
                      Purchased {new Date(purchase.createdAt).toLocaleDateString()} • ${purchase.amount} {purchase.currency?.toUpperCase()}
                    </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Cancel Subscription Button - only for active subscriptions */}
                    {purchase.type === "subscription" && purchase.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelClick(purchase)}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                    {/* Resume Subscription Button - only for pending_cancel subscriptions */}
                    {purchase.type === "subscription" && purchase.status === "pending_cancel" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResume(purchase)}
                        disabled={resumeMutation.isPending}
                        className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        {resumeMutation.isPending ? "Resuming..." : "Resume"}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/solution/${purchase.productId}`)}
                      className="border-primary/30 text-primary"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Access Files
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Billing History Section */}
      {isAuthenticated && purchases.length > 0 && (
        <div className="container py-12 max-w-4xl mx-auto border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Receipt className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Billing History</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={invoices.length === 0}
                className="text-foreground/70 hover:text-foreground"
              >
                <FileDown className="w-4 h-4 mr-1.5" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaymentMethodDialogOpen(true)}
                className="border-primary/30 text-primary hover:bg-primary/5"
              >
                <CreditCard className="w-4 h-4 mr-1.5" />
                Update Payment Method
              </Button>
            </div>
          </div>

          {/* Filter and Sort Controls */}
          {invoices.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-foreground/50" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="void">Void</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[150px] h-8 text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount_high">Amount (High-Low)</SelectItem>
                  <SelectItem value="amount_low">Amount (Low-High)</SelectItem>
                </SelectContent>
              </Select>
              {statusFilter !== "all" && (
                <span className="text-xs text-foreground/50">
                  Showing {filteredInvoices.length} of {invoices.length} invoices
                </span>
              )}
            </div>
          )}

          {invoicesLoading ? (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 flex gap-4">
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                <div className="h-4 bg-muted rounded w-14 animate-pulse" />
                <div className="ml-auto h-4 bg-muted rounded w-20 animate-pulse" />
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-4 py-4 border-t border-border flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                    <div>
                      <div className="h-4 bg-muted rounded w-32 mb-1 animate-pulse" />
                      <div className="h-3 bg-muted rounded w-24 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                  <div className="h-5 bg-muted rounded-full w-12 animate-pulse" />
                  <div className="flex gap-2 ml-auto">
                    <div className="h-7 bg-muted rounded w-14 animate-pulse" />
                    <div className="h-7 bg-muted rounded w-14 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-10 border border-border rounded-lg bg-card">
              <FileText className="w-12 h-12 text-foreground/30 mx-auto mb-3" />
              <p className="text-foreground/60">No invoices yet. Invoices will appear here after your first payment.</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-10 border border-border rounded-lg bg-card">
              <Filter className="w-12 h-12 text-foreground/30 mx-auto mb-3" />
              <p className="text-foreground/60">No invoices match the selected filter.</p>
              <Button variant="link" size="sm" onClick={() => setStatusFilter("all")} className="mt-2">
                Clear filter
              </Button>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/70">Invoice</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/70">Date</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/70">Amount</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/70">Status</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-foreground/70">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInvoices.map((invoice: any) => (
                    <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-foreground/50" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{invoice.number || invoice.id.slice(0, 12)}</p>
                            {invoice.productName && (
                              <p className="text-xs text-foreground/50">{invoice.productName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground/70">
                        {new Date(invoice.created * 1000).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        ${(invoice.amountPaid / 100).toFixed(2)} {invoice.currency.toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          invoice.status === "paid" ? "bg-green-100 text-green-800" :
                          invoice.status === "open" ? "bg-blue-100 text-blue-800" :
                          invoice.status === "void" ? "bg-gray-100 text-gray-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {invoice.invoicePdf && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(invoice.invoicePdf, '_blank')}
                              className="text-xs"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              PDF
                            </Button>
                          )}
                          {invoice.hostedInvoiceUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(invoice.hostedInvoiceUrl, '_blank')}
                              className="text-xs"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Cancel Subscription Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription to{" "}
              <strong>{selectedPurchase?.productName}</strong>?
              <br /><br />
              Your subscription will remain active until the end of the current billing period. After that, you will lose access to the solution files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelMutation.isPending}>
              Keep Subscription
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              disabled={cancelMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel Subscription"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Payment Method Confirmation Dialog */}
      <AlertDialog open={paymentMethodDialogOpen} onOpenChange={setPaymentMethodDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Update Payment Method
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to be redirected to Stripe's secure billing portal where you can safely update your credit card or payment method on file.
              <br /><br />
              <span className="text-foreground/70 font-medium">This is a secure, encrypted connection managed by Stripe.</span> Your payment details are never stored on our servers.
              <br /><br />
              After updating, you will be returned to this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={billingPortalMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => billingPortalMutation.mutate()}
              disabled={billingPortalMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {billingPortalMutation.isPending ? "Redirecting..." : "Continue to Stripe"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
