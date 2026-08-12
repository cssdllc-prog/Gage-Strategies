import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Download, Share2, Heart, CheckCircle, FileText, FileSpreadsheet, Archive, File, Lock, CreditCard, Building2, Eye, X } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import WhiteLabelPanel from "@/components/WhiteLabelPanel";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProductDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/solution/:id");
  const [isFavorited, setIsFavorited] = useState(false);
  const { isAuthenticated } = useAuth();
  const logDownloadMutation = trpc.assets.logDownload.useMutation();
  const brandedDownloadMutation = trpc.assets.brandedDownload.useMutation();
  const heroRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [previewFileName, setPreviewFileName] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);

  // Show sticky bar when hero CTA scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [heroRef.current]);

  const getPricingDisplay = (p: any) => {
    if (p?.pricing === "free") return { price: "Free", label: "Free Tool", badge: "bg-green-100 text-green-800 border-green-200" };
    if (p?.pricing === "subscription") return { price: `$${p.monthlyPrice}/mo`, label: "Monthly Subscription", badge: "bg-blue-100 text-blue-800 border-blue-200" };
    return { price: `$${p?.basePrice}`, label: "One-Time Purchase", badge: "bg-amber-100 text-amber-800 border-amber-200" };
  };

  const productId = params?.id ? parseInt(params.id) : 0;

  const { data: product, isLoading } = trpc.products.getById.useQuery(
    { id: productId },
    { enabled: productId > 0 }
  );

  const { data: allProducts = [] } = trpc.products.list.useQuery(undefined);
  const { data: assets = [] } = trpc.assets.getByProductId.useQuery(
    { productId },
    { enabled: productId > 0 }
  );
  const { data: templateCheck } = trpc.templates.hasTemplate.useQuery(
    { productId },
    { enabled: productId > 0 }
  );

  // Check if user has purchased this product
  const { data: purchaseStatus } = trpc.purchases.check.useQuery(
    { productId },
    { enabled: productId > 0 && isAuthenticated }
  );

  // Get product screenshots
  const { data: screenshots = [] } = trpc.products.getScreenshots.useQuery(
    { productId },
    { enabled: productId > 0 }
  );
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  const hasPurchased = purchaseStatus?.purchased ?? false;
  const isFree = product?.pricing === "free";
  const canAccess = isFree || hasPurchased;

  const createCheckoutMutation = trpc.purchases.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.info("Redirecting to checkout...");
        window.open(data.checkoutUrl, "_blank");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create checkout session");
    },
  });

  const relatedProducts = allProducts
    .filter((p: any) => p.id !== productId && p.categoryId === product?.categoryId)
    .slice(0, 3);

  const features = product?.features ? JSON.parse(product.features as string) : [];

  const getFileIcon = (fileType?: string | null) => {
    switch (fileType) {
      case "pdf": return <FileText className="w-5 h-5 text-red-500" />;
      case "xlsx": case "xls": case "csv": return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
      case "zip": case "rar": return <Archive className="w-5 h-5 text-amber-600" />;
      default: return <File className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleGetSolution = () => {
    if (isFree) {
      // For free tools, scroll to the files section
      const filesSection = document.getElementById("included-files");
      if (filesSection) {
        filesSection.scrollIntoView({ behavior: "smooth" });
      }
      toast.success("Scroll down to download your free files!");
      return;
    }
    if (!isAuthenticated) {
      toast.info("Please sign in to purchase this solution.");
      window.location.href = getLoginUrl();
      return;
    }
    if (hasPurchased) {
      if (assets.length > 0) {
        const filesSection = document.getElementById("included-files");
        if (filesSection) {
          filesSection.scrollIntoView({ behavior: "smooth" });
        }
        toast.success("You already own this solution! Download the files below.");
      } else {
        toast.success("You own this solution! Files are being prepared and will be available soon.");
      }
      return;
    }
    // Trigger Stripe checkout
    createCheckoutMutation.mutate({ productId });
  };

  const handleDownloadAsset = (asset: any) => {
    if (canAccess) {
      // If user is authenticated, use branded download (auto-replaces GAGE branding with their company info)
      if (isAuthenticated) {
        brandedDownloadMutation.mutate(
          { productId, assetId: asset.id },
          {
            onSuccess: (result) => {
              if (result.type === "html") {
                // Create a downloadable blob from the branded HTML
                const blob = new Blob([result.content], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = result.fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success("Downloaded with your company branding!");
              } else {
                // For non-HTML files, redirect to the file URL
                window.open(result.url, "_blank");
                toast.success("Download started!");
              }
            },
            onError: (error) => {
              // Fallback to direct download if branding fails
              window.open(asset.fileUrl, "_blank");
              toast.info("Downloaded without custom branding.");
            },
          }
        );
      } else {
        // Anonymous/free download without branding
        window.open(asset.fileUrl, "_blank");
        logDownloadMutation.mutate({
          productId: productId,
          productName: product?.name || "",
          fileName: asset.name,
        });
      }
    } else if (!isAuthenticated) {
      toast.info("Please sign in to purchase and download this file.");
      window.location.href = getLoginUrl();
    } else {
      toast.info("Purchase this solution to download files.");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handlePreviewAsset = (asset: any) => {
    if (!canAccess) {
      if (!isAuthenticated) {
        toast.info("Please sign in to preview this file.");
        window.location.href = getLoginUrl();
      } else {
        toast.info("Purchase this solution to preview files.");
      }
      return;
    }
    setPreviewLoading(true);
    setPreviewOpen(true);
    setPreviewFileName(asset.name);
    if (isAuthenticated) {
      brandedDownloadMutation.mutate(
        { productId, assetId: asset.id },
        {
          onSuccess: (result) => {
            if (result.type === "html") {
              setPreviewContent(result.content);
            } else {
              setPreviewContent(`<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><p>Preview not available for this file type. Please download instead.</p></body></html>`);
            }
            setPreviewLoading(false);
          },
          onError: () => {
            setPreviewContent(`<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><p>Unable to load preview. Please try downloading instead.</p></body></html>`);
            setPreviewLoading(false);
          },
        }
      );
    } else {
      // For anonymous free access, show direct file
      setPreviewContent(`<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><p>Sign in to preview branded content.</p></body></html>`);
      setPreviewLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-24 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-24 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Solution Not Found</h2>
          <p className="text-foreground/70 mb-8">This solution may have been moved or removed.</p>
          <Button onClick={() => navigate("/solutions")} variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Solutions Hub
          </Button>
        </div>
      </div>
    );
  }

  const ctaLabel = isFree ? "Get Free Tool" : hasPurchased ? (assets.length > 0 ? "Download Files" : "Purchased ✓") : product?.pricing === "subscription" ? `Start Now — ${getPricingDisplay(product).price}` : `Unlock This Tool — ${getPricingDisplay(product).price}`;
  const ctaIcon = isFree ? <Download className="w-4 h-4 mr-2" /> : hasPurchased ? <Download className="w-4 h-4 mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />;

  // Generate urgency text based on product type
  const getUrgencyText = () => {
    if (isFree) return null;
    if (product?.pricing === "subscription") return "Cancel anytime • No long-term commitment";
    return "One-time purchase • Yours forever";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumb */}
      <section className="border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <button
              onClick={() => navigate("/solutions")}
              className="hover:text-foreground transition-colors"
            >
              Solutions Hub
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div ref={heroRef}>
              <div className="flex items-center gap-3 mb-6">
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getPricingDisplay(product).badge}`}>
                  {getPricingDisplay(product).label}
                </span>
                {hasPurchased && (
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border bg-green-100 text-green-800 border-green-200">
                    Purchased
                  </span>
                )}
                {!hasPurchased && !isFree && (
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border bg-primary/10 text-primary border-primary/20 animate-pulse">
                    Popular
                  </span>
                )}
              </div>
              <h1 className="mb-6 text-foreground">{product.name}</h1>
              <p className="text-lg text-foreground/70 mb-8">{product.description}</p>

              <div className="flex items-center gap-4 mb-8">
                <div className="text-3xl font-bold text-primary">
                  {getPricingDisplay(product).price}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleGetSolution}
                    disabled={createCheckoutMutation.isPending}
                    className="bg-accent hover:bg-accent/90 text-foreground font-semibold"
                  >
                    {createCheckoutMutation.isPending ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        {ctaIcon}
                        {ctaLabel}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setIsFavorited(!isFavorited)}
                    variant="outline"
                    className="border-foreground/20"
                  >
                    <Heart
                      className={`w-4 h-4 ${isFavorited ? "fill-current text-accent" : ""}`}
                    />
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="border-foreground/20"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {/* Urgency / reassurance text */}
              {getUrgencyText() && (
                <p className="text-sm text-foreground/60 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {getUrgencyText()}
                  <span className="mx-2">•</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Instant access after purchase
                  <span className="mx-2">•</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  White-label ready
                </p>
              )}
            </div>

            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg h-96 border border-accent/20 flex items-center justify-center p-8">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full max-h-full w-auto h-auto rounded object-contain"
                />
              ) : (
                <img
                  src="/manus-storage/gage-strategies-logo_119c7c41.png"
                  alt="GAGE Strategies"
                  className="max-w-[380px] w-full h-auto"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Gallery */}
      {screenshots.length > 0 && (
        <section className="border-b border-border">
          <div className="container py-12">
            <h2 className="mb-8 text-foreground">Preview</h2>
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border border-border bg-background">
                <img
                  src={screenshots[activeScreenshot]?.imageUrl}
                  alt={screenshots[activeScreenshot]?.caption || "Product screenshot"}
                  className="w-full h-auto max-h-[500px] object-contain"
                />
              </div>
              {screenshots[activeScreenshot]?.caption && (
                <p className="text-sm text-foreground/60 text-center italic">
                  {screenshots[activeScreenshot].caption}
                </p>
              )}
              {screenshots.length > 1 && (
                <div className="flex gap-3 justify-center">
                  {screenshots.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveScreenshot(i)}
                      className={`w-24 h-16 rounded border-2 overflow-hidden transition-all ${
                        i === activeScreenshot
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={s.imageUrl}
                        alt={s.caption || `Screenshot ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Business Impact Panel */}
      <section className="border-b border-border bg-card/30">
        <div className="container py-12">
          <h2 className="mb-2 text-foreground">Business Impact</h2>
          <p className="text-foreground/60 mb-8">Real results you can expect from day one</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="p-5 rounded-lg border border-border bg-background hover:border-primary/30 transition-colors">
              <p className="text-sm text-foreground/60 mb-2">Time Saved</p>
              <p className="text-2xl font-bold text-primary">2-5 hrs/week</p>
              <p className="text-xs text-foreground/50 mt-1">Per team member</p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-background hover:border-primary/30 transition-colors">
              <p className="text-sm text-foreground/60 mb-2">Implementation</p>
              <p className="text-2xl font-bold text-primary">Easy</p>
              <p className="text-xs text-foreground/50 mt-1">No technical skills needed</p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-background hover:border-primary/30 transition-colors">
              <p className="text-sm text-foreground/60 mb-2">Setup Time</p>
              <p className="text-2xl font-bold text-primary">Under 30 min</p>
              <p className="text-xs text-foreground/50 mt-1">Start using immediately</p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-background hover:border-primary/30 transition-colors">
              <p className="text-sm text-foreground/60 mb-2">ROI Timeline</p>
              <p className="text-2xl font-bold text-primary">Day 1</p>
              <p className="text-xs text-foreground/50 mt-1">Immediate value</p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-background hover:border-primary/30 transition-colors">
              <p className="text-sm text-foreground/60 mb-2">Team Size</p>
              <p className="text-2xl font-bold text-primary">1-50+</p>
              <p className="text-xs text-foreground/50 mt-1">Scales with your business</p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-background hover:border-primary/30 transition-colors">
              <p className="text-sm text-foreground/60 mb-2">White-Label</p>
              <p className="text-2xl font-bold text-primary">Included</p>
              <p className="text-xs text-foreground/50 mt-1">Add your branding</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      {features.length > 0 && (
        <section className="border-b border-border" id="whats-included">
          <div className="container py-12">
            <h2 className="mb-8 text-foreground">What's Included</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Downloadable Assets */}
      {assets.length > 0 && (
        <section id="included-files" className="border-b border-border bg-accent/5">
          <div className="container py-12">
            <h2 className="mb-2 text-foreground">Included Files</h2>
            <p className="text-foreground/60 mb-8">
              {canAccess ? "Download your files below" : "Purchase this solution to unlock downloads"}
            </p>
            {canAccess && isAuthenticated && (
              <div className="mb-6 p-4 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-3">
                <Building2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-Branding Enabled</p>
                  <p className="text-xs text-foreground/60 mt-1">
                    HTML tools will be automatically branded with your company logo and info when downloaded.{" "}
                    <button onClick={() => navigate("/company-profile")} className="text-primary hover:underline font-medium">
                      Update your Company Profile →
                    </button>
                  </p>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {assets.map((asset: any) => (
                <div key={asset.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      {getFileIcon(asset.fileType)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{asset.name}</p>
                      <div className="flex items-center gap-3 text-sm text-foreground/60">
                        {asset.fileType && <span className="uppercase">{asset.fileType}</span>}
                        {asset.fileSize && <span>{formatFileSize(asset.fileSize)}</span>}
                        {asset.description && <span>— {asset.description}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {canAccess && (asset.fileType === "html" || asset.fileUrl?.endsWith(".html")) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-foreground/20 text-foreground/70 hover:bg-muted"
                        onClick={() => handlePreviewAsset(asset)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                    )}
                    <Button
                      variant={canAccess ? "outline" : "default"}
                      size="sm"
                      className={canAccess ? "border-primary/30 text-primary hover:bg-primary/5" : "bg-accent hover:bg-accent/90 text-foreground"}
                      onClick={() => handleDownloadAsset(asset)}
                    >
                      {canAccess ? (
                        <>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-1" />
                          Locked
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {!canAccess && (
              <div className="mt-6 p-4 rounded-lg border border-accent/30 bg-accent/5 text-center">
                <p className="text-foreground/70 mb-3">Purchase this solution to unlock all files</p>
                <Button
                  onClick={handleGetSolution}
                  disabled={createCheckoutMutation.isPending}
                  className="bg-accent hover:bg-accent/90 text-foreground font-semibold"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {ctaLabel}
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* White-Label Panel (only for users who have access) */}
      {isAuthenticated && canAccess && templateCheck?.hasTemplate && (
        <section className="border-b border-border">
          <div className="container py-12">
            <div className="max-w-2xl">
              <WhiteLabelPanel productId={productId} productName={product?.name || ""} />
            </div>
          </div>
        </section>
      )}

      {/* Long Description */}
      {product.longDescription && (
        <section className="border-b border-border">
          <div className="container py-12">
            <h2 className="mb-8 text-foreground">About This Solution</h2>
            <div className="max-w-3xl space-y-4">
              {product.longDescription.split('\n').filter((p: string) => p.trim()).map((paragraph: string, idx: number) => (
                <p key={idx} className="text-lg text-foreground/70 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why You Need This */}
      {product.longDescription && (
        <section className="border-b border-border bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container py-12">
            <h2 className="mb-4 text-foreground">Why You Need This</h2>
            <p className="text-foreground/60 mb-8 max-w-2xl">Stop losing time and money to inefficient processes. Here's what changes when you implement this solution:</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-red-200/30 bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600 text-lg">✗</span>
                  </div>
                  <h4 className="font-semibold text-foreground">Without This Solution</h4>
                </div>
                <ul className="space-y-2 text-foreground/70 text-sm">
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">•</span> Hours wasted on manual, repetitive tasks</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">•</span> Inconsistent processes across your team</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">•</span> Missed opportunities and dropped balls</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">•</span> No visibility into what's working</li>
                </ul>
              </div>
              <div className="p-6 rounded-lg border border-green-200/30 bg-background">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                  <h4 className="font-semibold text-foreground">With This Solution</h4>
                </div>
                <ul className="space-y-2 text-foreground/70 text-sm">
                  <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">•</span> Automated workflows save 2-5 hours weekly</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">•</span> Standardized, professional processes every time</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">•</span> Nothing falls through the cracks</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">•</span> Clear metrics and actionable insights</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Implementation Guide */}
      <section className="border-b border-border bg-card/50">
        <div className="container py-12">
          <h2 className="mb-8 text-foreground">Implementation Guide</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-border bg-background">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-primary">1</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Download & Review</h4>
              <p className="text-foreground/70 text-sm">Get instant access and review the solution structure. Familiarize yourself with the templates and guides included.</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-background">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-primary">2</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Customize & Adapt</h4>
              <p className="text-foreground/70 text-sm">Tailor the solution to your specific business needs. Add your branding, adjust workflows, and configure settings.</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-background">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-primary">3</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Deploy & Scale</h4>
              <p className="text-foreground/70 text-sm">Roll out to your team and start seeing results. Use the included training materials to onboard your team quickly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="container py-12">
          <h2 className="mb-8 text-foreground">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-2 text-sm">Can I customize this for my business?</h3>
              <p className="text-foreground/70 text-sm">Absolutely. Every solution is fully editable. Change colors, add your logo, modify workflows, and adapt it to your exact needs. Your branding is applied automatically when you download.</p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-2 text-sm">Do I need technical skills?</h3>
              <p className="text-foreground/70 text-sm">No. Our tools are designed for business owners and managers, not developers. If you can use a spreadsheet or web browser, you can use these tools.</p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-2 text-sm">Can my whole team use this?</h3>
              <p className="text-foreground/70 text-sm">Yes — one purchase covers your entire team. No per-seat pricing, no user limits. Share it with everyone who needs it.</p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-2 text-sm">What if it doesn't work for my industry?</h3>
              <p className="text-foreground/70 text-sm">Our tools are industry-agnostic and work for any business type — from contractors to consultants, retail to SaaS. The frameworks adapt to your specific context.</p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-2 text-sm">Is there a subscription or recurring fee?</h3>
              <p className="text-foreground/70 text-sm">One-time purchases are yours forever — no recurring fees. Subscription tools are month-to-month with no long-term commitment. Cancel anytime.</p>
            </div>
            <div className="p-5 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-2 text-sm">How quickly can I get started?</h3>
              <p className="text-foreground/70 text-sm">Instantly. Download immediately after purchase, open the file, and start using it. Most users are up and running in under 30 minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee */}
      <section className="border-b border-border bg-primary/5">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Built by GAGE Strategies</h3>
                <p className="text-sm text-foreground/60">Trusted by businesses nationwide. Every tool is battle-tested and designed to deliver real results from day one.</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-foreground/60">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>White-Label Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>No Lock-In</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Solutions */}
      {relatedProducts.length > 0 && (
        <section className="border-b border-border bg-card/50">
          <div className="container py-12">
            <h2 className="mb-8 text-foreground">Related Solutions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((rp: any) => (
                <button
                  key={rp.id}
                  onClick={() => navigate(`/solution/${rp.id}`)}
                  className="group rounded-lg border border-border bg-background hover:border-primary hover:shadow-lg transition-all text-left p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-xl">
                      {rp.icon || "⚡"}
                    </div>
                    <span className="text-xs font-medium text-foreground/60 bg-muted px-2 py-1 rounded">
                      {rp.pricing === "free" ? "Free" : rp.pricing === "subscription" ? `$${rp.monthlyPrice}/mo` : `$${rp.basePrice}`}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {rp.name}
                  </h3>
                  <p className="text-foreground/70 text-sm line-clamp-2">{rp.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="container py-12 text-center">
        <h2 className="mb-6 text-foreground">Ready to Get Started?</h2>
        <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
          {canAccess ? "Download your files above or explore more tools in our Solutions Hub." : "Purchase this solution now or explore more tools in our Solutions Hub."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGetSolution}
            disabled={createCheckoutMutation.isPending}
            className="bg-accent hover:bg-accent/90 text-foreground font-semibold px-6 py-6"
          >
            {ctaIcon}
            {ctaLabel}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            onClick={() => navigate("/solutions")}
            variant="outline"
            className="font-semibold px-6 py-6 border-foreground/20"
          >
            Browse More Solutions
          </Button>
        </div>
      </section>

      {/* Sticky Purchase Bar */}
      {!canAccess && showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300">
          <div className="container flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-semibold text-foreground truncate max-w-[200px] md:max-w-none">{product.name}</h3>
              <span className="text-lg font-bold text-primary hidden sm:block">{getPricingDisplay(product).price}</span>
              <span className="text-xs text-foreground/50 hidden md:block">{getUrgencyText()}</span>
            </div>
            <Button
              onClick={handleGetSolution}
              disabled={createCheckoutMutation.isPending}
              className="bg-accent hover:bg-accent/90 text-foreground font-semibold px-6 whitespace-nowrap"
            >
              {ctaIcon}
              {ctaLabel}
            </Button>
          </div>
        </div>
      )}

      {/* Branded HTML Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl w-[90vw] h-[80vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">{previewFileName}</DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (previewContent) {
                      const blob = new Blob([previewContent], { type: "text/html" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${previewFileName}.html`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      toast.success("Downloaded!");
                    }
                  }}
                  className="border-primary/30 text-primary hover:bg-primary/5"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {previewLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <iframe
                srcDoc={previewContent}
                className="w-full h-full border-0"
                title="Branded Preview"
                sandbox="allow-same-origin"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
