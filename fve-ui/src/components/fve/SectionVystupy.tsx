import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { SectionGrid } from "./FormPrimitives";

export function SectionVystupy() {
  return (
    <section id="vystupy" className="section-fade space-y-4 scroll-mt-28 pb-16">
      <SectionGrid>
        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle>7. Výstupy a export</CardTitle>
            <CardDescription>HTML výstupy se otevřou v novém okně; uložení přes tisk do PDF.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-wrap gap-2">
              <Button type="button" data-doc="e01">
                Otevřít E-01
              </Button>
              <Button type="button" data-doc="e02">
                Otevřít E-02
              </Button>
              <Button type="button" data-doc="e03">
                Otevřít E-03
              </Button>
              <Button type="button" variant="outline" data-download="e01">
                Stáhnout E-01 HTML
              </Button>
              <Button type="button" variant="outline" data-download="e02">
                Stáhnout E-02 HTML
              </Button>
              <Button type="button" variant="outline" data-download="e03">
                Stáhnout E-03 HTML
              </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold">Prompt pro ChatGPT</h3>
                <div
                  id="promptBox"
                  className="min-h-[160px] rounded-2xl border border-border bg-muted/30 p-4 text-sm leading-relaxed text-foreground"
                />
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold">Co aplikace generuje</h3>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-2 pr-2 font-medium">Dokument</th>
                      <th className="py-2 font-medium">Obsah</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/80">
                      <td className="py-2 pr-2 align-top font-medium text-foreground">E-01</td>
                      <td className="py-2">
                        Draft technické zprávy s krycím listem, identifikačními údaji a standardními kapitolami.
                      </td>
                    </tr>
                    <tr className="border-b border-border/80">
                      <td className="py-2 pr-2 align-top font-medium text-foreground">E-02</td>
                      <td className="py-2">
                        Jednopolové schéma zapojení FVE jako SVG; mění se stringy, baterie, wallbox, EPS i 1f/3f.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-2 align-top font-medium text-foreground">E-03</td>
                      <td className="py-2">
                        Zákres FV modulů do půdorysu střechy, legenda, situační mapka a titulkové pole.
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-4 text-xs text-muted-foreground">
                  Výstupy jsou drafty podle formuláře. Finální kontrola komponent a souladu s normami je potřeba.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </SectionGrid>
    </section>
  );
}
