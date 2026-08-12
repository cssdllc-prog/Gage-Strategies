import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import {
  PhoneMissed,
  CalendarX2,
  MailX,
  ClipboardX,
  Boxes,
  ShieldCheck,
  LineChart,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  CalendarCheck2,
  Star,
} from "lucide-react";

const PAIN_POINTS = [
  {
    icon: PhoneMissed,
    title: "Missed calls become missed jobs",
    body: "Calls that arrive mid-task go unanswered, and most callers won't leave a voicemail. They move to the next name on the list — and that job is gone.",
  },
  {
    icon: CalendarX2,
    title: "No-shows with no warning",
    body: "Without an automatic reminder, a booked slot quietly becomes an empty one — and it's only noticed when the client doesn't arrive.",
  },
  {
    icon: MailX,
    title: "Leads go cold overnight",
    body: "A lead that doesn't hear back within minutes, not days, books elsewhere — often before the message is even seen.",
  },
  {
    icon: ClipboardX,
    title: "Administrative work displaces everything else",
    body: "Invoicing, review requests, and follow-ups accumulate until they're handled manually, after hours, at the expense of time that belongs elsewhere.",
  },
];

const COSTS = [
  "A missed call today is a customer who has already found someone else by tomorrow.",
  "A no-show isn't just an empty slot on the calendar — it's a full block of overhead with nothing to show for it.",
  "A cold lead doesn't fail loudly. It quietly becomes evidence, wrongly, that the marketing isn't working.",
];

const PILLARS = [
  {
    icon: Boxes,
    title: "Modular",
    body: "Every piece solves one specific pain point. Choose the ones costing you the most, skip the rest.",
  },
  {
    icon: ShieldCheck,
    title: "Managed",
    body: "We build it, test it, deploy it, and keep watch on it every month. You never touch a dashboard you didn't ask for.",
  },
  {
    icon: LineChart,
    title: "Measurable",
    body: "A plain monthly report shows exactly what the system caught — calls answered, reminders sent, reviews collected.",
  },
];

const BENEFITS = [
  { icon: PhoneCall, title: "Every call answered", body: "A missed call gets an instant text-back — before the customer even thinks about calling your competitor." },
  { icon: CalendarCheck2, title: "No-shows, handled", body: "Automatic reminders keep your calendar honest, so a booked slot stays a booked slot." },
  { icon: Star, title: "Reviews, on autopilot", body: "Every finished job turns into a review request, sent automatically, without you lifting a finger." },
];

const FAQS = [
  {
    q: "Do I need to know anything technical?",
    a: "No. We handle setup, testing, and deployment from start to finish. Once it's live, it runs on its own — you don't need to log in, configure anything, or learn new software.",
  },
  {
    q: "What if I want to cancel?",
    a: "There's no long-term contract. You can cancel anytime after your first month, no penalty and no hassle.",
  },
  {
    q: "How long does setup take?",
    a: "Most single systems are built, tested, and live within one to two weeks of getting access to what we need. Larger combinations may take a bit longer — we'll give you a clear timeline before we start.",
  },
  {
    q: "What do I need to provide?",
    a: "Just access to the specific accounts a system touches — your business phone line, calendar, or review profile, for example. Nothing more than what's required to build what you've chosen.",
  },
  {
    q: "What happens after it's live?",
    a: "We monitor it every month to make sure it's still working as expected, and you get a plain monthly report showing what it caught. If something needs adjusting, we handle it.",
  },
];

export default function WorkflowSystems() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    businessType: "",
    role: "",
    phone: "",
    challenge: "",
  });

  const leadsMutation = trpc.leads.submit.useMutation({
    onSuccess: () => {
      toast.success("Assessment request submitted! We'll be in touch within 1 business day.");
      setFormData({ name: "", email: "", company: "", businessType: "", role: "", phone: "", challenge: "" });
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
    if (!formData.name || !formData.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    const message = [
      formData.businessType ? `Business type: ${formData.businessType}` : "",
      formData.role ? `Role: ${formData.role}` : "",
      formData.phone ? `Phone: ${formData.phone}` : "",
      formData.challenge ? `Biggest challenge: ${formData.challenge}` : "",
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

      {/* HERO */}
      <section className="border-b border-border bg-gradient-to-b from-primary/[0.03] to-transparent">
        <div className="container py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary mb-4 px-3 py-1 rounded-full bg-primary/10">
              Our Flagship Managed Solution
            </span>
            <h1 className="mb-5 text-foreground leading-[1.1] text-4xl md:text-5xl lg:text-6xl">
              The GAGE <span className="text-primary">Response Engine</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed max-w-2xl">
              Hard work and long hours built your business. But success brings its own kind of chaos — and somewhere in the busy, opportunity starts slipping through the cracks. We build the systems that catch what gets missed, so nothing stands between you and the business you've worked so hard to build.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Button
                onClick={() => document.getElementById("assessment-form")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-5 text-base"
              >
                Get Your Free Workflow Assessment
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <Button
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                variant="outline"
                className="font-medium px-6 py-5 text-base border-foreground/20"
              >
                See how it works
              </Button>
            </div>
            <p className="text-sm text-foreground/50 font-medium">
              No long-term contracts — cancel anytime after your first month.
            </p>
          </div>
        </div>
      </section>

      {/* BENEFITS STRIP */}
      <section className="border-b border-border bg-card/40">
        <div className="container py-10 md:py-14">
          <div className="grid md:grid-cols-3 gap-8">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-4">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{b.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 01 — THE PROBLEM */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">01 — The Problem</span>
            <h2 className="mt-2 mb-4 text-foreground text-3xl md:text-4xl">
              "Too much to do, not enough time to do it" is starting to create painful missed tasks and inefficiencies.
            </h2>
            <p className="text-foreground/70 text-lg leading-relaxed">
              Hard work, long hours, and results your clients can count on are the keys to your success. You've done a great job growing your business — but that growth has created a new challenge. The challenge isn't your fault; it's the natural evolution of success. That same drive is creating a gap in your ability to focus on the business of the business. The chaos of "too much to do, not enough time to do it" has started creating painful missed tasks, costly delays, and potential missed revenue.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {PAIN_POINTS.map((p) => (
              <div key={p.title} className="p-6 rounded-xl border border-border bg-card flex gap-4">
                <div className="w-11 h-11 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                  <p.icon className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1.5">{p.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — THE COST */}
      <section className="border-b border-border bg-card/30">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">02 — The Cost</span>
            <h2 className="mt-2 mb-4 text-foreground text-3xl md:text-4xl">Left unaddressed, small gaps compound into real losses.</h2>
            <p className="text-foreground/70 text-lg">
              None of this shows up as a single dramatic failure. The cost shows up as a slow, steady leak.
            </p>
          </div>
          <div className="max-w-2xl divide-y divide-border border-y border-border">
            {COSTS.map((c) => (
              <div key={c} className="flex items-start gap-4 py-5">
                <span className="w-2 h-2 rounded-full bg-destructive mt-2 shrink-0" />
                <p className="text-foreground">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — THE SOLUTION */}
      <section id="how-it-works" className="border-b border-border bg-ink text-white" style={{ background: "#10252B" }}>
        <div className="container py-16 md:py-24">
          <p className="text-lime-300 text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#D9F36B" }}>
            03 — The Solution
          </p>
          <h2 className="text-white text-3xl md:text-4xl mb-4 max-w-2xl">The GAGE Response Engine.</h2>
          <p className="text-white/70 text-lg max-w-2xl mb-12 leading-relaxed">
            The GAGE Response Engine is a set of automated systems built to close that gap. Each one is engineered around the specific pain point costing you the most. We test it before launch, then monitor it for as long as it runs. The result: chaos becomes clarity, and each pain point becomes the next stage of your success.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {PILLARS.map((p) => (
              <div key={p.title} className="border-t-2 pt-5" style={{ borderColor: "#D9F36B" }}>
                <p.icon className="w-6 h-6 mb-3" style={{ color: "#D9F36B" }} />
                <h3 className="text-white font-semibold mb-2">{p.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={() => document.getElementById("assessment-form")?.scrollIntoView({ behavior: "smooth" })}
            className="font-semibold px-6 py-5 text-base"
            style={{ background: "#D9F36B", color: "#10252B" }}
          >
            Explore Workflow Systems
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </section>

      {/* WHO WE WORK WITH */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Who We Work With</span>
              <h2 className="mt-2 mb-4 text-foreground text-3xl md:text-4xl">Built for anyone who keeps the business moving.</h2>
              <p className="text-foreground/70 text-lg mb-6 leading-relaxed">
                Owner. Operator. Manager. Executive. Whatever the title, the challenge is the same — too much responsibility, not enough bandwidth to catch everything. The GAGE Response Engine is built for the person holding the business together, wherever they sit on the org chart.
              </p>
              <ul className="space-y-3">
                {[
                  "Business owners running day-to-day operations themselves",
                  "Operators and general managers overseeing multiple locations or teams",
                  "Office and practice managers keeping the front desk running",
                  "Executives and leadership accountable for growth",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border">
              <img
                src="https://images.pexels.com/photos/7868975/pexels-photo-7868975.jpeg?auto=compress&cs=tinysrgb&h=800&fit=crop&w=1000"
                alt="A diverse group of business professionals collaborating in an office meeting"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border bg-card/30">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Questions</span>
            <h2 className="mt-2 text-foreground text-3xl md:text-4xl">What people usually ask first.</h2>
          </div>
          <div className="max-w-3xl divide-y divide-border border-y border-border">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-foreground list-none">
                  {f.q}
                  <span className="text-primary group-open:hidden">+</span>
                  <span className="text-primary hidden group-open:inline">−</span>
                </summary>
                <p className="text-foreground/70 text-sm leading-relaxed mt-3 max-w-2xl">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ASSESSMENT FORM */}
      <section id="assessment-form" className="container py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Get Started</span>
            <h2 className="mt-2 mb-3 text-foreground text-3xl md:text-4xl">Let's find out what's costing you the most.</h2>
            <p className="text-foreground/70">
              Tell us how things run today. We'll reply with a straightforward read on exactly where you're losing time or revenue — and which system fits best.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Name *</label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@company.com" required />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Business name</label>
                <Input name="company" value={formData.company} onChange={handleChange} placeholder="Your business name" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Your phone number" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Business type</label>
                <Select value={formData.businessType} onValueChange={(v) => setFormData((prev) => ({ ...prev, businessType: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contractor / Trades">Contractor / Trades</SelectItem>
                    <SelectItem value="Salon / Spa">Salon / Spa</SelectItem>
                    <SelectItem value="Clinic / Practice">Clinic / Practice</SelectItem>
                    <SelectItem value="Professional Services">Professional Services</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Your role</label>
                <Select value={formData.role} onValueChange={(v) => setFormData((prev) => ({ ...prev, role: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Operator / General Manager">Operator / General Manager</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Executive / Leadership">Executive / Leadership</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">What's costing you the most right now?</label>
              <Textarea
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                placeholder="Missed calls, no-shows, slow follow-up, getting reviews..."
                rows={4}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base"
              disabled={leadsMutation.isPending}
            >
              {leadsMutation.isPending ? "Submitting..." : "Request My Free Assessment"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-center text-sm text-foreground/50">We'll respond within 1 business day — no obligation.</p>
          </form>
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
