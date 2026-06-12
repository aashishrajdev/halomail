"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rpc } from "@/lib/api";
import { getToken, saveSession, getUser } from "@/lib/auth";
import { useRpc } from "@/lib/use-rpc";

interface User {
  id: string;
  email: string;
  name: string;
  handle: string;
  timezone: string;
}

export default function SettingsPage() {
  const { data } = useRpc<{ user: User }>("halolink.identity.v1.AuthService/GetCurrentUser");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [timezone, setTimezone] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);
  useEffect(() => {
    if (data?.user) {
      setName(data.user.name);
      setHandle(data.user.handle);
      setTimezone(data.user.timezone);
    }
  }, [data]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    try {
      const res = await rpc<{ user: User }>(
        "halolink.identity.v1.UserService/UpdateUser",
        { name, handle, timezone },
        getToken(),
      );
      const current = getUser();
      const token = getToken();
      if (current && token) saveSession(token, { ...current, ...res.user });
      setSaved(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile and public booking page." />

      <div className="grid max-w-2xl gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="handle">Handle</Label>
                <Input id="handle" value={handle} onChange={(e) => setHandle(e.target.value)} />
                <p className="text-xs text-muted-foreground">Your booking page: {origin}/book/{handle || "your-handle"}</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tz">Timezone</Label>
                <Input id="tz" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="UTC" />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
                {saved && <span className="text-sm text-emerald-500">Saved</span>}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Signed in as <span className="text-foreground">{data?.user?.email}</span>.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
