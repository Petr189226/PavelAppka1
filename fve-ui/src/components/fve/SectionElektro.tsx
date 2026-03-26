import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inputClassName, selectClassName, textareaClassName } from "@/lib/form-styles";

import { FormField, FormGrid, SectionGrid } from "./FormPrimitives";

export function SectionElektro() {
  return (
    <section id="elektro" className="section-fade space-y-4 scroll-mt-28">
      <SectionGrid>
        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle>4. Elektro a komponenty</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGrid>
              <FormField id="inverterManufacturer" label="Výrobce střídače">
                <input id="inverterManufacturer" defaultValue="SOFAR SOLAR" className={inputClassName()} />
              </FormField>
              <FormField id="inverterType" label="Typ střídače" className="sm:col-span-2">
                <input id="inverterType" defaultValue="HYD 8KTL-3PH" className={inputClassName()} />
              </FormField>
              <FormField id="inverterPhases" label="Počet fází">
                <select id="inverterPhases" className={selectClassName()} defaultValue="3f">
                  <option value="1f">1f</option>
                  <option value="3f">3f</option>
                </select>
              </FormField>
              <FormField id="inverterCount" label="Počet střídačů">
                <input id="inverterCount" type="number" min={1} defaultValue={1} className={inputClassName()} />
              </FormField>
              <FormField id="inverterSvt" label="SVT střídače">
                <input id="inverterSvt" defaultValue="SVT30838" className={inputClassName()} />
              </FormField>
              <FormField id="batteryType" label="Typ baterie">
                <input id="batteryType" defaultValue="LiFePO4 Renac TB-H1-11.23" className={inputClassName()} />
              </FormField>
              <FormField id="batteryCapacity" label="Kapacita baterie [kWh]">
                <input id="batteryCapacity" type="number" step={0.01} defaultValue={11.23} className={inputClassName()} />
              </FormField>
              <FormField id="batteryCurrent" label="Vybíjecí proud baterie [A]">
                <input id="batteryCurrent" type="number" defaultValue={25} className={inputClassName()} />
              </FormField>
              <FormField id="meterType" label="Smartmeter / 4Q elektroměr">
                <input id="meterType" defaultValue="SOFAR SOLAR DTSU666 smartmeter 3f" className={inputClassName()} />
              </FormField>
              <FormField id="utilityMeter" label="Distribuční elektroměr">
                <input id="utilityMeter" defaultValue="Obousměrný elektroměr" className={inputClassName()} />
              </FormField>
              <FormField id="mainBoard" label="Hlavní rozvaděč">
                <input id="mainBoard" defaultValue="Hlavní domovní rozvaděč RH" className={inputClassName()} />
              </FormField>
              <FormField id="meterBoard" label="Elektroměrový rozvaděč">
                <input id="meterBoard" defaultValue="Elektroměrový rozvaděč RE" className={inputClassName()} />
              </FormField>
              <FormField id="wallboxType" label="Wallbox">
                <input id="wallboxType" defaultValue="Joint JNT-EVC11 Series-EU" className={inputClassName()} />
              </FormField>
              <FormField id="wallboxPower" label="Výkon wallboxu [kW]">
                <input id="wallboxPower" type="number" step={0.1} defaultValue={11} className={inputClassName()} />
              </FormField>
              <FormField id="evPoints" label="Počet nabíjecích bodů">
                <input id="evPoints" type="number" step={1} defaultValue={2} className={inputClassName()} />
              </FormField>
              <FormField id="backupLabel" label="EPS / backup větev">
                <input id="backupLabel" defaultValue="EPS rozvaděč" className={inputClassName()} />
              </FormField>
              <FormField id="dcProtection" label="DC ochrany">
                <input id="dcProtection" defaultValue="Přepěťová ochrana SPD + DC odpojovač" className={inputClassName()} />
              </FormField>
              <FormField id="acProtection" label="AC ochrany">
                <input id="acProtection" defaultValue="Jistič + přepěťová ochrana SPD" className={inputClassName()} />
              </FormField>
              <FormField id="dcCable" label="DC kabel">
                <input id="dcCable" defaultValue="Solární kabel" className={inputClassName()} />
              </FormField>
              <FormField id="acCable" label="AC kabel">
                <input id="acCable" defaultValue="CYKY-J" className={inputClassName()} />
              </FormField>
              <FormField id="utpCable" label="Datové propojení">
                <input id="utpCable" defaultValue="UTP CAT 5E" className={inputClassName()} />
              </FormField>
              <div className="sm:col-span-2 lg:col-span-4">
                <p className="mb-2 text-sm font-medium">Volitelné prvky</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input id="hasBattery" type="checkbox" defaultChecked className="size-4 rounded border-input" />
                    Baterie
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input id="hasWallbox" type="checkbox" defaultChecked className="size-4 rounded border-input" />
                    Wallbox
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input id="hasBackup" type="checkbox" className="size-4 rounded border-input" />
                    EPS / backup
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input id="hasExportToGrid" type="checkbox" defaultChecked className="size-4 rounded border-input" />
                    Přetoky do DS
                  </label>
                </div>
              </div>
              <FormField id="routeDescription" label="Popis trasy pro E-02" className="sm:col-span-2 lg:col-span-4">
                <textarea
                  id="routeDescription"
                  defaultValue="Začíná fotovoltaickými panely na střeše objektu. DC kabely jsou zaústěny pod střechu do rozvodnice RDC a pokračují v liště do technické místnosti, kde je umístěna technologie FVE. Připojení na síť je v hlavním rozvaděči RH, kde je umístěn i smartmeter. Wallbox je umístěn v garáži objektu."
                  className={textareaClassName("min-h-[100px]")}
                />
              </FormField>
              <FormField id="protectionSettings" label="Nastavení ochran / poznámky do E-02" className="sm:col-span-2 lg:col-span-4">
                <textarea
                  id="protectionSettings"
                  defaultValue={`- Po odstávce se výrobna bude k DS připojovat automaticky nejdříve v okamžiku, kdy napětí i frekvence v distribuční soustavě bylo v předcházejících 20 minutách bez přerušení v hodnotách uvedených ve smlouvě o připojení, zajištěno funkcí střídače.
- Nastavení ochran dle PPDS a platných podmínek distributora.
- U,f ochrana je integrována ve střídači.
- Při výpadku napětí v DS zajišťuje střídač vlastní funkcí odpojení od DS a blokování opětného zapnutí do doby obnovení napětí i frekvence v DS.`}
                  className={textareaClassName("min-h-[120px]")}
                />
              </FormField>
              <FormField id="electricalNotes" label="Poznámky k elektro části" className="sm:col-span-2 lg:col-span-4">
                <textarea
                  id="electricalNotes"
                  defaultValue="Kabelové vedení stejnosměrného i střídavého proudu bude opatřeno přepěťovou ochranou. Způsob měření elektrické energie, napojení do distribuční sítě a nastavení ochran je nutno ověřit před realizací podle konkrétního zařízení a podmínek distributora."
                  className={textareaClassName("min-h-[100px]")}
                />
              </FormField>
            </FormGrid>
          </CardContent>
        </Card>
      </SectionGrid>
    </section>
  );
}
