import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminCategories() {
  const { data: categories, isLoading, refetch } = trpc.admin.categories.list.useQuery();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const deleteMutation = trpc.admin.categories.delete.useMutation({
    onSuccess: () => { toast.success("Category deleted"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground mt-1">
              Organize your solutions by category.
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2C3E2D] hover:bg-[#2C3E2D]/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Category</DialogTitle>
              </DialogHeader>
              <CategoryForm onSuccess={() => { setIsCreateOpen(false); refetch(); }} />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories?.map((cat: any) => (
              <Card key={cat.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#2C3E2D]/10 flex items-center justify-center text-xl">
                        {cat.icon || "📁"}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">{cat.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                          </DialogHeader>
                          <CategoryForm category={cat} onSuccess={() => refetch()} />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Delete "${cat.name}"?`)) {
                            deleteMutation.mutate({ id: cat.id });
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{cat.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
            {(!categories || categories.length === 0) && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No categories yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function CategoryForm({ category, onSuccess }: { category?: any; onSuccess: () => void }) {
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [icon, setIcon] = useState(category?.icon ?? "");

  const createMutation = trpc.admin.categories.create.useMutation({
    onSuccess: () => { toast.success("Category created"); onSuccess(); },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.admin.categories.update.useMutation({
    onSuccess: () => { toast.success("Category updated"); onSuccess(); },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: description || undefined,
      icon: icon || undefined,
    };
    if (category) {
      updateMutation.mutate({ id: category.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => { setName(e.target.value); if (!category) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")); }} required />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Icon (emoji)</Label>
        <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🤖" />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <Button type="submit" className="w-full bg-[#2C3E2D] hover:bg-[#2C3E2D]/90" disabled={createMutation.isPending || updateMutation.isPending}>
        {createMutation.isPending || updateMutation.isPending ? "Saving..." : category ? "Update" : "Create"}
      </Button>
    </form>
  );
}
