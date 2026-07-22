import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { DemoPresentation, ProjectCategory } from "@/data/projects";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { premiumEase } from "@/components/site/motion-primitives";

export interface DemoViewerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  category: ProjectCategory;
  accent: string;
  presentation: DemoPresentation;
  demoUrl: string | null;
}

const liquidSpring = {
  type: "spring" as const,
  stiffness: 290,
  damping: 29,
  mass: 0.78,
};

export function DemoViewer({
  open,
  onClose,
  title,
  category,
  accent,
  presentation,
  demoUrl,
}: DemoViewerProps) {
  const dialogRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const titleId = useId();
  const descriptionId = useId();

  useFocusTrap(dialogRef, open, onClose);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => {
      closeBtnRef.current?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (open) setLoadedUrl(null);
  }, [demoUrl, open]);

  const maxWidth = presentation === "wide" ? "1180px" : "720px";
  const iframeLoading = Boolean(demoUrl && loadedUrl !== demoUrl);

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="demo-viewer"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: reducedMotion ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.24, ease: premiumEase }}
          style={{
            backgroundColor: "rgba(2, 12, 8, 0.9)",
            backdropFilter: reducedMotion ? undefined : "blur(10px)",
            WebkitBackdropFilter: reducedMotion ? undefined : "blur(10px)",
            paddingTop: "max(0.75rem, env(safe-area-inset-top))",
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
          }}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            className="flex w-full max-h-full min-h-0 flex-col overflow-hidden rounded-lg outline-none"
            style={{
              maxWidth,
              height: "min(82vh, 820px)",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border-strong, var(--border))",
            }}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.975, y: 8 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    opacity: { duration: 0.2, ease: premiumEase },
                    scale: liquidSpring,
                    y: liquidSpring,
                  }
            }
            onPointerDown={(event) => event.stopPropagation()}
          >
            <header
              className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4"
              style={{
                backgroundColor: "var(--surface-raised)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                <div className="min-w-0">
                  <h2
                    id={titleId}
                    className="truncate text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {title}
                  </h2>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p
                  id={descriptionId}
                  className="hidden text-xs sm:block"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Interaktívna ukážka — údaje sa neodosielajú.
                </p>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={onClose}
                  className="rounded-md px-3 py-1.5 text-sm transition-[color,border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    backgroundColor: "var(--background-soft)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    outlineColor: accent,
                  }}
                  aria-label={`Zavrieť ukážku ${title}`}
                >
                  Zavrieť
                </button>
              </div>
            </header>

            <div
              className="relative min-h-0 flex-1 overflow-hidden"
              style={{ backgroundColor: "var(--background-soft)" }}
              aria-busy={iframeLoading}
            >
              {demoUrl ? (
                <>
                  <iframe
                    key={demoUrl}
                    src={demoUrl}
                    title={`Interaktívna ukážka — ${title}`}
                    className="block h-full min-h-full w-full"
                    style={{ border: 0, backgroundColor: "var(--surface)" }}
                    onLoad={() => setLoadedUrl(demoUrl)}
                  />
                  <AnimatePresence initial={false}>
                    {iframeLoading ? (
                      <DemoSkeleton key={`loading-${demoUrl}`} reducedMotion={reducedMotion} />
                    ) : null}
                  </AnimatePresence>
                </>
              ) : (
                <DemoPlaceholder title={title} accent={accent} />
              )}
            </div>

            <p
              className="shrink-0 px-4 py-2.5 text-center text-xs sm:hidden"
              style={{ color: "var(--text-secondary)", borderTop: "1px solid var(--border)" }}
            >
              Interaktívna ukážka — údaje sa neodosielajú.
            </p>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DemoSkeleton({ reducedMotion }: { reducedMotion: boolean }) {
  const skeletonRows = ["74%", "91%", "62%", "84%"];

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-10 flex items-center justify-center p-6 md:p-10"
      style={{ backgroundColor: "var(--surface)" }}
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2, ease: premiumEase }}
    >
      <div className="w-full max-w-xl" aria-hidden="true">
        <div className="mb-8 flex items-center justify-between gap-4">
          <motion.span
            className="block h-2 w-24 rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
            animate={reducedMotion ? undefined : { opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} />
          <span
            className="text-[0.68rem] uppercase tracking-[0.18em]"
            style={{ color: "var(--text-secondary)" }}
          >
            Načítavam
          </span>
        </div>
        <div className="space-y-5" style={{ borderLeft: "2px solid var(--accent)" }}>
          {skeletonRows.map((width, index) => (
            <motion.span
              key={width}
              className="block h-px"
              style={{ width, backgroundColor: "var(--border-strong, var(--border))" }}
              animate={reducedMotion ? undefined : { opacity: [0.28, 0.68, 0.28] }}
              transition={{
                duration: 1.25,
                delay: index * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
      <span className="sr-only">Načítava sa interaktívna ukážka.</span>
    </motion.div>
  );
}

function DemoPlaceholder({ title, accent }: { title: string; accent: string }) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: accent }} />
      <p className="max-w-md text-sm" style={{ color: "var(--text-secondary)" }}>
        {title} — funkčná ukážka sa sem pripojí neskôr. Údaje sa neodosielajú.
      </p>
    </div>
  );
}

export function useDemoViewer() {
  const [open, setOpen] = useState(false);
  return {
    open,
    show: () => setOpen(true),
    hide: () => setOpen(false),
  };
}
