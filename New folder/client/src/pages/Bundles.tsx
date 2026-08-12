import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { ChevronRight, Package, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Bundles() {
  const [, navigate] = useLocation();
  const { data: bundles = [], isLoading } = trpc.bundles.list.useQuery();
  const { data: allProducts = [] } = trpc.products.list.useQuery(undefined);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<string>("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const leadsMutation = trpc.leads.submit.useMutation({
    onSuccess: () => {
      toast.success("Request received! We'll send you access details shortly.");
      setShowDialog(false);
      setEmail("");
      setName("");
      setSelectedBundle("");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleGetBundle = (bundleName: string) => {
    setSelectedBundle(bundleName);
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    leadsMutation.mutate({
      name,
      email,
      message: `Bundle request: ${selectedBundle}`,
    });
  };

  const getProductNames = (productIds: string | null) => {
    if (!productIds) return [];
    try {
      const ids = JSON.parse(productIds) as number[];
      return ids.map((idOrName) => {
        // Support both numeric IDs and product name strings
        const product = typeof idOrName === 'number'
          ? allProducts.find((p: any) => p.id === idOrName)
          : allProducts.find((p: any) => p.name === idOrName);
        return product ? { id: product.id, name: product.name, icon: product.icon } : (typeof idOrName === 'string' ? { id: idOrName, name: idOrName, icon: "⚡" } : null);
      }).filter(Boolean);
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <section className="border-b border-border">
        <div className="container py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-foreground">Solution Bundles</h1>
          </div>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Curated collections of tools designed to work together. Get more value with bundled pricing — save up to 39% compared to buying individually.
          </p>
        </div>
      </section>

      {/* Bundles Grid */}
      <section className="container py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-8 animate-pulse">
                <div className="h-8 bg-muted rounded w-3/4 mb-4" />
                <div className="h-4 bg-muted rounded w-full mb-6" />
                <div className="h-20 bg-muted rounded mb-6" />
                <div className="h-10 bg-muted rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {bundles.map((bundle: any) => {
              const includedProducts = getProductNames(bundle.productIds);
              return (
                <div
                  key={bundle.id}
                  className={`rounded-xl border bg-card p-8 transition-all hover:shadow-lg ${
                    bundle.isPopular ? "border-primary shadow-md" : "border-border"
                  }`}
                >
                  {bundle.isPopular && (
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                        Popular Bundle
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        {bundle.icon} {bundle.name}
                      </h2>
                      <p className="text-foreground/70 text-sm">{bundle.description}</p>
                    </div>
                  </div>

                  {/* Included Products */}
                  <div className="my-6 p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wide mb-3">
                      Includes {includedProducts.length} Solutions
                    </p>
                    <div className="space-y-2">
                      {includedProducts.map((product: any) => (
                        <div key={product.id} className="flex items-center gap-2">
                          <span className="text-sm">{product.icon || "⚡"}</span>
                          <button
                            onClick={() => navigate(`/solution/${product.id}`)}
                            className="text-sm text-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
                          >
                            {product.name}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-end justify-between pt-4 border-t border-border">
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-primary">${bundle.bundlePrice}</span>
                        <span className="text-lg text-foreground/40 line-through">${bundle.originalPrice}</span>
                      </div>
                      <span className="text-sm font-semibold text-accent-foreground bg-accent/20 px-2 py-0.5 rounded mt-1 inline-block">
                        {bundle.savings}
                      </span>
                    </div>
                    <Button
                      className="bg-accent hover:bg-accent/90 text-foreground font-semibold"
                      onClick={() => handleGetBundle(bundle.name)}
                    >
                      Get Bundle
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card/50">
        <div className="container py-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Not sure which bundle is right for you?
          </h2>
          <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
            Use our Solution Finder to get personalized recommendations based on your business challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/solution-finder")}
              className="bg-accent hover:bg-accent/90 text-foreground font-semibold"
            >
              Try Solution Finder
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/solutions")}
              variant="outline"
              className="border-foreground/20 font-semibold"
            >
              Browse Individual Solutions
            </Button>
          </div>
        </div>
      </section>

      {/* Lead Capture Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-xl border border-border p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Get {selectedBundle}</h3>
              <button
                onClick={() => setShowDialog(false)}
                className="text-foreground/40 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-foreground/70 text-sm mb-6">
              Enter your details and we'll send you instant access to this bundle.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-foreground font-semibold"
                disabled={leadsMutation.isPending}
              >
                {leadsMutation.isPending ? "Processing..." : "Get Instant Access"}
              </Button>
              <p className="text-xs text-foreground/50 text-center">
                No spam. We'll send you access details and a receipt.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
