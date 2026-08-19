"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRpc } from "@/lib/use-rpc";

interface Theme {
  kind: string;
  name: string;
  description: string;
  previewHtml: string;
}
interface Template {
  id: string;
  name: string;
  theme: string;
  subject: string;
}

export default function TemplatesPage() {
  const themes = useRpc<{ themes?: Theme[] }>("halomail.template.v1.TemplateService/ListThemes");
  const templates = useRpc<{ templates?: Template[] }>("halomail.template.v1.TemplateService/ListTemplates");

  return (
    <>
      <PageHeader title="Templates" description="Built-in email themes and your saved designs." />

      <h2 className="mb-1 text-sm font-medium text-muted-foreground">Built-in themes</h2>
      <p className="mb-3 text-xs text-muted-foreground">
        Preview only for now. Emails use the Minimal theme until theme selection ships.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(themes.data?.themes ?? []).map((t) => (
          <Card key={t.kind} className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-sm font-medium">{t.name}</span>
              <Badge variant="outline">{t.kind.replace("THEME_KIND_", "").toLowerCase()}</Badge>
            </div>
            <iframe
              title={t.name}
              srcDoc={t.previewHtml}
              className="pointer-events-none h-48 w-full bg-white"
              sandbox=""
              tabIndex={-1}
            />
          </Card>
        ))}
      </div>

      <div className="mb-3 mt-8 flex items-center gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">Your templates</h2>
        <Badge variant="outline">Coming soon</Badge>
      </div>
      <Card>
        {(templates.data?.templates ?? []).length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium">Custom templates are coming soon.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You'll be able to design your own email templates here and pick which one each
              notification uses.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {(templates.data?.templates ?? []).map((t) => (
              <div key={t.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-muted-foreground">{t.subject || "No subject"}</div>
                </div>
                <Badge variant="outline">{t.theme.replace("THEME_KIND_", "").toLowerCase()}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
