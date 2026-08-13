import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap, Sparkles, Bot, Layers, Download, Gift, Calendar, ArrowRight, CheckCircle2, TrendingUp, Clock, Shield, Users, Boxes, LineChart, Settings2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";

export default function Home() {
  const [, navigate] = useLocation();
  const { data: products = [] } = trpc.products.list.useQuery(undefined);
  const featuredProducts = products.filter((p: any) => p.isPopular).slice(0, 4);

  // Animated counter for social proof
  // No longer using animated counter — keeping it generic

  const solutionTypes = [
    { icon: Sparkles, title: "AI-Powered Tools", description: "Content generators, smart assistants, and automation that save hours every week.", badge: "Popular", featured: true },
    { icon: Bot, title: "AI Prompt Packs", description: "Ready-to-use prompt libraries for marketing, sales, support, and ops.", badge: "New", featured: true },
    { icon: Layers, title: "White-Label SaaS", description: "Branded CRM, marketing automation, and client portals under your name.", badge: null, featured: false },
    { icon: Download, title: "One-Time Tools", description: "Templates, dashboards, checklists — buy once, use forever.", badge: null, featured: false },
    { icon: Gift, title: "Free Tools", description: "Starter templates and utilities to get you moving — no cost.", badge: "Free", featured: false },
    { icon: Calendar, title: "Subscription Tools", description: "Continuously updated AI tools and premium resources delivered monthly.", badge: null, featured: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section — Dynamic, product-focused */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <img src="/hero-bg.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative py-20 md:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              {/* Small wordmark lockup above headline */}
              <img
                src="/logo.png"
                alt="GAGE Strategies"
                className="w-[340px] h-auto mb-6"
              />
              <h1 className="mb-5 text-foreground leading-[1.1] text-4xl md:text-5xl lg:text-6xl">
                From Chaos<br />to <span className="text-primary">Clarity</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/80 mb-4 leading-relaxed max-w-lg">
                Practical workflow tools that help small businesses save time, reduce confusion, and operate more consistently.
              </p>
              <p className="text-sm text-foreground/60 mb-8 max-w-lg">
                Browse our tools — from free templates to AI-powered automation. Find what fits your business today.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => navigate("/solution-finder")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-5 text-base"
                >
                  Find My Solution
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  onClick={() => navigate("/free-tools")}
                  variant="outline"
                  className="font-medium px-6 py-5 text-base border-foreground/20"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Try Free AI Tool
                </Button>
              </div>
            </div>

            {/* Right: Product preview / stats */}
            <div className="animate-fade-in-up hidden lg:block" style={{ animationDelay: '200ms' }}>
              <div className="relative cursor-pointer group/card" onClick={() => navigate("/solutions")}>
                {/* Mock hub interface */}
                <div className="rounded-2xl border border-border bg-card shadow-2xl p-6 relative overflow-visible transition-shadow duration-200 group-hover/card:shadow-3xl group-hover/card:border-primary/30">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                    <div className="w-3 h-3 rounded-full bg-green-400/60" />
                    <span className="ml-3 text-xs text-foreground/40 font-mono">gage-strategies.com/solutions</span>
                  </div>
                  <div className="space-y-3">
                    {/* Mini product cards */}
                    {[
                      { name: "AI Email Marketing Suite", price: "$19/mo", type: "AI Tool" },
                      { name: "Sales Pipeline Dashboard", price: "$29", type: "Template" },
                      { name: "Client Onboarding Kit", price: "Free", type: "Free" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/60">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-foreground/50">{item.type}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-primary">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-foreground/50">Tools available</span>
                    <span className="text-xs text-primary font-medium">View all →</span>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  New tools weekly
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats — breaks the icon-grid pattern */}
      <section className="border-y border-border bg-card/40">
        <div className="container py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">70+</p>
              <p className="text-sm text-foreground/70 mt-1">Business Tools</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-foreground">6</p>
              <p className="text-sm text-foreground/70 mt-1">Tool Categories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-foreground">Free</p>
              <p className="text-sm text-foreground/70 mt-1">Tools to Start</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-foreground">White-Label</p>
              <p className="text-sm text-foreground/70 mt-1">Your Brand, Your Tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Tools Spotlight — drives engagement with zero-friction tools */}
      <section className="border-b border-border bg-gradient-to-b from-primary/[0.02] to-transparent">
        <div className="container py-16 md:py-24">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">Free to Use</span>
              </div>
              <h2 className="text-3xl md:text-4xl text-foreground">
                Try Our Free Tools
              </h2>
              <p className="text-foreground/70 mt-2 max-w-lg">
                No sign-up required. Start solving problems right now with these interactive tools.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/free-tools")}
              className="hidden md:flex items-center gap-1 border-primary/30 text-primary hover:bg-primary/5"
            >
              View All Free Tools
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "AI Business Name Generator", desc: "Generate brandable names instantly. Choose industry, style, and keywords.", path: "/tools/business-name-generator", img: "/tool-business-name.svg", badge: "AI" },
              { name: "Marketing ROI Calculator", desc: "Calculate ROI with interactive sliders. Compare up to 4 scenarios.", path: "/tools/roi-calculator", img: "/tool-roi-calculator.svg", badge: "Calculator" },
              { name: "AI Cold Email Writer", desc: "Generate a complete 4-email outreach sequence personalized to your product.", path: "/tools/cold-email-writer", img: "/tool-cold-email.svg", badge: "AI" },
              { name: "Invoice Generator", desc: "Create professional invoices with line items, taxes, and PDF download.", path: "/tools/invoice-generator", img: "/tool-invoice.svg", badge: "Utility" },
              { name: "Profit Margin Calculator", desc: "Calculate gross and net margins for multiple products. Export results.", path: "/tools/profit-margin-calculator", img: "/tool-profit-margin.svg", badge: "Calculator" },
              { name: "AI Social Media Captions", desc: "Generate platform-optimized captions with hashtags and emojis.", path: "/tools/social-media-captions", img: "/tool-social-captions.svg", badge: "AI" },
            ].map((tool) => (
              <button
                key={tool.name}
                onClick={() => navigate(tool.path)}
                className="group rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all text-left flex flex-col overflow-hidden"
              >
                <div className="w-full h-32 overflow-hidden border-b border-border bg-primary/5 flex items-center justify-center p-6">
                  <img
                    src={tool.img}
                    alt={tool.name}
                    className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">
                      Free
                    </span>
                    <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-wider">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-foreground/60 line-clamp-2">{tool.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Button
              variant="outline"
              onClick={() => navigate("/free-tools")}
              className="border-primary/30 text-primary hover:bg-primary/5"
            >
              View All Free Tools
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* What's in the Hub — varied card layout */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl mb-12">
            <h2 className="mb-3 text-foreground text-3xl md:text-4xl">
              Everything Your Business Needs
            </h2>
            <p className="text-foreground/70 text-lg">
              AI-first tools, ready-made templates, and full SaaS products — from free to premium.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {solutionTypes.map((solution) => (
              <div
                key={solution.title}
                className={`group p-5 rounded-xl border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer ${solution.featured ? 'border-primary/20 bg-primary/[0.02]' : 'border-border'}`}
                onClick={() => navigate("/solutions")}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center transition-colors">
                    <solution.icon className="w-5 h-5 text-primary" />
                  </div>
                  {solution.badge && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${solution.badge === 'Popular' ? 'bg-accent/20 text-accent-foreground' : solution.badge === 'New' ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-700'}`}>
                      {solution.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1.5">{solution.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{solution.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              onClick={() => navigate("/solutions")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-5"
            >
              Browse All Solutions
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Workflow Systems — Flagship managed solution, visually distinct from the self-serve hub */}
      <section className="border-b border-border" style={{ background: "#10252B" }}>
        <div className="container py-16 md:py-24">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-wider mb-3 px-3 py-1 rounded-full"
            style={{ color: "#10252B", background: "#D9F36B" }}
          >
            Our Flagship Managed Solution
          </span>
          <h2 className="text-white text-3xl md:text-4xl mb-4 max-w-2xl">The GAGE Response Engine</h2>
          <p className="text-white/70 text-lg max-w-2xl mb-10 leading-relaxed">
            Too much to do, not enough time to do it — that's not a self-serve problem, it's a build-it-and-run-it
            problem. For challenges too big for a template, we design, test, and manage the automated systems that
            close the gap entirely.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="border-t-2 pt-5" style={{ borderColor: "#D9F36B" }}>
              <Boxes className="w-6 h-6 mb-3" style={{ color: "#D9F36B" }} />
              <h3 className="text-white font-semibold mb-2">Modular</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Every piece solves one specific pain point. Choose what's costing you the most, skip the rest.
              </p>
            </div>
            <div className="border-t-2 pt-5" style={{ borderColor: "#D9F36B" }}>
              <Settings2 className="w-6 h-6 mb-3" style={{ color: "#D9F36B" }} />
              <h3 className="text-white font-semibold mb-2">Managed</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                We build it, test it, deploy it, and monitor it every month. You never touch a dashboard you didn't ask for.
              </p>
            </div>
            <div className="border-t-2 pt-5" style={{ borderColor: "#D9F36B" }}>
              <LineChart className="w-6 h-6 mb-3" style={{ color: "#D9F36B" }} />
              <h3 className="text-white font-semibold mb-2">Measurable</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                A plain monthly report shows exactly what the system caught — calls answered, reminders sent, reviews collected.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              onClick={() => navigate("/workflow-systems")}
              className="font-semibold px-6 py-5 text-base"
              style={{ background: "#D9F36B", color: "#10252B" }}
            >
              Explore Workflow Systems
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <p className="text-white/50 text-sm">No long-term contracts — cancel anytime after your first month.</p>
          </div>
        </div>
      </section>

      {/* Value Proposition — Story block format, NOT icon grid */}
      <section className="border-b border-border bg-card/30">
        <div className="container py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl text-foreground mb-6">
                Why businesses choose GAGE
              </h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Save 10+ hours per week</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed">Stop rebuilding spreadsheets and writing from scratch. Our tools handle the repetitive work so you can focus on growth.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">White-label everything</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed">Every tool comes with your branding. Upload your logo once, and all downloads reflect your company — not ours.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Built for small business</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed">No enterprise bloat. No 6-month implementations. Tools that work the day you buy them, priced for real budgets.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">New tools added weekly</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed">The hub grows with your needs. We're constantly building new AI tools, templates, and automation based on what businesses actually ask for.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right side: testimonial-style quote */}
            <div className="bg-background rounded-2xl border border-border p-8 md:p-10 shadow-sm">
              <div className="text-5xl text-primary/30 font-serif leading-none mb-4">"</div>
              <p className="text-lg text-foreground/90 leading-relaxed mb-6 italic">
                We went from juggling 5 different spreadsheets to having one dashboard that does everything. The white-label feature means our clients think we built it ourselves.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">JM</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Small Business Owner</p>
                  <p className="text-xs text-foreground/50">Marketing Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Solutions */}
      {featuredProducts.length > 0 && (
        <section className="border-b border-border">
          <div className="container py-16 md:py-24">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl text-foreground mb-2">Popular Tools</h2>
                <p className="text-foreground/70">Most downloaded this month</p>
              </div>
              <Button
                onClick={() => navigate("/solutions")}
                variant="outline"
                className="hidden md:flex font-medium"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product: any) => (
                <div
                  key={product.id}
                  className="rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                  onClick={() => navigate(`/solution/${product.id}`)}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 text-xl">
                    {product.icon || <Zap className="w-5 h-5 text-primary" />}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-foreground/60 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <span className="text-sm font-bold text-primary">
                    {product.pricing === "free" ? "Free" : product.pricing === "subscription" ? `$${product.monthlyPrice}/mo` : `$${product.basePrice}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button onClick={() => navigate("/solutions")} variant="outline" className="font-medium">
                View All Solutions <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* How It Works — Simple 3-step, not icon grid */}
      <section className="border-b border-border bg-card/30">
        <div className="container py-16 md:py-24">
          <h2 className="text-center text-3xl md:text-4xl text-foreground mb-4">Get started in 3 steps</h2>
          <p className="text-center text-foreground/70 mb-12 max-w-xl mx-auto">No onboarding calls. No setup fees. Just find what you need and go.</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Browse the Hub", desc: "Search by goal, department, or tool type to find what fits your business." },
              { step: "2", title: "Get Your Tool", desc: "Free tools download instantly. Paid tools unlock after a quick checkout." },
              { step: "3", title: "Add Your Brand", desc: "Upload your logo once — every tool you download carries your branding." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                <p className="text-sm text-foreground/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              onClick={() => navigate("/solutions")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-5"
            >
              Start Browsing
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Custom Solutions — Demoted to a subtle mention */}
      <section className="border-b border-border">
        <div className="container py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 rounded-2xl bg-card border border-border">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">Need something custom?</h3>
              <p className="text-sm text-foreground/70 max-w-lg">
                Can't find what you need in the hub? We also build custom tools, websites, and automation — tailored to your exact workflow.
              </p>
            </div>
            <Button
              onClick={() => navigate("/contact")}
              variant="outline"
              className="shrink-0 font-medium border-foreground/20"
            >
              Tell Us What You Need
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer — Enhanced */}
      <footer className="bg-card/50 border-t border-border py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/logo.png" alt="GAGE Strategies" className="h-12 w-auto mb-4" />
              <p className="text-foreground/70 text-sm leading-relaxed">
                Practical workflow tools for small businesses. From chaos to clarity.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Product</h4>
              <ul className="space-y-2.5 text-sm text-foreground/70">
                <li><button onClick={() => navigate("/workflow-systems")} className="hover:text-foreground transition-colors">Workflow Systems</button></li>
                <li><button onClick={() => navigate("/solutions")} className="hover:text-foreground transition-colors">Solutions Hub</button></li>
                <li><button onClick={() => navigate("/bundles")} className="hover:text-foreground transition-colors">Bundles</button></li>
                <li><button onClick={() => navigate("/compare")} className="hover:text-foreground transition-colors">Compare Plans</button></li>
                <li><button onClick={() => navigate("/free-tools")} className="hover:text-foreground transition-colors">Free AI Tool</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Company</h4>
              <ul className="space-y-2.5 text-sm text-foreground/70">
                <li><button onClick={() => navigate("/about")} className="hover:text-foreground transition-colors">About</button></li>
                <li><button onClick={() => navigate("/how-it-works")} className="hover:text-foreground transition-colors">How It Works</button></li>
                <li><button onClick={() => navigate("/resources")} className="hover:text-foreground transition-colors">Resources</button></li>
                <li><button onClick={() => navigate("/contact")} className="hover:text-foreground transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Legal & Support</h4>
              <ul className="space-y-2.5 text-sm text-foreground/70">
                <li><button onClick={() => navigate("/privacy")} className="hover:text-foreground transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => navigate("/terms")} className="hover:text-foreground transition-colors">Terms of Service</button></li>
                <li><a href="mailto:support@gage-strategies.com" className="hover:text-foreground transition-colors">support@gage-strategies.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground/60">&copy; {new Date().getFullYear()} GAGE Strategies. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.gage-strategies.com" className="text-xs text-foreground/50 hover:text-foreground/70 transition-colors">www.gage-strategies.com</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
