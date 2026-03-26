import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { inputClassName } from "@/lib/form-styles";

import { FormField, FormGrid, SectionGrid } from "./FormPrimitives";

export function SectionProjekt() {
  return (
    <section id="projekt" className="section-fade space-y-4 scroll-mt-28">
      <SectionGrid>
        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle>1. Projekt a investor</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGrid>
              <FormField id="projectNumber" label="Číslo projektu">
                <input id="projectNumber" className={inputClassName()} />
              </FormField>
              <FormField id="issueDate" label="Datum vypracování">
                <input id="issueDate" type="date" className={inputClassName()} />
              </FormField>
              <FormField id="docPurpose" label="Účel dokumentace">
                <input id="docPurpose" defaultValue="Projekt pro účely NZÚ" className={inputClassName()} />
              </FormField>
              <FormField id="investorName" label="Investor">
                <input id="investorName" className={inputClassName()} />
              </FormField>
              <FormField id="siteAddress" label="Místo stavby" className="sm:col-span-2 lg:col-span-2">
                <input id="siteAddress" className={inputClassName()} />
              </FormField>
              <FormField id="siteTown" label="Město / obec">
                <input id="siteTown" className={inputClassName()} />
              </FormField>
              <FormField id="cadastralArea" label="Katastrální území">
                <input id="cadastralArea" className={inputClassName()} />
              </FormField>
              <FormField id="parcelNumber" label="Číslo parcely">
                <input id="parcelNumber" className={inputClassName()} />
              </FormField>
              <FormField id="lvNumber" label="Číslo LV">
                <input id="lvNumber" className={inputClassName()} />
              </FormField>
              <FormField id="buildingType" label="Typ objektu">
                <input id="buildingType" defaultValue="Rodinný dům" className={inputClassName()} />
              </FormField>
              <FormField id="companyName" label="Zhotovitel / firma" className="sm:col-span-2">
                <input id="companyName" defaultValue="Schlieger s.r.o." className={inputClassName()} />
              </FormField>
              <FormField id="companyAddress" label="Adresa firmy" className="sm:col-span-2">
                <input
                  id="companyAddress"
                  defaultValue="U Nákladového nádraží 3265/10, 130 00 Praha"
                  className={inputClassName()}
                />
              </FormField>
              <FormField id="companyIc" label="IČ">
                <input id="companyIc" defaultValue="28787803" className={inputClassName()} />
              </FormField>
              <FormField id="companyEmail" label="E-mail">
                <input id="companyEmail" defaultValue="info@schlieger.cz" className={inputClassName()} />
              </FormField>
              <FormField id="companyPhone" label="Telefon">
                <input id="companyPhone" defaultValue="+420 566 440 008" className={inputClassName()} />
              </FormField>
              <FormField id="designerName" label="Zodpovědný projektant">
                <input id="designerName" defaultValue="Ing. Markéta Chrbolková" className={inputClassName()} />
              </FormField>
              <FormField id="designerCert" label="Č. certifikátu / oprávnění">
                <input id="designerCert" defaultValue="26-014-H" className={inputClassName()} />
              </FormField>
              <FormField id="assistantName" label="Spolupracoval">
                <input id="assistantName" defaultValue="Martin Nový" className={inputClassName()} />
              </FormField>
              <FormField id="assistantEmail" label="E-mail spolupracoval">
                <input id="assistantEmail" defaultValue="martin.novy@schlieger.cz" className={inputClassName()} />
              </FormField>
              <FormField id="customHeaderNote" label="Doplňující poznámka do hlavičky / titulu" className="sm:col-span-2 lg:col-span-4">
                <input
                  id="customHeaderNote"
                  defaultValue="FVE s ukládáním přebytků do baterií a nabíjecí stanicí"
                  className={inputClassName()}
                />
              </FormField>
            </FormGrid>
          </CardContent>
        </Card>
      </SectionGrid>
    </section>
  );
}
