import { createFileRoute } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { Countdown } from "@/components/site/countdown";
import { ProductCard } from "@/components/site/product-card";
import { Reveal } from "@/components/site/reveal";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Flash Deals & Azadi Sale — Audiony Gadgets" },
      {
        name: "description",
        content:
          "Live flash deals on Audiony earbuds, headphones, solar lights and CX20 cooling fans. Countdown pricing with up to 60% off.",
      },
      { property: "og:title", content: "Flash Deals & Azadi Sale — Audiony Gadgets" },
      {
        property: "og:description",
        content: "Limited-time countdown offers with extra 30% off on advance payment.",
      },
      { property: "og:url", content: "/deals" },
    ],
    links: [{ rel: "canonical", href: "/deals" }],
  }),
  component: Deals,
});

function Deals() {
  const { products, settings } = useStore();
  const flash = products.filter((p) => p.active && p.flashSale);
  const others = products.filter((p) => p.active && !p.flashSale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Reveal className="gradient-brand rounded-[2rem] p-8 text-brand-foreground shadow-premium sm:p-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-background/20 px-3 py-1 text-xs font-bold uppercase tracking-widest">
          <Flame className="size-3.5" /> Live now
        </span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Flash Deals</h1>
        <p className="mt-2 max-w-xl text-sm opacity-90">{settings.saleBannerText}</p>
        <div className="mt-6">
          <Countdown target={settings.saleEndsAt} />
        </div>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {flash.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>

      <h2 className="mt-16 text-2xl font-bold">More great prices</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {others.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
