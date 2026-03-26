import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { inputClassName } from "@/lib/form-styles";

import { FormField, SectionGrid } from "./FormPrimitives";

export function SectionObrazky() {
  return (
    <section id="obrazky" className="section-fade space-y-4 scroll-mt-28">
      <SectionGrid>
        <Card className="md:col-span-6">
          <CardHeader>
            <CardTitle>5. Podklady a obrázky</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField id="logoUpload" label="Logo firmy / razítko (volitelné)">
              <input
                id="logoUpload"
                type="file"
                accept="image/*"
                className={inputClassName("py-1.5 file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm")}
              />
            </FormField>
            <FormField id="roofUpload" label="Podklad půdorysu střechy pro E-03 (volitelné)">
              <input
                id="roofUpload"
                type="file"
                accept="image/*"
                className={inputClassName("py-1.5 file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm")}
              />
            </FormField>
            <FormField id="mapUpload" label="Situační mapa / screenshot katastru pro E-03 (volitelné)">
              <input
                id="mapUpload"
                type="file"
                accept="image/*"
                className={inputClassName("py-1.5 file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm")}
              />
            </FormField>
            <CardDescription>
              Když obrázky nenahraješ, E-03 se vygeneruje s jednoduchým obdélníkovým půdorysem.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-white/30 bg-gradient-to-b from-white/40 to-transparent md:col-span-6 dark:from-zinc-900/40">
          <CardHeader>
            <CardTitle>Rychlý návod</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Vyplň projekt, objekt, panely a komponenty.</li>
              <li>U řad nastav počet panelů, azimut, sklon a pozici pro E-03.</li>
              <li>Klikni na „Přepočítat a připravit výstupy“.</li>
              <li>Otevři E-01, E-02 a E-03 do nového okna a ulož přes tisk do PDF.</li>
            </ol>
          </CardContent>
        </Card>
      </SectionGrid>
    </section>
  );
}
