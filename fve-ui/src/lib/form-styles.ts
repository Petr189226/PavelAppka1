import { cn } from "@/lib/utils";

/** Shared native control styling (Apple-like, matches shadcn feel). */
export function inputClassName(extra?: string) {
  return cn(
    "flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
    "placeholder:text-muted-foreground",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    extra,
  );
}

export function textareaClassName(extra?: string) {
  return cn(inputClassName(), "min-h-[72px] py-2", extra);
}

export function selectClassName(extra?: string) {
  return cn(inputClassName(), extra);
}
