import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import {
  installSiteAssistantGlobal,
  SITE_ASSISTANT_OPEN_EVENT,
} from "../../lib/site-assistant";
import type {
  AssistantPreset,
  OpenSiteAssistantOptions,
} from "../../types/assistant";
import { AssistantConversation } from "./AssistantConversation";
import { BubbleLogo } from "./BubbleLogo";
import { ToolCalculator } from "./ToolCalculator";
import { WidgetIcon } from "./WidgetIcon";

type WidgetMode = "assistant" | "calculator";
type SwipeDirection = "forward" | "backward";
type ActionAnimation = "reset" | "close" | null;
type SwipeStart = { x: number; y: number };

const isPreset = (value: string | undefined): value is AssistantPreset =>
  Boolean(value && ["calculator", "inquiry", "advisor", "booking"].includes(value));

const PANEL_EXIT_MS = 220;
const ACTION_ANIMATION_MS = 520;
const SWIPE_THRESHOLD_PX = 54;

const reducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isInteractiveSwipeTarget = (target: EventTarget | null): boolean =>
  target instanceof Element &&
  Boolean(
    target.closest(
      "button, a, input, textarea, select, summary, label, [role='button'], [contenteditable='true']",
    ),
  );

export function ChameleonWidget(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [mode, setMode] = useState<WidgetMode>("assistant");
  const [transitionDirection, setTransitionDirection] =
    useState<SwipeDirection>("forward");
  const [actionAnimating, setActionAnimating] =
    useState<ActionAnimation>(null);
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [preset, setPreset] = useState<AssistantPreset | null>(null);

  const panelRef = useRef<HTMLElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const assistantViewRef = useRef<HTMLDivElement>(null);
  const calculatorViewRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const actionTimerRef = useRef<number | null>(null);
  const tabSwipeStartRef = useRef<SwipeStart | null>(null);
  const bodySwipeStartRef = useRef<SwipeStart | null>(null);
  const openRef = useRef(false);
  const closingRef = useRef(false);

  const clearActionTimer = useCallback(() => {
    if (actionTimerRef.current !== null) {
      window.clearTimeout(actionTimerRef.current);
      actionTimerRef.current = null;
    }
  }, []);

  const animateAction = useCallback(
    (action: Exclude<ActionAnimation, null>) => {
      clearActionTimer();
      setActionAnimating(action);
      if (reducedMotion()) {
        setActionAnimating(null);
        return;
      }
      actionTimerRef.current = window.setTimeout(() => {
        actionTimerRef.current = null;
        setActionAnimating(null);
      }, ACTION_ANIMATION_MS);
    },
    [clearActionTimer],
  );

  const close = useCallback(() => {
    if (!openRef.current || closingRef.current) return;
    closingRef.current = true;
    animateAction("close");
    setIsClosing(true);

    const finish = () => {
      closeTimerRef.current = null;
      openRef.current = false;
      closingRef.current = false;
      setIsOpen(false);
      setIsClosing(false);
      launcherRef.current?.focus({ preventScroll: true });
    };

    if (reducedMotion()) {
      finish();
      return;
    }
    closeTimerRef.current = window.setTimeout(finish, PANEL_EXIT_MS);
  }, [animateAction]);

  useFocusTrap(panelRef, isOpen && !isClosing, close);

  const switchMode = useCallback(
    (nextMode: WidgetMode) => {
      if (nextMode === mode) return;
      setTransitionDirection(nextMode === "calculator" ? "forward" : "backward");
      setMode(nextMode);
    },
    [mode],
  );

  const open = useCallback(
    (nextMode: WidgetMode, nextPreset: AssistantPreset | null = null) => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      openRef.current = true;
      closingRef.current = false;
      setTransitionDirection(nextMode === "calculator" ? "forward" : "backward");
      setMode(nextMode);
      setPreset(nextPreset);
      setResetToken((value) => value + 1);
      setTeaserVisible(false);
      setHasOpened(true);
      setIsClosing(false);
      setIsOpen(true);
    },
    [],
  );

  const beginSwipe = (
    event: ReactPointerEvent<HTMLElement>,
    ref: { current: SwipeStart | null },
    allowInteractive: boolean,
  ) => {
    if (!allowInteractive && isInteractiveSwipeTarget(event.target)) return;
    ref.current = { x: event.clientX, y: event.clientY };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is optional; the gesture still works without it.
    }
  };

  const finishSwipe = (
    event: ReactPointerEvent<HTMLElement>,
    ref: { current: SwipeStart | null },
  ) => {
    const start = ref.current;
    ref.current = null;
    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (
      Math.abs(dx) < SWIPE_THRESHOLD_PX ||
      Math.abs(dx) <= Math.abs(dy) * 1.15
    ) {
      return;
    }

    if (mode === "assistant" && dx < 0) {
      switchMode("calculator");
    } else if (mode === "calculator" && dx > 0) {
      switchMode("assistant");
    }
  };

  useEffect(() => installSiteAssistantGlobal(), []);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const options = (event as CustomEvent<OpenSiteAssistantOptions>).detail;
      const directPreset =
        options?.preset ?? (isPreset(options?.entry) ? options.entry : undefined);
      const calculatorEntry =
        options?.entry === "builder" ||
        options?.entry === "calculator" ||
        Boolean(directPreset);
      open(calculatorEntry ? "calculator" : "assistant", directPreset ?? null);
    };

    window.addEventListener(SITE_ASSISTANT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(SITE_ASSISTANT_OPEN_EVENT, onOpen);
  }, [open]);

  useEffect(() => {
    if (teaserDismissed || isOpen) return;
    const timer = window.setTimeout(() => setTeaserVisible(true), 1_100);
    return () => window.clearTimeout(timer);
  }, [isOpen, teaserDismissed]);

  useEffect(() => {
    if (!isOpen || !window.matchMedia("(max-width: 520px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    panelRef.current?.toggleAttribute("inert", isClosing || !isOpen);
  }, [hasOpened, isClosing, isOpen]);

  useLayoutEffect(() => {
    assistantViewRef.current?.toggleAttribute("inert", mode !== "assistant");
    calculatorViewRef.current?.toggleAttribute("inert", mode !== "calculator");
  }, [hasOpened, mode]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
      clearActionTimer();
    },
    [clearActionTimer],
  );

  const reset = () => {
    animateAction("reset");
    setPreset(null);
    setResetToken((value) => value + 1);
  };

  return (
    <div className="cw-widget">
      {teaserVisible && !isOpen ? (
        <aside className="cw-teaser" data-testid="widget-teaser">
          <button
            type="button"
            className="cw-teaser__close"
            aria-label="Zavrieť tip"
            onClick={() => {
              setTeaserVisible(false);
              setTeaserDismissed(true);
            }}
          >
            ×
          </button>
          <button
            type="button"
            className="cw-teaser__content"
            onClick={() => open("calculator")}
          >
            <strong>Vyskladajte si asistenta na počkanie</strong>
            <span className="cw-teaser__copy">
              Otvorte <b>konfigurátor</b> — návrh riešenia máte do minúty.{" "}
              <b>AI asistent</b> poradí ďalší krok.
            </span>
          </button>
        </aside>
      ) : null}

      <button
        id="chameleon-widget-launcher"
        data-testid="widget-launcher"
        className="cw-launcher"
        ref={launcherRef}
        type="button"
        aria-label="Otvoriť Môj Chatbot"
        aria-expanded={isOpen}
        aria-controls="chameleon-widget-panel"
        onClick={() => open(mode, preset)}
      >
        <BubbleLogo size="launcher" />
        <span className="cw-launcher__online" aria-hidden="true" />
      </button>

      {hasOpened ? (
        <section
          id="chameleon-widget-panel"
          className="cw-panel"
          data-mode={mode}
          data-direction={transitionDirection}
          data-state={isClosing ? "closing" : "open"}
          hidden={!isOpen}
          aria-hidden={isClosing || !isOpen}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chameleon-widget-title"
          tabIndex={-1}
        >
          <header className="cw-panel-head">
            <span className="cw-panel-head__mascot" aria-hidden="true">
              <BubbleLogo size="header" />
            </span>
            <div className="cw-panel-head__title">
              <b id="chameleon-widget-title">Môj Chatbot</b>
              <span className="cw-panel-head__meta">
                <i /> {mode === "assistant" ? "AI asistent" : "Konfigurátor"} ·
                online
              </span>
            </div>
            <div className="cw-panel-head__actions">
              <button
                type="button"
                data-testid="widget-reset"
                data-action-animating={
                  actionAnimating === "reset" ? "reset" : undefined
                }
                aria-label="Resetovať aktuálnu obrazovku"
                title="Resetovať"
                onClick={reset}
              >
                <WidgetIcon name="reset" />
              </button>
              <button
                type="button"
                className="cw-panel-head__close"
                data-testid="widget-close"
                data-action-animating={
                  actionAnimating === "close" ? "close" : undefined
                }
                aria-label="Zavrieť asistenta"
                title="Zavrieť"
                onClick={close}
              >
                <WidgetIcon name="close" />
              </button>
            </div>
            <span className="cw-panel-head__beam" aria-hidden="true" />
          </header>

          <nav
            className="cw-tabs"
            aria-label="Režim asistenta"
            data-mode={mode}
            onPointerDown={(event) =>
              beginSwipe(event, tabSwipeStartRef, true)
            }
            onPointerUp={(event) => finishSwipe(event, tabSwipeStartRef)}
            onPointerCancel={() => {
              tabSwipeStartRef.current = null;
            }}
          >
            <span className="cw-tabs__glass" aria-hidden="true" />
            <button
              type="button"
              data-testid="tab-calculator"
              data-active={mode === "calculator"}
              aria-current={mode === "calculator" ? "page" : undefined}
              onClick={() => switchMode("calculator")}
            >
              <WidgetIcon name="calculator" /> Konfigurátor
            </button>
            <button
              type="button"
              data-testid="tab-assistant"
              data-active={mode === "assistant"}
              aria-current={mode === "assistant" ? "page" : undefined}
              onClick={() => switchMode("assistant")}
            >
              <WidgetIcon name="chat" /> AI asistent
            </button>
          </nav>

          <div
            className="cw-panel-body"
            data-mode={mode}
            data-direction={transitionDirection}
            onPointerDown={(event) =>
              beginSwipe(event, bodySwipeStartRef, false)
            }
            onPointerUp={(event) => finishSwipe(event, bodySwipeStartRef)}
            onPointerCancel={() => {
              bodySwipeStartRef.current = null;
            }}
          >
            <div
              className="cw-mode-view"
              ref={assistantViewRef}
              data-view="assistant"
              data-active={mode === "assistant"}
              aria-hidden={mode !== "assistant"}
            >
              <AssistantConversation
                resetToken={resetToken}
                onOpenCalculator={() => switchMode("calculator")}
              />
            </div>
            <div
              className="cw-mode-view"
              ref={calculatorViewRef}
              data-view="calculator"
              data-active={mode === "calculator"}
              aria-hidden={mode !== "calculator"}
            >
              <ToolCalculator
                resetToken={resetToken}
                initialPreset={preset}
                onOpenChat={() => switchMode("assistant")}
              />
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
