import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import { PieChart, TrendingUp, DollarSign, Download, Plus, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  revenue: number;
  cogs: number;
  expenses: number;
}

export default function ProfitMarginCalculator() {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Product A", revenue: 10000, cogs: 4000, expenses: 2000 },
  ]);

  const calculations = useMemo(() => {
    return products.map((p) => {
      const grossProfit = p.revenue - p.cogs;
      const netProfit = grossProfit - p.expenses;
      const grossMargin = p.revenue > 0 ? (grossProfit / p.revenue) * 100 : 0;
      const netMargin = p.revenue > 0 ? (netProfit / p.revenue) * 100 : 0;
      const markup = p.cogs > 0 ? (grossProfit / p.cogs) * 100 : 0;
      const breakEvenRevenue = p.expenses > 0 && grossMargin > 0 ? p.expenses / (grossMargin / 100) : 0;
      return { ...p, grossProfit, netProfit, grossMargin, netMargin, markup, breakEvenRevenue };
    });
  }, [products]);

  const totals = useMemo(() => {
    const totalRevenue = products.reduce((s, p) => s + p.revenue, 0);
    const totalCogs = products.reduce((s, p) => s + p.cogs, 0);
    const totalExpenses = products.reduce((s, p) => s + p.expenses, 0);
    const totalGross = totalRevenue - totalCogs;
    const totalNet = totalGross - totalExpenses;
    return {
      revenue: totalRevenue,
      cogs: totalCogs,
      expenses: totalExpenses,
      grossProfit: totalGross,
      netProfit: totalNet,
      grossMargin: totalRevenue > 0 ? (totalGross / totalRevenue) * 100 : 0,
      netMargin: totalRevenue > 0 ? (totalNet / totalRevenue) * 100 : 0,
    };
  }, [products]);

  const updateProduct = (id: string, field: keyof Product, value: string | number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: typeof value === "string" && field !== "name" ? parseFloat(value) || 0 : value } : p)));
  };

  const addProduct = () => {
    if (products.length >= 8) { toast.error("Maximum 8 products."); return; }
    setProducts((prev) => [...prev, { id: String(Date.now()), name: `Product ${prev.length + 1}`, revenue: 0, cogs: 0, expenses: 0 }]);
  };

  const removeProduct = (id: string) => {
    if (products.length <= 1) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const exportCSV = () => {
    const headers = ["Product", "Revenue", "COGS", "Expenses", "Gross Profit", "Net Profit", "Gross Margin %", "Net Margin %", "Markup %"];
    const rows = calculations.map((c) => [c.name, c.revenue, c.cogs, c.expenses, c.grossProfit.toFixed(2), c.netProfit.toFixed(2), c.grossMargin.toFixed(1), c.netMargin.toFixed(1), c.markup.toFixed(1)]);
    rows.push(["TOTAL", totals.revenue, totals.cogs, totals.expenses, totals.grossProfit.toFixed(2), totals.netProfit.toFixed(2), totals.grossMargin.toFixed(1), totals.netMargin.toFixed(1), ""]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "profit-margin-analysis.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="border-b border-border bg-gradient-to-b from-background to-card/30">
        <div className="container py-16 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <PieChart className="w-6 h-6 text-primary" />
            </div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">Free Tool</span>
          </div>
          <h1 className="mb-4 text-foreground text-3xl md:text-4xl font-bold">Profit Margin Calculator</h1>
          <p className="text-lg text-foreground/70 max-w-3xl">
            Calculate gross and net profit margins for multiple products. Visualize your margins, compare products, and export results.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-xs text-foreground/60 uppercase font-medium">Total Revenue</span>
              </div>
              <p className="text-xl font-bold text-foreground">${totals.revenue.toLocaleString()}</p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs text-foreground/60 uppercase font-medium">Gross Margin</span>
              </div>
              <p className={`text-xl font-bold ${totals.grossMargin >= 0 ? "text-green-600" : "text-red-500"}`}>{totals.grossMargin.toFixed(1)}%</p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-1">
                <PieChart className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-foreground/60 uppercase font-medium">Net Margin</span>
              </div>
              <p className={`text-xl font-bold ${totals.netMargin >= 0 ? "text-blue-600" : "text-red-500"}`}>{totals.netMargin.toFixed(1)}%</p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-foreground/60 uppercase font-medium">Net Profit</span>
              </div>
              <p className={`text-xl font-bold ${totals.netProfit >= 0 ? "text-foreground" : "text-red-500"}`}>${totals.netProfit.toLocaleString()}</p>
            </div>
          </div>

          {/* Product Inputs */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Products / Services</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportCSV}><Download className="w-3.5 h-3.5 mr-1.5" /> Export</Button>
                <Button variant="outline" size="sm" onClick={addProduct}><Plus className="w-3.5 h-3.5 mr-1.5" /> Add Product</Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-foreground/60 font-medium">Name</th>
                    <th className="text-right py-2 text-foreground/60 font-medium">Revenue ($)</th>
                    <th className="text-right py-2 text-foreground/60 font-medium">COGS ($)</th>
                    <th className="text-right py-2 text-foreground/60 font-medium">Expenses ($)</th>
                    <th className="text-right py-2 text-foreground/60 font-medium">Gross %</th>
                    <th className="text-right py-2 text-foreground/60 font-medium">Net %</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {calculations.map((calc) => (
                    <tr key={calc.id}>
                      <td className="py-2"><Input value={calc.name} onChange={(e) => updateProduct(calc.id, "name", e.target.value)} className="h-8 text-sm" /></td>
                      <td className="py-2"><Input type="number" value={calc.revenue} onChange={(e) => updateProduct(calc.id, "revenue", e.target.value)} className="h-8 text-sm text-right w-28 ml-auto" /></td>
                      <td className="py-2"><Input type="number" value={calc.cogs} onChange={(e) => updateProduct(calc.id, "cogs", e.target.value)} className="h-8 text-sm text-right w-28 ml-auto" /></td>
                      <td className="py-2"><Input type="number" value={calc.expenses} onChange={(e) => updateProduct(calc.id, "expenses", e.target.value)} className="h-8 text-sm text-right w-28 ml-auto" /></td>
                      <td className={`py-2 text-right font-medium ${calc.grossMargin >= 0 ? "text-green-600" : "text-red-500"}`}>{calc.grossMargin.toFixed(1)}%</td>
                      <td className={`py-2 text-right font-medium ${calc.netMargin >= 0 ? "text-blue-600" : "text-red-500"}`}>{calc.netMargin.toFixed(1)}%</td>
                      <td className="py-2"><button onClick={() => removeProduct(calc.id)} className="p-1 text-foreground/30 hover:text-red-500" disabled={products.length <= 1}><Trash2 className="w-3.5 h-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Margin Bars */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Margin Comparison</h3>
            <div className="space-y-4">
              {calculations.map((calc) => (
                <div key={calc.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{calc.name}</span>
                    <span className="text-xs text-foreground/60">Gross: {calc.grossMargin.toFixed(1)}% | Net: {calc.netMargin.toFixed(1)}%</span>
                  </div>
                  <div className="h-6 bg-muted rounded-full overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 bg-green-500/30 rounded-full" style={{ width: `${Math.max(Math.min(calc.grossMargin, 100), 0)}%` }} />
                    <div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: `${Math.max(Math.min(calc.netMargin, 100), 0)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-foreground/60">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500/30"></span> Gross Margin</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary"></span> Net Margin</span>
            </div>
          </div>
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
