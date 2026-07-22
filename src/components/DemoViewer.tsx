import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { DemoPresentation, ProjectCategory } from "@/data/projects";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface DemoViewerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  category: ProjectCategory;
  accent: string;
  presentation: DemoPresentation;
  demoUrl: string | null;
}

const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  useFocusTrap(dialogRef, open, onClose);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setLoaded(false);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = previous;
      returnFocusRef.current?.focus?.();
    };
  }, [open, demoUrl]);

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
    <AnimatePresence>
      {open ? (
        <motion.div
          role="presentation"
          className="fixed inset-0 z-50 flex flex-col"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.22, ease: premiumEase }}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          style={{
            backgroundColor: "rgba(2, 13, 14, 0.88)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — interaktívna ukážka`}
            tabIndex={-1}
            className="flex min-h-0 flex-1 flex-col"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.975, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.985, y: 10 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.28, ease: premiumEase }}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 md:px-6"
              style={{
                backgroundColor: "var(--surface-raised)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                <div className="min-w-0">
                  <div
                    className="truncate text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {title}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {category}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="hidden text-xs sm:inline"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Interaktívna ukážka — údaje sa neodosielajú.
                </span>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={onClose}
                  className="rounded-md px-3 py-1.5 text-sm transition-colors"
                  style={{
                    backgroundColor: "var(--background-soft)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  Zavrieť
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-4 md:p-8">
              <motion.div
                className="relative mx-auto overflow-hidden rounded-xl"
                layout
                style={{
                  maxWidth,
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  minHeight: "60vh",
                }}
              >
                {demoUrl ? (
                  <>
                    <iframe
                      src={demoUrl}
                      title={title}
                      loading="lazy"
                      onLoad={() => setLoaded(true)}
                      className="min-h-[60vh] w-full"
                      style={{
                        border: 0,
                        display: "block",
                        height: "70vh",
                        opacity: loaded ? 1 : 0,
                        transition: reducedMotion ? "none" : "opacity 220ms ease",
                      }}
                    />
                    <AnimatePresence initial={false}>
                      {!loaded ? <DemoSkeleton reducedMotion={reducedMotion} /> : null}
                    </AnimatePresence>
                  </>
                ) : (
                  <DemoPlaceholder title={title} accent={accent} />
                )}
              </motion.div>
              <p
                className="mt-3 text-center text-xs sm:hidden"
                style={{ color: "var(--text-secondary)" }}
              >
                Interaktívna ukážka — údaje sa neodosielajú.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DemoSkeleton({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 grid place-items-center p-8"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.18 }}
      aria-label="Načítava sa ukážka"
      role="status"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <motion.div
        className="w-full max-w-md"
        animate={reducedMotion ? undefined : { opacity: [0.52, 0.9, 0.52] }}
        transition={
          reducedMotion
            ? undefined
            : { duration: 1.25, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
        }
      >
        <div
          className="h-3 w-24 rounded-full"
          style={{ backgroundColor: "var(--border-strong)" }}
        />
        <div className="mt-5 h-8 w-4/5 rounded-md" style={{ backgroundColor: "var(--border)" }} />
        <div
          className="mt-3 h-3 w-full rounded-full"
          style={{ backgroundColor: "var(--border)" }}
        />
        <div className="mt-2 h-3 w-3/4 rounded-full" style={{ backgroundColor: "var(--border)" }} />
        <div
          className="mt-8 h-40 w-full rounded-lg"
          style={{ border: "1px solid var(--border)", backgroundColor: "var(--background-soft)" }}
        />
      </motion.div>
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
