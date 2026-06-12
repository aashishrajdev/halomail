"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useRpc } from "@/lib/use-rpc";

interface Booking {
  id: string;
  inviteeName: string;
  inviteeEmail: string;
  start: string;
  end: string;
  status: string;
}

function statusLabel(s: string) {
  return s.replace("BOOKING_STATUS_", "").toLowerCase();
}

export default function MeetingsPage() {
  const { data, loading, error } = useRpc<{ bookings?: Booking[] }>("halolink.scheduling.v1.BookingService/ListBookings");
  const bookings = data?.bookings ?? [];

  return (
    <>
      <PageHeader title="Meetings" description="Bookings made through your booking page." />
      <Card>
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading…</p>
        ) : error ? (
          <p className="p-6 text-sm text-destructive">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">No bookings yet. Share your booking page to get started.</p>
        ) : (
          <div className="divide-y divide-border">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span>Invitee</span>
              <span>When</span>
              <span>Status</span>
            </div>
            {bookings.map((b) => (
              <div key={b.id} className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 px-5 py-3 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-medium">{b.inviteeName}</div>
                  <div className="truncate text-muted-foreground">{b.inviteeEmail}</div>
                </div>
                <div className="text-muted-foreground">{formatDate(b.start)}</div>
                <Badge variant={statusLabel(b.status) === "cancelled" ? "danger" : "success"}>{statusLabel(b.status)}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
