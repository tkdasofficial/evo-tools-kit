import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    summary: "Everything you need for occasional, everyday tasks.",
    features: [
      "All 10 tools, no sign-in required",
      "Standard file size limits",
      "In-browser processing",
      "Single file at a time",
    ],
    cta: "Start using it",
    to: "/" as const,
    featured: false,
  },
  {
    name: "Pro",
    price: "$6",
    period: "per month",
    summary: "For daily work, larger files and batch output.",
    features: [
      "Higher file size limits",
      "Batch processing across files",
      "Saved presets per tool",
      "Priority email support",
      "Export history",
    ],
    cta: "Create account",
    to: "/auth/signup" as const,
    featured: true,
  },
  {
    name: "Team",
    price: "$18",
    period: "per month",
    summary: "Shared presets and billing for small teams.",
    features: [
      "Everything in Pro",
      "Up to 5 members",
      "Shared team presets",
      "Consolidated invoicing",
      "Onboarding assistance",
    ],
    cta: "Create account",
    to: "/auth/signup" as const,
    featured: false,
  },
];

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Hyper Cluster plans" },
      {
        name: "description",
        content:
          "Use all ten Hyper Cluster tools free, or upgrade for larger files, batch processing, saved presets and team billing.",
      },
      { property: "og:title", content: "Pricing — Hyper Cluster plans" },
      {
        property: "og:description",
        content: "Free forever, Pro at $6/month, Team at $18/month. Cancel any time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <AppShell title="Pricing">
      <div className="mx-auto w-full max-w-4xl">
        <header className="max-w-xl">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            Simple pricing, no surprises
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Every tool is free to use. Upgrade only when you need bigger files, batches or shared
            presets. Cancel any time.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {plans.map((plan) => (
            <section
              key={plan.name}
              className={cn(
                "flex flex-col rounded-xl border bg-card p-5 shadow-sm",
                plan.featured ? "border-foreground/40 ring-1 ring-foreground/10" : "border-border",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold tracking-tight">{plan.name}</h2>
                {plan.featured && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight tabular-nums">
                  {plan.price}
                </span>
                <span className="text-xs text-muted-foreground">{plan.period}</span>
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {plan.summary}
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-[13px] text-muted-foreground">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-foreground" strokeWidth={2.25} />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={plan.to}
                className={cn(
                  "mt-5 inline-flex h-9 items-center justify-center rounded-lg px-4 text-[13px] font-medium transition-colors",
                  plan.featured
                    ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90"
                    : "border border-border bg-background hover:bg-accent",
                )}
              >
                {plan.cta}
              </Link>
            </section>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Prices in USD, excluding any local taxes. See the{" "}
          <Link to="/terms" className="underline underline-offset-2 hover:text-foreground">
            Terms of Service
          </Link>{" "}
          for billing details.
        </p>
      </div>
    </AppShell>
  );
}
