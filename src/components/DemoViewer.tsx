import { useEffect, useState } from "react";
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
  preferredDesktopWidth?: number;
}

export function DemoViewer({
  open,
  onClose,
  title,
  category,
  accent,
  presentation,
  demoUrl,
  preferredDesktopWidth = 1180,
}: DemoViewerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const frameMaxWidth =
    presentation === "fullscreen" ? "min(1440px, 96vw)" : `${preferredDesktopWidth}px`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ backgroundColor: "rgba(16,35,29,0.55)" }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 md:px-6"
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
                onClick={onClose}
                className="rounded-md px-3 py-1.5 text-sm transition-colors"
                style={{ backgroundColor: "var(--background-soft)", color: "var(--text-primary)" }}
              >
                Zavrieť
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 md:p-8">
            <div
              className="mx-auto h-full rounded-xl overflow-hidden"
              style={{
                maxWidth: frameMaxWidth,
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-dialog)",
                border: "1px solid var(--border)",
                minHeight: "70vh",
              }}
            >
              {open && demoUrl ? (
                <iframe
                  src={demoUrl}
                  title={title}
                  className="w-full h-full min-h-[70vh]"
                  style={{ border: 0, display: "block" }}
                />
              ) : (
                <DemoPlaceholder title={title} accent={accent} />
              )}
            </div>
            <p className="sm:hidden mt-3 text-center text-xs" style={{ color: "var(--surface)" }}>
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
    <div className="flex h-full min-h-[70vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <span
        className="inline-block h-3 w-3 rounded-full"
        style={{ backgroundColor: accent }}
      />
      <p className="text-sm max-w-md" style={{ color: "var(--text-secondary)" }}>
        Ukážka projektu {title} sa pripája neskôr. Na tomto mieste sa zobrazí funkčný nástroj.
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
