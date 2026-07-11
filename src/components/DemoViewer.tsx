import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { DemoPresentation, ProjectCategory } from "@/data/projects";

export interface DemoViewerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  category: ProjectCategory;
  accent: string;
  presentation: DemoPresentation;
  demoUrl: string | null;
}

export function DemoViewer({
  open,
  onClose,
  title,
  category,
  accent,
  presentation,
  demoUrl,
}: DemoViewerProps) {
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      returnFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  const maxWidth = presentation === "wide" ? "min(1180px, 96vw)" : "min(720px, 96vw)";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — interaktívna ukážka`}
          className="fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            backgroundColor: "rgba(16,35,29,0.55)",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 md:px-6"
            style={{ backgroundColor: "var(--surface-raised)", borderBottom: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: accent }}
              />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                  {title}
                </div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {category}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs" style={{ color: "var(--text-secondary)" }}>
                Interaktívna ukážka — údaje sa neodosielajú.
              </span>
              <button
                ref={closeBtnRef}
                onClick={onClose}
                className="rounded-md px-3 py-1.5 text-sm"
                style={{ backgroundColor: "var(--background-soft)", color: "var(--text-primary)" }}
              >
                Zavrieť
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 md:p-8">
            <div
              className="mx-auto rounded-xl overflow-hidden"
              style={{
                maxWidth,
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-dialog)",
                border: "1px solid var(--border)",
                minHeight: "60vh",
              }}
            >
              {demoUrl ? (
                <iframe
                  src={demoUrl}
                  title={title}
                  className="w-full min-h-[60vh]"
                  style={{ border: 0, display: "block", height: "70vh" }}
                />
              ) : (
                <DemoPlaceholder title={title} accent={accent} />
              )}
            </div>
            <p
              className="sm:hidden mt-3 text-center text-xs"
              style={{ color: "color-mix(in oklab, var(--surface) 90%, transparent)" }}
            >
              Interaktívna ukážka — údaje sa neodosielajú.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DemoPlaceholder({ title, accent }: { title: string; accent: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: accent }} />
      <p className="text-sm max-w-md" style={{ color: "var(--text-secondary)" }}>
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
