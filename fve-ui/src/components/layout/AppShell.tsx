import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FileJson, Layers, LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { href: "#vstup", label: "0. Vstupní podklady" },
  { href: "#projekt", label: "1. Projekt a investor" },
  { href: "#objekt", label: "2. Objekt a střecha" },
  { href: "#panely", label: "3. Panely a řady" },
  { href: "#elektro", label: "4. Elektro" },
  { href: "#obrazky", label: "5. Obrázky" },
  { href: "#zmeny", label: "6. Změny a náhled" },
  { href: "#vystupy", label: "7. Výstupy" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-10%,oklch(0.95_0.04_25),transparent),radial-gradient(900px_500px_at_100%_0%,oklch(0.94_0.03_264),transparent)]">
      <aside className="relative hidden w-[280px] shrink-0 flex-col border-r border-white/10 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 text-zinc-100 shadow-xl lg:flex">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <span className="text-2xl text-[#e85d5d]">)))</span>
            <span className="text-xl text-white">SCHLIEGER</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Generátor E-01, E-02 a E-03 pro FVE projekty – lokálně v prohlížeči.
          </p>
        </div>
        <Separator className="bg-white/10" />
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1 pr-3">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors",
                  "hover:bg-white/10 hover:text-white",
                  "focus-visible:ring-2 focus-visible:ring-[#e85d5d]/60 focus-visible:outline-none",
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-zinc-400">
            <div className="flex items-start gap-2 text-zinc-200">
              <LayoutDashboard className="mt-0.5 size-4 shrink-0 text-[#e85d5d]" />
              <span>Jeden formulář → tři dokumenty, JSON záloha, vlastní logo a mapka.</span>
            </div>
            <div className="flex items-start gap-2">
              <Layers className="mt-0.5 size-4 shrink-0 text-zinc-500" />
              <span>Výstupy jsou projektové podklady – vždy ověřit jištění a distributora.</span>
            </div>
            <div className="flex items-start gap-2">
              <FileJson className="mt-0.5 size-4 shrink-0 text-zinc-500" />
              <span>Ulož stav přes „Uložit JSON“ a načti znovu před úpravami.</span>
            </div>
          </div>
        </ScrollArea>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2 px-4 py-3 lg:px-6">
            <button
              type="button"
              id="btnGenerate"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Přepočítat a připravit výstupy
            </button>
            <button
              type="button"
              id="btnSaveJson"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-600/90"
            >
              Uložit JSON
            </button>
            <label
              htmlFor="loadJsonInput"
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent"
            >
              Načíst JSON
            </label>
            <input id="loadJsonInput" type="file" accept="application/json" hidden />
            <button
              type="button"
              id="btnCopyPrompt"
              className="inline-flex h-9 items-center justify-center rounded-xl border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent"
            >
              Kopírovat prompt
            </button>
            <button
              type="button"
              id="btnReset"
              className="inline-flex h-9 items-center justify-center rounded-xl border border-transparent px-4 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Obnovit vzorová data
            </button>
            <span id="statusLine" className="ml-auto min-w-[120px] text-right text-sm text-emerald-700 dark:text-emerald-400" />
          </div>
        </header>

        <nav
          aria-label="Sekce formuláře"
          className="flex gap-1 overflow-x-auto border-b border-border/60 bg-muted/20 px-3 py-2 lg:hidden"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm"
            >
              {item.label.replace(/^\d+\.\s*/, "")}
            </a>
          ))}
        </nav>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
