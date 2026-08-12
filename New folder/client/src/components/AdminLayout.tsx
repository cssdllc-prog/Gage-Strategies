import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import {
  LayoutDashboard,
  Package,
  Users,
  Activity,
  FolderOpen,
  FileText,
  LogOut,
  ArrowLeft,
  Menu,
  CreditCard,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";

const LOGO_URL = "/manus-storage/gage-strategies-logo_2e5a1b6c.png";

const adminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: FolderOpen, label: "Categories", path: "/admin/categories" },
  { icon: FileText, label: "Templates", path: "/admin/assets" },
  { icon: BookOpen, label: "Blog", path: "/admin/blog" },
  { icon: Users, label: "Leads", path: "/admin/leads" },
  { icon: Activity, label: "Activity", path: "/admin/activity" },
  { icon: CreditCard, label: "Purchases", path: "/admin/purchases" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { loading, user, logout } = useAuth();
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Admin Access Required
          </h1>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Sign in with an admin account to access the management panel.
          </p>
          <Button
            onClick={() => { window.location.href = getLoginUrl(); }}
            size="lg"
            className="w-full"
          >
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-6 p-8 max-w-md w-full">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-2xl">🚫</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Access Denied
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            You don't have admin privileges. Contact the site owner for access.
          </p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isMobile ? (mobileMenuOpen ? "fixed inset-0 z-50 bg-white" : "hidden") : "sticky top-0 h-screen"} w-64 border-r bg-white flex flex-col`}>
        <div className="p-4 border-b flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <img src={LOGO_URL} alt="GAGE" className="h-8" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Admin</span>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
              ✕
            </Button>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {adminMenuItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/admin" && location.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#2C3E2D] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors mt-1">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="text-xs font-medium">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate">{user?.name || "Admin"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {isMobile && (
          <header className="sticky top-0 z-40 bg-white border-b px-4 h-14 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-medium text-sm">Admin Panel</span>
          </header>
        )}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
