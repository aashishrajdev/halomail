import { CalendarClock, Code2, Inbox, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Features" };

const sections = [
  {
    icon: <CalendarClock />,
    title: "Meeting scheduling",
    points: [
      "A public booking page for every user at /book/{handle}",
      "Weekly availability rules + per-date overrides",
      "Timezone-aware slot computation with buffers",
      "Google Calendar and Outlook sync via OAuth",
      "Confirmation, reschedule, and cancel links",
    ],
  },
  {
    icon: <Inbox />,
    title: "Contact form infrastructure",
    points: [
      "Embeddable widget — one <script> tag",
      "REST API and generated SDK",
      "Honeypot + heuristic spam scoring",
      "Per-IP and per-form rate limiting",
      "Message storage and email forwarding",
    ],
  },
  {
    icon: <Palette />,
    title: "Email designer",
    points: [
      "Five built-in themes: Minimal, Apple, Notion, Glass, Terminal",
      "Custom HTML templates with {{variables}}",
      "Live preview rendering",
      "XSS-safe variable substitution",
    ],
  },
  {
    icon: <Code2 />,
    title: "Developer surface",
    points: [
      "Scoped API keys",
      "HMAC-signed webhooks with retries",
      "Generated TypeScript SDK",
      "OpenAPI documentation",
      "Audit logs for every sensitive action",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="brand" className="mb-4">Features</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">Everything you need, nothing you don't</h1>
        <p className="mt-3 text-muted-foreground">One typed API powers the dashboard, the SDK, and your own integrations.</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        {sections.map((s) => (
          <Card key={s.title} className="p-6">
            <div className="mb-4 inline-flex size-9 items-center justify-center rounded-lg bg-secondary [&_svg]:size-5">
              {s.icon}
            </div>
            <h2 className="mb-3 text-lg font-medium">{s.title}</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {s.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                  {p}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
