"use client";

import { Check, Copy, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { rpc } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { useRpc } from "@/lib/use-rpc";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  lastFour: string;
  createdAt: string;
  revoked: boolean;
}

export default function ApiKeysPage() {
  const { data, loading, reload } = useRpc<{ keys?: ApiKey[] }>("halomail.identity.v1.ApiKeyService/ListApiKeys");
  const [name, setName] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const keys = data?.keys ?? [];

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copySecret() {
    if (!secret) return;
    await navigator.clipboard.writeText(secret);
    setCopied(true);
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      const res = await rpc<{ secret: string }>("halomail.identity.v1.ApiKeyService/CreateApiKey", { name, scopes: [] }, getToken());
      setSecret(res.secret);
      setCopied(false);
      setName("");
      reload();
    } finally {
      setBusy(false);
    }
  }

  async function revoke(id: string) {
    await rpc("halomail.identity.v1.ApiKeyService/RevokeApiKey", { id }, getToken());
    reload();
  }

  return (
    <>
      <PageHeader title="API keys" description="Authenticate server-to-server requests to the HaloMail API." />

      {secret && (
        <Card className="mb-6 border-brand/40 bg-brand/5 p-4">
          <p className="text-sm font-medium">Copy your key now — it won't be shown again.</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 truncate rounded-md bg-background px-3 py-2 font-mono text-sm">{secret}</code>
            <Button size="icon" variant="outline" onClick={copySecret} aria-label={copied ? "Copied" : "Copy"}>
              {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
            </Button>
            <span
              aria-live="polite"
              className={`text-xs text-emerald-500 transition-opacity ${copied ? "opacity-100" : "opacity-0"}`}
            >
              Copied to clipboard
            </span>
          </div>
        </Card>
      )}

      <Card className="mb-6 p-4">
        <form onSubmit={create} className="flex gap-2">
          <Input placeholder="Key name (e.g. production server)" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit" disabled={busy}>{busy ? "Creating…" : "Create key"}</Button>
        </form>
      </Card>

      <Card>
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading…</p>
        ) : keys.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">No API keys yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {keys.map((k) => (
              <div key={k.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    {k.name}
                    {k.revoked && <Badge variant="danger">revoked</Badge>}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">{k.prefix}_••••{k.lastFour} · {formatDate(k.createdAt)}</div>
                </div>
                {!k.revoked && (
                  <Button size="icon" variant="ghost" onClick={() => revoke(k.id)} aria-label="Revoke">
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
