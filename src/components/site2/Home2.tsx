import type { DemoEntry } from "@/lib/demo-entry";
import { Faq, FinalCta, Process } from "./sections/Closing";
import { Hero } from "./sections/Hero";
import { Work } from "./sections/Work";

/**
 * Domovská stránka nového webu.
 *
 * Rytmus nerobia karty, ale striedanie plôch: papier, papier, tmavá,
 * papier, tmavá. Každá sekcia má jednu myšlienku a jedno číslo — index
 * je tu preto, že poradie niečo znamená, nie ako ozdoba.
 */
export function Home2({ demo }: { demo: DemoEntry | null }) {
  return (
    <>
      <Hero demo={demo} />
      <Work />
      <Process />
      <Faq />
      <FinalCta />
    </>
  );
}
