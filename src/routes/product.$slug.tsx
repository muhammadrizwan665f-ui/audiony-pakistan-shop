import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import {
  BadgeCheck,
  Check,
  Heart,
  RotateCcw,
  Share2,
  ShieldCheck,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Countdown } from "@/components/site/countdown";
import { ProductCard } from "@/components/site/product-card";
import { Reveal } from "@/components/site/reveal";
import { bulkDiscountFor, discountPct, formatPKR, lineTotal, unitPrice } from "@/lib/pricing";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Audiony Gadgets` },
      {
        name: "description",
        content:
          "Premium Audiony gadget with warranty, flash sale pricing, bulk discounts and cash on delivery across Pakistan.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: `/product/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/product/${params.slug}` }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { products, payments, addToCart, wishlist, toggleWishlist, settings } = useStore();
  const product = products.find((p) => p.slug === slug);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors?.[0]?.name,
  );

  if (!product) throw notFound();

  const t = lineTotal(product, qty);
  const off = discountPct(product);
  const related = products.filter((p) => p.id !== product.id && p.active).slice(0, 4);
  const wished = wishlist.includes(product.id);
  const bestPay = payments.filter((p) => p.enabled).sort((a, b) => b.discountPct - a.discountPct)[0];

  function pickColor(name: string) {
    setSelectedColor(name);
    setImg(0);
  }

  const activeColor = product.colors.find((c) => c.name === selectedColor);
  const galleryImages =
    activeColor?.images && activeColor.images.length > 0 ? activeColor.images : product.images;

  const waText = encodeURIComponent(
    `Assalam o Alaikum! I want to order: ${product.name}${selectedColor ? ` (Color: ${selectedColor})` : ""} (Qty ${qty}) — ${formatPKR(t.total)}`,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/shop" className="hover:text-primary">
          Shop
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <motion.div
            key={img}
            initial={{ opacity: 0.4, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card group overflow-hidden p-0"
          >
            <img
              src={galleryImages[img]}
              alt={product.name}
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-125"
            />
          </motion.div>
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
            {galleryImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setImg(i)}
                aria-label={`View image ${i + 1}`}
                className={`size-20 shrink-0 overflow-hidden rounded-2xl border-2 sm:shrink ${i === img ? "border-primary" : "border-border"}`}
              >
                <img src={src} alt="" loading="lazy" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
            {product.badges.map((b) => (
              <span
                key={b}
                className="shrink-0 gradient-brand rounded-full px-3 py-1 text-xs font-bold text-brand-foreground sm:shrink"
              >
                {b}
              </span>
            ))}
          </div>

          {product.colors.length > 0 ? (
            <div className="mt-4">
              <div className="mb-2.5 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Colour: <span className="text-foreground">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={() => pickColor(c.name)}
                    className={`flex size-12 items-center justify-center rounded-full border-2 transition-transform active:scale-95 ${
                      selectedColor === c.name
                        ? "border-primary scale-110"
                        : "border-border hover:scale-105"
                    }`}
                  >
                    <span
                      className="size-9 rounded-full border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-muted-foreground">{product.tagline}</p>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${i < Math.round(product.rating) ? "fill-warning text-warning" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="font-semibold">{product.rating}</span>
            <span className="text-muted-foreground">· {product.sold.toLocaleString()} sold</span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-4xl font-bold text-primary">
              {formatPKR(unitPrice(product))}
            </span>
            {product.salePrice ? (
              <div className="flex items-center gap-2">
                <span className="text-lg text-muted-foreground line-through">
                  {formatPKR(product.price)}
                </span>
                <span className="rounded-full bg-destructive px-2.5 py-1 text-[10px] font-bold text-destructive-foreground uppercase tracking-tight">
                  Save {off}%
                </span>
              </div>
            ) : null}
          </div>

          {product.flashSale && product.flashEndsAt ? (
            <div className="mt-5 rounded-2xl border border-destructive/40 bg-destructive/10 p-4">
              <p className="flex items-center gap-1.5 text-sm font-bold text-destructive">
                <Zap className="size-4" /> Flash sale ends in
              </p>
              <div className="mt-2">
                <Countdown target={product.flashEndsAt} />
              </div>
            </div>
          ) : null}

          <p className="mt-4 text-sm">
            <span className="font-semibold text-destructive">Only {product.stock} left</span> · live
            stock counter
          </p>

          {/* Bulk discount box */}
          <div className="premium-card mt-6 p-5">
            <h2 className="font-display font-bold">Buy more, save more</h2>
            <div className="mt-3 flex flex-col gap-2 sm:grid sm:grid-cols-3">
              {product.bulkRules.map((r) => {
                const activeRule = bulkDiscountFor(product.bulkRules, qty)?.minQty === r.minQty;
                return (
                  <button
                    key={r.minQty}
                    onClick={() => setQty(r.minQty)}
                    className={`min-h-[60px] rounded-2xl border p-3 text-left transition-colors ${activeRule ? "border-primary bg-secondary" : "border-border"}`}
                  >
                    <p className="font-display font-bold">Buy {r.minQty}</p>
                    <p className="text-xs text-success">{r.discountPct}% off</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment discount box */}
          <div className="premium-card mt-4 p-5">
            <h2 className="font-display font-bold">Payment discounts</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {payments
                .filter((p) => p.enabled)
                .map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3">
                    <span>
                      {p.label}{" "}
                      <span className="text-xs text-muted-foreground">— {p.note}</span>
                    </span>
                    <span className="font-semibold text-success">{p.discountPct}% off</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-border p-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </Button>
              <span className="w-8 text-center font-semibold tabular-nums">{qty}</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </Button>
            </div>
            <p className="text-sm">
              Total:{" "}
              <span className="font-display text-lg font-bold">{formatPKR(t.total)}</span>
              {t.bulk > 0 ? (
                <span className="ml-1 text-xs font-semibold text-success">
                  (saved {formatPKR(t.bulk)})
                </span>
              ) : null}
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:grid sm:grid-cols-2">
            <Button
              size="lg"
              className="h-12 w-full text-base sm:h-11 sm:text-sm"
              onClick={() => {
                addToCart(product.id, qty, selectedColor);
                toast.success("Added to cart", { description: product.name });
              }}
            >
              Add to Cart
            </Button>
            <Button size="lg" variant="secondary" className="h-12 w-full text-base sm:h-11 sm:text-sm" asChild>
              <Link to="/checkout" onClick={() => addToCart(product.id, qty, selectedColor)}>
                Buy Now
              </Link>
            </Button>
            <a
              href={`https://wa.me/${settings.whatsapp}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-success px-4 py-3 font-semibold text-background transition-transform hover:scale-[1.02] sm:col-span-2 sm:h-11"
            >
              Order on WhatsApp
            </a>
          </div>

          <div className="mt-5 flex gap-3">
            <Button variant="ghost" onClick={() => toggleWishlist(product.id)}>
              <Heart className={`mr-1.5 size-4 ${wished ? "fill-destructive text-destructive" : ""}`} />
              {wished ? "In wishlist" : "Add to wishlist"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                void navigator.clipboard?.writeText(window.location.href);
                toast.success("Link copied");
              }}
            >
              <Share2 className="mr-1.5 size-4" /> Share
            </Button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { Icon: Truck, t: "1-3 day delivery" },
              { Icon: ShieldCheck, t: product.warranty },
              { Icon: RotateCcw, t: "7-day replacement" },
            ].map(({ Icon, t: text }) => (
              <div
                key={text}
                className="flex items-center gap-2 rounded-2xl border border-border bg-surface-2 p-3 text-xs"
              >
                <Icon className="size-4 shrink-0 text-primary" /> {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <Tabs defaultValue="features" className="mt-16">
        <TabsList className="no-scrollbar flex w-full justify-start overflow-x-auto pb-1 sm:justify-center">
          <TabsTrigger value="features" className="shrink-0">Features</TabsTrigger>
          <TabsTrigger value="specs" className="shrink-0">Specifications</TabsTrigger>
          <TabsTrigger value="included" className="shrink-0">What's Included</TabsTrigger>
          <TabsTrigger value="reviews" className="shrink-0">Reviews ({product.reviews.length})</TabsTrigger>
          <TabsTrigger value="faq" className="shrink-0">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="premium-card mt-5 p-6">
          <p className="text-muted-foreground">{product.description}</p>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="specs" className="premium-card mt-5 p-6">
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {product.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-4 border-b border-border pb-2 text-sm">
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd className="font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>

        <TabsContent value="included" className="premium-card mt-5 p-6">
          <ul className="space-y-2.5">
            {product.included.map((i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <BadgeCheck className="size-4 text-primary" /> {i}
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="reviews" className="mt-5 space-y-4">
          {product.reviews.length === 0 ? (
            <p className="premium-card p-6 text-muted-foreground">
              No reviews yet — be the first to review this product.
            </p>
          ) : (
            product.reviews.map((r) => (
              <div key={r.id} className="premium-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display font-semibold">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.name} · {r.city} · {r.date}
                      {r.verified ? (
                        <span className="ml-1 font-semibold text-primary">Verified purchase</span>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-warning text-warning" />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{r.body}</p>
                {r.adminReply ? (
                  <p className="mt-3 rounded-2xl bg-secondary p-3 text-sm">
                    <span className="font-semibold">Audiony Gadgets:</span> {r.adminReply}
                  </p>
                ) : null}
                <p className="mt-3 text-xs text-muted-foreground">{r.helpful} people found this helpful</p>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="faq" className="premium-card mt-5 p-6">
          <Accordion type="single" collapsible>
            {product.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>

      <section className="mt-20">
        <h2 className="text-2xl font-bold">You may also like</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Sticky mobile buy bar */}
      <Reveal className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="glass flex items-center gap-3 border-t border-border p-3 pb-safe-bottom">
          <div className="flex-1 min-w-0">
            <p className="font-display text-base font-bold leading-tight truncate sm:text-lg">{formatPKR(t.total)}</p>
            {bestPay ? (
              <p className="text-[10px] text-success leading-tight sm:text-[11px]">Save {bestPay.discountPct}% on advance</p>
            ) : null}
          </div>
          <Button
            size="sm"
            className="h-10 px-3 text-xs sm:h-11 sm:px-4 sm:text-sm"
            onClick={() => {
              addToCart(product.id, qty, selectedColor);
              toast.success("Added to cart");
            }}
          >
            Add
          </Button>
          <Button variant="secondary" size="sm" className="h-10 px-3 text-xs sm:h-11 sm:px-4 sm:text-sm" asChild>
            <Link to="/checkout" onClick={() => addToCart(product.id, qty, selectedColor)}>
              Buy Now
            </Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
