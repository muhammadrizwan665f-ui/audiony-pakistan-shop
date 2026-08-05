import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronUp,
  Headphones,
  Menu,
  Search,
  ShoppingCart,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Countdown } from "@/components/site/countdown";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/deals", label: "Flash Deals" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { cart, settings } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = cart.reduce((a, l) => a + l.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="gradient-brand relative overflow-hidden text-brand-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center text-xs font-semibold sm:text-sm">
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-4" /> {settings.saleBannerText}
          </span>
          <Countdown target={settings.saleEndsAt} compact className="tracking-wide" />
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled ? "glass shadow-soft" : "bg-background/70 backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Load the security issues from the scan results and fix the selected issues.">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="mt-8 flex flex-col gap-1">
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-base font-medium hover:bg-secondary"
                  >
                    {n.label}
                  </Link>
                ))}
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium hover:bg-secondary"
                >
                  Admin Panel
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2">
            <span className="gradient-brand flex size-10 items-center justify-center rounded-2xl text-brand-foreground shadow-soft">
              <Headphones className="size-5" />
            </span>
            <span className="font-display text-lg font-bold leading-none tracking-tight">
              AUDIONY
              <span className="block text-[10px] font-semibold tracking-[0.28em] text-muted-foreground">
                GADGETS
              </span>
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                  pathname === n.to && "bg-secondary text-primary",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <form
            className="ml-auto hidden max-w-xs flex-1 items-center gap-2 md:flex"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/shop?q=${encodeURIComponent(q)}`;
            }}
          >
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search earbuds, fans..."
                className="rounded-full pl-9"
                aria-label="Search products"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Button variant="ghost" size="icon" asChild aria-label="Search">
              <Link to="/shop" className="md:hidden">
                <Search />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild aria-label="Cart">
              <Link to="/cart">
                <ShoppingCart />
                <AnimatePresence>
                  {count > 0 ? (
                    <motion.span
                      key={count}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="gradient-brand absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-brand-foreground"
                    >
                      {count}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </Link>
            </Button>
            <Button className="hidden sm:inline-flex" asChild>
              <Link to="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="glass fixed bottom-24 right-5 z-40 flex size-11 items-center justify-center rounded-full shadow-premium"
        >
          <ChevronUp className="size-5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

export function WhatsAppButton() {
  const { settings } = useStore();
  return (
    <a
      href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Assalam o Alaikum! I want to order from Audiony Gadgets.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed bottom-6 right-5 z-40 flex items-center gap-2 rounded-full bg-success px-4 py-3 font-semibold text-background shadow-premium transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.12-.41-2.13-1.31-.79-.7-1.32-1.57-1.47-1.87-.15-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.62-1.51-.85-2.06-.22-.54-.45-.47-.62-.48h-.53c-.18 0-.47.07-.72.34-.25.27-.94.92-.94 2.25 0 1.32.96 2.6 1.09 2.78.13.17 1.85 2.96 4.5 4.03 2.65 1.07 2.65.71 3.13.67.47-.05 1.53-.62 1.75-1.23.22-.6.22-1.12.15-1.23-.07-.1-.27-.17-.57-.32zM12 2a10 10 0 0 0-8.6 15.1L2 22l5.05-1.32A10 10 0 1 0 12 2z" />
      </svg>
      <span className="hidden sm:inline">WhatsApp Order</span>
    </a>
  );
}
