import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { ChevronRight, BookOpen, FileText, Download } from "lucide-react";

export default function Resources() {
  const [, navigate] = useLocation();

  const articles = [
    {
      id: 1,
      title: "From Chaos to Clarity: A Strategic Framework for Growth",
      category: "Strategy",
      date: "March 15, 2026",
      readTime: "8 min read",
      description:
        "Learn the foundational framework that helps organizations move from chaos to clarity and position themselves for sustainable growth.",
    },
    {
      id: 2,
      title: "5 Systems Every Growing Business Needs",
      category: "Operations",
      date: "March 10, 2026",
      readTime: "6 min read",
      description:
        "Discover the essential systems that allow businesses to scale without chaos. From workflows to documentation.",
    },
    {
      id: 3,
      title: "The Hidden Cost of Disorganization",
      category: "Business",
      date: "March 5, 2026",
      readTime: "7 min read",
      description:
        "How poor organization impacts your bottom line. Data, insights, and practical solutions.",
    },
  ];

  const guides = [
    {
      id: 1,
      title: "Project Management Playbook",
      description: "Complete guide to managing projects effectively",
      pages: "24 pages",
      icon: FileText,
    },
    {
      id: 2,
      title: "Sales Process Template",
      description: "Step-by-step sales process for SMBs",
      pages: "18 pages",
      icon: FileText,
    },
    {
      id: 3,
      title: "Operations Checklist",
      description: "Daily, weekly, and monthly operational checklists",
      pages: "12 pages",
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <h1 className="mb-4 text-foreground">Resources & Guides</h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Free articles, guides, and tools to help you move from chaos to clarity.
          </p>
        </div>
      </section>

      {/* Articles Section */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24">
          <h2 className="mb-12 text-foreground">Latest Articles</h2>
          <div className="space-y-8">
            {articles.map((article) => (
              <button
                key={article.id}
                onClick={() => navigate("/blog")}
                className="w-full p-8 rounded-lg border border-border bg-card hover:border-primary hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-sm font-medium text-primary bg-accent/10 px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-sm text-foreground/60">{article.date}</span>
                      <span className="text-sm text-foreground/60">{article.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {article.title}
                    </h3>
                    <p className="text-foreground/70">{article.description}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-foreground/40 flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="border-b border-border bg-card/50">
        <div className="container py-16 md:py-24">
          <h2 className="mb-12 text-foreground">Free Guides & Templates</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {guides.map((guide) => {
              const IconComponent = guide.icon;
              return (
                <button
                  key={guide.id}
                  onClick={() => navigate("/solutions")}
                  className="p-8 rounded-lg border border-border bg-background hover:border-primary hover:shadow-lg transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-foreground/70 text-sm mb-6">{guide.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-foreground/60">{guide.pages}</span>
                    <Download className="w-4 h-4 text-primary" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-24 text-center">
        <h2 className="mb-6 text-foreground">Ready to Take Action?</h2>
        <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
          Explore our Solutions Hub to find the tools and templates you need.
        </p>
        <Button
          onClick={() => navigate("/solutions")}
          className="bg-accent hover:bg-accent/90 text-foreground font-semibold px-6 py-6"
        >
          Explore Solutions Hub
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </section>
    </div>
  );
}
