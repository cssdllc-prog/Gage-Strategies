import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Pen, MessageSquare, Clock, Tag } from "lucide-react";
import { Streamdown } from "streamdown";

const CONTENT_TYPE_LABELS: Record<string, { label: string; icon: typeof Pen; color: string; description: string }> = {
  original: { label: "Original", icon: Pen, color: "bg-emerald-100 text-emerald-700", description: "Written by GAGE Strategies" },
  curated: { label: "Curated", icon: ExternalLink, color: "bg-blue-100 text-blue-700", description: "Shared from an external source" },
  commentary: { label: "Commentary", icon: MessageSquare, color: "bg-amber-100 text-amber-700", description: "Our take on external content" },
};

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug: params.slug || "" },
    { enabled: !!params.slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-16 max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-32" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!post || error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-foreground/60 mb-6">This blog post doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/blog")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const typeInfo = CONTENT_TYPE_LABELS[post.contentType] || CONTENT_TYPE_LABELS.original;
  const TypeIcon = typeInfo.icon;
  const tags: string[] = (() => {
    if (!post.tags) return [];
    try {
      const parsed = JSON.parse(post.tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Fallback: treat as comma-separated string
      return post.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
    }
  })();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <article className="container py-12 md:py-16 max-w-3xl mx-auto">
        {/* Back link */}
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </button>

        {/* Post header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${typeInfo.color}`}>
              <TypeIcon className="w-3 h-3" />
              {typeInfo.label}
            </span>
            {post.category && (
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {post.category}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-foreground/50 flex-wrap">
            {post.authorName && (
              <span>By {post.authorName}</span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>

          {/* Source attribution for curated/commentary posts */}
          {(post.contentType === "curated" || post.contentType === "commentary") && post.sourceUrl && (
            <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-foreground/70">
                {post.contentType === "curated" ? "Originally published" : "In response to an article"}
                {post.sourcePublication && ` in ${post.sourcePublication}`}
                {post.sourceAuthor && ` by ${post.sourceAuthor}`}
              </p>
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
              >
                View original source
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </header>

        {/* Cover image */}
        {post.coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden border border-border">
            <img src={post.coverImage} alt={post.title} className="w-full h-auto" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-sm md:prose-base max-w-none text-foreground/80 [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_strong]:text-foreground [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline [&_blockquote]:border-primary/30 [&_blockquote]:text-foreground/70">
          <Streamdown>{post.content}</Streamdown>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-foreground/40" />
              {tags.map((tag) => (
                <span key={tag} className="text-xs bg-muted text-foreground/60 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back to blog */}
        <div className="mt-10 pt-6 border-t border-border">
          <Button onClick={() => navigate("/blog")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border py-8">
        <div className="container text-center">
          <p className="text-foreground/50 text-sm">&copy; {new Date().getFullYear()} GAGE Strategies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
