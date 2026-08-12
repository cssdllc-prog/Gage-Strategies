import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { ChevronRight, Search, ShoppingCart, Palette, Rocket } from "lucide-react";

export default function HowItWorks() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border">
        <div className="container py-14 md:py-20">
          <h1 className="mb-4 text-foreground text-4xl md:text-5xl">How It Works</h1>
          <p className="text-lg text-foreground/80 max-w-2xl">
            Find, buy, and brand your tools in minutes — not months. Here's how the GAGE Solutions Hub works.
          </p>
        </div>
      </section>

      {/* Steps — alternating layout, no placeholder images */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Step 1 */}
            <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
              <div className="w-14 h-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">Browse the Hub</h3>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Search by goal (save time, increase sales), by department (marketing, operations), or by tool type (AI, templates, dashboards). Use the Solution Finder quiz if you're not sure where to start.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">AI Tools</span>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">Templates</span>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">Dashboards</span>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">Checklists</span>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">Automation</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
              <div className="w-14 h-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">Get Your Tool</h3>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Free tools download instantly — no account required. Paid tools unlock after a quick Stripe checkout. Subscriptions give you ongoing access to continuously updated tools.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-border bg-card text-center">
                    <p className="text-lg font-bold text-green-600">Free</p>
                    <p className="text-xs text-foreground/60 mt-0.5">Instant download</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-card text-center">
                    <p className="text-lg font-bold text-foreground">$9–$49</p>
                    <p className="text-xs text-foreground/60 mt-0.5">One-time purchase</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-card text-center">
                    <p className="text-lg font-bold text-primary">$X/mo</p>
                    <p className="text-xs text-foreground/60 mt-0.5">Subscription</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
              <div className="w-14 h-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">Brand It as Yours</h3>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Set up your Company Profile once — upload your logo, company name, and contact info. Every tool you download will automatically carry your branding instead of ours.
                </p>
                <div className="p-4 rounded-lg border border-primary/20 bg-primary/[0.03]">
                  <p className="text-sm text-foreground/80">
                    <strong className="text-foreground">White-label included:</strong> Your clients see your brand on every document, dashboard, and report — not GAGE.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
              <div className="w-14 h-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shrink-0">
                4
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">Use It Today</h3>
                <p className="text-foreground/80 leading-relaxed">
                  Every tool is ready to use immediately — no setup calls, no training sessions, no waiting. Open it, fill in your data, and start getting results. If you need help, our support team is one email away.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ-style section */}
      <section className="border-b border-border bg-card/30">
        <div className="container py-16 md:py-24">
          <h2 className="text-center mb-10 text-foreground text-3xl md:text-4xl">Common Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { q: "Do I need an account to browse?", a: "No. You can browse the entire hub and download free tools without signing in. An account is only needed for purchases." },
              { q: "What format are the tools in?", a: "Most tools are interactive HTML files that work in any browser — no software to install. Some include spreadsheets or PDFs." },
              { q: "Can I really put my own logo on everything?", a: "Yes. Set up your Company Profile once, and every download is automatically branded with your logo, name, and contact info." },
              { q: "What if I need something that's not in the hub?", a: "We also build custom tools. Just reach out via the contact page and tell us what you need." },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-background">
                <h4 className="font-semibold text-foreground mb-2">{item.q}</h4>
                <p className="text-sm text-foreground/70 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Single */}
      <section className="border-b border-border">
        <div className="container py-14 md:py-20 text-center">
          <h2 className="mb-4 text-foreground text-3xl md:text-4xl">Ready to get started?</h2>
          <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
            Browse the hub and find a tool that fits your business today.
          </p>
          <Button
            onClick={() => navigate("/solutions")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-5 text-base"
          >
            Browse Solutions Hub
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
