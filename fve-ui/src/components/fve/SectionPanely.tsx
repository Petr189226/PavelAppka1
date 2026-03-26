import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { inputClassName } from "@/lib/form-styles";

import { FormField, FormGrid, SectionGrid } from "./FormPrimitives";

export function SectionPanely() {
  return (
    <section id="panely" className="section-fade space-y-4 scroll-mt-28">
      <SectionGrid>
        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle>3. Panely, řady a stringy</CardTitle>
            <CardDescription>Řady spravuje také starý engine přes dynamické řádky v #rowsWrap.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormGrid>
              <FormField id="panelManufacturer" label="Výrobce panelu">
                <input id="panelManufacturer" defaultValue="DAH Solar" className={inputClassName()} />
              </FormField>
              <FormField id="panelType" label="Typ panelu" className="sm:col-span-2">
                <input id="panelType" defaultValue="DHM-T72X10/FS(BB)-550Wp" className={inputClassName()} />
              </FormField>
              <FormField id="panelPower" label="Výkon 1 panelu [Wp]">
                <input id="panelPower" type="number" defaultValue={550} className={inputClassName()} />
              </FormField>
              <FormField id="panelVoltage" label="Napětí panelu [V]">
                <input id="panelVoltage" type="number" defaultValue={63} className={inputClassName()} />
              </FormField>
              <FormField id="panelArea" label="Plocha 1 panelu [m²]">
                <input id="panelArea" type="number" step={0.01} defaultValue={2.58} className={inputClassName()} />
              </FormField>
              <FormField id="panelWidth" label="Rozměr panelu - šířka [mm]">
                <input id="panelWidth" type="number" defaultValue={1134} className={inputClassName()} />
              </FormField>
              <FormField id="panelHeight" label="Rozměr panelu - výška [mm]">
                <input id="panelHeight" type="number" defaultValue={2279} className={inputClassName()} />
              </FormField>
              <FormField id="panelSvt" label="SVT panelu">
                <input id="panelSvt" defaultValue="SVT34133" className={inputClassName()} />
              </FormField>
              <FormField id="connectionType" label="Typ připojení">
                <input id="connectionType" defaultValue="Vlastní spotřeba" className={inputClassName()} />
              </FormField>
            </FormGrid>
            <div className="flex flex-wrap gap-2">
              <button type="button" id="btnAddRow" className={inputClassName("cursor-pointer bg-primary px-4 text-primary-foreground hover:bg-primary/90")}>
                Přidat řadu
              </button>
              <button type="button" id="btnAutoLayout" className={inputClassName("cursor-pointer px-4")}>
                Automaticky rozložit řady do E-03
              </button>
            </div>
            <div id="rowsWrap" className="space-y-4" />
            <p className="text-xs text-muted-foreground">
              Každá řada může reprezentovat jeden string. Je možné automatické skládání do polygonu střechy nebo ruční
              souřadnice v mm.
            </p>
          </CardContent>
        </Card>
      </SectionGrid>
    </section>
  );
}
