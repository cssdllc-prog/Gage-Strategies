import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Mail, Copy, RefreshCw, Zap, TrendingUp, Target } from "lucide-react";
import { Building2, Send, Hash } from "lucide-react";

export default function FreeTools() {
  const [, navigate] = useLocation();
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [results, setResults] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState("");

  const leadsMutation = trpc.leads.submit.useMutation({
    onSuccess: () => {
      toast.success("Thanks! We'll send you more free tools and tips.");
      setShowEmailCapture(false);
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const generateMutation = trpc.ai.generateSubjectLines.useMutation({
    onSuccess: (data) => {
      setResults(data.subjectLines);
      setIsGenerating(false);
      setGenerationCount((c) => c + 1);
      // Show email capture after 2 successful generations
      if (generationCount >= 1 && !showEmailCapture) {
        setShowEmailCapture(true);
      }
    },
    onError: (err) => {
      toast.error("Generation failed. Please try again.");
      setIsGenerating(false);
      console.error("AI generation error:", err.message);
    },
  });

  const handleGenerate = () => {
    if (!topic || topic.trim().length < 3) {
      toast.error("Please describe your email topic (at least 3 characters).");
      return;
    }
    setIsGenerating(true);
    generateMutation.mutate({ topic: topic.trim(), tone });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    leadsMutation.mutate({
      name: "Free Tool User",
      email,
      message: "Signed up via AI Email Subject Line Generator (free tool)",
      inquiryType: "hub",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const copyAll = () => {
    navigator.clipboard.writeText(results.join("\n"));
    toast.success("All subject lines copied!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-background to-card/30">
        <div className="container py-16 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">Free AI Tool</span>
          </div>
          <h1 className="mb-4 text-foreground text-3xl md:text-4xl font-bold">AI Email Subject Line Generator</h1>
          <p className="text-lg text-foreground/70 max-w-3xl">
            Generate high-converting email subject lines in seconds. Powered by AI, designed for small businesses. No sign-up required — just type and generate.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">

          {/* Generator */}
          <div className="p-8 rounded-xl border border-border bg-card shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Generate Subject Lines
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">What is your email about? *</label>
                <Textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Announcing a 20% off summer sale for our landscaping services..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {["professional", "casual", "urgent", "friendly", "creative", "bold"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                        tone === t
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-card border border-border text-foreground/70 hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate 10 Subject Lines
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-8 p-8 rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Your Subject Lines</h3>
                <Button variant="outline" size="sm" onClick={copyAll}>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy All
                </Button>
              </div>
              <div className="space-y-3">
                {results.map((line, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 p-4 rounded-lg border border-border hover:border-primary/30 bg-background transition-colors"
                  >
                    <span className="text-foreground text-sm flex-1">{line}</span>
                    <button
                      onClick={() => copyToClipboard(line)}
                      className="shrink-0 p-2 rounded-md hover:bg-primary/10 text-foreground/50 hover:text-primary transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="mt-4 w-full"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                Generate More
              </Button>
            </div>
          )}

          {/* Optional Email Capture (shown after 2 generations) */}
          {showEmailCapture && (
            <div className="mt-8 p-6 rounded-xl border border-primary/20 bg-primary/5">
              <h3 className="text-base font-semibold text-foreground mb-2">Want more free AI tools?</h3>
              <p className="text-sm text-foreground/70 mb-4">
                Enter your email and we'll send you new free tools as we release them. No spam, ever.
              </p>
              <form onSubmit={handleEmailSubmit} className="flex gap-3">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1"
                  required
                />
                <Button type="submit" variant="outline" disabled={leadsMutation.isPending}>
                  {leadsMutation.isPending ? "Sending..." : "Get Updates"}
                </Button>
              </form>
            </div>
          )}

          {/* Benefits */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card/50 text-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Instant Results</h4>
              <p className="text-sm text-foreground/60">Generate 10 subject lines in seconds, not hours</p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card/50 text-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Higher Open Rates</h4>
              <p className="text-sm text-foreground/60">AI-optimized for engagement and conversions</p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card/50 text-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Multiple Tones</h4>
              <p className="text-sm text-foreground/60">Professional, casual, urgent — match your brand voice</p>
            </div>
          </div>

          {/* CTA */}
          {/* More Free AI Tools */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-foreground mb-6">More Free AI Tools</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/tools/business-name-generator")}
                className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">Business Name Generator</h4>
                <p className="text-xs text-foreground/60">Generate brandable names with domain availability</p>
              </button>
              <button
                onClick={() => navigate("/tools/cold-email-writer")}
                className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Send className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">Cold Email Writer</h4>
                <p className="text-xs text-foreground/60">Generate a complete 4-email outreach sequence</p>
              </button>
              <button
                onClick={() => navigate("/tools/social-media-captions")}
                className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Hash className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">Social Media Captions</h4>
                <p className="text-xs text-foreground/60">Generate captions with hashtags for any platform</p>
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-xl border border-border bg-card/50 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Need more powerful tools?</h3>
            <p className="text-foreground/60 mb-4">
              Explore our full Solutions Hub for interactive calculators, invoice generators, and more.
            </p>
            <Button onClick={() => navigate("/solutions")} variant="outline">
              Explore Solutions Hub
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border py-8">
        <div className="container text-center">
          <p className="text-foreground/50 text-sm">&copy; {new Date().getFullYear()} GAGE Strategies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
