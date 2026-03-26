import { SectionElektro } from "@/components/fve/SectionElektro";
import { SectionObjekt } from "@/components/fve/SectionObjekt";
import { SectionObrazky } from "@/components/fve/SectionObrazky";
import { SectionPanely } from "@/components/fve/SectionPanely";
import { SectionProjekt } from "@/components/fve/SectionProjekt";
import { SectionVstup } from "@/components/fve/SectionVstup";
import { SectionVystupy } from "@/components/fve/SectionVystupy";
import { SectionZmeny } from "@/components/fve/SectionZmeny";

export function FveAppRoot() {
  return (
    <div id="fve-app-root" className="space-y-10">
      <SectionVstup />
      <SectionProjekt />
      <SectionObjekt />
      <SectionPanely />
      <SectionElektro />
      <SectionObrazky />
      <SectionZmeny />
      <SectionVystupy />
    </div>
  );
}
