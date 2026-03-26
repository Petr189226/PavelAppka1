import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { inputClassName, textareaClassName } from "@/lib/form-styles";

import { FormField, SectionGrid } from "./FormPrimitives";

export function SectionZmeny() {
  return (
    <section id="zmeny" className="section-fade space-y-4 scroll-mt-28">
      <SectionGrid>
        <Card className="md:col-span-6">
          <CardHeader>
            <CardTitle>6. Rychlé změny projektu</CardTitle>
            <CardDescription>
              Můžeš psát volné věty i přesnější zápis typu <code className="rounded bg-muted px-1">row1.panels = 8</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField id="changeCommands" label="Příkazy pro změny">
              <textarea
                id="changeCommands"
                className={textareaClassName("min-h-[140px] font-mono text-xs")}
                placeholder={"Např.:\nzměň střídač na HYD 10KTL-3PH\nbez wallboxu\nřada 1 azimut 210\nrow1.panels = 10"}
              />
            </FormField>
            <div className="flex flex-wrap gap-2">
              <button type="button" id="btnApplyChanges" className={inputClassName("cursor-pointer bg-primary px-4 text-primary-foreground hover:bg-primary/90")}>
                Použít změny
              </button>
              <button type="button" id="btnSampleChanges" className={inputClassName("cursor-pointer px-4")}>
                Vložit ukázkové příkazy
              </button>
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="mb-1 font-medium text-foreground">Funguje třeba:</p>
              <code className="block">změň střídač na HYD 10KTL-3PH</code>
              <code className="block">bez wallboxu</code>
              <code className="block">řada 1 azimut 210</code>
              <code className="block">row2.drawOrientation = portrait</code>
              <code className="block">roofEdgeOffset = 400</code>
              <code className="block">počet řad na 2</code>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/30 bg-gradient-to-b from-white/40 to-transparent md:col-span-6 dark:from-zinc-900/40">
          <CardHeader>
            <CardTitle>Kontrola projektu a živý náhled</CardTitle>
          </CardHeader>
          <CardContent>
            <div id="validationBox" className="validation-list min-h-[48px] text-sm" />
            <p className="mt-3 text-xs text-muted-foreground">
              Kontrola hlídá obrys střechy, překážky, rozložení panelů a základní konzistenci projektu.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle>Živý náhled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/40 px-4 py-2 text-sm font-medium">E-02 – schéma</div>
                <div id="previewE02" className="min-h-[200px] overflow-auto bg-white p-2 dark:bg-zinc-950" />
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/40 px-4 py-2 text-sm font-medium">E-03 – rozmístění panelů</div>
                <div id="previewE03" className="min-h-[200px] overflow-auto bg-white p-2 dark:bg-zinc-950" />
              </div>
            </div>
          </CardContent>
        </Card>
      </SectionGrid>
    </section>
  );
}
