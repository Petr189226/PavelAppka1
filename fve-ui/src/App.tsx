import { useEffect } from "react";

import { FveAppRoot } from "@/components/fve/FveAppRoot";
import { AppShell } from "@/components/layout/AppShell";
import { bootstrapEngine, setStatusHandler } from "@/lib/fve/engine-body";

export default function App() {
  useEffect(() => {
    setStatusHandler((text: string, ok: boolean) => {
      if (text && !ok) console.warn("[FVE]", text);
    });
    bootstrapEngine();
  }, []);

  return (
    <AppShell>
      <FveAppRoot />
    </AppShell>
  );
}
