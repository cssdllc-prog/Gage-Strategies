import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Copy, RefreshCw, Sparkles, Send, ChevronDown, ChevronUp } from "lucide-react";

const GOALS = [
  { id: "book_meeting", label: "Book a Meeting" },
  { id: "get_reply", label: "Get a Reply" },
  { id: "drive_signup", label: "Drive Sign-ups" },
  { id: "build_awareness", label: "Build Awareness" },
] as const;

const TONES = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "direct", label: "Direct" },
  { id: "friendly", label: "Friendly" },
  { id: "provocative", label: "Provocative" },
] as const;

export default function ColdEmailWriter() {
  const [product, setProduct] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [goal, setGoal] = useState<"book_meeting" | "get_reply" | "drive_signup" | "build_awareness">("book_meeting");
  const [tone, setTone] = useState<"professional" | "casual" | "direct" | "friendly" | "provocative">("professional");
  const [senderName, setSenderName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [emails, setEmails] = useState<Array<{ subject: string; body: string; type: string }>>([]);
  const [expandedEmail, setExpandedEmail] = useState<number | null>(null);

  const generateMutation = trpc.ai.generateColdEmails.useMutation({
    onSuccess: (data) => {
      setEmails(data.emails);
      setExpandedEmail(0);
    },
    onError: () => {
      toast.error("Generation failed. Please try again.");
    },
  });

  const handleGenerate = () => {
    if (!product || product.trim().length < 3) {
      toast.error("Please describe your product/service.");
      return;
    }
    if (!targetAudience || targetAudience.trim().length < 3) {
      toast.error("Please describe your target audience.");
      return;
    }
    generateMutation.mutate({ product: product.trim(), targetAudience: targetAudience.trim(), goal, tone, senderName: senderName.trim(), companyName: companyName.trim() });
  };

  const copyEmail = (email: { subject: string; body: string }) => {
    navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`);
    toast.success("Email copied to clipboard!");
  };

  const copyAll = () => {
    const text = emails.map((e, i) => `--- Email ${i + 1}: ${e.type} ---\nSubject: ${e.subject}\n\n${e.body}`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Full sequence copied!");
  };

  const EMAIL_LABELS = ["Initial Outreach", "Value Follow-up", "Social Proof", "Breakup Email"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="border-b border-border bg-gradient-to-b from-background to-card/30">
        <div className="container py-16 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Send className="w-6 h-6 text-primary" />
            </div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">Free AI Tool</span>
          </div>
          <h1 className="mb-4 text-foreground text-3xl md:text-4xl font-bold">AI Cold Email Writer</h1>
          <p className="text-lg text-foreground/70 max-w-3xl">
            Generate a complete 4-email cold outreach sequence. Personalized to your product, audience, and goals. Copy and send in minutes.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm h-fit lg:sticky lg:top-8">
              <h2 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Configure Your Sequence
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Product / Service *</label>
                  <Textarea
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="e.g., AI-powered CRM that helps sales teams close 30% more deals..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Target Audience *</label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., VP of Sales at B2B SaaS companies (50-200 employees)"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Goal</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GOALS.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setGoal(g.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                          goal === g.id ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground/70 hover:border-primary/30"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Tone</label>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          tone === t.id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground/70 hover:border-primary/40"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Your Name</label>
                    <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="John" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Company</label>
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Inc" />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5"
              >
                {generateMutation.isPending ? (
                  <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Writing Emails...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Generate 4-Email Sequence</>
                )}
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {emails.length > 0 && emails[0].type !== "error" ? (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Your Email Sequence</h3>
                    <Button variant="outline" size="sm" onClick={copyAll}>
                      <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy All
                    </Button>
                  </div>
                  {emails.map((email, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card overflow-hidden transition-all">
                      <button
                        onClick={() => setExpandedEmail(expandedEmail === i ? null : i)}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                          <div className="text-left">
                            <p className="text-sm font-medium text-foreground">{EMAIL_LABELS[i] || email.type}</p>
                            <p className="text-xs text-foreground/50 truncate max-w-[200px]">{email.subject}</p>
                          </div>
                        </div>
                        {expandedEmail === i ? <ChevronUp className="w-4 h-4 text-foreground/50" /> : <ChevronDown className="w-4 h-4 text-foreground/50" />}
                      </button>
                      {expandedEmail === i && (
                        <div className="px-4 pb-4 border-t border-border/50">
                          <div className="mt-3 p-3 rounded-lg bg-muted/30">
                            <p className="text-xs font-medium text-foreground/60 mb-1">Subject:</p>
                            <p className="text-sm font-medium text-foreground">{email.subject}</p>
                          </div>
                          <div className="mt-3 p-3 rounded-lg bg-muted/30">
                            <p className="text-xs font-medium text-foreground/60 mb-1">Body:</p>
                            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{email.body}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => copyEmail(email)} className="mt-3">
                            <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy This Email
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-12 rounded-xl border border-dashed border-border bg-card/50 text-center">
                  <Mail className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                  <p className="text-foreground/50 text-sm">Your email sequence will appear here</p>
                  <p className="text-foreground/30 text-xs mt-1">Fill in the form and click generate</p>
                </div>
              )}
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
