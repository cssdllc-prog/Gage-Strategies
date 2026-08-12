import { useState } from "react";
import { trpc } from "@/lib/trpc";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, ExternalLink, Pen, MessageSquare } from "lucide-react";

type BlogPostForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentType: "original" | "curated" | "commentary";
  sourceUrl: string;
  sourceAuthor: string;
  sourcePublication: string;
  category: string;
  tags: string;
  coverImage: string;
  authorName: string;
  status: "draft" | "published";
};

const emptyForm: BlogPostForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  contentType: "original",
  sourceUrl: "",
  sourceAuthor: "",
  sourcePublication: "",
  category: "",
  tags: "",
  coverImage: "",
  authorName: "",
  status: "draft",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminBlog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BlogPostForm>(emptyForm);
  const [search, setSearch] = useState("");

  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.admin.blog.list.useQuery();

  const createMutation = trpc.admin.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post created");
      utils.admin.blog.list.invalidate();
      setDialogOpen(false);
      setForm(emptyForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.admin.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Blog post updated");
      utils.admin.blog.list.invalidate();
      setDialogOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted");
      utils.admin.blog.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setForm({
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      contentType: post.contentType || "original",
      sourceUrl: post.sourceUrl || "",
      sourceAuthor: post.sourceAuthor || "",
      sourcePublication: post.sourcePublication || "",
      category: post.category || "",
      tags: post.tags || "",
      coverImage: post.coverImage || "",
      authorName: post.authorName || "",
      status: post.status || "draft",
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title || !form.content) {
      toast.error("Title and content are required");
      return;
    }
    // Warn if curated/commentary without source URL
    if ((form.contentType === "curated" || form.contentType === "commentary") && !form.sourceUrl) {
      toast.error("Source URL is recommended for curated/commentary posts");
    }
    const slug = form.slug || slugify(form.title);
    // Convert comma-separated tags to JSON array
    const tagsJson = form.tags
      ? JSON.stringify(form.tags.split(",").map(t => t.trim()).filter(Boolean))
      : undefined;
    const payload = {
      ...form,
      slug,
      tags: tagsJson,
      sourceUrl: form.sourceUrl || undefined,
      sourceAuthor: form.sourceAuthor || undefined,
      sourcePublication: form.sourcePublication || undefined,
      category: form.category || undefined,
      coverImage: form.coverImage || undefined,
      authorName: form.authorName || undefined,
      excerpt: form.excerpt || undefined,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filteredPosts = (posts || []).filter((p: any) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const CONTENT_TYPE_ICONS: Record<string, typeof Pen> = {
    original: Pen,
    curated: ExternalLink,
    commentary: MessageSquare,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>

        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        {isLoading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No blog posts yet. Create your first one!</p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-foreground/70">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground/70 hidden md:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground/70 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground/70">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-foreground/70">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPosts.map((post: any) => {
                  const TypeIcon = CONTENT_TYPE_ICONS[post.contentType] || Pen;
                  return (
                    <tr key={post.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{post.title}</span>
                        <span className="block text-xs text-foreground/50 mt-0.5">/{post.slug}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="flex items-center gap-1 text-foreground/60">
                          <TypeIcon className="w-3.5 h-3.5" />
                          {post.contentType}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-foreground/60">
                        {post.category || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          post.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {post.status === "published" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(post)} title="Edit">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm("Delete this post?")) {
                                deleteMutation.mutate({ id: post.id });
                              }
                            }}
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Blog Post" : "New Blog Post"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) });
                  }}
                  placeholder="Post title"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="auto-generated-from-title"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Content Type</Label>
                <Select
                  value={form.contentType}
                  onValueChange={(v) => setForm({ ...form, contentType: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original</SelectItem>
                    <SelectItem value="curated">Curated (Repost)</SelectItem>
                    <SelectItem value="commentary">Commentary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Strategy, AI, Sales"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Source fields (only for curated/commentary) */}
            {(form.contentType === "curated" || form.contentType === "commentary") && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
                <p className="text-sm font-medium text-foreground/70">Source Attribution</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Source URL</Label>
                    <Input
                      value={form.sourceUrl}
                      onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Author</Label>
                    <Input
                      value={form.sourceAuthor}
                      onChange={(e) => setForm({ ...form, sourceAuthor: e.target.value })}
                      placeholder="Original author"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Publication</Label>
                    <Input
                      value={form.sourcePublication}
                      onChange={(e) => setForm({ ...form, sourcePublication: e.target.value })}
                      placeholder="e.g. Forbes"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label>Excerpt (short summary)</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Brief summary for listing pages..."
                rows={2}
              />
            </div>

            <div>
              <Label>Content (Markdown) *</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your post content in Markdown..."
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Author Name</Label>
                <Input
                  value={form.authorName}
                  onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                  placeholder="Display name"
                />
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="ai, strategy, growth"
                />
              </div>
            </div>

            <div>
              <Label>Cover Image URL</Label>
              <Input
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingId ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
