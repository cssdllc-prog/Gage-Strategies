import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import { Calculator, TrendingUp, DollarSign, Target, BarChart3, Download, Plus, Trash2 } from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  monthlySpend: number;
  conversionRate: number;
  avgDealSize: number;
  monthlyLeads: number;
  closeRate: number;
}

const defaultScenario: Scenario = {
  id: "1",
  name: "Current",
  monthlySpend: 5000,
  conversionRate: 2.5,
  avgDealSize: 2000,
  monthlyLeads: 500,
  closeRate: 20,
};

export default function ROICalculator() {
  const [scenarios, setScenarios] = useState<Scenario[]>([{ ...defaultScenario }]);
  const [activeScenario, setActiveScenario] = useState("1");

  const currentScenario = scenarios.find((s) => s.id === activeScenario) || scenarios[0];

  const calculations = useMemo(() => {
    return scenarios.map((s) => {
      const conversions = (s.monthlyLeads * s.conversionRate) / 100;
      const deals = (conversions * s.closeRate) / 100;
      const monthlyRevenue = deals * s.avgDealSize;
      const annualRevenue = monthlyRevenue * 12;
      const annualSpend = s.monthlySpend * 12;
      const roi = annualSpend > 0 ? ((annualRevenue - annualSpend) / annualSpend) * 100 : 0;
      const cpa = conversions > 0 ? s.monthlySpend / conversions : 0;
      const breakEvenMonths = monthlyRevenue > s.monthlySpend ? s.monthlySpend / (monthlyRevenue - s.monthlySpend) : Infinity;
      return { ...s, conversions, deals, monthlyRevenue, annualRevenue, annualSpend, roi, cpa, breakEvenMonths };
    });
  }, [scenarios]);

  const currentCalc = calculations.find((c) => c.id === activeScenario) || calculations[0];

  const updateScenario = (field: keyof Scenario, value: string | number) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === activeScenario ? { ...s, [field]: typeof value === "string" && field !== "name" ? parseFloat(value) || 0 : value } : s))
    );
  };

  const addScenario = () => {
    if (scenarios.length >= 4) {
      toast.error("Maximum 4 scenarios.");
      return;
    }
    const newId = String(Date.now());
    setScenarios((prev) => [...prev, { ...defaultScenario, id: newId, name: `Scenario ${prev.length + 1}` }]);
    setActiveScenario(newId);
  };

  const removeScenario = (id: string) => {
    if (scenarios.length <= 1) return;
    setScenarios((prev) => prev.filter((s) => s.id !== id));
    if (activeScenario === id) setActiveScenario(scenarios[0].id);
  };

  const exportCSV = () => {
    const headers = ["Scenario", "Monthly Spend", "Monthly Revenue", "Annual Revenue", "ROI %", "CPA", "Break-even Months"];
    const rows = calculations.map((c) => [c.name, `$${c.monthlySpend}`, `$${c.monthlyRevenue.toFixed(0)}`, `$${c.annualRevenue.toFixed(0)}`, `${c.roi.toFixed(1)}%`, `$${c.cpa.toFixed(2)}`, c.breakEvenMonths === Infinity ? "N/A" : c.breakEvenMonths.toFixed(1)]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roi-analysis.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const maxRevenue = Math.max(...calculations.map((c) => c.annualRevenue), 1);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="border-b border-border bg-gradient-to-b from-background to-card/30">
        <div className="container py-16 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">Free Tool</span>
          </div>
          <h1 className="mb-4 text-foreground text-3xl md:text-4xl font-bold">Marketing ROI Calculator</h1>
          <p className="text-lg text-foreground/70 max-w-3xl">
            Calculate your marketing return on investment instantly. Compare up to 4 scenarios side-by-side. Export results as CSV.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Scenario Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveScenario(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeScenario === s.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-card border border-border text-foreground/70 hover:border-primary/40"
                }`}
              >
                {s.name}
                {scenarios.length > 1 && (
                  <span
                    onClick={(e) => { e.stopPropagation(); removeScenario(s.id); }}
                    className="ml-1 opacity-50 hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </span>
                )}
              </button>
            ))}
            <button onClick={addScenario} className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-foreground/50 hover:text-primary border border-dashed border-border hover:border-primary/40 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Inputs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Scenario: {currentScenario.name}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Scenario Name</label>
                    <Input value={currentScenario.name} onChange={(e) => updateScenario("name", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Monthly Ad Spend ($)</label>
                    <Input type="number" value={currentScenario.monthlySpend} onChange={(e) => updateScenario("monthlySpend", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Monthly Leads</label>
                    <Input type="number" value={currentScenario.monthlyLeads} onChange={(e) => updateScenario("monthlyLeads", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Conversion Rate (%)</label>
                    <Input type="number" step="0.1" value={currentScenario.conversionRate} onChange={(e) => updateScenario("conversionRate", e.target.value)} />
                    <input type="range" min="0.1" max="20" step="0.1" value={currentScenario.conversionRate} onChange={(e) => updateScenario("conversionRate", e.target.value)} className="w-full mt-2 accent-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Close Rate (%)</label>
                    <Input type="number" step="1" value={currentScenario.closeRate} onChange={(e) => updateScenario("closeRate", e.target.value)} />
                    <input type="range" min="1" max="100" step="1" value={currentScenario.closeRate} onChange={(e) => updateScenario("closeRate", e.target.value)} className="w-full mt-2 accent-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Average Deal Size ($)</label>
                    <Input type="number" value={currentScenario.avgDealSize} onChange={(e) => updateScenario("avgDealSize", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-foreground/60 uppercase">ROI</span>
                  </div>
                  <p className={`text-2xl font-bold ${currentCalc.roi >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {currentCalc.roi.toFixed(1)}%
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-foreground/60 uppercase">Monthly Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">${currentCalc.monthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="p-5 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-medium text-foreground/60 uppercase">Cost per Acquisition</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">${currentCalc.cpa.toFixed(2)}</p>
                </div>
                <div className="p-5 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium text-foreground/60 uppercase">Break-even</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {currentCalc.breakEvenMonths === Infinity ? "N/A" : `${currentCalc.breakEvenMonths.toFixed(1)} mo`}
                  </p>
                </div>
              </div>

              {/* Comparison Chart */}
              {calculations.length > 1 && (
                <div className="p-6 rounded-xl border border-border bg-card">
                  <h3 className="font-semibold text-foreground mb-4">Scenario Comparison — Annual Revenue</h3>
                  <div className="space-y-3">
                    {calculations.map((c) => (
                      <div key={c.id} className="flex items-center gap-3">
                        <span className="text-sm text-foreground/70 w-24 truncate">{c.name}</span>
                        <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 flex items-center px-2 ${
                              c.id === activeScenario ? "bg-primary" : "bg-primary/40"
                            }`}
                            style={{ width: `${Math.max((c.annualRevenue / maxRevenue) * 100, 5)}%` }}
                          >
                            <span className="text-xs font-medium text-primary-foreground whitespace-nowrap">
                              ${c.annualRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        </div>
                        <span className={`text-xs font-medium w-16 text-right ${c.roi >= 0 ? "text-green-600" : "text-red-500"}`}>
                          {c.roi.toFixed(0)}% ROI
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary Table */}
              <div className="p-6 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Detailed Breakdown</h3>
                  <Button variant="outline" size="sm" onClick={exportCSV}>
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-foreground/60 font-medium">Metric</th>
                        {calculations.map((c) => (
                          <th key={c.id} className="text-right py-2 text-foreground/60 font-medium">{c.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      <tr><td className="py-2 text-foreground">Monthly Spend</td>{calculations.map((c) => <td key={c.id} className="py-2 text-right text-foreground">${c.monthlySpend.toLocaleString()}</td>)}</tr>
                      <tr><td className="py-2 text-foreground">Conversions/mo</td>{calculations.map((c) => <td key={c.id} className="py-2 text-right text-foreground">{c.conversions.toFixed(1)}</td>)}</tr>
                      <tr><td className="py-2 text-foreground">Deals Closed/mo</td>{calculations.map((c) => <td key={c.id} className="py-2 text-right text-foreground">{c.deals.toFixed(1)}</td>)}</tr>
                      <tr><td className="py-2 text-foreground">Monthly Revenue</td>{calculations.map((c) => <td key={c.id} className="py-2 text-right text-foreground font-medium">${c.monthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>)}</tr>
                      <tr><td className="py-2 text-foreground">Annual Revenue</td>{calculations.map((c) => <td key={c.id} className="py-2 text-right text-foreground font-medium">${c.annualRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>)}</tr>
                      <tr><td className="py-2 text-foreground">ROI</td>{calculations.map((c) => <td key={c.id} className={`py-2 text-right font-bold ${c.roi >= 0 ? "text-green-600" : "text-red-500"}`}>{c.roi.toFixed(1)}%</td>)}</tr>
                    </tbody>
                  </table>
                </div>
              </div>
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
