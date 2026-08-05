import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Facebook,
  Headphones,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LIVE_SALES_FEED } from "@/lib/seed";
import { useStore } from "@/lib/store";

export function Footer() {
  const { settings } = useStore();
  const [email, setEmail] = useState("");

  return (
    <footer className="mt-24 border-t border-border bg-surface-2">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="premium-card gradient-brand mb-14 grid gap-6 p-8 text-brand-foreground md:grid-cols-2 md:items-center">
          <div>
            <h3 className="font-display text-2xl font-bold">Get flash deals before anyone else</h3>
            <p className="mt-2 text-sm opacity-90">
              Join 12,000+ customers getting Audiony drops, coupon codes and sale alerts.
            </p>
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
                toast.error("Please enter a valid email address");
                return;
              }
              toast.success("Subscribed! Check your inbox for your coupon.");
              setEmail("");
            }}
          >
            <Input
              type="email"
              required
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              className="border-transparent bg-background text-foreground"
            />
            <Button type="submit" variant="secondary">
              Subscribe
            </Button>
          </form>
        </div>

        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="gradient-brand flex size-10 items-center justify-center rounded-2xl text-brand-foreground">
                <Headphones className="size-5" />
              </span>
              <span className="font-display text-lg font-bold">AUDIONY GADGETS</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{settings.tagline}</p>
            <div className="mt-4 flex gap-2">
              {[
                { href: settings.socials.facebook, Icon: Facebook, label: "Facebook" },
                { href: settings.socials.instagram, Icon: Instagram, label: "Instagram" },
                { href: settings.socials.youtube, Icon: Youtube, label: "YouTube" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-9 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-secondary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Shop links">
            <h4 className="font-display text-sm font-bold uppercase tracking-widest">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {["Wireless Earbuds", "Bluetooth Headphones", "Solar Lights", "Mobile Cooling Fans"].map(
                (c) => (
                  <li key={c}>
                    <Link to="/shop" search={{ category: c }} className="hover:text-primary">
                      {c}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <nav aria-label="Company links">
            <h4 className="font-display text-sm font-bold uppercase tracking-widest">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-primary">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-primary" /> {settings.supportPhone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary" /> {settings.email}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" /> {settings.address}
              </li>
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-primary" /> Nationwide COD available
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" /> Secure checkout & warranty
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Audiony Gadgets. All rights reserved.</p>
          <p>EasyPaisa · JazzCash · Bank Transfer · Cash on Delivery</p>
        </div>
      </div>
    </footer>
  );
}

export function LiveSalesPopup() {
  const { settings } = useStore();
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!settings.liveSalesPopup) return;
    let i = Math.floor(Math.random() * LIVE_SALES_FEED.length);
    const show = () => {
      setMsg(LIVE_SALES_FEED[i % LIVE_SALES_FEED.length] ?? null);
      i += 1;
      setTimeout(() => setMsg(null), 5000);
    };
    const first = setTimeout(show, 6000);
    const id = setInterval(show, 16000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [settings.liveSalesPopup]);

  return (
    <AnimatePresence>
      {msg ? (
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="glass fixed bottom-6 left-5 z-40 hidden max-w-xs rounded-2xl p-3 shadow-premium sm:block"
        >
          <p className="text-sm font-semibold">{msg}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {2 + Math.floor(Math.random() * 12)} minutes ago · Verified order
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
