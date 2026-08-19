import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Code2,
  Inbox,
  KeyRound,
  Mail,
  Palette,
  ShieldCheck,
  Sparkles,
  Webhook,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <Features />
      <Dashboard />
      <FormsTable />
      <HowItWorks />
      <Integrate />
      <Stats />
      <Faq />
      <FinalCta />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Section shell                                                              */
/* -------------------------------------------------------------------------- */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center">
      <Badge variant="outline" className="bg-card/60 px-3 py-1 font-normal text-muted-foreground backdrop-blur">
        {children}
      </Badge>
    </div>
  );
}

function SectionHead({
  label,
  title,
  desc,
}: {
  label: string;
  title: React.ReactNode;
  desc?: string;
}) {
  return (
    <div className="mb-12 flex flex-col items-center gap-4 text-center">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {desc ? <p className="max-w-xl text-balance text-muted-foreground">{desc}</p> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="bg-spotlight pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]"
      />

      <div className="container relative flex flex-col items-center py-24 text-center md:py-32">
        <Badge variant="outline" className="mb-6 animate-fade-up gap-1.5 bg-card/60 py-1 pl-2 pr-3 backdrop-blur">
          <Sparkles className="size-3.5 text-brand" />
          <span className="font-normal text-muted-foreground">API-first · open source · MIT</span>
        </Badge>

        <h1 className="max-w-4xl animate-fade-up text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
          Scheduling and contact forms,
          <br className="hidden md:block" /> behind one clean API.
        </h1>

        <p className="mt-6 max-w-xl animate-fade-up text-balance text-lg text-muted-foreground">
          Give every user a public booking page and an embeddable contact form — backed by
          typed ConnectRPC, a generated SDK, signed webhooks, and a dashboard you don&apos;t
          have to build.
        </p>

        <div className="mt-9 flex animate-fade-up flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/register">
              Get started <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="/docs/integrate.html">Read the guide</a>
          </Button>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          No credit card · deploys on free tiers · self-host anywhere
        </p>

        <HeroPreview />
      </div>

      {/* Horizon curve closing the hero. */}
      <div aria-hidden className="bg-arc pointer-events-none absolute -bottom-px left-1/2 h-40 w-[160%] -translate-x-1/2" />
    </section>
  );
}

/** A compact, believable product shot: booking picker beside a live submission. */
function HeroPreview() {
  return (
    <div className="relative mt-16 w-full max-w-4xl animate-fade-up">
      <Card className="glass overflow-hidden p-2 shadow-2xl">
        <div className="rounded-md border border-border bg-background">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-destructive/60" />
            <span className="size-2.5 rounded-full bg-yellow-500/60" />
            <span className="size-2.5 rounded-full bg-emerald-500/60" />
            <span className="ml-3 font-mono text-[11px] text-muted-foreground">
              halomail.app/book/grace-hopper
            </span>
          </div>

          <div className="grid gap-4 p-4 text-left sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground">Intro Call · 30 min</p>
              <p className="mt-1 font-medium">Pick a time</p>
              <div className="mt-3 flex gap-1.5">
                {["Mon", "Tue", "Wed", "Thu"].map((d, i) => (
                  <div
                    key={d}
                    className={`flex-1 rounded-md border px-2 py-2 text-center text-[11px] ${
                      i === 1
                        ? "border-foreground/30 bg-secondary font-medium"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-1.5">
                {["09:00", "09:30", "10:00"].map((t, i) => (
                  <div
                    key={t}
                    className={`rounded-md border px-3 py-2 font-mono text-xs ${
                      i === 0
                        ? "border-brand/40 bg-brand/10 text-brand"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Inbox</p>
                <Badge variant="success" className="px-1.5 py-0 text-[10px]">live</Badge>
              </div>
              <div className="mt-3 space-y-2">
                {[
                  { n: "Jane Visitor", m: "Saw your portfolio — can we talk?" },
                  { n: "Marc Dev", m: "Question about the API pricing" },
                  { n: "Priya S.", m: "Booking rescheduled to Thursday" },
                ].map((row) => (
                  <div key={row.n} className="rounded-md border border-border px-3 py-2">
                    <p className="text-xs font-medium">{row.n}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{row.m}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[10px] text-muted-foreground">
                POST /SubmitMessage · 200 OK
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Logo strip                                                                 */
/* -------------------------------------------------------------------------- */

const STACK = [
  "PostgreSQL",
  "Redis",
  "Google Calendar",
  "Outlook",
  "Resend",
  "ConnectRPC",
  "Docker",
  "OpenTelemetry",
];

function LogoStrip() {
  return (
    <section className="border-b border-border py-16">
      <SectionLabel>Plays well with</SectionLabel>
      <h2 className="mt-5 text-center text-xl font-medium tracking-tight md:text-2xl">
        Built on the tools you already run
      </h2>

      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-3">
          {[...STACK, ...STACK].map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex h-14 min-w-[180px] items-center justify-center rounded-lg border border-border bg-card px-6 text-sm text-muted-foreground"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Features — bento                                                           */
/* -------------------------------------------------------------------------- */

function Features() {
  return (
    <section className="container py-20 md:py-28">
      <SectionHead
        label="Features"
        title="Everything a booking link needs, and nothing it doesn't"
        desc="Two products sharing one identity layer, one API, and one deployable binary."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Scheduling — wide */}
        <Card className="bg-card relative overflow-hidden p-6 lg:col-span-2">
          <FeatureHead
            icon={<CalendarClock />}
            title="Scheduling that respects timezones"
            desc="Weekly availability rules, date overrides, Google and Outlook sync, reschedule and cancel flows — slots are computed server-side so two people never book the same minute."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Weekly rules</p>
              <div className="mt-3 space-y-2">
                {[
                  ["Mon – Fri", "09:00 – 17:00"],
                  ["Saturday", "Unavailable"],
                ].map(([d, t]) => (
                  <div key={d} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{d}</span>
                    <span className="font-mono">{t}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex h-16 items-end gap-1">
                {[40, 65, 30, 80, 55, 20, 70].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-sm ${i === 3 ? "bg-brand/70" : "bg-secondary"}`}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Next bookings</p>
              <div className="mt-3 space-y-2">
                {[
                  ["Intro Call", "Tue 09:00"],
                  ["Design Review", "Wed 14:30"],
                  ["Pairing", "Thu 11:00"],
                ].map(([t, w]) => (
                  <div
                    key={t}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                  >
                    <span className="text-xs font-medium">{t}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Spam */}
        <Card className="bg-card p-6">
          <FeatureHead
            icon={<ShieldCheck />}
            title="Spam-proof by default"
            desc="Honeypot fields, per-IP rate limiting, and a spam score on every submission."
          />
          <div className="mt-6 space-y-2">
            {[
              { label: "jane@example.com", score: "0.02", spam: false },
              { label: "winner@lottery.biz", score: "0.97", spam: true },
              { label: "marc@studio.dev", score: "0.05", spam: false },
            ].map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2"
              >
                <span className="truncate text-xs text-muted-foreground">{r.label}</span>
                <Badge variant={r.spam ? "danger" : "success"} className="ml-2 px-1.5 py-0 text-[10px]">
                  {r.score}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Email designer */}
        <Card className="bg-card p-6">
          <FeatureHead
            icon={<Palette />}
            title="Emails that don't look templated"
            desc="Five built-in themes plus custom HTML, with live preview before you send."
          />
          <div className="mt-6 grid grid-cols-5 gap-2">
            {["Minimal", "Apple", "Notion", "Glass", "Terminal"].map((t, i) => (
              <div
                key={t}
                className={`rounded-md border p-2 text-center text-[10px] ${
                  i === 2 ? "border-brand/40 bg-brand/10 text-brand" : "border-border text-muted-foreground"
                }`}
              >
                <div className="mb-1.5 h-8 rounded bg-secondary" />
                {t}
              </div>
            ))}
          </div>
        </Card>

        {/* Developer — wide */}
        <Card className="bg-card overflow-hidden p-6 lg:col-span-2">
          <FeatureHead
            icon={<Code2 />}
            title="Typed end to end"
            desc="Protobuf definitions generate both the Go server and the TypeScript SDK, so a renamed field breaks the build instead of production."
          />
          <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-background p-4">
            <pre className="font-mono text-[12px] leading-relaxed text-muted-foreground">
              <code>{`const halo = new HaloMail({ apiUrl: process.env.API_URL });

await halo.contact.submitMessage({
  formSlug:    "portfolio",
  senderName:  "Jane Visitor",
  senderEmail: "jane@example.com",
  data:        { message: "Let's talk." },
});`}</code>
            </pre>
          </div>
        </Card>
      </div>
    </section>
  );
}

function FeatureHead({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div>
      <div className="mb-4 inline-flex size-9 items-center justify-center rounded-lg border border-border bg-secondary [&_svg]:size-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard split                                                            */
/* -------------------------------------------------------------------------- */

function Dashboard() {
  return (
    <section className="border-y border-border bg-card/30 py-20 md:py-28">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="max-w-md text-3xl font-semibold tracking-tight md:text-4xl">
            One dashboard for meetings and messages.
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            Every booking, every form submission, every API key and webhook delivery in a
            single place — with an audit log that records who changed what.
          </p>
          <ul className="mt-7 space-y-3">
            {[
              "Read, search, and mark submissions without leaving the app",
              "Rotate scoped API keys and replay failed webhooks",
              "Per-form target addresses and redirect URLs",
            ].map((line) => (
              <li key={line} className="flex gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                <span className="text-muted-foreground">{line}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-8" size="lg">
            <Link href="/dashboard">
              Open the dashboard <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <Card className="bg-card overflow-hidden p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">This week</p>
            <div className="flex gap-1">
              {["1D", "7D"].map((t, i) => (
                <span
                  key={t}
                  className={`rounded-md border px-2 py-0.5 text-[11px] ${
                    i === 1 ? "border-foreground/25 bg-secondary" : "border-border text-muted-foreground"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              ["Bookings", "34"],
              ["Messages", "128"],
              ["Show rate", "92%"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border bg-background p-3">
                <p className="text-[11px] text-muted-foreground">{k}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-border bg-background p-4">
            <svg viewBox="0 0 320 90" className="h-24 w-full" role="img" aria-label="Weekly volume">
              <polyline
                points="0,70 45,58 90,64 135,38 180,44 225,22 270,30 320,12"
                fill="none"
                stroke="hsl(var(--brand))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="0,80 45,74 90,78 135,66 180,70 225,58 270,62 320,52"
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.5"
              />
            </svg>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Forms table split                                                          */
/* -------------------------------------------------------------------------- */

const FORMS = [
  ["portfolio", "142", "0.4%", "2m ago"],
  ["hire-me", "38", "1.1%", "1h ago"],
  ["support", "512", "3.8%", "4m ago"],
  ["newsletter", "96", "0.9%", "22m ago"],
  ["feedback", "27", "0.0%", "3h ago"],
];

function FormsTable() {
  return (
    <section className="container py-20 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Card className="bg-card order-2 overflow-hidden p-0 lg:order-1">
          <div className="grid grid-cols-4 border-b border-border px-5 py-3 text-[11px] uppercase tracking-wide text-muted-foreground">
            <span className="col-span-1">Form</span>
            <span className="text-right">Messages</span>
            <span className="text-right">Spam</span>
            <span className="text-right">Last</span>
          </div>
          {FORMS.map(([slug, msgs, spam, last]) => (
            <div
              key={slug}
              className="grid grid-cols-4 items-center border-b border-border px-5 py-3.5 text-sm last:border-0"
            >
              <span className="flex items-center gap-2 font-mono text-xs">
                <Inbox className="size-3.5 text-muted-foreground" />
                {slug}
              </span>
              <span className="text-right font-medium">{msgs}</span>
              <span className="text-right text-muted-foreground">{spam}</span>
              <span className="text-right text-xs text-muted-foreground">{last}</span>
            </div>
          ))}
        </Card>

        <div className="order-1 lg:order-2">
          <h2 className="max-w-md text-3xl font-semibold tracking-tight md:text-4xl">
            Run as many forms as you have pages.
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            One form per page, per campaign, per client. Each gets its own slug, target
            address, field schema, and redirect — and shares the same two-line embed.
          </p>
          <Button asChild variant="outline" size="lg" className="mt-8">
            <a href="/docs/integrate.html">
              See the embed guide <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* How it works                                                               */
/* -------------------------------------------------------------------------- */

const STEPS = [
  {
    n: "01",
    title: "Create a form or event type",
    desc: "From the dashboard or one API call. You get a slug and a public booking handle.",
  },
  {
    n: "02",
    title: "Paste two lines into your site",
    desc: "A script tag and a data-halomail attribute on the form you already designed.",
  },
  {
    n: "03",
    title: "Watch messages and bookings land",
    desc: "Stored, forwarded to your inbox, and pushed to your endpoints as signed webhooks.",
  },
];

function HowItWorks() {
  return (
    <section className="border-y border-border bg-card/30 py-20 md:py-28">
      <div className="container">
        <SectionHead label="How it works" title="Live on your site in three steps" />
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <Card key={s.n} className="bg-card p-6">
              <span className="font-mono text-sm text-brand">{s.n}</span>
              <h3 className="mt-3 font-medium tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Integrate — code                                                           */
/* -------------------------------------------------------------------------- */

function Integrate() {
  return (
    <section className="container py-20 md:py-28">
      <SectionHead
        label="Integrate"
        title="Two lines of HTML, or the raw API"
        desc="The widget is progressive enhancement over a form you already have. Prefer to own the request? It's plain JSON over POST."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <CodeCard title="index.html · drop-in widget">
          {`<script src="https://api.halomail.app/widget.js" defer></script>

<form data-halomail="portfolio">
  <input name="name" required>
  <input name="email" type="email" required>
  <textarea name="message" required></textarea>
  <input name="_hl_hp" tabindex="-1" style="display:none">
  <button type="submit">Send</button>
</form>`}
        </CodeCard>

        <CodeCard title="terminal · book a meeting">
          {`curl https://api.halomail.app/halomail.scheduling.v1.BookingService/CreateBooking \\
  -H 'Content-Type: application/json' \\
  -d '{
    "eventTypeId":  "evt_01a01b8f",
    "inviteeName":  "Grace Hopper",
    "inviteeEmail": "grace@example.com",
    "start":        "2026-06-15T09:00:00Z"
  }'`}
        </CodeCard>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Mini icon={<Webhook />} label="Signed webhooks" />
        <Mini icon={<KeyRound />} label="Scoped API keys" />
        <Mini icon={<Mail />} label="Resend or SMTP" />
        <Mini icon={<Zap />} label="Single-binary deploy" />
      </div>
    </section>
  );
}

function CodeCard({ title, children }: { title: string; children: string }) {
  return (
    <Card className="bg-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-destructive/60" />
        <span className="size-2.5 rounded-full bg-yellow-500/60" />
        <span className="size-2.5 rounded-full bg-emerald-500/60" />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">{title}</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed">
        <code>{children}</code>
      </pre>
    </Card>
  );
}

function Mini({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm [&_svg]:size-4 [&_svg]:text-muted-foreground">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stats                                                                      */
/* -------------------------------------------------------------------------- */

const STATS = [
  ["6", "services, one binary"],
  ["~15 MB", "container image"],
  ["$0", "to run on free tiers"],
  ["MIT", "licensed, forever"],
];

function Stats() {
  return (
    <section className="border-y border-border">
      <div className="container grid divide-y divide-border sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
        {STATS.map(([v, k]) => (
          <div key={k} className="px-6 py-10 text-center">
            <p className="text-3xl font-semibold tracking-tight md:text-4xl">{v}</p>
            <p className="mt-2 text-sm text-muted-foreground">{k}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

const FAQS = [
  {
    q: "What is HaloMail?",
    a: "An open-source platform that gives every user a public booking page and an embeddable contact form, behind one typed API. Run it as a hosted service or self-host the whole thing as a single container.",
  },
  {
    q: "How do I start using HaloMail?",
    a: "Create an account, make a form or event type, then paste a script tag into your site. The integration guide walks through both, with copy-paste snippets for plain HTML and React.",
  },
  {
    q: "Do I need a database?",
    a: "PostgreSQL, yes — a free Neon project is plenty to start. Redis is optional: without it, rate limiting falls back to an in-memory limiter, which is correct for a single instance.",
  },
  {
    q: "Can I use my own domain for emails?",
    a: "Yes. Verify a domain with your email provider, then point EMAIL_FROM at an address on it. Without a verified domain, delivery is limited to your own account address.",
  },
  {
    q: "Is it really free to run?",
    a: "In monolith mode it fits inside the free tiers of a container host and a managed Postgres. Scale a single service out to its own deployment later without touching code.",
  },
  {
    q: "How do I keep the API off the public internet?",
    a: "Every write endpoint except form submission and booking requires a bearer token. Deploy the gateway behind your own proxy if you want the rest locked down further.",
  },
];

function Faq() {
  return (
    <section className="container py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="max-w-sm text-3xl font-semibold tracking-tight md:text-4xl">
            Have a question? We&apos;ve got answers.
          </h2>
        </div>
        <div className="flex flex-col items-start gap-5">
          <p className="max-w-md text-muted-foreground">
            Confused or curious? The docs cover the whole surface — from the first embed to
            self-hosting the stack on your own infrastructure.
          </p>
          <Button asChild variant="outline">
            <a href="/docs/index.html">
              Read the docs <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-14 grid gap-x-10 gap-y-8 border-t border-border pt-10 md:grid-cols-2">
        {FAQS.map((f) => (
          <div key={f.q}>
            <h3 className="font-medium tracking-tight">{f.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Final CTA                                                                  */
/* -------------------------------------------------------------------------- */

function FinalCta() {
  return (
    <section className="container pb-24">
      <Card className="bg-card relative overflow-hidden p-12 text-center md:p-16">
        <div aria-hidden className="bg-spotlight pointer-events-none absolute inset-0" />
        <div className="relative flex flex-col items-center gap-5">
          <SectionLabel>Get started</SectionLabel>
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
            Ship scheduling and contact in an afternoon.
          </h2>
          <p className="max-w-md text-muted-foreground">
            Self-host the whole platform as one container, or run each service on its own.
            Same API either way.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/register">
                Create your account <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://github.com/aashishrajdev/halomail" target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
