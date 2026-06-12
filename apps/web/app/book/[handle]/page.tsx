"use client";

import { CalendarClock, Check } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rpc } from "@/lib/api";

interface User { id: string; name: string; handle: string; timezone?: string }
interface EventType { id: string; title: string; description: string; durationMinutes: number }
interface Slot { start: string; end: string }

const tz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";

function isoDate(d: Date) { return d.toISOString().slice(0, 10); }

function BookingInner() {
  const params = useParams<{ handle: string }>();
  const eventId = useSearchParams().get("event");

  const [owner, setOwner] = useState<User | null>(null);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [picked, setPicked] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    rpc<{ user: User }>("halolink.identity.v1.UserService/GetUserByHandle", { handle: params.handle })
      .then((r) => setOwner(r.user))
      .catch(() => setError("This booking page does not exist."));
  }, [params.handle]);

  useEffect(() => {
    if (!eventId) return;
    rpc<{ eventType: EventType }>("halolink.scheduling.v1.EventTypeService/GetEventType", { id: eventId })
      .then((r) => setEventType(r.eventType))
      .catch(() => {});
    const from = new Date();
    const to = new Date(Date.now() + 7 * 86400_000);
    rpc<{ slots?: Slot[] }>("halolink.scheduling.v1.BookingService/ListSlots", {
      eventTypeId: eventId, fromDate: isoDate(from), toDate: isoDate(to), inviteeTimezone: tz,
    })
      .then((r) => setSlots(r.slots ?? []))
      .catch(() => {});
  }, [eventId]);

  async function book(e: React.FormEvent) {
    e.preventDefault();
    if (!picked || !eventId) return;
    try {
      await rpc("halolink.scheduling.v1.BookingService/CreateBooking", {
        eventTypeId: eventId, inviteeName: name, inviteeEmail: email, inviteeTimezone: tz, start: picked.start,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not book this time.");
    }
  }

  return (
    <div className="min-h-screen">
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <Link href="/"><Logo /></Link>
        <ThemeToggle />
      </header>

      <div className="container max-w-2xl py-12">
        {error && !owner ? (
          <Card className="p-10 text-center text-muted-foreground">{error}</Card>
        ) : !owner ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : done ? (
          <Card className="flex flex-col items-center gap-3 p-12 text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
              <Check className="size-6" />
            </span>
            <h1 className="text-2xl font-semibold">You're booked!</h1>
            <p className="text-muted-foreground">A confirmation with reschedule and cancel links is on its way to {email}.</p>
          </Card>
        ) : (
          <>
            <div className="mb-8">
              <div className="text-sm text-muted-foreground">Book with</div>
              <h1 className="text-3xl font-semibold tracking-tight">{owner.name}</h1>
            </div>

            {!eventId ? (
              <Card className="p-8 text-center text-sm text-muted-foreground">
                <CalendarClock className="mx-auto mb-3 size-6" />
                Open a specific event link to pick a time, e.g. <code className="font-mono">/book/{owner.handle}?event=evt_…</code>
              </Card>
            ) : !picked ? (
              <Card>
                <CardHeader>
                  <CardTitle>{eventType?.title ?? "Select a time"}</CardTitle>
                  {eventType && <p className="text-sm text-muted-foreground">{eventType.durationMinutes} min · times shown in {tz}</p>}
                </CardHeader>
                <CardContent>
                  {slots.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">No open times in the next 7 days.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {slots.slice(0, 24).map((s) => (
                        <Button key={s.start} variant="outline" onClick={() => setPicked(s)}>
                          {new Date(s.start).toLocaleString(undefined, { weekday: "short", hour: "2-digit", minute: "2-digit" })}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Confirm your booking</CardTitle>
                  <p className="text-sm text-muted-foreground">{new Date(picked.start).toLocaleString()}</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={book} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="n">Name</Label>
                      <Input id="n" required value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="e">Email</Label>
                      <Input id="e" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <div className="flex gap-2">
                      <Button type="button" variant="ghost" onClick={() => setPicked(null)}>Back</Button>
                      <Button type="submit">Confirm booking</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-sm text-muted-foreground">Loading…</div>}>
      <BookingInner />
    </Suspense>
  );
}
