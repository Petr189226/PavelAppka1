import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { inputClassName, selectClassName, textareaClassName } from "@/lib/form-styles";

import { FormField, FormGrid, SectionGrid } from "./FormPrimitives";

export function SectionVstup() {
  return (
    <section id="vstup" className="section-fade space-y-4 scroll-mt-28">
      <SectionGrid>
        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle>0. Vstupní podklady – nákres a přepis formuláře</CardTitle>
            <CardDescription>
              Úvodní sekce je navržená podle přiloženého vstupního formuláře a nákresu střechy. Vyplníš ji
              jako první a aplikace z ní převezme data do technických částí projektu.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
              Spodní sekce zůstávají jako detailní doladění.
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input id="syncOnGenerate" type="checkbox" defaultChecked className="size-4 rounded border-input" />
              Při generování vždy převzít data z formuláře
            </label>
          </CardContent>
        </Card>

        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Zdrojové soubory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField id="sourceFormUpload" label="Původní formulář PDF/JPG/PNG">
              <input
                id="sourceFormUpload"
                type="file"
                accept=".pdf,image/*"
                className={inputClassName("py-1.5 file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm")}
              />
            </FormField>
            <FormField id="sketchUpload" label="Nákres střechy / screenshot">
              <input
                id="sketchUpload"
                type="file"
                accept="image/*"
                className={inputClassName("py-1.5 file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm")}
              />
            </FormField>
            <FormField id="sketchNote" label="Poznámka k nákresu">
              <textarea
                id="sketchNote"
                className={textareaClassName("short-area min-h-[80px]")}
                placeholder="Např. jižní plocha, komín vlevo..."
              />
            </FormField>
            <div id="sourceFormInfo" className="text-sm text-muted-foreground">
              Není nahraný žádný zdrojový formulář.
            </div>
            <div id="sourceFormParseInfo" className="text-xs text-muted-foreground">
              Automatický přenos funguje pro textové PDF formuláře.
            </div>
            <div
              id="sketchPreviewBox"
              className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground"
            >
              Nákres zatím není nahraný.
            </div>
            <div id="sketchTraceInfo" className="text-xs text-muted-foreground">
              Detekce panelů z nákresu zatím neproběhla.
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input id="useSketchTrace" type="checkbox" defaultChecked className="size-4 rounded border-input" />
              V E-03 použít detekované panely z nákresu
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button type="button" id="btnSyncFromIntake" className={inputClassName("cursor-pointer justify-center bg-primary text-primary-foreground hover:bg-primary/90")}>
                Převzít data z formuláře do projektu
              </button>
              <button type="button" id="btnDetectSketchPanels" className={inputClassName("cursor-pointer justify-center bg-secondary hover:bg-secondary/80")}>
                Detekovat panely z nákresu
              </button>
              <button type="button" id="btnClearSourceFiles" className={inputClassName("cursor-pointer justify-center")}>
                Vyčistit podklady
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Po nahrání textového PDF se údaje z formuláře zkusí automaticky přenést do buněk.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle>Přepis formuláře – identifikace a realizace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="mb-3 text-sm font-semibold text-muted-foreground">Identifikace žadatele</h4>
              <FormGrid>
                <FormField id="intakeApplicantName" label="Jméno a příjmení / název">
                  <input id="intakeApplicantName" className={inputClassName()} />
                </FormField>
                <FormField id="intakeApplicantBirthIc" label="Dat. nar. / IČ">
                  <input id="intakeApplicantBirthIc" className={inputClassName()} />
                </FormField>
                <FormField id="intakeApplicantEmail" label="E-mail">
                  <input id="intakeApplicantEmail" type="email" className={inputClassName()} />
                </FormField>
                <FormField id="intakeApplicantPhone" label="Telefon">
                  <input id="intakeApplicantPhone" className={inputClassName()} />
                </FormField>
                <FormField id="intakeApplicantStreet" label="Ulice">
                  <input id="intakeApplicantStreet" className={inputClassName()} />
                </FormField>
                <FormField id="intakeApplicantHouseNo" label="Č. popisné">
                  <input id="intakeApplicantHouseNo" className={inputClassName()} />
                </FormField>
                <FormField id="intakeApplicantOrientNo" label="Č. orientační">
                  <input id="intakeApplicantOrientNo" className={inputClassName()} />
                </FormField>
                <FormField id="intakeApplicantPsc" label="PSČ">
                  <input id="intakeApplicantPsc" className={inputClassName()} />
                </FormField>
                <FormField id="intakeApplicantCity" label="Obec">
                  <input id="intakeApplicantCity" className={inputClassName()} />
                </FormField>
              </FormGrid>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-muted-foreground">Adresa realizace</h4>
              <FormGrid>
                <FormField id="intakeRealStreet" label="Ulice">
                  <input id="intakeRealStreet" className={inputClassName()} />
                </FormField>
                <FormField id="intakeRealHouseNo" label="Č. popisné">
                  <input id="intakeRealHouseNo" className={inputClassName()} />
                </FormField>
                <FormField id="intakeRealOrientNo" label="Č. orientační">
                  <input id="intakeRealOrientNo" className={inputClassName()} />
                </FormField>
                <FormField id="intakeRealPsc" label="PSČ">
                  <input id="intakeRealPsc" className={inputClassName()} />
                </FormField>
                <FormField id="intakeRealCity" label="Obec">
                  <input id="intakeRealCity" className={inputClassName()} />
                </FormField>
                <FormField id="intakeRegion" label="Kraj">
                  <input id="intakeRegion" className={inputClassName()} />
                </FormField>
                <FormField id="intakeCadastralCode" label="Katastrální území – číslo">
                  <input id="intakeCadastralCode" className={inputClassName()} />
                </FormField>
                <FormField id="intakeCadastralName" label="Katastrální území – název">
                  <input id="intakeCadastralName" className={inputClassName()} />
                </FormField>
                <FormField id="intakeParcelNumber" label="Číslo parcely">
                  <input id="intakeParcelNumber" className={inputClassName()} />
                </FormField>
                <FormField id="intakeLvNumber" label="Číslo LV">
                  <input id="intakeLvNumber" className={inputClassName()} />
                </FormField>
                <FormField id="intakePropertyType" label="Typ nemovitosti">
                  <input id="intakePropertyType" placeholder="Rodinný dům" className={inputClassName()} />
                </FormField>
                <FormField id="intakePeopleCount" label="Počet osob v objektu">
                  <input id="intakePeopleCount" type="number" min={0} step={1} className={inputClassName()} />
                </FormField>
                <FormField id="intakeHouseAge" label="Stáří domu [roky]">
                  <input id="intakeHouseAge" type="number" min={0} step={1} className={inputClassName()} />
                </FormField>
                <FormField id="intakeUnitCount" label="Počet bytových jednotek">
                  <input id="intakeUnitCount" type="number" min={0} step={1} className={inputClassName()} />
                </FormField>
                <FormField id="intakeFloorArea" label="Podlahová plocha [m²]">
                  <input id="intakeFloorArea" type="number" min={0} step={0.1} className={inputClassName()} />
                </FormField>
                <FormField id="intakeFloors" label="Počet podlaží">
                  <input id="intakeFloors" type="number" min={0} step={1} className={inputClassName()} />
                </FormField>
                <FormField id="intakeProductType" label="Typ produktu">
                  <input id="intakeProductType" defaultValue="Fotovoltaická elektrárna" className={inputClassName()} />
                </FormField>
                <FormField id="intakeSubsidyProgram" label="Dotační program">
                  <input id="intakeSubsidyProgram" className={inputClassName()} />
                </FormField>
              </FormGrid>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-6">
          <CardHeader>
            <CardTitle>Specifikace zakázky</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGrid>
              <FormField id="intakeTotalPanels" label="Celkový počet panelů">
                <input id="intakeTotalPanels" type="number" min={0} step={1} className={inputClassName()} />
              </FormField>
              <FormField id="intakePhases" label="Počet fází">
                <select id="intakePhases" className={selectClassName()}>
                  <option value="">-</option>
                  <option value="1">1</option>
                  <option value="3">3</option>
                </select>
              </FormField>
              <FormField id="intakePanelType" label="Typ fotovoltaických panelů" className="sm:col-span-2 lg:col-span-2">
                <input id="intakePanelType" className={inputClassName()} />
              </FormField>
              <FormField id="intakeInverterType" label="Typ střídače">
                <input id="intakeInverterType" className={inputClassName()} />
              </FormField>
              <FormField id="intakeAccumulationType" label="Typ akumulace">
                <input id="intakeAccumulationType" className={inputClassName()} />
              </FormField>
              <FormField id="intakeBatteryModuleType" label="Typ řídicího modulu / BDU">
                <input id="intakeBatteryModuleType" className={inputClassName()} />
              </FormField>
              <FormField id="intakeBatteryType" label="Typ akumulátorů">
                <input id="intakeBatteryType" className={inputClassName()} />
              </FormField>
              <FormField id="intakeBatteryCount" label="Počet akumulátorů">
                <input id="intakeBatteryCount" type="number" min={0} step={1} className={inputClassName()} />
              </FormField>
              <FormField id="intakeAnnualConsumption1" label="Roční spotřeba 1. rok [MWh]">
                <input id="intakeAnnualConsumption1" type="number" min={0} step={0.01} className={inputClassName()} />
              </FormField>
              <FormField id="intakeAnnualConsumption2" label="Roční spotřeba 2. rok [MWh]">
                <input id="intakeAnnualConsumption2" type="number" min={0} step={0.01} className={inputClassName()} />
              </FormField>
              <FormField id="intakeTariff" label="Sazba">
                <input id="intakeTariff" placeholder="C02d / D57d..." className={inputClassName()} />
              </FormField>
              <FormField id="intakeWallboxCount" label="Počet dobíjecích bodů">
                <input id="intakeWallboxCount" type="number" min={0} step={1} className={inputClassName()} />
              </FormField>
              <FormField id="intakeWallboxPlace" label="Umístění wallboxu">
                <input id="intakeWallboxPlace" className={inputClassName()} />
              </FormField>
              <FormField id="intakeOwnInfo" label="Vlastní informace / poznámka obchodníka" className="sm:col-span-2">
                <textarea id="intakeOwnInfo" className={textareaClassName("min-h-[72px]")} />
              </FormField>
            </FormGrid>
          </CardContent>
        </Card>

        <Card className="md:col-span-6">
          <CardHeader>
            <CardTitle>Stringy / střešní plochy ze vstupního formuláře</CardTitle>
            <CardDescription>
              Pracovní logika projektu používá maximálně 2 stringy. Pole 3 a 4 jsou skrytá.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={n >= 3 ? "hidden" : "rounded-xl border border-border/80 bg-card/50 p-4"}
              >
                <h4 className="mb-3 text-sm font-semibold">Střecha / string {n}</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField id={`intakeString${n}RoofCover`} label="Krytina">
                    <input id={`intakeString${n}RoofCover`} className={inputClassName()} />
                  </FormField>
                  <FormField id={`intakeString${n}RoofType`} label="Typ střechy">
                    <input id={`intakeString${n}RoofType`} className={inputClassName()} />
                  </FormField>
                  <FormField id={`intakeString${n}Panels`} label="Počet panelů">
                    <input id={`intakeString${n}Panels`} type="number" min={0} step={1} className={inputClassName()} />
                  </FormField>
                  <FormField id={`intakeString${n}Azimuth`} label="Azimut [°]">
                    <input id={`intakeString${n}Azimuth`} type="number" className={inputClassName()} />
                  </FormField>
                  <FormField id={`intakeString${n}Tilt`} label="Sklon [°]">
                    <input id={`intakeString${n}Tilt`} type="number" className={inputClassName()} />
                  </FormField>
                  <FormField id={`intakeString${n}RoofSize`} label="Velikost střechy [m²]">
                    <input id={`intakeString${n}RoofSize`} type="number" min={0} step={0.1} className={inputClassName()} />
                  </FormField>
                  <FormField id={`intakeString${n}EaveHeight`} label="Výška k okapu [m]">
                    <input id={`intakeString${n}EaveHeight`} type="number" min={0} step={0.1} className={inputClassName()} />
                  </FormField>
                  <FormField id={`intakeString${n}HorizonHeight`} label="Výška k horizontu [m]">
                    <input id={`intakeString${n}HorizonHeight`} type="number" min={0} step={0.1} className={inputClassName()} />
                  </FormField>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle>Místo instalace, legislativa a trasa</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGrid>
              <FormField id="intakeTechnicalRoomHeight" label="Výška technické místnosti [m]">
                <input id="intakeTechnicalRoomHeight" type="number" min={0} step={0.1} className={inputClassName()} />
              </FormField>
              <FormField id="intakeTechnicalRoomSize" label="Velikost technické místnosti [m²]">
                <input id="intakeTechnicalRoomSize" type="number" min={0} step={0.1} className={inputClassName()} />
              </FormField>
              <FormField id="intakeLightning" label="Hromosvod">
                <select id="intakeLightning" className={selectClassName()}>
                  <option value="">-</option>
                  <option>Ano</option>
                  <option>Ne</option>
                  <option>Nutno ověřit</option>
                </select>
              </FormField>
              <FormField id="intakeInverterPlace" label="Umístění střídače">
                <input id="intakeInverterPlace" className={inputClassName()} />
              </FormField>
              <FormField id="intakeRdcPlace" label="Umístění RDC">
                <input id="intakeRdcPlace" className={inputClassName()} />
              </FormField>
              <FormField id="intakeRacPlace" label="Umístění RAC">
                <input id="intakeRacPlace" className={inputClassName()} />
              </FormField>
              <FormField id="intakeMainBoardPlace" label="Umístění hlavního rozvaděče">
                <input id="intakeMainBoardPlace" className={inputClassName()} />
              </FormField>
              <FormField id="intakeMeterBoardPlace" label="Umístění elektroměrového rozvaděče">
                <input id="intakeMeterBoardPlace" className={inputClassName()} />
              </FormField>
              <FormField id="intakeDistanceRdcInverter" label="Vzdálenost RDC → střídač [m]">
                <input id="intakeDistanceRdcInverter" type="number" min={0} step={0.1} className={inputClassName()} />
              </FormField>
              <FormField id="intakeDistanceInvMain" label="Vzdálenost střídač → hl. rozvaděč [m]">
                <input id="intakeDistanceInvMain" type="number" min={0} step={0.1} className={inputClassName()} />
              </FormField>
              <FormField id="intakeMainBreaker" label="Jistič před elektroměrem [A]">
                <input id="intakeMainBreaker" type="number" min={0} step={1} className={inputClassName()} />
              </FormField>
              <FormField id="intakeHdo" label="HDO">
                <select id="intakeHdo" className={selectClassName()}>
                  <option value="">-</option>
                  <option>Ano</option>
                  <option>Ne</option>
                </select>
              </FormField>
              <FormField id="intakeDistributor" label="Distributor">
                <input id="intakeDistributor" className={inputClassName()} />
              </FormField>
              <FormField id="intakeEan" label="Kód EAN">
                <input id="intakeEan" className={inputClassName()} />
              </FormField>
              <FormField id="intakeOm" label="Číslo OM">
                <input id="intakeOm" className={inputClassName()} />
              </FormField>
              <FormField id="intakeRestrictions" label="CHKO / památka / omezení">
                <input id="intakeRestrictions" className={inputClassName()} />
              </FormField>
              <FormField id="intakeScaffold" label="Nutnost lešení / plošiny">
                <input id="intakeScaffold" className={inputClassName()} />
              </FormField>
              <FormField id="intakeRecreational" label="Rekreační objekt">
                <input id="intakeRecreational" className={inputClassName()} />
              </FormField>
              <FormField id="intakeRoute" label="Popis trasy zapojení systému" className="sm:col-span-2 lg:col-span-4">
                <textarea id="intakeRoute" className={textareaClassName("min-h-[100px]")} />
              </FormField>
            </FormGrid>
          </CardContent>
        </Card>
      </SectionGrid>
    </section>
  );
}
