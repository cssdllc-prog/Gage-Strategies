import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import { FileText, Plus, Trash2, Download, Eye } from "lucide-react";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceGenerator() {
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${String(Date.now()).slice(-6)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("Payment is due within 30 days. Thank you for your business!");
  const [currency, setCurrency] = useState("USD");
  const [items, setItems] = useState<LineItem[]>([{ id: "1", description: "", quantity: 1, rate: 0 }]);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const CURRENCIES = [
    { id: "USD", symbol: "$" },
    { id: "EUR", symbol: "\u20AC" },
    { id: "GBP", symbol: "\u00A3" },
    { id: "CAD", symbol: "C$" },
    { id: "AUD", symbol: "A$" },
  ];

  const currencySymbol = CURRENCIES.find((c) => c.id === currency)?.symbol || "$";

  const addItem = () => {
    setItems((prev) => [...prev, { id: String(Date.now()), description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const downloadInvoice = () => {
    if (!companyName || !clientName || items.every((i) => !i.description)) {
      toast.error("Please fill in company name, client name, and at least one line item.");
      return;
    }
    // Generate printable HTML
    const html = `<!DOCTYPE html><html><head><title>Invoice ${invoiceNumber}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#1a1a1a}h1{color:#1a5c4b;margin:0}.header{display:flex;justify-content:space-between;margin-bottom:40px}.info{margin-bottom:30px}.info h3{margin:0 0 8px;font-size:14px;color:#666}.info p{margin:2px 0;font-size:13px}table{width:100%;border-collapse:collapse;margin:20px 0}th{background:#f5f5f5;text-align:left;padding:10px;font-size:13px;border-bottom:2px solid #ddd}td{padding:10px;font-size:13px;border-bottom:1px solid #eee}.totals{text-align:right;margin-top:20px}.totals p{margin:4px 0;font-size:14px}.totals .total{font-size:20px;font-weight:bold;color:#1a5c4b}.notes{margin-top:40px;padding:15px;background:#f9f9f9;border-radius:8px;font-size:12px;color:#666}@media print{body{padding:20px}}</style></head><body><div class="header"><div><h1>${companyName}</h1><p style="color:#666;font-size:13px">${companyEmail}</p><p style="color:#666;font-size:13px">${companyAddress}</p></div><div style="text-align:right"><h2 style="color:#1a5c4b;margin:0">INVOICE</h2><p style="font-size:13px">${invoiceNumber}</p><p style="font-size:13px">Date: ${invoiceDate}</p><p style="font-size:13px">Due: ${dueDate}</p></div></div><div class="info"><h3>Bill To:</h3><p><strong>${clientName}</strong></p><p>${clientEmail}</p><p>${clientAddress}</p></div><table><thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th style="text-align:right">Amount</th></tr></thead><tbody>${items.filter((i) => i.description).map((i) => `<tr><td>${i.description}</td><td>${i.quantity}</td><td>${currencySymbol}${i.rate.toFixed(2)}</td><td style="text-align:right">${currencySymbol}${(i.quantity * i.rate).toFixed(2)}</td></tr>`).join("")}</tbody></table><div class="totals"><p>Subtotal: ${currencySymbol}${subtotal.toFixed(2)}</p>${discount > 0 ? `<p>Discount (${discount}%): -${currencySymbol}${discountAmount.toFixed(2)}</p>` : ""}${taxRate > 0 ? `<p>Tax (${taxRate}%): ${currencySymbol}${taxAmount.toFixed(2)}</p>` : ""}<p class="total">Total: ${currencySymbol}${total.toFixed(2)}</p></div>${notes ? `<div class="notes"><strong>Notes:</strong><br>${notes}</div>` : ""}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoiceNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Invoice downloaded! Open in browser and print to PDF.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="border-b border-border bg-gradient-to-b from-background to-card/30">
        <div className="container py-16 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">Free Tool</span>
          </div>
          <h1 className="mb-4 text-foreground text-3xl md:text-4xl font-bold">Invoice Generator</h1>
          <p className="text-lg text-foreground/70 max-w-3xl">
            Create professional invoices in seconds. Add line items, taxes, discounts, and download as a printable document. No account needed.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company & Client */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-border bg-card">
                  <h3 className="text-sm font-semibold text-foreground mb-3">From (Your Business)</h3>
                  <div className="space-y-3">
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name *" />
                    <Input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="Email" />
                    <Input value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="Address" />
                  </div>
                </div>
                <div className="p-5 rounded-xl border border-border bg-card">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Bill To (Client)</h3>
                  <div className="space-y-3">
                    <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client Name *" />
                    <Input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="Email" />
                    <Input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Address" />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="text-sm font-semibold text-foreground mb-3">Invoice Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-foreground/60 mb-1 block">Invoice #</label>
                    <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-foreground/60 mb-1 block">Date</label>
                    <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-foreground/60 mb-1 block">Due Date</label>
                    <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-foreground/60 mb-1 block">Currency</label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm">
                      {CURRENCIES.map((c) => <option key={c.id} value={c.id}>{c.id} ({c.symbol})</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="text-sm font-semibold text-foreground mb-3">Line Items</h3>
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        placeholder="Description"
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                        className="w-20"
                        placeholder="Qty"
                      />
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                        className="w-28"
                        placeholder="Rate"
                      />
                      <span className="text-sm text-foreground/70 w-24 text-right">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</span>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 text-foreground/30 hover:text-red-500 transition-colors" disabled={items.length <= 1}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addItem} className="mt-3">
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Item
                </Button>
              </div>

              {/* Tax & Discount */}
              <div className="p-5 rounded-xl border border-border bg-card">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-foreground/60 mb-1 block">Tax Rate (%)</label>
                    <Input type="number" step="0.5" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className="text-xs text-foreground/60 mb-1 block">Discount (%)</label>
                    <Input type="number" step="0.5" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-xs text-foreground/60 mb-1 block">Notes</label>
                  <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, thank you note..." />
                </div>
              </div>
            </div>

            {/* Summary & Actions */}
            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-border bg-card shadow-sm sticky top-8">
                <h3 className="text-sm font-semibold text-foreground mb-4">Invoice Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-foreground/60">Subtotal</span><span className="text-foreground">{currencySymbol}{subtotal.toFixed(2)}</span></div>
                  {discount > 0 && <div className="flex justify-between"><span className="text-foreground/60">Discount ({discount}%)</span><span className="text-red-500">-{currencySymbol}{discountAmount.toFixed(2)}</span></div>}
                  {taxRate > 0 && <div className="flex justify-between"><span className="text-foreground/60">Tax ({taxRate}%)</span><span className="text-foreground">{currencySymbol}{taxAmount.toFixed(2)}</span></div>}
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between"><span className="font-semibold text-foreground">Total</span><span className="text-xl font-bold text-primary">{currencySymbol}{total.toFixed(2)}</span></div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button onClick={downloadInvoice} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Download className="w-4 h-4 mr-2" /> Download Invoice
                  </Button>
                  <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="w-full">
                    <Eye className="w-4 h-4 mr-2" /> {showPreview ? "Hide" : "Show"} Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div ref={previewRef} className="mt-8 p-8 rounded-xl border border-border bg-white text-gray-900 shadow-lg">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{companyName || "Your Company"}</h2>
                  <p className="text-sm text-gray-500">{companyEmail}</p>
                  <p className="text-sm text-gray-500">{companyAddress}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold text-primary">INVOICE</h3>
                  <p className="text-sm text-gray-500">{invoiceNumber}</p>
                  <p className="text-sm text-gray-500">Date: {invoiceDate}</p>
                  <p className="text-sm text-gray-500">Due: {dueDate}</p>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-1">Bill To</h4>
                <p className="font-medium text-gray-900">{clientName || "Client Name"}</p>
                <p className="text-sm text-gray-500">{clientEmail}</p>
                <p className="text-sm text-gray-500">{clientAddress}</p>
              </div>
              <table className="w-full text-sm mb-6">
                <thead><tr className="border-b-2 border-gray-200"><th className="text-left py-2 text-gray-600">Description</th><th className="text-right py-2 text-gray-600">Qty</th><th className="text-right py-2 text-gray-600">Rate</th><th className="text-right py-2 text-gray-600">Amount</th></tr></thead>
                <tbody>
                  {items.filter((i) => i.description).map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-2 text-gray-900">{item.description}</td>
                      <td className="py-2 text-right text-gray-700">{item.quantity}</td>
                      <td className="py-2 text-right text-gray-700">{currencySymbol}{item.rate.toFixed(2)}</td>
                      <td className="py-2 text-right text-gray-900 font-medium">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-right space-y-1">
                <p className="text-sm text-gray-600">Subtotal: {currencySymbol}{subtotal.toFixed(2)}</p>
                {discount > 0 && <p className="text-sm text-red-500">Discount: -{currencySymbol}{discountAmount.toFixed(2)}</p>}
                {taxRate > 0 && <p className="text-sm text-gray-600">Tax: {currencySymbol}{taxAmount.toFixed(2)}</p>}
                <p className="text-xl font-bold text-primary mt-2">Total: {currencySymbol}{total.toFixed(2)}</p>
              </div>
              {notes && <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">{notes}</div>}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-card/50 border-t border-border py-8">
        <div className="container text-center">
          <p className="text-foreground/50 text-sm">&copy; {new Date().getFullYear()} GAGE Strategies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
