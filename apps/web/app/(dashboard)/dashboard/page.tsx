"use client";

import { BarChart3, CalendarClock, Inbox, KeyRound, Palette } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import { useRpc } from "@/lib/use-rpc";

export default function OverviewPage() {
  const [name, setName] = useState("");
  useEffect(() => setName(getUser()?.name?.split(" ")[0] ?? ""), []);

  const bookings = useRpc<{ bookings?: unknown[] }>("halomail.scheduling.v1.BookingService/ListBookings");
  const messages = useRpc<{ messages?: unknown[] }>("halomail.contact.v1.MessageService/ListMessages");
  const forms = useRpc<{ forms?: unknown[] }>("halomail.contact.v1.FormService/ListForms");
  const keys = useRpc<{ keys?: unknown[] }>("halomail.identity.v1.ApiKeyService/ListApiKeys");

  const stats = [
    { label: "Meetings", value: bookings.data?.bookings?.length ?? 0, icon: CalendarClock, href: "/dashboard/meetings" },
    { label: "Messages", value: messages.data?.messages?.length ?? 0, icon: Inbox, href: "/dashboard/messages" },
    { label: "Forms", value: forms.data?.forms?.length ?? 0, icon: Palette, href: "/dashboard/templates" },
    { label: "API keys", value: keys.data?.keys?.length ?? 0, icon: KeyRound, href: "/dashboard/api-keys" },
  ];

  return (
    <>
      <PageHeader title={name ? `Welcome back, ${name}` : "Overview"} description="Your scheduling and contact activity at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card className="p-5 transition-colors hover:border-foreground/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-tight">{s.value}</div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-2 flex items-center gap-2 font-medium">
            <CalendarClock className="size-4" /> Get bookable
          </div>
          <p className="text-sm text-muted-foreground">
            Create an event type and set your availability, then share your booking page.
          </p>
          <Link href="/dashboard/meetings" className="mt-4 inline-block text-sm text-brand underline-offset-4 hover:underline">
            Manage meetings →
          </Link>
        </Card>
        <Card className="p-6">
          <div className="mb-2 flex items-center gap-2 font-medium">
            <BarChart3 className="size-4" /> Insights
          </div>
          <p className="text-sm text-muted-foreground">Track bookings and form submissions over time.</p>
          <Link href="/dashboard/analytics" className="mt-4 inline-block text-sm text-brand underline-offset-4 hover:underline">
            View analytics →
          </Link>
        </Card>
      </div>
    </>
  );
}
