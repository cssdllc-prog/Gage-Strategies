import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Upload, Download, Sparkles, Building2 } from "lucide-react";

interface WhiteLabelPanelProps {
  productId: number;
  productName: string;
}

export default function WhiteLabelPanel({ productId, productName }: WhiteLabelPanelProps) {
  const [companyName, setCompanyName] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [rebrandedUrl, setRebrandedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rebrandMutation = trpc.templates.rebrand.useMutation({
    onSuccess: (data) => {
      setRebrandedUrl(data.url);
      toast.success("Your white-labeled document is ready for download!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to generate white-labeled document");
    },
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, SVG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo must be under 5MB");
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Base64 for API
    const base64Reader = new FileReader();
    base64Reader.onload = () => {
      const result = base64Reader.result as string;
      // Remove data URL prefix to get pure base64
      const base64 = result.split(",")[1];
      setLogoBase64(base64);
    };
    base64Reader.readAsDataURL(file);
  };

  const handleRebrand = () => {
    if (!companyName.trim()) {
      toast.error("Please enter your company name");
      return;
    }
    if (!logoBase64) {
      toast.error("Please upload your company logo");
      return;
    }

    rebrandMutation.mutate({
      productId,
      companyName: companyName.trim(),
      logoBase64,
    });
  };

  return (
    <div className="rounded-xl border-2 border-accent/30 bg-accent/5 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">White-Label This Solution</h3>
          <p className="text-sm text-foreground/60">Add your logo and company name to make it yours</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Company Name */}
        <div>
          <Label htmlFor="company-name" className="text-sm font-medium text-foreground/80">
            <Building2 className="w-4 h-4 inline mr-1" />
            Company Name
          </Label>
          <Input
            id="company-name"
            placeholder="Your Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <Label className="text-sm font-medium text-foreground/80">
            <Upload className="w-4 h-4 inline mr-1" />
            Company Logo
          </Label>
          <div className="mt-1">
            {logoPreview ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg border border-border bg-white flex items-center justify-center overflow-hidden">
                  <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Logo
                </Button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
              >
                <Upload className="w-6 h-6 mx-auto mb-2 text-foreground/40" />
                <p className="text-sm text-foreground/60">Click to upload your logo</p>
                <p className="text-xs text-foreground/40 mt-1">PNG, JPG, or SVG — max 5MB</p>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleRebrand}
          disabled={!companyName || !logoBase64 || rebrandMutation.isPending}
          className="w-full bg-accent hover:bg-accent/90 text-foreground font-semibold"
        >
          {rebrandMutation.isPending ? (
            <>Generating Your Branded Document...</>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate White-Labeled {productName}
            </>
          )}
        </Button>

        {/* Download Result */}
        {rebrandedUrl && (
          <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm font-medium text-green-800 mb-2">Your branded document is ready!</p>
            <Button
              asChild
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <a href={rebrandedUrl} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Download "{companyName} - {productName}"
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
