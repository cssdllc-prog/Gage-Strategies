import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";

export default function PurchaseSuccess() {
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container py-24 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Purchase Successful!</h1>
        <p className="text-lg text-foreground/70 mb-8">
          Thank you for your purchase. Your solution files are now unlocked and ready to download.
        </p>

        <div className="bg-card border border-border rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-foreground mb-3">What's next?</h3>
          <ul className="space-y-3 text-foreground/70">
            <li className="flex items-start gap-3">
              <Download className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>Go to the solution page to download your files</span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>Use the white-label panel to customize documents with your branding</span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>Check your email for a receipt from Stripe</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/my-purchases")}
            className="bg-accent hover:bg-accent/90 text-foreground font-semibold"
          >
            View My Purchases
          </Button>
          <Button
            onClick={() => navigate("/solutions")}
            variant="outline"
            className="border-foreground/20"
          >
            Browse More Solutions
          </Button>
        </div>
      </div>
    </div>
  );
}
