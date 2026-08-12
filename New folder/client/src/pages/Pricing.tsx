import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Check, Loader2 } from "lucide-react";

export default function Pricing() {
  const [, navigate] = useLocation();
  const { data: tiers, isLoading } = trpc.pricing.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-foreground hover:opacity-80 transition-opacity"
          >
            Gage Strategies
          </button>
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate("/solutions")}
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Solutions
            </button>
            <button className="text-accent font-medium">Pricing</button>
            <button
              onClick={() => navigate("/about")}
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              About
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24 text-center">
          <h1 className="mb-4 text-foreground">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Choose the perfect plan for your business. Scale up or down anytime.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="container py-16 md:py-24">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {tiers?.map((tier: any) => (
              <div
                key={tier.id}
                className={`rounded-lg border transition-all ${
                  tier.isPopular
                    ? "border-accent bg-accent/5 shadow-lg scale-105"
                    : "border-border bg-card"
                }`}
              >
                {tier.isPopular && (
                  <div className="px-6 py-2 bg-accent text-accent-foreground text-sm font-semibold text-center">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-foreground/60 text-sm mb-6">
                    {tier.description}
                  </p>

                  <div className="mb-6">
                    <div className="text-4xl font-bold text-foreground">
                      ${tier.monthlyPrice}
                    </div>
                    <p className="text-foreground/60 text-sm">per month</p>
                  </div>

                  <Button
                    onClick={() => navigate("/contact")}
                    className={`w-full mb-8 font-semibold ${
                      tier.isPopular
                        ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                        : "border border-border text-foreground hover:bg-card"
                    }`}
                    variant={tier.isPopular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>

                  <div className="space-y-4">
                    {tier.features &&
                      JSON.parse(tier.features).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-foreground/80 text-sm">{feature}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="border-t border-border bg-card/50">
        <div className="container py-16 md:py-24">
          <h2 className="text-center mb-12 text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-foreground/70">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Do you offer annual billing discounts?
              </h3>
              <p className="text-foreground/70">
                Yes! Annual plans include a 20% discount compared to monthly billing. Contact us for details.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Is there a free trial?
              </h3>
              <p className="text-foreground/70">
                We offer a 14-day free trial for all plans. No credit card required to get started.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
