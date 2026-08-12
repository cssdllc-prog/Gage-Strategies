import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { CreditCard, TrendingUp } from "lucide-react";

export default function AdminPurchases() {
  const { data: purchases = [], isLoading } = trpc.admin.purchases.list.useQuery();

  const totalRevenue = purchases.reduce((sum: number, p: any) => sum + parseFloat(p.amount || "0"), 0);
  const activeSubscriptions = purchases.filter((p: any) => p.type === "subscription" && p.status === "active").length;
  const oneTimePurchases = purchases.filter((p: any) => p.type === "one_time").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Purchases & Subscriptions</h1>
          <p className="text-foreground/60">Track all customer purchases and active subscriptions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-sm text-foreground/60 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-sm text-foreground/60 mb-1">Total Purchases</p>
            <p className="text-2xl font-bold text-foreground">{purchases.length}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-sm text-foreground/60 mb-1">Active Subscriptions</p>
            <p className="text-2xl font-bold text-blue-600">{activeSubscriptions}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-sm text-foreground/60 mb-1">One-Time Purchases</p>
            <p className="text-2xl font-bold text-amber-600">{oneTimePurchases}</p>
          </div>
        </div>

        {/* Purchases Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground/70">ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground/70">User</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground/70">Product</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground/70">Type</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground/70">Amount</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground/70">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground/70">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-foreground/60">Loading...</td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-foreground/60">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-foreground/30" />
                    <p>No purchases yet</p>
                  </td>
                </tr>
              ) : (
                purchases.map((purchase: any) => (
                  <tr key={purchase.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm text-foreground/70">#{purchase.id}</td>
                    <td className="px-4 py-3 text-sm text-foreground">User #{purchase.userId}</td>
                    <td className="px-4 py-3 text-sm text-foreground">Product #{purchase.productId}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={
                        purchase.type === "subscription" ? "border-blue-200 text-blue-700 bg-blue-50" : "border-amber-200 text-amber-700 bg-amber-50"
                      }>
                        {purchase.type === "subscription" ? "Monthly" : "One-time"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      ${purchase.amount} {purchase.currency?.toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={
                        purchase.status === "active" ? "border-green-200 text-green-700 bg-green-50" :
                        purchase.status === "cancelled" ? "border-red-200 text-red-700 bg-red-50" :
                        "border-gray-200 text-gray-700 bg-gray-50"
                      }>
                        {purchase.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/60">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
