import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Sparkles, Copy, RefreshCw, Hash, Instagram, Linkedin, Twitter } from "lucide-react";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "twitter", label: "X (Twitter)", icon: Twitter },
  { id: "facebook", label: "Facebook", icon: null },
  { id: "tiktok", label: "TikTok", icon: null },
] as const;

const TONES = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "witty", label: "Witty" },
  { id: "inspirational", label: "Inspirational" },
  { id: "educational", label: "Educational" },
  { id: "promotional", label: "Promotional" },
] as const;

const LENGTHS = [
  { id: "short", label: "Short" },
  { id: "medium", label: "Medium" },
  { id: "long", label: "Long" },
] as const;

export default function SocialMediaCaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "linkedin" | "twitter" | "facebook" | "tiktok">("instagram");
  const [tone, setTone] = useState<"professional" | "casual" | "witty" | "inspirational" | "educational" | "promotional">("casual");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [captionLength, setCaptionLength] = useState<"short" | "medium" | "long">("medium");
  const [captions, setCaptions] = useState<Array<{ caption: string; hashtags: string[] }>>([]);

  const generateMutation = trpc.ai.generateCaptions.useMutation({
    onSuccess: (data) => {
      setCaptions(data.captions);
    },
    onError: () => {
      toast.error("Generation failed. Please try again.");
    },
  });

  const handleGenerate = () => {
    if (!topic || topic.trim().length < 3) {
      toast.error("Please describe your post topic.");
      return;
    }
    generateMutation.mutate({ topic: topic.trim(), platform, tone, includeHashtags, includeEmojis, captionLength });
  };

  const copyCaption = (caption: string, hashtags: string[]) => {
    const text = includeHashtags && hashtags.length > 0
      ? `${caption}\n\n${hashtags.map((h) => `#${h}`).join(" ")}`
      : caption;
    navigator.clipboard.writeText(text);
    toast.success("Caption copied!");
  };

  const copyAll = () => {
    const text = captions.map((c, i) => {
      let t = `${i + 1}. ${c.caption}`;
      if (includeHashtags && c.hashtags.length > 0) t += `\n   ${c.hashtags.map((h) => `#${h}`).join(" ")}`;
      return t;
    }).join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("All captions copied!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="border-b border-border bg-gradient-to-b from-background to-card/30">
        <div className="container py-16 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Hash className="w-6 h-6 text-primary" />
            </div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">Free AI Tool</span>
          </div>
          <h1 className="mb-4 text-foreground text-3xl md:text-4xl font-bold">AI Social Media Caption Generator</h1>
          <p className="text-lg text-foreground/70 max-w-3xl">
            Generate engaging captions for any platform. Customize tone, length, hashtags, and emojis. Get 10 options in seconds.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Input */}
            <div className="lg:col-span-2">
              <div className="p-6 rounded-xl border border-border bg-card shadow-sm sticky top-8">
                <h2 className="text-lg font-semibold text-foreground mb-5">Configure</h2>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">What's your post about? *</label>
                    <Textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Launching our new eco-friendly packaging, behind-the-scenes at our studio..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Platform</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PLATFORMS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setPlatform(p.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                            platform === p.id ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground/70 hover:border-primary/30"
                          }`}
                        >
                          {p.icon && <p.icon className="w-4 h-4" />}
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Tone</label>
                    <div className="flex flex-wrap gap-2">
                      {TONES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTone(t.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            tone === t.id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground/70 hover:border-primary/40"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Length</label>
                    <div className="flex gap-2">
                      {LENGTHS.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => setCaptionLength(l.id)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                            captionLength === l.id ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground/70 hover:border-primary/30"
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={includeHashtags} onChange={(e) => setIncludeHashtags(e.target.checked)} className="rounded border-border accent-primary" />
                      <span className="text-sm text-foreground">Hashtags</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={includeEmojis} onChange={(e) => setIncludeEmojis(e.target.checked)} className="rounded border-border accent-primary" />
                      <span className="text-sm text-foreground">Emojis</span>
                    </label>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5"
                >
                  {generateMutation.isPending ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" /> Generate 10 Captions</>
                  )}
                </Button>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {captions.length > 0 && captions[0].caption !== "Unable to generate captions. Please try again." ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Your Captions</h3>
                    <Button variant="outline" size="sm" onClick={copyAll}>
                      <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy All
                    </Button>
                  </div>
                  {captions.map((c, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-foreground leading-relaxed">{c.caption}</p>
                          {includeHashtags && c.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {c.hashtags.map((h, j) => (
                                <span key={j} className="text-xs text-primary bg-primary/5 px-2 py-0.5 rounded-full">#{h}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => copyCaption(c.caption, c.hashtags)}
                          className="shrink-0 p-2 rounded-md hover:bg-primary/10 text-foreground/40 hover:text-primary transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={handleGenerate} disabled={generateMutation.isPending} className="w-full">
                    <RefreshCw className={`w-4 h-4 mr-2 ${generateMutation.isPending ? "animate-spin" : ""}`} /> Generate More
                  </Button>
                </div>
              ) : (
                <div className="p-16 rounded-xl border border-dashed border-border bg-card/50 text-center">
                  <Hash className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                  <p className="text-foreground/50 text-sm">Your captions will appear here</p>
                  <p className="text-foreground/30 text-xs mt-1">Choose your platform, set the tone, and generate</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-card/50 border-t border-border py-8">
        <div className="container text-center">
          <p className="text-foreground/50 text-sm">&copy; {new Date().getFullYear()} GAGE Strategies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

