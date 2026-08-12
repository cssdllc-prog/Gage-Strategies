import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ExternalLink, Pen, MessageSquare, ChevronRight } from "lucide-react";

const CONTENT_TYPE_LABELS: Record<string, { label: string; icon: typeof Pen; color: string }> = {
  original: { label: "Original", icon: Pen, color: "bg-emerald-100 text-emerald-700" },
  curated: { label: "Curated", icon: ExternalLink, color: "bg-blue-100 text-blue-700" },
  commentary: { label: "Commentary", icon: MessageSquare, color: "bg-amber-100 text-amber-700" },
};

export default function Blog() {
  const [, navigate] = useLocation();
  const { data: posts, isLoading, error } = trpc.blog.list.useQuery({ limit: 50, offset: 0 });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-background to-card/30">
        <div className="container py-16 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">Blog</span>
          </div>
          <h1 className="mb-4 text-foreground text-3xl md:text-4xl font-bold">Insights & Ideas</h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Original articles, curated industry reads, and expert commentary to help you grow smarter.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="container py-12 md:py-16">
        {error ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-destructive/50 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
            <p className="text-foreground/60 mb-4">We couldn't load blog posts. Please try again.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 md:p-8 rounded-xl border border-border bg-card animate-pulse">
                <div className="h-4 bg-muted rounded w-24 mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No posts yet</h2>
            <p className="text-foreground/60">Check back soon for new content.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => {
              const typeInfo = CONTENT_TYPE_LABELS[post.contentType] || CONTENT_TYPE_LABELS.original;
              const TypeIcon = typeInfo.icon;
              return (
                <button
                  key={post.id}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="w-full p-6 md:p-8 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${typeInfo.color}`}>
                          <TypeIcon className="w-3 h-3" />
                          {typeInfo.label}
                        </span>
                        {post.category && (
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                            {post.category}
                          </span>
                        )}
                        {post.publishedAt && (
                          <span className="text-xs text-foreground/50 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-foreground/60 text-sm line-clamp-2">{post.excerpt}</p>
                      )}
                      {post.contentType === "curated" && post.sourcePublication && (
                        <p className="text-xs text-foreground/40 mt-2 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          via {post.sourcePublication}
                          {post.sourceAuthor && ` — ${post.sourceAuthor}`}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-foreground/30 group-hover:text-primary flex-shrink-0 mt-2 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
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
