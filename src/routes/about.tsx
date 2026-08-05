import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Audiony Gadgets Pakistan" },
      {
        name: "description",
        content:
          "Audiony Gadgets tests every earbud, headphone, solar light and cooling fan in-house before shipping it anywhere in Pakistan.",
      },
      { property: "og:title", content: "Our Story — Audiony Gadgets" },
      {
        property: "og:description",
        content: "Why thousands of Pakistani customers trust Audiony Gadgets.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Reveal>
        <h1 className="text-4xl font-bold">Built in Pakistan, for people who hate wasting money</h1>
        <p className="mt-4 text-muted-foreground">
          Audiony Gadgets started in Lahore with one simple frustration: buying electronics online in
          Pakistan felt like a gamble. Fake specs, no warranty, no support. We fixed that by testing
          every single unit before dispatch and answering every WhatsApp message ourselves.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 overflow-hidden rounded-[2rem] border border-border shadow-premium">
        <img
          src={hero}
          alt="Audiony Gadgets product testing"
          loading="lazy"
          width={1920}
          height={1088}
          className="aspect-video w-full object-cover"
        />
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {[
          "12,000+ orders delivered nationwide",
          "Quality check on every unit before dispatch",
          "Cash on delivery in 400+ cities",
          "Up to 12 months official warranty",
          "7-day replacement on any fault",
          "Real reviews — we never delete them",
        ].map((t, i) => (
          <Reveal key={t} delay={i * 0.05} className="premium-card flex items-start gap-3 p-5">
            <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm">{t}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
