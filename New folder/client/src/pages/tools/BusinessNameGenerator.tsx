import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Building2, Copy, RefreshCw, Sparkles, CheckCircle2, XCircle } from "lucide-react";

const STYLES = [
  { id: "modern", label: "Modern" },
  { id: "classic", label: "Classic" },
  { id: "playful", label: "Playful" },
  { id: "bold", label: "Bold" },
  { id: "minimal", label: "Minimal" },
  { id: "tech", label: "Tech" },
] as const;

const LENGTHS = [
  { id: "short", label: "Short (1-2 words)" },
  { id: "medium", label: "Medium (2-3 words)" },
  { id: "long", label: "Long (3-4 words)" },
] as const;

export default function BusinessNameGenerator() {
  const [industry, setIndustry] = useState("");
  const [keywords, setKeywords] = useState("");
  const [style, setStyle] = useState<"modern" | "classic" | "playful" | "bold" | "minimal" | "tech">("modern");
  const [nameLength, setNameLength] = useState<"short" | "medium" | "long">("medium");
  const [names, setNames] = useState<Array<{ name: string; tagline: string; available: boolean }>>([]);

  const generateMutation = trpc.ai.generateBusinessNames.useMutation({
    onSuccess: (data) => {
      setNames(data.names);
    },
    onError: () => {
      toast.error("Generation failed. Please try again.");
    },
  });

  const handleGenerate = () => {
    if (!industry || industry.trim().length < 2) {
      toast.error("Please describe your industry or business idea.");
      return;
    }
    generateMutation.mutate({
      industry: industry.trim(),
      keywords: keywords.trim(),
      style,
      nameLength,
    });
  };

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success("Copied to clipboard!");
  };

  const copyAll = () => {
    navigator.clipboard.writeText(names.map((n) => n.name).join("\n"));
    toast.success("All names copied!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="border-b border-border bg-gradient-to-b from-background to-card/30">
        <div className="container py-16 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">Free AI Tool</span>
          </div>
          <h1 className="mb-4 text-foreground text-3xl md:text-4xl font-bold">AI Business Name Generator</h1>
          <p className="text-lg text-foreground/70 max-w-3xl">
            Generate brandable, domain-friendly business names in seconds. Pick an industry, style, and a few keywords — get 15 options with taglines.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm h-fit lg:sticky lg:top-8">
              <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Describe Your Business
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Industry / Business Idea *</label>
                  <Input
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., organic dog treat subscription box"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Keywords (optional)</label>
                  <Input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., fresh, loyal, pack"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STYLES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStyle(s.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                          style === s.id ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground/70 hover:border-primary/30"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Name Length</label>
                  <div className="flex flex-col gap-2">
                    {LENGTHS.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setNameLength(l.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all border ${
                          nameLength === l.id ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground/70 hover:border-primary/30"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5"
              >
                {generateMutation.isPending ? (
                  <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating Names...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Generate 15 Names</>
                )}
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {names.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Your Business Names</h3>
                    <Button variant="outline" size="sm" onClick={copyAll}>
                      <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy All
                    </Button>
                  </div>
                  {names.map((n, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 p-4 rounded-lg border border-border hover:border-primary/30 bg-card transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-semibold truncate">{n.name}</span>
                          {n.available ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" /> .com likely open
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-foreground/40 shrink-0">
                              <XCircle className="w-3.5 h-3.5" /> .com may be taken
                            </span>
                          )}
                        </div>
                        {n.tagline && <p className="text-sm text-foreground/60 truncate">{n.tagline}</p>}
                      </div>
                      <button
                        onClick={() => copyName(n.name)}
                        className="shrink-0 p-2 rounded-md hover:bg-primary/10 text-foreground/50 hover:text-primary transition-colors"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={handleGenerate}
                    disabled={generateMutation.isPending}
                    className="w-full"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${generateMutation.isPending ? "animate-spin" : ""}`} />
                    Generate More
                  </Button>
                </>
              ) : (
                <div className="p-12 rounded-xl border border-dashed border-border bg-card/50 text-center">
                  <Building2 className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                  <p className="text-foreground/50 text-sm">Your business names will appear here</p>
                  <p className="text-foreground/30 text-xs mt-1">Fill in the form and click generate</p>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-foreground/40 mt-6 text-center">
            Domain availability is an AI estimate, not a live lookup — always double-check on a registrar before you commit to a name.
          </p>
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
