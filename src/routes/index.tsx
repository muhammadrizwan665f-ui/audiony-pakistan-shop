import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Flame,
  Headphones,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Wallet,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/site/countdown";
import { ProductCard } from "@/components/site/product-card";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { CATEGORIES } from "@/lib/seed";
import { formatPKR, unitPrice } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Audiony Gadgets — Premium Earbuds, Headphones & Gadgets in Pakistan" },
      {
        name: "description",
        content:
          "Shop premium wireless earbuds, bluetooth headphones, solar lights and CX20 mobile cooling fans in Pakistan. Cash on delivery + 30% off on advance payment.",
      },
      { property: "og:title", content: "Audiony Gadgets — Premium Gadgets in Pakistan" },
      {
        property: "og:description",
        content: "Flash sales, bulk discounts and nationwide cash on delivery across Pakistan.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const TRUST = [
  { Icon: Truck, title: "Fast Delivery", text: "1-3 days nationwide" },
  { Icon: Wallet, title: "Cash on Delivery", text: "Pay only delivery in advance" },
  { Icon: ShieldCheck, title: "Warranty Included", text: "Up to 12 months" },
  { Icon: RotateCcw, title: "Easy Returns", text: "7-day replacement" },
];

function Particles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute size-1.5 rounded-full bg-primary/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0], y: [-10, -120], x: [0, (i % 5) * 12 - 24] }}
          transition={{ duration: 7 + (i % 5), repeat: Infinity, delay: i * 0.45 }}
          style={{ left: `${(i * 5.4) % 100}%`, top: `${60 + (i % 4) * 8}%` }}
        />
      ))}
    </div>
  );
}

function Home() {
  const { products, settings, hydrated } = useStore();
  const active = products.filter((p) => p.active);
  const flash = active.filter((p) => p.flashSale);
  const best = [...active].sort((a, b) => b.sold - a.sold).slice(0, 4);
  const trending = [...active].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const featured = flash[0] ?? active[0];

  return (
    <>
      {/* HERO */}
      <section className="gradient-hero relative overflow-hidden">
        <Particles />
        <div
          aria-hidden
          className="float-slow gradient-brand absolute -right-24 -top-24 size-96 rounded-full opacity-20 blur-3xl"
        />
        <div
          aria-hidden
          className="float-slow gradient-brand absolute -bottom-32 left-1/4 size-80 rounded-full opacity-15 blur-3xl"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 pt-14 lg:grid-cols-2 lg:pb-28 lg:pt-20">
          <div className="relative z-10">
            {settings.independenceBanner ? (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]"
              >
                <Sparkles className="size-4 text-primary" /> 14 August Azadi Sale
              </motion.div>
            ) : null}

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl"
            >
              Premium Gadgets
              <span className="text-gradient block">Unbeatable Pakistani Prices</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg"
            >
              Discover premium earbuds, headphones, solar lights, and CX20 cooling fans with official
              warranty, fast nationwide delivery, Cash on Delivery, and exclusive advance payment discounts.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button size="lg" className="h-13 px-7 text-base" asChild>
                <Link to="/shop">
                  🛒 Shop Now <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="h-13 px-7 text-base" asChild>
                <Link to="/deals">
                  <Flame className="mr-1 size-4" /> ⚡ View Flash Deals
                </Link>
              </Button>
            </motion.div>

            <div className="mt-9 flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-warning text-warning" />
                  ))}
                </div>
                <span className="font-semibold">4.8/5</span>
                <span className="text-muted-foreground">· 3,400+ reviews</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BadgeCheck className="size-4 text-primary" /> 12,000+ orders delivered
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[2rem] border border-border shadow-premium">
              <img
                src={hero}
                alt="Man wearing Audiony wireless earbuds"
                width={1920}
                height={1088}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            {featured ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass absolute -bottom-6 left-4 right-4 rounded-2xl p-4 shadow-premium sm:left-8 sm:right-auto sm:w-80"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Deal of the day
                </p>
                <p className="mt-1 font-display font-semibold">{featured.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-display text-lg font-bold">
                    {formatPKR(unitPrice(featured))}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPKR(featured.price)}
                  </span>
                </div>
                {hydrated ? (
                  <Countdown target={featured.flashEndsAt} compact className="mt-1 text-primary" />
                ) : null}
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </section>



      {/* PRODUCT TICKER */}
      <section className="overflow-hidden border-y border-border bg-surface-2 py-10">
        <div className="flex whitespace-nowrap">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-6 px-3"
          >
            {[...active, ...active, ...active].map((p, i) => (
              <Link
                key={`${p.id}-${i}`}
                to="/product/$slug"
                params={{ slug: p.slug }}
                className="group flex w-[180px] shrink-0 items-center gap-3 rounded-full border border-border bg-background px-4 py-2 shadow-sm transition-all hover:border-primary hover:shadow-md"

              >
                <img
                  src={p.images[0] ?? "/placeholder.svg"}
                  alt={p.name}
                  className="size-11 flex-shrink-0 rounded-full object-cover outline outline-2 outline-offset-2 outline-transparent transition-all group-hover:outline-primary"
                />
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs font-bold leading-tight">{p.name}</span>
                  <span className="text-[11px] font-bold text-primary">
                    {formatPKR(unitPrice(p))}
                  </span>
                </div>


              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FLASH DEALS */}
      {flash.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1 text-xs font-bold uppercase tracking-widest text-destructive-foreground">
                <Zap className="size-3.5" /> Flash Sale
              </span>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Limited time offers</h2>
            </div>
            <Button variant="secondary" asChild>
              <Link to="/deals">View all deals</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {flash.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      ) : null}

      {/* BEST SELLERS */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <SectionHeading
          eyebrow="Best Selling"
          title="Pakistan's favourites this month"
          subtitle="Ranked by real orders delivered across the country."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {best.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto max-w-7xl px-4 pt-24">
        <SectionHeading eyebrow="Trending" title="Highest rated right now" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* ALL PRODUCTS (if needed more volume) */}
      <section className="mx-auto max-w-7xl px-4 pt-24">
        <SectionHeading
          eyebrow="Our Catalog"
          title="All Premium Gadgets"
          subtitle="Quality tested and ready for nationwide delivery."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {active.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <SectionHeading
          eyebrow="Categories"
          title="Shop by category"
          subtitle="Four categories, zero filler — only gadgets we use ourselves."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06}>
              <Link
                to="/shop"
                search={{ category: c.name }}
                className="premium-card group flex h-full flex-col justify-between gap-6 p-6"
              >
                <span className="gradient-brand flex size-12 items-center justify-center rounded-2xl text-brand-foreground">
                  <Headphones className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mt-24 border-y border-border bg-surface-2 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Reviews"
            title="12,000+ happy customers"
            subtitle="Verified reviews from real delivered orders."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {active
              .flatMap((p) => p.reviews.map((r) => ({ ...r, product: p.name })))
              .slice(0, 3)
              .map((r, i) => (
                <Reveal key={r.id} delay={i * 0.08}>
                  <figure className="premium-card h-full p-6">
                    <div className="flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, k) => (
                        <Star key={k} className="size-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <blockquote className="mt-3">
                      <p className="font-display font-semibold">{r.title}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
                    </blockquote>
                    <figcaption className="mt-4 text-sm">
                      <span className="font-semibold">{r.name}</span>
                      <span className="text-muted-foreground"> · {r.city}</span>
                      <span className="mt-1 block text-xs text-primary">
                        Verified purchase · {r.product}
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to upgrade your setup?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Order now and pay cash on delivery, or save 30% by paying in advance with EasyPaisa,
            JazzCash or bank transfer.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/shop">Browse all products</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">Talk to us</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
