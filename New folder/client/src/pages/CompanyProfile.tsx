import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Building2, Upload, Palette, Globe, Mail, Phone, MapPin, Sparkles } from "lucide-react";

export default function CompanyProfile() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = trpc.companyProfile.get.useQuery(undefined, {
    enabled: !!user,
  });
  const updateMutation = trpc.companyProfile.update.useMutation();
  const uploadLogoMutation = trpc.companyProfile.uploadLogo.useMutation();
  const utils = trpc.useUtils();

  const [form, setForm] = useState({
    companyName: "",
    tagline: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    primaryColor: "#1a56db",
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        companyName: profile.companyName || "",
        tagline: profile.tagline || "",
        website: profile.website || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        primaryColor: profile.primaryColor || "#1a56db",
      });
      if (profile.logoUrl) setLogoPreview(profile.logoUrl);
    }
  }, [profile]);

  if (profileLoading && user) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-12 text-center">
        <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Company Profile</h1>
        <p className="text-muted-foreground mb-6">Sign in to set up your company branding.</p>
        <Button asChild>
          <a href={getLoginUrl()}>Sign In</a>
        </Button>
      </div>
    );
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      setLogoPreview(reader.result as string);
      try {
        const result = await uploadLogoMutation.mutateAsync({
          base64,
          filename: file.name,
          contentType: file.type,
        });
        toast.success("Logo uploaded successfully");
        utils.companyProfile.get.invalidate();
      } catch {
        toast.error("Failed to upload logo");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(form);
      toast.success("Company profile saved! Your branding will be applied to all future downloads.");
      utils.companyProfile.get.invalidate();
    } catch {
      toast.error("Failed to save profile");
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            Company Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Save your company branding here. When you purchase products, your logo and info will automatically replace the default GAGE branding in all downloadable files.
          </p>
        </div>

        <div className="space-y-6">
          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Company Logo
              </CardTitle>
              <CardDescription>Upload your logo (PNG, JPG, SVG — max 2MB)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center overflow-hidden bg-muted">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Building2 className="w-10 h-10 text-muted-foreground/50" />
                  )}
                </div>
                <div>
                  <label className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        {logoPreview ? "Change Logo" : "Upload Logo"}
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </label>
                  {uploadLogoMutation.isPending && (
                    <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Company Details
              </CardTitle>
              <CardDescription>This information will appear on your branded downloads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Your Company Name"
                  value={form.companyName}
                  onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline / Slogan</Label>
                <Input
                  id="tagline"
                  placeholder="Your company tagline"
                  value={form.tagline}
                  onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> Website
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://yourcompany.com"
                    value={form.website}
                    onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="hello@yourcompany.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Phone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor" className="flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5" /> Brand Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      className="w-12 h-10 p-1 cursor-pointer"
                      value={form.primaryColor}
                      onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                    />
                    <Input
                      value={form.primaryColor}
                      onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                      placeholder="#1a56db"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="123 Main St, City, State ZIP"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Company Profile"}
            </Button>
          </div>

          {/* Live Branding Preview */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                Live Preview — How Your Branding Will Look
              </CardTitle>
              <CardDescription>This is a preview of how your company info will appear on downloaded tools</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div
                className="p-6 border-b"
                style={{ background: `linear-gradient(135deg, ${form.primaryColor}15, ${form.primaryColor}05)` }}
              >
                {/* Simulated tool header */}
                <div className="rounded-lg border border-border bg-background shadow-sm overflow-hidden">
                  <div
                    className="flex items-center gap-4 p-4 border-b"
                    style={{ borderBottomColor: `${form.primaryColor}30` }}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="h-10 w-auto max-w-[120px] object-contain" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">
                        {form.companyName || "Your Company Name"}
                      </p>
                      <p className="text-xs text-foreground/60">
                        {form.tagline || "Your tagline will appear here"}
                      </p>
                    </div>
                    <div className="ml-auto text-right text-xs text-foreground/50">
                      <p>{form.email || "email@company.com"}</p>
                      <p>{form.website || "yourwebsite.com"}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-muted/20">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-20 rounded bg-muted/50 border border-border/50 flex items-center justify-center text-xs text-muted-foreground">Tool Content</div>
                      <div className="h-20 rounded bg-muted/50 border border-border/50 flex items-center justify-center text-xs text-muted-foreground">Dashboard</div>
                      <div className="h-20 rounded bg-muted/50 border border-border/50 flex items-center justify-center text-xs text-muted-foreground">Charts</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 border-t text-xs text-foreground/50">
                    <span>© {new Date().getFullYear()} {form.companyName || "Your Company"}</span>
                    <span>{form.phone || "(555) 123-4567"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Box */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-primary mb-2">How it works</h3>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• Save your company info above</li>
                <li>• Purchase any product from the Solutions Hub</li>
                <li>• When you download, GAGE branding is automatically replaced with yours</li>
                <li>• Your logo, company name, and contact info appear on all tools</li>
                <li>• Update your profile anytime — future downloads will use the latest info</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
