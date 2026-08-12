import Navigation from "@/components/Navigation";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container py-14 md:py-20 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        <p className="text-sm text-foreground/60 mb-8">Last updated: July 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Acceptance of Terms</h2>
            <p className="leading-relaxed">By accessing or using the GAGE Strategies website and Solutions Hub, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Products & Licensing</h2>
            <p className="leading-relaxed">When you purchase a tool from the Solutions Hub, you receive a license to use that tool for your business. White-label tools may be branded with your company information and shared with your clients. You may not resell, redistribute, or sublicense the tools themselves.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Subscriptions</h2>
            <p className="leading-relaxed">Subscription products are billed monthly. You may cancel at any time and retain access until the end of your billing period. Refunds are handled on a case-by-case basis.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Free Tools</h2>
            <p className="leading-relaxed">Free tools are provided as-is with no warranty. We reserve the right to modify or discontinue free tools at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
            <p className="leading-relaxed">GAGE Strategies provides tools and templates for business use. We are not liable for any business decisions made based on our tools, or for any indirect, incidental, or consequential damages arising from your use of our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Changes to Terms</h2>
            <p className="leading-relaxed">We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
            <p className="leading-relaxed">For questions about these terms, contact us at <a href="mailto:support@gage-strategies.com" className="text-primary hover:underline">support@gage-strategies.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
