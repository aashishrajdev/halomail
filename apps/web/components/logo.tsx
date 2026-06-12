import { cn } from "@/lib/utils";

export function Logo({ className, mark = true }: { className?: string; mark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      {mark && <span className="inline-block size-5 rounded-md bg-gradient-to-br from-brand to-fuchsia-400" />}
      HaloLink
    </span>
  );
}
