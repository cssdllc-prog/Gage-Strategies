import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, ChevronRight, Sparkles, Package, Repeat } from "lucide-react";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";

export default function ComparePlans() {
  const [, navigate] = useLocation();
  const { data: products = [] } = trpc.products.list.useQuery(undefined);

  const freeProducts = products.filter((p: any) => p.pricing === "free");
  const oneTimeProducts = products.filter((p: any) => p.pricing === "one-time");
  const subscriptionProducts = products.filter((p: any) => p.pricing === "subscription");

  const plans = [
    {
      name: "Free Tools",
      icon: <Sparkles className="w-6 h-6" />,
      price: "Free",
      priceNote: "No credit card required",
      description: "Essential assessment and planning tools to get started immediately",
      color: "border-green-200 bg-green-50/50",
      headerColor: "bg-green-600 text-white",
      badge: null,
      features: [
        { text: "Business Health Check assessment", included: true },
        { text: "AI Readiness Assessment", included: true },
        { text: "Weekly Planning Template", included: true },
        { text: "Basic templates & frameworks", included: true },
        { text: "Instant download access", included: true },
        { text: "White-label customization", included: true },
        { text: "Advanced automation features", included: false },
        { text: "AI-powered tools", included: false },
        { text: "Priority support", included: false },
      ],
      cta: "Browse Free Tools",
      ctaAction: () => navigate("/solutions?filter=free"),
      count: freeProducts.length,
    },
    {
      name: "One-Time Purchase",
      icon: <Package className="w-6 h-6" />,
      price: "$9 – $39",
      priceNote: "Pay once, yours forever",
      description: "Professional templates, frameworks, and toolkits for specific business needs",
      color: "border-primary/30 bg-primary/5",
      headerColor: "bg-primary text-primary-foreground",
      badge: "Most Popular",
      features: [
        { text: "All Free tool features", included: true },
        { text: "Professional templates & frameworks", included: true },
        { text: "Comprehensive documentation kits", included: true },
        { text: "White-label with your branding", included: true },
        { text: "Lifetime access & updates", included: true },
        { text: "Team-wide usage (no per-seat)", included: true },
        { text: "Editable source files", included: true },
        { text: "AI-powered automation", included: false },
        { text: "Real-time integrations", included: false },
      ],
      cta: "Browse One-Time Tools",
      ctaAction: () => navigate("/solutions?filter=one-time"),
      count: oneTimeProducts.length,
    },
    {
      name: "Monthly Subscription",
      icon: <Repeat className="w-6 h-6" />,
      price: "$19 – $39/mo",
      priceNote: "Cancel anytime, no commitment",
      description: "AI-powered tools with ongoing updates, integrations, and automation capabilities",
      color: "border-blue-200 bg-blue-50/50",
      headerColor: "bg-blue-600 text-white",
      badge: "Most Powerful",
      features: [
        { text: "All One-Time Purchase features", included: true },
        { text: "AI-powered automation & generation", included: true },
        { text: "Real-time integrations (Slack, email)", included: true },
        { text: "Continuous updates & improvements", included: true },
        { text: "Advanced analytics & reporting", included: true },
        { text: "White-label with your branding", included: true },
        { text: "Priority support", included: true },
        { text: "API access", included: true },
        { text: "Custom workflows", included: true },
      ],
      cta: "Browse Subscriptions",
      ctaAction: () => navigate("/solutions?filter=subscription"),
      count: subscriptionProducts.length,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="container py-16 text-center">
        <h1 className="mb-4 text-foreground">Compare Plans</h1>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-2">
          Choose the right tools for your business stage. Start free, upgrade when you're ready.
        </p>
        <p className="text-sm text-foreground/50">
          All plans include white-label customization • No per-seat pricing • Instant access
        </p>
      </section>

      {/* Plans Comparison */}
      <section className="container pb-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border-2 ${plan.color} overflow-hidden transition-transform hover:scale-[1.02] duration-200`}
            >
              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent text-foreground">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Header */}
              <div className={`p-6 ${plan.headerColor}`}>
                <div className="flex items-center gap-3 mb-3">
                  {plan.icon}
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                </div>
                <div className="text-3xl font-bold mb-1">{plan.price}</div>
                <p className="text-sm opacity-90">{plan.priceNote}</p>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-sm text-foreground/70 mb-6">{plan.description}</p>
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-4">
                  {plan.count} tools available
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {feature.included ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-foreground/30 mt-0.5 shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? "text-foreground" : "text-foreground/40"}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={plan.ctaAction}
                  className="w-full bg-accent hover:bg-accent/90 text-foreground font-semibold"
                >
                  {plan.cta}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="bg-muted/30 border-t border-border py-16">
        <div className="container max-w-5xl">
          <h2 className="text-center mb-12 text-foreground">Detailed Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-green-700">Free</th>
                  <th className="text-center py-4 px-4 font-semibold text-primary">One-Time</th>
                  <th className="text-center py-4 px-4 font-semibold text-blue-700">Subscription</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Instant Download", free: true, oneTime: true, sub: true },
                  { feature: "White-Label Customization", free: true, oneTime: true, sub: true },
                  { feature: "Team Usage (No Per-Seat)", free: true, oneTime: true, sub: true },
                  { feature: "Professional Templates", free: "Basic", oneTime: true, sub: true },
                  { feature: "Editable Source Files", free: false, oneTime: true, sub: true },
                  { feature: "Comprehensive Documentation", free: false, oneTime: true, sub: true },
                  { feature: "Implementation Guides", free: false, oneTime: true, sub: true },
                  { feature: "AI-Powered Features", free: false, oneTime: false, sub: true },
                  { feature: "Real-Time Integrations", free: false, oneTime: false, sub: true },
                  { feature: "Continuous Updates", free: false, oneTime: "Major only", sub: true },
                  { feature: "Advanced Analytics", free: false, oneTime: false, sub: true },
                  { feature: "API Access", free: false, oneTime: false, sub: true },
                  { feature: "Priority Support", free: false, oneTime: false, sub: true },
                  { feature: "Custom Workflows", free: false, oneTime: false, sub: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {row.free === true ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : row.free === false ? (
                        <X className="w-5 h-5 text-foreground/20 mx-auto" />
                      ) : (
                        <span className="text-xs font-medium text-foreground/60">{row.free}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.oneTime === true ? (
                        <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                      ) : row.oneTime === false ? (
                        <X className="w-5 h-5 text-foreground/20 mx-auto" />
                      ) : (
                        <span className="text-xs font-medium text-foreground/60">{row.oneTime}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.sub === true ? (
                        <CheckCircle className="w-5 h-5 text-blue-600 mx-auto" />
                      ) : row.sub === false ? (
                        <X className="w-5 h-5 text-foreground/20 mx-auto" />
                      ) : (
                        <span className="text-xs font-medium text-foreground/60">{row.sub}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16 max-w-3xl">
        <h2 className="text-center mb-12 text-foreground">Common Questions</h2>
        <div className="space-y-6">
          {[
            {
              q: "Can I start with free tools and upgrade later?",
              a: "Absolutely. Our free tools give you a real taste of what GAGE offers. When you're ready for more, one-time purchases and subscriptions are available with no pressure."
            },
            {
              q: "What does 'white-label' mean?",
              a: "Every tool you download can be customized with your company's logo, name, and branding. Your clients will see YOUR brand, not ours. Set up your Company Profile once and it applies automatically to all downloads."
            },
            {
              q: "Is there a per-seat or per-user fee?",
              a: "No. One purchase covers your entire team. Share tools with everyone — no additional licensing required."
            },
            {
              q: "Can I cancel a subscription anytime?",
              a: "Yes. Monthly subscriptions are month-to-month with no long-term commitment. Cancel anytime and keep using the tool until the end of your billing period."
            },
            {
              q: "What if I need help choosing?",
              a: "Try our free Business Health Check — it assesses your business across 6 dimensions and recommends which tools will have the biggest impact for you."
            },
          ].map((item, i) => (
            <div key={i} className="border border-border rounded-lg p-6">
              <h4 className="font-semibold text-foreground mb-2">{item.q}</h4>
              <p className="text-sm text-foreground/70">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary/5 border-t border-border py-16 text-center">
        <div className="container max-w-2xl">
          <h2 className="mb-4 text-foreground">Not Sure Where to Start?</h2>
          <p className="text-lg text-foreground/70 mb-8">
            Take our free Business Health Check to get personalized recommendations based on your specific challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/solution/60036")}
              className="bg-accent hover:bg-accent/90 text-foreground font-semibold px-6 py-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Take Free Health Check
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/solutions")}
              variant="outline"
              className="font-semibold px-6 py-6 border-foreground/20"
            >
              Browse All Solutions
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
