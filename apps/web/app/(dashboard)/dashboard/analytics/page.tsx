"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { useRpc } from "@/lib/use-rpc";

export default function AnalyticsPage() {
  const bookings = useRpc<{ bookings?: unknown[] }>("halolink.scheduling.v1.BookingService/ListBookings");
  const messages = useRpc<{ messages?: unknown[] }>("halolink.contact.v1.MessageService/ListMessages");

  const meetings = bookings.data?.bookings?.length ?? 0;
  const msgs = messages.data?.messages?.length ?? 0;
  const max = Math.max(meetings, msgs, 1);

  const bars = [
    { label: "Meetings", value: meetings, color: "bg-brand" },
    { label: "Messages", value: msgs, color: "bg-emerald-500" },
  ];

  return (
    <>
      <PageHeader title="Analytics" description="A quick read on your activity." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total meetings" value={meetings} />
        <Stat label="Total messages" value={msgs} />
        <Stat label="Engagements" value={meetings + msgs} />
      </div>

      <Card className="mt-6 p-6">
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">Volume</h2>
        <div className="space-y-4">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{b.label}</span>
                <span className="text-muted-foreground">{b.value}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className={`h-full rounded-full ${b.color}`} style={{ width: `${(b.value / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
    </Card>
  );
}
