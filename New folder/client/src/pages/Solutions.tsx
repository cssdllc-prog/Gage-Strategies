import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, ChevronRight, Zap, Package, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";

export default function Solutions() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<string | null>(null);

  const { data: products = [], isLoading: productsLoading } = trpc.products.list.useQuery(
    selectedCategory ? { categoryId: selectedCategory } : undefined
  );
  const { data: categories = [] } = trpc.products.listCategories.useQuery();

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = !searchQuery ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPricing = !selectedPricing || product.pricing === selectedPricing;
    return matchesSearch && matchesPricing;
  });

  const subscriptionProducts = filteredProducts.filter((p: any) => p.pricing === "subscription");
  const oneTimeProducts = filteredProducts.filter((p: any) => p.pricing === "one-time");
  const freeProducts = filteredProducts.filter((p: any) => p.pricing === "free");

  const getPricingDisplay = (product: any) => {
    if (product.pricing === "free") return { label: "Free", badge: "bg-green-100 text-green-800", price: "Free" };
    if (product.pricing === "subscription") return {
      label: `$${product.monthlyPrice}/mo`,
      badge: "bg-blue-100 text-blue-800",
      price: `$${product.monthlyPrice}/mo`
    };
    return {
      label: `$${product.basePrice}`,
      badge: "bg-amber-100 text-amber-800",
      price: `$${product.basePrice}`
    };
  };

  const getPricingBadge = (product: any) => {
    if (product.pricing === "free") return { text: "FREE", className: "bg-green-100 text-green-800 border-green-200" };
    if (product.pricing === "subscription") return { text: "MONTHLY", className: "bg-blue-100 text-blue-800 border-blue-200" };
    return { text: "ONE-TIME", className: "bg-amber-100 text-amber-800 border-amber-200" };
  };

  const ProductCard = ({ product }: { product: any }) => {
    const pricing = getPricingDisplay(product);
    const badge = getPricingBadge(product);
    return (
      <button
        onClick={() => navigate(product.pricing === "free" && product.demoUrl ? product.demoUrl : `/solution/${product.id}`)}
        className="group rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all text-left flex flex-col h-full overflow-hidden"
      >
        {/* Product Image */}
        {product.image ? (
          <div className="w-full h-36 bg-muted/30 overflow-hidden border-b border-border">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="w-full h-36 bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center border-b border-border">
            <span className="text-4xl">{product.icon || "⚡"}</span>
          </div>
        )}

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-3">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.className}`}>
              {badge.text}
            </span>
          </div>

          <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>

          <p className="text-foreground/60 text-sm mb-4 line-clamp-2 flex-grow">
            {product.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
            <span className="font-bold text-lg text-primary">
              {pricing.price}
            </span>
            <span className="text-xs text-foreground/40 group-hover:text-primary flex items-center gap-1 transition-colors font-medium">
              Learn More
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header with stats */}
      <section className="border-b border-border">
        <div className="container py-12 md:py-16">
          <h1 className="mb-4 text-foreground">Solutions Hub</h1>
          <p className="text-lg text-foreground/70 max-w-2xl mb-8">
            Practical workflow solutions that solve your business challenges. From templates and checklists to AI assistants and dashboards.
          </p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Zap className="w-4 h-4 text-primary" />
              <span><strong className="text-foreground">{products.length}</strong> Solutions Available</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Package className="w-4 h-4 text-blue-600" />
              <span><strong className="text-foreground">{products.filter((p: any) => p.pricing === "subscription").length}</strong> Monthly Subscriptions</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Star className="w-4 h-4 text-green-600" />
              <span><strong className="text-foreground">{products.filter((p: any) => p.pricing === "free").length}</strong> Free Tools</span>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Finder + Bundles CTA */}
      <section className="border-b border-border bg-card/50">
        <div className="container py-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-lg border border-border bg-background">
              <div>
                <h3 className="font-semibold text-foreground mb-1 text-sm">Not sure where to start?</h3>
                <p className="text-foreground/70 text-xs">Get personalized recommendations</p>
              </div>
              <Button
                onClick={() => navigate("/solution-finder")}
                size="sm"
                className="bg-accent hover:bg-accent/90 text-foreground font-semibold whitespace-nowrap"
              >
                Solution Finder
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-lg border border-primary/30 bg-primary/5">
              <div>
                <h3 className="font-semibold text-foreground mb-1 text-sm">Save with Bundles</h3>
                <p className="text-foreground/70 text-xs">Curated tool collections — save up to 39%</p>
              </div>
              <Button
                onClick={() => navigate("/bundles")}
                size="sm"
                variant="outline"
                className="border-primary text-primary font-semibold whitespace-nowrap"
              >
                View Bundles
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="border-b border-border">
        <div className="container py-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <Input
              type="text"
              placeholder="Search solutions by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-base bg-card border-border"
            />
          </div>

          {/* Pricing Type Filter */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3">
              Pricing Type
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPricing(null)}
                className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                  selectedPricing === null
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground/70 hover:border-primary/50 hover:text-foreground"
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setSelectedPricing("subscription")}
                className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                  selectedPricing === "subscription"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
                }`}
              >
                Monthly ($9-$29/mo)
              </button>
              <button
                onClick={() => setSelectedPricing("one-time")}
                className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                  selectedPricing === "one-time"
                    ? "bg-amber-600 text-white border-amber-600"
                    : "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
                }`}
              >
                One-Time ($9-$49)
              </button>
              <button
                onClick={() => setSelectedPricing("free")}
                className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                  selectedPricing === "free"
                    ? "bg-green-600 text-white border-green-600"
                    : "border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
                }`}
              >
                Free Tools
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3">
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground/70 hover:border-primary/50"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-foreground/70 hover:border-primary/50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="container py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-foreground/60 text-sm">
            Showing {filteredProducts.length} solution{filteredProducts.length !== 1 ? "s" : ""}
            {selectedPricing && ` • ${selectedPricing === "subscription" ? "Monthly Subscriptions" : selectedPricing === "one-time" ? "One-Time Purchases" : "Free Tools"}`}
          </p>
          {(searchQuery || selectedCategory || selectedPricing) && (
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
                setSelectedPricing(null);
              }}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              Clear All Filters
            </Button>
          )}
        </div>

        {productsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 animate-pulse">
                <div className="h-12 w-12 rounded-xl bg-muted mb-4" />
                <div className="h-5 bg-muted rounded mb-2 w-3/4" />
                <div className="h-4 bg-muted rounded mb-4 w-full" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {/* If no specific filter, show grouped sections */}
            {!selectedPricing ? (
              <div className="space-y-12">
                {/* Monthly Subscription Tools */}
                {subscriptionProducts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Package className="w-4 h-4 text-blue-700" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">Monthly Subscription Tools</h2>
                        <p className="text-xs text-foreground/60">Ongoing access with continuous updates • $9-$29/mo</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {subscriptionProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {/* One-Time Purchase Tools */}
                {oneTimeProducts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-amber-700" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">One-Time Purchase Tools</h2>
                        <p className="text-xs text-foreground/60">Buy once, use forever • $9-$49</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {oneTimeProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Free Tools */}
                {freeProducts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <Star className="w-4 h-4 text-green-700" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">Free Tools</h2>
                        <p className="text-xs text-foreground/60">Start solving problems today — no cost, no commitment</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {freeProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-foreground/40" />
            </div>
            <p className="text-foreground/60 mb-2 font-medium">No solutions found</p>
            <p className="text-foreground/40 text-sm mb-6">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
                setSelectedPricing(null);
              }}
              variant="outline"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-card/50">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-border bg-background">
            <div>
              <p className="font-medium text-foreground text-sm">Can't find what you need?</p>
              <p className="text-foreground/60 text-xs mt-0.5">We also build custom tools tailored to your workflow.</p>
            </div>
            <Button
              onClick={() => navigate("/contact")}
              variant="outline"
              size="sm"
              className="font-medium border-foreground/20 shrink-0"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
