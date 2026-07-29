import { useSyncExternalStore } from "react";

const mediaQuery = "(prefers-reduced-motion: reduce)";
const narrowQuery = "(max-width: 760px)";

function makeStore(query: string) {
  return {
    subscribe(callback: () => void) {
      const list = window.matchMedia(query);
      list.addEventListener("change", callback);
      return () => list.removeEventListener("change", callback);
    },
    getSnapshot() {
      return window.matchMedia(query).matches;
    },
  };
}

const reducedStore = makeStore(mediaQuery);
const narrowStore = makeStore(narrowQuery);

function getServerSnapshot() {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(reducedStore.subscribe, reducedStore.getSnapshot, getServerSnapshot);
}

/**
 * Úzka obrazovka. Bočné posuny v 390 px stĺpci vyzerajú trhane,
 * preto sa na mobile odhaľuje smerom nahor a na kratšiu vzdialenosť.
 */
export function useNarrowViewport(): boolean {
  return useSyncExternalStore(narrowStore.subscribe, narrowStore.getSnapshot, getServerSnapshot);
}
