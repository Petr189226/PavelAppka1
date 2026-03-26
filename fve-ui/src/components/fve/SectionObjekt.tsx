import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { inputClassName, selectClassName, textareaClassName } from "@/lib/form-styles";

import { FormField, FormGrid, SectionGrid } from "./FormPrimitives";

export function SectionObjekt() {
  return (
    <section id="objekt" className="section-fade space-y-4 scroll-mt-28">
      <SectionGrid>
        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle>2. Objekt a střecha</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGrid>
              <FormField id="roofType" label="Typ střechy">
                <select id="roofType" className={selectClassName()}>
                  <option>Rovná</option>
                  <option>Šikmá</option>
                  <option>Pultová</option>
                  <option>Jiná</option>
                </select>
              </FormField>
              <FormField id="roofSurface" label="Povrch střechy">
                <input id="roofSurface" defaultValue="IPA" className={inputClassName()} />
              </FormField>
              <FormField id="roofFire" label="Požární hodnocení povrchu">
                <select id="roofFire" className={selectClassName()}>
                  <option>NEHOŘLAVÝ</option>
                  <option>HOŘLAVÝ</option>
                  <option>Nutno posoudit</option>
                </select>
              </FormField>
              <FormField id="floors" label="Počet podlaží">
                <input id="floors" type="number" min={1} step={1} defaultValue={2} className={inputClassName()} />
              </FormField>
              <FormField id="heatingSource" label="Zdroj vytápění">
                <input id="heatingSource" defaultValue="Plynový kotel" className={inputClassName()} />
              </FormField>
              <FormField id="hotWaterSource" label="Zdroj TV">
                <input id="hotWaterSource" defaultValue="Plynový kotel" className={inputClassName()} />
              </FormField>
              <FormField id="roofWidth" label="Šířka střechy / plochy [mm]">
                <input id="roofWidth" type="number" defaultValue={11000} className={inputClassName()} />
              </FormField>
              <FormField id="roofHeight" label="Výška střechy / plochy [mm]">
                <input id="roofHeight" type="number" defaultValue={10400} className={inputClassName()} />
              </FormField>
              <FormField id="roofEdgeOffset" label="Odstup od hrany [mm]">
                <input id="roofEdgeOffset" type="number" defaultValue={300} className={inputClassName()} />
              </FormField>
              <FormField id="panelGapMm" label="Mezera mezi panely [mm]">
                <input id="panelGapMm" type="number" defaultValue={20} className={inputClassName()} />
              </FormField>
              <FormField id="roofPolygon" label="Obrys střechy [mm, body x,y]" className="sm:col-span-2">
                <textarea
                  id="roofPolygon"
                  defaultValue="0,0 11000,0 11000,10400 0,10400"
                  className={textareaClassName("font-mono text-xs")}
                />
              </FormField>
              <FormField id="roofObstacles" label="Překážky / výřezy [název;x;y;šířka;výška]" className="sm:col-span-2">
                <textarea id="roofObstacles" className={textareaClassName("font-mono text-xs")} />
              </FormField>
              <FormField id="technicalRoom" label="Umístění technické místnosti">
                <input id="technicalRoom" defaultValue="Technická místnost" className={inputClassName()} />
              </FormField>
              <FormField id="wallboxPlace" label="Umístění wallboxu">
                <input id="wallboxPlace" defaultValue="Garáž" className={inputClassName()} />
              </FormField>
              <FormField id="lightning" label="Hromosvod">
                <select id="lightning" className={selectClassName()}>
                  <option>Stávající hromosvod</option>
                  <option>Bez hromosvodu - doporučit doplnění</option>
                  <option>Nutno ověřit</option>
                </select>
              </FormField>
              <FormField id="roofPlanScale" label="Měřítko E-03">
                <input id="roofPlanScale" defaultValue="1:100" className={inputClassName()} />
              </FormField>
              <FormField id="buildingDescription" label="Krátký popis objektu" className="sm:col-span-2">
                <textarea
                  id="buildingDescription"
                  defaultValue="Fotovoltaické panely budou umístěny na střeše rodinného domu, který bude zároveň místem spotřeby vyrobené energie. Panely budou orientovány dle jednotlivých řad uvedených níže. Sklon panelů je dán sklonem střechy nebo systémové konstrukce v místě instalace."
                  className={textareaClassName()}
                />
              </FormField>
              <FormField id="executionNotes" label="Kabelové trasy / montážní poznámky" className="sm:col-span-2">
                <textarea
                  id="executionNotes"
                  defaultValue="Umístění komponentů, prostupů do budovy, tras a způsobu provedení je nutno koordinovat s odpovědným zástupcem investora a s dodavatelem. Kabelové rozvody musí být provedeny tak, aby neztěžovaly údržbu a výměnu jednotlivých částí systému."
                  className={textareaClassName()}
                />
              </FormField>
            </FormGrid>
          </CardContent>
        </Card>

        <Card className="border-white/30 bg-gradient-to-b from-white/50 to-white/30 md:col-span-4 dark:from-zinc-900/50 dark:to-zinc-950/40">
          <CardHeader>
            <CardTitle>Souhrn</CardTitle>
            <CardDescription>Přepočítává se automaticky z řad a panelů.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-background/80 p-3 shadow-sm">
                <div className="text-muted-foreground">Celkem panelů</div>
                <div id="sumPanels" className="text-lg font-semibold tabular-nums">
                  0
                </div>
              </div>
              <div className="rounded-xl bg-background/80 p-3 shadow-sm">
                <div className="text-muted-foreground">Instalovaný výkon</div>
                <div id="sumPower" className="text-lg font-semibold tabular-nums">
                  0 kWp
                </div>
              </div>
              <div className="rounded-xl bg-background/80 p-3 shadow-sm">
                <div className="text-muted-foreground">Počet řad</div>
                <div id="sumRows" className="text-lg font-semibold tabular-nums">
                  0
                </div>
              </div>
              <div className="rounded-xl bg-background/80 p-3 shadow-sm">
                <div className="text-muted-foreground">Plocha FV</div>
                <div id="sumArea" className="text-lg font-semibold tabular-nums">
                  0 m²
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              E-03 pracuje s rozmístěním panelů podle zadaných řad a pozic.
            </p>
          </CardContent>
        </Card>
      </SectionGrid>
    </section>
  );
}
