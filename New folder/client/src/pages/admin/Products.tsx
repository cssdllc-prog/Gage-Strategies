import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Pencil, Trash2, Search, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminProducts() {
  const { data: products, isLoading, refetch } = trpc.admin.products.list.useQuery();
  const { data: categories } = trpc.admin.categories.list.useQuery();
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const deleteMutation = trpc.admin.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const filteredProducts = products?.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage your solutions, tools, and templates.
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2C3E2D] hover:bg-[#2C3E2D]/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
              </DialogHeader>
              <ProductForm
                categories={categories ?? []}
                onSuccess={() => { setIsCreateOpen(false); refetch(); }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Product List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredProducts.map((product: any) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className="h-10 w-10 rounded-lg bg-[#2C3E2D]/10 flex items-center justify-center text-lg shrink-0">
                      {product.icon || "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        product.pricing === "free" ? "bg-green-100 text-green-700" :
                        product.pricing === "subscription" ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {product.pricing === "free" ? "Free" :
                         product.pricing === "subscription" ? `$${product.monthlyPrice}/mo` :
                         `$${product.basePrice}`}
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setEditingProduct(product)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                          </DialogHeader>
                          <ProductForm
                            product={product}
                            categories={categories ?? []}
                            onSuccess={() => { setEditingProduct(null); refetch(); }}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Delete "${product.name}"? This cannot be undone.`)) {
                            deleteMutation.mutate({ id: product.id });
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No products found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground">
          {filteredProducts.length} of {products?.length ?? 0} products shown
        </p>
      </div>
    </AdminLayout>
  );
}

function ProductForm({
  product,
  categories,
  onSuccess,
}: {
  product?: any;
  categories: any[];
  onSuccess: () => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [longDescription, setLongDescription] = useState(product?.longDescription ?? "");
  const [categoryId, setCategoryId] = useState<string>(product?.categoryId?.toString() ?? "");
  const [pricing, setPricing] = useState(product?.pricing ?? "one-time");
  const [basePrice, setBasePrice] = useState(product?.basePrice ?? "");
  const [monthlyPrice, setMonthlyPrice] = useState(product?.monthlyPrice ?? "");
  const [isPopular, setIsPopular] = useState(product?.isPopular ?? false);
  const [features, setFeatures] = useState(product?.features ?? "");
  const [icon, setIcon] = useState(product?.icon ?? "");

  const createMutation = trpc.admin.products.create.useMutation({
    onSuccess: () => { toast.success("Product created"); onSuccess(); },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.admin.products.update.useMutation({
    onSuccess: () => { toast.success("Product updated"); onSuccess(); },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description,
      longDescription: longDescription || undefined,
      categoryId: parseInt(categoryId),
      pricing,
      basePrice: basePrice || undefined,
      monthlyPrice: monthlyPrice || undefined,
      isPopular,
      features: features || undefined,
      icon: icon || undefined,
    };

    if (product) {
      updateMutation.mutate({ id: product.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => { setName(e.target.value); if (!product) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")); }} required />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Short Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={2} />
      </div>

      <div className="space-y-2">
        <Label>Long Description (optional)</Label>
        <Textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)} rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Icon (emoji)</Label>
          <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="📦" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Pricing Type</Label>
          <Select value={pricing} onValueChange={setPricing}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="one-time">One-Time</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Base Price ($)</Label>
          <Input type="number" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="29.00" />
        </div>
        <div className="space-y-2">
          <Label>Monthly Price ($)</Label>
          <Input type="number" step="0.01" value={monthlyPrice} onChange={(e) => setMonthlyPrice(e.target.value)} placeholder="9.00" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Features (JSON array)</Label>
        <Textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={3}
          placeholder='["Feature 1", "Feature 2", "Feature 3"]'
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={isPopular} onCheckedChange={setIsPopular} />
        <Label>Mark as Popular</Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#2C3E2D] hover:bg-[#2C3E2D]/90"
        disabled={createMutation.isPending || updateMutation.isPending}
      >
        {createMutation.isPending || updateMutation.isPending ? "Saving..." : product ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
