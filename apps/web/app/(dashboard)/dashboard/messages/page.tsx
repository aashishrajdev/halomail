"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useRpc } from "@/lib/use-rpc";

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  data?: Record<string, string>;
  isSpam: boolean;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const { data, loading, error } = useRpc<{ messages?: Message[] }>("halolink.contact.v1.MessageService/ListMessages");
  const messages = data?.messages ?? [];

  return (
    <>
      <PageHeader title="Messages" description="Submissions from your contact forms." />
      <Card>
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading…</p>
        ) : error ? (
          <p className="p-6 text-sm text-destructive">{error}</p>
        ) : messages.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">No messages yet. Embed your form widget to start collecting.</p>
        ) : (
          <div className="divide-y divide-border">
            {messages.map((m) => {
              const body = m.data ? Object.values(m.data)[0] : "";
              return (
                <div key={m.id} className="flex items-start gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{m.senderName || m.senderEmail || "Anonymous"}</span>
                      {m.isSpam && <Badge variant="danger">spam</Badge>}
                      {!m.read && !m.isSpam && <Badge variant="brand">new</Badge>}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{body}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDate(m.createdAt)}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
}
