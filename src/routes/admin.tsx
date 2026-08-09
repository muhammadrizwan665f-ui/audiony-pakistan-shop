import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Star,
  Store,
  Users,
} from "lucide-react";
import { AdminProvider, useAdmin } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AdminLogin from "@/components/admin/admin-login";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Audiony Gadgets" },
      { name: "description", content: "Manage products, orders, themes and store settings." },
      { property: "og:title", content: "Admin Panel — Audiony Gadgets" },
      { property: "og:description", content: "Audiony Gadgets store management dashboard." },
      { property: "og:url", content: "/admin" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminRoot,
});

const LINKS = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", Icon: Package },
  { to: "/admin/orders", label: "Orders", Icon: ShoppingBag },
  { to: "/admin/coupons", label: "Coupons", Icon: CreditCard },
  { to: "/admin/customers", label: "Customers", Icon: Users },
  { to: "/admin/blog", label: "Blog", Icon: BookOpen },
  { to: "/admin/reviews", label: "Reviews", Icon: Star },
  { to: "/admin/payments", label: "Payments", Icon: CreditCard },
  { to: "/admin/visitors", label: "Visitors", Icon: BarChart3 },
  { to: "/admin/settings", label: "Themes & Settings", Icon: Settings },
] as const;

function AdminRoot() {
  return (
    <AdminProvider>
      <AdminGate />
    </AdminProvider>
  );
}

function AdminGate() {
  const { session, isAdmin, checking, loadingData } = useAdmin();

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-2">
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </div>
    );
  }

  if (!session) return <AdminLogin />;

  if (!isAdmin) {
    if (loadingData) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-surface-2">
          <p className="text-sm text-muted-foreground">Loading your store…</p>
        </div>
      );
    }
    return <AdminLogin denied />;
  }

  return <AdminLayout />;
}

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { email, signOut } = useAdmin();

  return (
    <div className="flex min-h-screen w-full bg-surface-2">
      <aside className="hidden w-64 shrink-0 flex-col gap-1 bg-sidebar p-4 text-sidebar-foreground lg:flex">
        <Link to="/" className="mb-6 flex items-center gap-2 px-2">
          <span className="gradient-brand flex size-9 items-center justify-center rounded-xl text-brand-foreground">
            <Store className="size-4" />
          </span>
          <span className="font-display font-bold">AUDIONY ADMIN</span>
        </Link>
        {LINKS.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent",
              pathname === to && "bg-sidebar-accent text-sidebar-primary",
            )}
          >
            <Icon className="size-4" /> {label}
          </Link>
        ))}
        <div className="mt-auto space-y-1 border-t border-sidebar-border pt-3">
          <p className="truncate px-3 text-xs text-sidebar-foreground/70">{email}</p>
          <Link to="/" className="block rounded-xl px-3 py-2.5 text-sm hover:bg-sidebar-accent">
            ← View storefront
          </Link>
          <button
            onClick={() => void signOut()}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-sidebar-accent"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <nav className="flex items-center gap-1 overflow-x-auto border-b border-border bg-card p-2 lg:hidden">
          {LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium",
                pathname === to && "bg-secondary text-primary",
              )}
            >
              {label}
            </Link>
          ))}
          <Button size="sm" variant="ghost" className="ml-auto" onClick={() => void signOut()}>
            Sign out
          </Button>
        </nav>
        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
