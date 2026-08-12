import Navigation from "@/components/Navigation";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container py-14 md:py-20 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <p className="text-sm text-foreground/60 mb-8">Last updated: July 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h2>
            <p className="leading-relaxed">When you create an account or make a purchase, we collect your name, email address, and payment information (processed securely through Stripe). We also collect usage data to improve our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">How We Use Your Information</h2>
            <p className="leading-relaxed">We use your information to provide and improve our services, process transactions, send you updates about your purchases, and communicate with you about new tools and features. We never sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Data Security</h2>
            <p className="leading-relaxed">We implement industry-standard security measures to protect your personal information. Payment processing is handled entirely by Stripe and we never store your credit card details on our servers.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Cookies</h2>
            <p className="leading-relaxed">We use essential cookies to maintain your session and preferences. We do not use third-party tracking cookies for advertising purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Your Rights</h2>
            <p className="leading-relaxed">You may request access to, correction of, or deletion of your personal data at any time by contacting us at support@gage-strategies.com.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
            <p className="leading-relaxed">For questions about this privacy policy, contact us at <a href="mailto:support@gage-strategies.com" className="text-primary hover:underline">support@gage-strategies.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
