import { useSyncExternalStore } from "react";
import { isIntroReady, isIntroReadyOnServer, subscribeIntro } from "@/lib/brand-intro";

/**
 * `true`, keď sa opona značkového úvodu zdvihla — alebo keď sa vôbec
 * nehrala (druhá stránka v relácii, vypnuté animácie). Hero na to čaká,
 * aby sa nadpis neodkrýval pod bielou plochou.
 */
export function useIntroReady(): boolean {
  return useSyncExternalStore(subscribeIntro, isIntroReady, isIntroReadyOnServer);
}
