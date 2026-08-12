import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, X, Building2, Plus } from "lucide-react";
import { useOrg } from "@/contexts/OrgContext";

const LOGO_URL = "/logo.png";

export default function Navigation() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { organizations, activeOrg, setActiveOrg } = useOrg();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on navigation
  const navTo = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    setExploreOpen(false);
  };

  const exploreItems = [
    { label: "Workflow Systems", path: "/workflow-systems", desc: "Fully managed automation, built and run for you" },
    { label: "Solutions Hub", path: "/solutions", desc: "Browse all tools & templates" },
    { label: "Bundles", path: "/bundles", desc: "Save with curated packages" },
    { label: "Compare Plans", path: "/compare", desc: "Free vs paid side-by-side" },
    { label: "Free AI Tools", path: "/free-tools", desc: "AI-powered generators & writers" },
    { label: "Free Calculators", path: "/tools/roi-calculator", desc: "ROI & profit margin tools" },
  ];

  const topLinks = [
    { label: "How It Works", path: "/how-it-works" },
    { label: "Blog", path: "/blog" },
    { label: "Resources", path: "/resources" },
    { label: "About", path: "/about" },
  ];

  const isExplorePath = exploreItems.some(item => location === item.path);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <button
          onClick={() => navTo("/")}
          className="flex items-center hover:opacity-80 transition-opacity shrink-0"
        >
          <img
            src={LOGO_URL}
            alt="GAGE Strategies"
            className="h-10 w-auto"
          />
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Explore Dropdown */}
          <div className="relative" ref={exploreRef}>
            <button
              onClick={() => setExploreOpen(!exploreOpen)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                isExplorePath ? "text-primary" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Explore
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${exploreOpen ? 'rotate-180' : ''}`} />
            </button>
            {exploreOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-background border border-border rounded-xl shadow-xl py-2 z-50 animate-fade-in" style={{ animationDuration: '150ms' }}>
                {exploreItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navTo(item.path)}
                    className={`w-full text-left px-4 py-2.5 hover:bg-muted transition-colors ${
                      location === item.path ? "bg-muted" : ""
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <span className="block text-xs text-foreground/50 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Top-level links */}
          {topLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navTo(link.path)}
              className={`text-sm font-medium transition-colors ${
                location === link.path
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* Primary CTA */}
          <button
            onClick={() => navTo("/solution-finder")}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors text-sm"
          >
            Get Started
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold hover:bg-primary/20 transition-colors"
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-56 bg-background border border-border rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                    <p className="text-xs text-foreground/50 truncate">{user?.email}</p>
                  </div>
                  {/* Org Switcher */}
                  {organizations.length > 0 && (
                    <div className="border-b border-border py-1">
                      <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/40">Organizations</p>
                      {organizations.map((org) => (
                        <button
                          key={org.id}
                          onClick={() => { setActiveOrg(org); setUserMenuOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                            activeOrg?.id === org.id ? "bg-primary/5 text-primary" : "text-foreground/80 hover:bg-muted"
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{org.name}</span>
                          {activeOrg?.id === org.id && <span className="ml-auto text-[10px] text-primary font-medium">Active</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => { navTo("/my-purchases"); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-foreground/80 hover:bg-muted transition-colors"
                  >
                    My Purchases
                  </button>
                  <button
                    onClick={() => { navTo("/organizations"); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-foreground/80 hover:bg-muted transition-colors"
                  >
                    Organizations
                  </button>
                  <button
                    onClick={() => { navTo("/company-profile"); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-foreground/80 hover:bg-muted transition-colors"
                  >
                    Company Profile
                  </button>
                  {user?.role === "admin" && (
                    <button
                      onClick={() => { navTo("/admin"); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-foreground/80 hover:bg-muted transition-colors"
                    >
                      Admin Panel
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <a
              href={getLoginUrl()}
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              Sign In
            </a>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in" style={{ animationDuration: '150ms' }}>
          <div className="container py-4 flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40 px-3 py-2">Explore</p>
            {exploreItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navTo(item.path)}
                className={`text-left text-sm py-2.5 px-3 rounded-lg transition-colors ${
                  location === item.path
                    ? "text-primary font-medium bg-primary/5"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-border my-2" />
            {topLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navTo(link.path)}
                className={`text-left text-sm py-2.5 px-3 rounded-lg transition-colors ${
                  location === link.path
                    ? "text-primary font-medium bg-primary/5"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </button>
            ))}
            {isAuthenticated && (
              <>
                <div className="border-t border-border my-2" />
                {organizations.length > 0 && (
                  <>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground/40 px-3 py-1">Organizations</p>
                    {organizations.map((org) => (
                      <button
                        key={org.id}
                        onClick={() => { setActiveOrg(org); setMobileOpen(false); }}
                        className={`text-left text-sm py-2 px-3 rounded-lg flex items-center gap-2 transition-colors ${
                          activeOrg?.id === org.id ? "text-primary font-medium bg-primary/5" : "text-foreground/70 hover:bg-muted"
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        {org.name}
                      </button>
                    ))}
                    <div className="border-t border-border my-2" />
                  </>
                )}
                <button
                  onClick={() => navTo("/my-purchases")}
                  className="text-left text-sm py-2.5 px-3 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                >
                  My Purchases
                </button>
                <button
                  onClick={() => navTo("/organizations")}
                  className="text-left text-sm py-2.5 px-3 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                >
                  Organizations
                </button>
              </>
            )}
            <div className="border-t border-border my-2" />
            <button
              onClick={() => navTo("/solution-finder")}
              className="mt-1 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors text-sm text-center"
            >
              Get Started
            </button>
            {!isAuthenticated && (
              <a
                href={getLoginUrl()}
                className="mt-1 px-4 py-2.5 rounded-lg border border-border text-foreground/70 font-medium transition-colors text-sm text-center hover:bg-muted"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
