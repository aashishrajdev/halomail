import { ArrowRight, CalendarClock, Code2, Inbox, KeyRound, Palette, ShieldCheck, Webhook, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="container relative flex flex-col items-center py-24 text-center md:py-32">
          <Badge variant="brand" className="mb-5 animate-fade-up">API-first · open source</Badge>
          <h1 className="max-w-3xl animate-fade-up text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
            Scheduling and contact forms,
            <br className="hidden md:block" /> behind one clean API.
          </h1>
          <p className="mt-6 max-w-xl animate-fade-up text-balance text-lg text-muted-foreground">
            Give every user a public booking page and an embeddable contact form —
            backed by typed ConnectRPC, an SDK, webhooks, and a polished dashboard.
          </p>
          <div className="mt-8 flex animate-fade-up flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/register">
                Start building <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://github.com/aashishrajdev/halomail" target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">No credit card · deploy free · MIT licensed</p>
        </div>
      </section>

      {/* Feature grid */}
      <section className="container py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Feature icon={<CalendarClock />} title="Scheduling" desc="Public booking pages, availability rules, Google & Outlook sync, timezones, reschedule/cancel." />
          <Feature icon={<Inbox />} title="Contact forms" desc="Embeddable widget, REST + SDK, spam protection, rate limiting, storage, email forwarding." />
          <Feature icon={<Palette />} title="Email designer" desc="Built-in themes — Minimal, Apple, Notion, Glass, Terminal — plus custom HTML and live preview." />
          <Feature icon={<Code2 />} title="Developer-first" desc="API keys, signed webhooks, generated SDK, OpenAPI, audit logs. Typed end-to-end." />
        </div>
      </section>

      {/* Code showcase */}
      <section className="container py-12">
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="size-3 rounded-full bg-destructive/70" />
            <span className="size-3 rounded-full bg-yellow-500/70" />
            <span className="size-3 rounded-full bg-emerald-500/70" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">book a meeting · ConnectRPC over JSON</span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
            <code>{`curl https://api.halolink.dev/halolink.scheduling.v1.BookingService/CreateBooking \\
  -H 'Content-Type: application/json' \\
  -d '{
    "event_type_id": "evt_...",
    "invitee_name": "Grace Hopper",
    "invitee_email": "grace@example.com",
    "start": "2026-06-15T09:00:00Z"
  }'`}</code>
          </pre>
        </Card>
      </section>

      {/* Capability strip */}
      <section className="container grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <Mini icon={<Webhook />} label="Signed webhooks" />
        <Mini icon={<KeyRound />} label="Scoped API keys" />
        <Mini icon={<ShieldCheck />} label="Spam protection" />
        <Mini icon={<Zap />} label="Single-binary deploy" />
      </section>

      {/* CTA */}
      <section className="container py-20">
        <Card className="flex flex-col items-center gap-5 bg-gradient-to-b from-card to-secondary/40 p-12 text-center">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight">Ship scheduling and contact in an afternoon.</h2>
          <p className="max-w-md text-muted-foreground">Self-host the whole platform as one container, or run each service on its own.</p>
          <Button asChild size="lg">
            <Link href="/register">Create your account <ArrowRight className="size-4" /></Link>
          </Button>
        </Card>
      </section>
    </>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="p-6 transition-colors hover:border-foreground/20">
      <div className="mb-4 inline-flex size-9 items-center justify-center rounded-lg bg-secondary text-foreground [&_svg]:size-5">
        {icon}
      </div>
      <h3 className="mb-1.5 font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </Card>
  );
}

function Mini({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm [&_svg]:size-4 [&_svg]:text-muted-foreground">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}
