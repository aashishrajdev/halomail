import { Check } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Pricing" };

const tiers = [
  {
    name: "Free",
    price: "$0",
    blurb: "Self-host the whole platform. Forever.",
    cta: "Get started",
    featured: false,
    features: ["1 user", "Unlimited bookings", "1 contact form", "Honeypot spam protection", "Community support"],
  },
  {
    name: "Pro",
    price: "$12",
    blurb: "For makers shipping real products.",
    cta: "Start Pro",
    featured: true,
    features: ["Everything in Free", "Google & Outlook sync", "Unlimited contact forms", "Custom email themes", "Signed webhooks", "API keys"],
  },
  {
    name: "Scale",
    price: "$49",
    blurb: "Distributed services + higher limits.",
    cta: "Contact us",
    featured: false,
    features: ["Everything in Pro", "Per-service scaling", "Priority webhooks", "Audit log retention", "SSO (coming soon)", "SLA"],
  },
];

export default function PricingPage() {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="brand" className="mb-4">Pricing</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">Simple, honest pricing</h1>
        <p className="mt-3 text-muted-foreground">Open source and free to self-host. Pay only for hosted convenience.</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <Card key={t.name} className={t.featured ? "relative border-brand/50 shadow-lg" : "relative"}>
            {t.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="brand">Most popular</Badge>
              </span>
            )}
            <div className="p-6">
              <div className="font-medium">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">{t.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
              <Button asChild className="mt-6 w-full" variant={t.featured ? "brand" : "outline"}>
                <Link href="/register">{t.cta}</Link>
              </Button>
              <ul className="mt-6 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
