import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Globe, Video, Megaphone, Code, ClipboardList, Database, Layout, Presentation, ArrowRight, CheckCircle2 } from "lucide-react";

const SERVICES = [
  {
    id: "websites",
    icon: Globe,
    title: "Custom Websites",
    description: "Professional websites built to convert visitors into customers.",
    details: [
      "Landing pages & sales funnels",
      "Full business websites with CMS",
      "E-commerce stores & product catalogs",
      "Web applications & client portals",
      "Mobile-responsive design",
      "SEO optimization & analytics setup",
    ],
    startingAt: "$1,500",
  },
  {
    id: "video",
    icon: Video,
    title: "Video Production",
    description: "Engaging video content that tells your brand story.",
    details: [
      "Promotional & brand videos",
      "Explainer & tutorial videos",
      "Social media content packages",
      "AI-enhanced video editing",
      "Motion graphics & animation",
      "Video strategy & scripting",
    ],
    startingAt: "$500",
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "Marketing Tools",
    description: "Custom marketing systems that drive measurable results.",
    details: [
      "Sales funnels & lead magnets",
      "Email sequences & automation",
      "Ad creative design & copy",
      "Social media content calendars",
      "CRM setup & configuration",
      "Marketing analytics dashboards",
    ],
    startingAt: "$750",
  },
  {
    id: "apps",
    icon: Code,
    title: "Custom Apps & Tools",
    description: "Bespoke software built around your exact workflow.",
    details: [
      "Internal business tools & dashboards",
      "AI-powered automation workflows",
      "API integrations & data pipelines",
      "Client-facing portals & platforms",
      "Chrome extensions & browser tools",
      "Chatbots & AI assistants",
    ],
    startingAt: "$2,000",
  },
  {
    id: "reports",
    icon: ClipboardList,
    title: "Custom Reports",
    description: "Branded reports that showcase your value to clients.",
    details: [
      "Client performance reports",
      "Monthly/quarterly business reviews",
      "Automated report generation",
      "KPI dashboards & scorecards",
      "Competitive analysis reports",
      "White-labeled report templates",
    ],
    startingAt: "$400",
  },
  {
    id: "data",
    icon: Database,
    title: "Data Analysis & Processing",
    description: "Turn raw data into actionable business intelligence.",
    details: [
      "Data cleaning & transformation",
      "Statistical analysis & modeling",
      "Predictive analytics & forecasting",
      "Database design & optimization",
      "ETL pipelines & automation",
      "Data visualization & storytelling",
    ],
    startingAt: "$600",
  },
  {
    id: "design",
    icon: Layout,
    title: "Report Design",
    description: "Visually stunning documents that impress stakeholders.",
    details: [
      "Professional report layouts",
      "Infographic design",
      "Data visualization design",
      "Brand-consistent templates",
      "Interactive PDF reports",
      "Proposal & pitch document design",
    ],
    startingAt: "$300",
  },
  {
    id: "presentations",
    icon: Presentation,
    title: "Presentations",
    description: "Pitch decks and slides that win deals and inspire action.",
    details: [
      "Investor pitch decks",
      "Sales presentations",
      "Keynote & conference slides",
      "Training & onboarding decks",
      "Animated slide presentations",
      "Presentation strategy & scripting",
    ],
    startingAt: "$350",
  },
];

export default function CustomSolutions() {
  const [, navigate] = useLocation();
  const [selectedService, setSelectedService] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    timeline: "",
    description: "",
  });

  const leadsMutation = trpc.leads.submit.useMutation({
    onSuccess: () => {
      toast.success("Project inquiry submitted! We'll be in touch within 24 hours.");
      setFormData({ name: "", email: "", company: "", budget: "", timeline: "", description: "" });
      setSelectedService("");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !selectedService) {
      toast.error("Please fill in your name, email, and select a service.");
      return;
    }
    const message = [
      `Service: ${selectedService}`,
      formData.budget ? `Budget: ${formData.budget}` : "",
      formData.timeline ? `Timeline: ${formData.timeline}` : "",
      formData.description ? `Details: ${formData.description}` : "",
    ].filter(Boolean).join("\n");

    leadsMutation.mutate({
      name: formData.name,
      email: formData.email,
      company: formData.company || undefined,
      message,
      inquiryType: "solutions",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-background to-card/30">
        <div className="container py-16 md:py-24">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-3 px-3 py-1 rounded-full bg-primary/10">Custom Built for You</span>
          <h1 className="mb-4 text-foreground">Custom Solutions</h1>
          <p className="text-lg text-foreground/70 max-w-3xl">
            Beyond our ready-made tools, we build custom solutions from scratch — designed around your brand, your workflow, and your goals. From websites to AI tools, data analysis to presentations.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container py-16 md:py-24">
        <h2 className="text-center mb-4 text-foreground">Our Services</h2>
        <p className="text-center text-foreground/60 mb-12 max-w-2xl mx-auto">
          Each project is scoped, quoted, and delivered with clear milestones. No surprises.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="group p-8 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors duration-200">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{service.title}</h3>
                  <p className="text-foreground/60">{service.description}</p>
                </div>
              </div>

              <ul className="grid grid-cols-2 gap-2 mb-5">
                {service.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2 text-sm text-foreground/70">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-foreground/50">Starting at <span className="font-semibold text-foreground">{service.startingAt}</span></span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedService(service.title);
                    document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Get a Quote
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry-form" className="border-t border-border bg-card/50">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-center mb-4 text-foreground">Start Your Project</h2>
            <p className="text-center text-foreground/60 mb-10">
              Tell us about your project and we'll get back to you within 24 hours with a scope and quote.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
                  <Input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Service *</label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Budget Range</label>
                  <Select value={formData.budget} onValueChange={(v) => setFormData(prev => ({ ...prev, budget: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Under $500">Under $500</SelectItem>
                      <SelectItem value="$500 - $1,000">$500 - $1,000</SelectItem>
                      <SelectItem value="$1,000 - $2,500">$1,000 - $2,500</SelectItem>
                      <SelectItem value="$2,500 - $5,000">$2,500 - $5,000</SelectItem>
                      <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="$10,000+">$10,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Timeline</label>
                  <Select value={formData.timeline} onValueChange={(v) => setFormData(prev => ({ ...prev, timeline: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="When do you need it?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASAP (1-2 weeks)">ASAP (1-2 weeks)</SelectItem>
                      <SelectItem value="Soon (2-4 weeks)">Soon (2-4 weeks)</SelectItem>
                      <SelectItem value="Standard (1-2 months)">Standard (1-2 months)</SelectItem>
                      <SelectItem value="Flexible (no rush)">Flexible (no rush)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Project Details</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your project — what you need, who it's for, and any specific requirements..."
                  rows={5}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base"
                disabled={leadsMutation.isPending}
              >
                {leadsMutation.isPending ? "Submitting..." : "Submit Project Inquiry"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-center text-sm text-foreground/50">
                Free consultation — no commitment required. We'll respond within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border py-8">
        <div className="container text-center">
          <p className="text-foreground/50 text-sm">&copy; {new Date().getFullYear()} GAGE Strategies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
