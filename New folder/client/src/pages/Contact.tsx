import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Building2, Headphones, CreditCard, Lightbulb, MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INQUIRY_TYPES = [
  { value: "general", label: "General Inquiry", email: "hello@gage-strategies.com", icon: MessageSquare, description: "General questions about GAGE Strategies" },
  { value: "solutions", label: "AI Consulting & Solutions", email: "solutions@gage-strategies.com", icon: Lightbulb, description: "Custom AI strategy and consulting" },
  { value: "hub", label: "Solutions Hub / Marketplace", email: "hub@gage-strategies.com", icon: Building2, description: "Questions about tools and products" },
  { value: "support", label: "Customer Support", email: "support@gage-strategies.com", icon: Headphones, description: "Help with existing purchases" },
  { value: "billing", label: "Billing & Subscriptions", email: "billing@gage-strategies.com", icon: CreditCard, description: "Invoices, payments, and subscriptions" },
] as const;

export default function Contact() {
  const [, navigate] = useLocation();
  const [inquiryType, setInquiryType] = useState<string>("general");
  const leadsMutation = trpc.leads.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you! We'll be in touch soon.");
      setFormData({ name: "", email: "", company: "", challenge: "" });
      setInquiryType("general");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    challenge: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    leadsMutation.mutate({
      name: formData.name,
      email: formData.email,
      company: formData.company || undefined,
      message: formData.challenge || undefined,
      inquiryType: inquiryType as "general" | "solutions" | "hub" | "support" | "billing",
    });
  };

  const selectedInquiry = INQUIRY_TYPES.find(t => t.value === inquiryType) || INQUIRY_TYPES[0];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <h1 className="mb-4 text-foreground">Bring Us Your Challenge</h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Tell us about your business challenge. We'll connect you with the right team to help.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-8">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Inquiry Type Selector */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What can we help you with?
                </label>
                <Select value={inquiryType} onValueChange={setInquiryType}>
                  <SelectTrigger className="bg-card border-border text-foreground">
                    <SelectValue placeholder="Select inquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    {INQUIRY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-2 text-xs text-foreground/50">
                  Your message will be routed to: <span className="font-medium text-primary">{selectedInquiry.email}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="bg-card border-border text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="bg-card border-border text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company (Optional)
                </label>
                <Input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company"
                  className="bg-card border-border text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Challenge
                </label>
                <Textarea
                  name="challenge"
                  value={formData.challenge}
                  onChange={handleChange}
                  placeholder="Tell us about your business challenge..."
                  rows={5}
                  className="bg-card border-border text-foreground"
                />
              </div>
              <Button
                type="submit"
                disabled={leadsMutation.isPending}
                className="w-full bg-accent hover:bg-accent/90 text-foreground font-semibold py-6"
              >
                {leadsMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Info - Department Emails */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-8">Contact the Right Team</h2>
            <div className="space-y-4 mb-12">
              {INQUIRY_TYPES.map((type) => (
                <div
                  key={type.value}
                  className={`flex gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                    inquiryType === type.value
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                  onClick={() => setInquiryType(type.value)}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    inquiryType === type.value ? "bg-primary/10" : "bg-accent/10"
                  }`}>
                    <type.icon className={`w-5 h-5 ${inquiryType === type.value ? "text-primary" : "text-foreground/60"}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{type.label}</h3>
                    <p className="text-xs text-foreground/50 mt-0.5">{type.description}</p>
                    <p className="text-xs text-primary font-medium mt-1">{type.email}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Response Time */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4">What to Expect</h3>
              <div className="space-y-4 text-sm text-foreground/70">
                <div>
                  <p className="font-medium text-foreground mb-1">Response Time</p>
                  <p>We typically respond within 24 business hours.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Next Steps</p>
                  <p>We'll schedule a brief call to understand your challenge and recommend solutions.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">No Pressure</p>
                  <p>Whether you need a quick solution or strategic guidance, we're here to help.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

