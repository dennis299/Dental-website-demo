import { useCallback, useEffect, useRef, useState } from "react";
import { SarahNotification } from "./SarahNotification";
import { EngagementModal } from "./EngagementModal";
import { ConcernCheckerModal } from "@/components/concern-checker/ConcernCheckerModal";

const MESSAGES = [
  "Hi! Need help choosing the right treatment?",
  "Have a dental question? I'm here to help.",
  "Want to book in under 60 seconds?",
];

const FIRST_NOTIFICATION_DELAY = 7000;
const REENGAGE_DWELL_MS = 45000;
const REENGAGE_SCROLL = 0.45;
const COOLDOWN_MS = 90_000;
const MAX_TOASTS = 3;
const SECTION_VIEW_TRIGGER = 3;

const MODAL_DWELL_MS = 25000;
const MODAL_SCROLL = 0.4;
const MODAL_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const sarahBooked = () =>
  typeof window !== "undefined" && localStorage.getItem("sarah_booked") === "1";
const sarahOpen = () =>
  typeof document !== "undefined" && !!document.querySelector('[aria-label="Chat with Sarah"]');

const dispatchOpenSarah = (prefill?: string) => {
  window.dispatchEvent(new CustomEvent("open-sarah", { detail: prefill ? { prefill } : undefined }));
};

if (typeof window !== "undefined") {
  const params = new URLSearchParams(window.location.search);
  if (params.get("reset-engagement") === "1") {
    try {
      localStorage.removeItem("sarah_booked");
      localStorage.removeItem("engagement_modal_shown_at");
    } catch { /* ignore */ }
  }
}

export const EngagementOrchestrator = () => {
  const [notifMsg, setNotifMsg] = useState<string | null>(null);
  const [notifCount, setNotifCount] = useState(0);
  const [lastNotifAt, setLastNotifAt] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [checkerOpen, setCheckerOpen] = useState(false);

  const startedAt = useRef(Date.now());
  const sectionViews = useRef(new Set<Element>());
  const lastDismissAt = useRef(0);

  const canShowNotif = useCallback(() => {
    if (sarahBooked() || sarahOpen()) return false;
    if (notifCount >= MAX_TOASTS) return false;
    if (Date.now() - lastNotifAt < COOLDOWN_MS) return false;
    return true;
  }, [notifCount, lastNotifAt]);

  const showNotif = useCallback(() => {
    if (!canShowNotif()) return;
    const msg = MESSAGES[notifCount % MESSAGES.length];
    setNotifMsg(msg);
    setNotifCount((c) => c + 1);
    setLastNotifAt(Date.now());
  }, [canShowNotif, notifCount]);

  // First notification after 7s
  useEffect(() => {
    const t = window.setTimeout(showNotif, FIRST_NOTIFICATION_DELAY);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-engagement triggers
  useEffect(() => {
    let dwellTimer: number | undefined;
    const scheduleDwell = () => {
      window.clearTimeout(dwellTimer);
      dwellTimer = window.setTimeout(() => {
        showNotif();
      }, REENGAGE_DWELL_MS);
    };
    scheduleDwell();

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = window.scrollY / max;
      if (pct >= REENGAGE_SCROLL) showNotif();
      if (pct >= MODAL_SCROLL) tryShowModal();
    };

    const onMouseOut = (e: MouseEvent) => {
      // Desktop exit intent
      if (e.clientY < 5 && !e.relatedTarget) showNotif();
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) sectionViews.current.add(entry.target);
        });
        if (sectionViews.current.size >= SECTION_VIEW_TRIGGER) showNotif();
      },
      { threshold: 0.4 },
    );
    document.querySelectorAll("section").forEach((s) => sectionObserver.observe(s));

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.clearTimeout(dwellTimer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
      sectionObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotif]);

  // Modal logic
  const tryShowModal = useCallback(() => {
    if (sarahBooked() || sarahOpen() || modalOpen || checkerOpen) return;
    const last = Number(localStorage.getItem("engagement_modal_shown_at") || "0");
    if (Date.now() - last < MODAL_COOLDOWN_MS) return;
    localStorage.setItem("engagement_modal_shown_at", String(Date.now()));
    setModalOpen(true);
  }, [modalOpen, checkerOpen]);

  useEffect(() => {
    const t = window.setTimeout(tryShowModal, MODAL_DWELL_MS);
    return () => window.clearTimeout(t);
  }, [tryShowModal]);

  const handleNotifOpen = () => {
    setNotifMsg(null);
    dispatchOpenSarah();
  };
  const handleNotifDismiss = () => {
    setNotifMsg(null);
    lastDismissAt.current = Date.now();
  };

  const handleChatFromModal = () => {
    dispatchOpenSarah();
  };

  const handleStartAssessment = () => setCheckerOpen(true);

  const handleBookWithSummary = (summary: string) => {
    dispatchOpenSarah(summary);
  };

  return (
    <>
      {notifMsg && (
        <SarahNotification
          key={notifMsg + notifCount}
          message={notifMsg}
          onOpen={handleNotifOpen}
          onDismiss={handleNotifDismiss}
        />
      )}
      <EngagementModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onChatWithSarah={handleChatFromModal}
        onStartAssessment={handleStartAssessment}
      />
      <ConcernCheckerModal
        open={checkerOpen}
        onOpenChange={setCheckerOpen}
        onBookWithSummary={handleBookWithSummary}
        onChatWithSummary={handleBookWithSummary}
      />
    </>
  );
};
