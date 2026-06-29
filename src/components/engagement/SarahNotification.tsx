import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import sarahAvatar from "@/assets/sarah-avatar.jpg";
import { gtagEvent } from "@/lib/analytics";

type Props = {
  message: string;
  onOpen: () => void;
  onDismiss: () => void;
  autoDismissMs?: number;
};

export const SarahNotification = ({
  message,
  onOpen,
  onDismiss,
  autoDismissMs = 9000,
}: Props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    gtagEvent("sarah_notification_shown", { message });
    const t = window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(onDismiss, 250);
    }, autoDismissMs);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    gtagEvent("sarah_notification_clicked", { message });
    setVisible(false);
    window.setTimeout(onOpen, 150);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
    window.setTimeout(onDismiss, 200);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="button"
          tabIndex={0}
          aria-label={`Sarah says: ${message}. Tap to open chat.`}
          onClick={handleClick}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed bottom-24 right-5 z-40 max-w-[280px] cursor-pointer select-none rounded-2xl bg-card text-card-foreground shadow-elegant border border-border p-3 pr-8 flex gap-2.5 items-start hover:-translate-y-0.5 transition-transform"
        >
          <img
            src={sarahAvatar}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0">
            <div className="text-xs font-semibold leading-tight flex items-center gap-1.5">
              <span>Sarah</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
            </div>
            <div className="text-sm leading-snug mt-0.5">{message}</div>
          </div>
          <button
            aria-label="Dismiss notification"
            onClick={handleClose}
            className="absolute top-1.5 right-1.5 rounded-full p-1 hover:bg-muted transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
