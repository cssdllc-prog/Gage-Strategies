import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { FileText, Trash2, Plus, Upload, Search, Loader2, Eye, Replace, Code, FileSpreadsheet, Archive } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminAssets() {
  const { data: products } = trpc.admin.products.list.useQuery();
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [replaceAssetId, setReplaceAssetId] = useState<number | null>(null);

  const { data: assets, refetch: refetchAssets } = trpc.admin.assets.list.useQuery(
    { productId: parseInt(selectedProductId) },
    { enabled: !!selectedProductId }
  );

  const deleteMutation = trpc.admin.assets.delete.useMutation({
    onSuccess: () => { toast.success("Asset deleted"); refetchAssets(); },
    onError: (err) => toast.error(err.message),
  });

  const createMutation = trpc.admin.assets.create.useMutation({
    onSuccess: () => { 
      toast.success(replaceAssetId ? "Asset replaced" : "Asset uploaded"); 
      refetchAssets(); 
      setIsUploadOpen(false); 
      setReplaceAssetId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProductId) return;
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      createMutation.mutate({
        productId: parseInt(selectedProductId),
        fileName: file.name,
        fileType: file.name.split(".").pop() || "pdf",
        fileSize: file.size,
        fileBase64: base64,
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePreview = async (asset: any) => {
    if (!asset.fileUrl) return;
    try {
      const resp = await fetch(asset.fileUrl);
      const html = await resp.text();
      setPreviewHtml(html);
    } catch {
      toast.error("Failed to load preview");
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === "html" || fileType === "htm") return <Code className="h-4 w-4 text-orange-600" />;
    if (fileType === "xlsx" || fileType === "xls" || fileType === "csv") return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
    if (fileType === "zip") return <Archive className="h-4 w-4 text-purple-600" />;
    return <FileText className="h-4 w-4 text-blue-600" />;
  };

  const getFileIconBg = (fileType: string) => {
    if (fileType === "html" || fileType === "htm") return "bg-orange-50";
    if (fileType === "xlsx" || fileType === "xls" || fileType === "csv") return "bg-green-50";
    if (fileType === "zip") return "bg-purple-50";
    return "bg-blue-50";
  };

  const filteredProducts = products?.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates & Assets</h1>
          <p className="text-muted-foreground mt-1">
            Manage downloadable tools and files attached to each product. Upload HTML tools, PDFs, spreadsheets, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product selector */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="border rounded-lg max-h-[500px] overflow-y-auto">
              {filteredProducts.map((p: any) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id.toString())}
                  className={`w-full text-left px-3 py-2.5 text-sm border-b last:border-b-0 transition-colors ${
                    selectedProductId === p.id.toString()
                      ? "bg-[#2C3E2D]/10 font-medium"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="mr-2">{p.icon || "📦"}</span>
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Assets panel */}
          <div className="md:col-span-2 space-y-4">
            {selectedProductId ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    Assets for: {products?.find((p: any) => p.id.toString() === selectedProductId)?.name}
                  </h2>
                  <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-[#2C3E2D] hover:bg-[#2C3E2D]/90">
                        <Plus className="h-4 w-4 mr-1" />
                        Upload File
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Asset</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                          Select a file to attach to this product. Supported formats: HTML (interactive tools), PDF, XLSX, ZIP, DOCX, CSV, TXT, PPTX.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-xs text-amber-800 font-medium">Tip: HTML files are served as interactive tools that customers can download and use in their browser.</p>
                        </div>
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          {createMutation.isPending ? (
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Uploading...</p>
                            </div>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center gap-2">
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <p className="text-sm font-medium">Click to select file</p>
                              <p className="text-xs text-muted-foreground">Max 10MB</p>
                              <input
                                type="file"
                                className="hidden"
                                accept=".html,.htm,.pdf,.xlsx,.xls,.zip,.docx,.doc,.pptx,.csv,.txt"
                                onChange={handleFileUpload}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {assets && assets.length > 0 ? (
                  <div className="space-y-2">
                    {assets.map((asset: any) => (
                      <Card key={asset.id}>
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-lg ${getFileIconBg(asset.fileType || "")} flex items-center justify-center`}>
                              {getFileIcon(asset.fileType || "")}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{asset.fileName || asset.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {asset.fileType?.toUpperCase()} • {asset.fileSize ? `${Math.round(asset.fileSize / 1024)} KB` : "Unknown size"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {asset.fileUrl && (asset.fileType === "html" || asset.fileType === "htm") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Preview tool"
                                onClick={() => handlePreview(asset)}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            {asset.fileUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Open in new tab"
                                onClick={() => window.open(asset.fileUrl, "_blank")}
                              >
                                <Upload className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Replace file"
                              onClick={() => {
                                setReplaceAssetId(asset.id);
                                deleteMutation.mutate({ id: asset.id });
                                setIsUploadOpen(true);
                              }}
                            >
                              <Replace className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              title="Delete asset"
                              onClick={() => {
                                if (confirm(`Delete "${asset.fileName || asset.name}"?`)) {
                                  deleteMutation.mutate({ id: asset.id });
                                }
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                 ) : (
                   <div className="text-center py-12 border rounded-lg bg-gray-50">
                     <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                     <p className="text-sm text-muted-foreground">No assets attached to this product.</p>
                     <p className="text-xs text-muted-foreground mt-1">Click "Upload File" to attach an HTML tool, PDF, or other file.</p>
                   </div>
                 )}
              </>
            ) : (
              <div className="text-center py-16 border rounded-lg bg-gray-50">
                <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">Select a product to manage its assets.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HTML Preview Modal */}
      {previewHtml && (
        <Dialog open={!!previewHtml} onOpenChange={() => setPreviewHtml(null)}>
          <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Tool Preview</DialogTitle>
            </DialogHeader>
            <div className="flex-1 min-h-0">
              <iframe
                srcDoc={previewHtml}
                className="w-full h-full border rounded-lg"
                sandbox="allow-scripts allow-forms"
                title="Tool Preview"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}
