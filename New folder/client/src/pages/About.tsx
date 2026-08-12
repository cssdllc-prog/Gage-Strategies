import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { ChevronRight, Sparkles, Wrench, Target, TrendingUp } from "lucide-react";

export default function About() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border">
        <div className="container py-14 md:py-20">
          <h1 className="mb-4 text-foreground text-4xl md:text-5xl">About GAGE Strategies</h1>
          <p className="text-lg text-foreground/80 max-w-2xl">
            We build practical tools that help small businesses move from chaos to clarity — no enterprise complexity, no long onboarding.
          </p>
        </div>
      </section>

      {/* Mission Section — replaced placeholder with logo */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-5 text-foreground text-3xl md:text-4xl">Our Mission</h2>
              <p className="text-foreground/80 mb-5 leading-relaxed">
                Too many small businesses are stuck — juggling spreadsheets, rebuilding the same documents, and losing hours to tasks that should be automated.
              </p>
              <p className="text-foreground/80 mb-5 leading-relaxed">
                GAGE Strategies exists to fix that. We build ready-to-use workflow tools, AI-powered assistants, and white-label templates that work the day you get them.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                Our Solutions Hub makes professional-grade tools accessible to businesses of all sizes — from free starter templates to full subscription platforms.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/manus-storage/gage-strategies-logo_119c7c41.png"
                alt="GAGE Strategies"
                className="w-64 md:w-80 h-auto opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-b border-border bg-card/30">
        <div className="container py-16 md:py-24">
          <h2 className="text-center mb-10 text-foreground text-3xl md:text-4xl">What We Believe</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-7 rounded-xl border border-border bg-background">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Tools Should Just Work</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">
                No 6-month implementations. No training manuals. If a tool needs an onboarding call, it's too complicated.
              </p>
            </div>
            <div className="p-7 rounded-xl border border-border bg-background">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Wrench className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Practical Over Perfect</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">
                Simple solutions that teams actually use beat complicated systems every time. We build for real workflows, not demo day.
              </p>
            </div>
            <div className="p-7 rounded-xl border border-border bg-background">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Grow at Your Pace</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">
                Start with a free tool. Upgrade when you're ready. We don't lock you into annual contracts or force enterprise pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer — Hub-focused */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <h2 className="text-center mb-4 text-foreground text-3xl md:text-4xl">What We Offer</h2>
          <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            The GAGE Solutions Hub is our primary product — a marketplace of business tools built for small teams.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-7 rounded-xl border border-primary/20 bg-primary/[0.02]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Solutions Hub</h3>
              </div>
              <p className="text-foreground/70 text-sm mb-4 leading-relaxed">
                Our core product. Browse 70+ workflow tools, AI assistants, templates, and dashboards. White-label everything with your branding.
              </p>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li className="flex items-center gap-2"><span className="text-primary">•</span> AI-powered tools & prompt packs</li>
                <li className="flex items-center gap-2"><span className="text-primary">•</span> White-label SaaS templates</li>
                <li className="flex items-center gap-2"><span className="text-primary">•</span> Free, one-time, and subscription pricing</li>
              </ul>
            </div>

            <div className="p-7 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-foreground/60" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Custom Builds</h3>
              </div>
              <p className="text-foreground/70 text-sm mb-4 leading-relaxed">
                Need something specific? We also build custom tools, websites, and automation tailored to your exact workflow.
              </p>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li className="flex items-center gap-2"><span className="text-foreground/40">•</span> Custom websites & apps</li>
                <li className="flex items-center gap-2"><span className="text-foreground/40">•</span> Video & marketing tools</li>
                <li className="flex items-center gap-2"><span className="text-foreground/40">•</span> Data analysis & reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Single primary */}
      <section className="border-b border-border bg-card/30">
        <div className="container py-14 md:py-20 text-center">
          <h2 className="mb-4 text-foreground text-3xl md:text-4xl">Ready to simplify your workflow?</h2>
          <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
            Browse the hub to find tools that fit your business — from free templates to AI-powered automation.
          </p>
          <Button
            onClick={() => navigate("/solutions")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-5 text-base"
          >
            Explore Solutions Hub
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
