import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const KEY = "cookie_consent";

export const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (!saved) setShow(true);
    else if (saved === "declined") window.gtag?.("consent", "update", { analytics_storage: "denied" });
  }, []);

  const choose = (value: "accepted" | "declined") => {
    localStorage.setItem(KEY, value);
    window.gtag?.("consent", "update", {
      analytics_storage: value === "accepted" ? "granted" : "denied",
    });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 rounded-3xl border border-border bg-background p-5 shadow-elegant">
      <p className="text-sm text-foreground/80">
        We use cookies to understand how visitors use this site and improve it.{" "}
        <Link to="/cookies" className="underline underline-offset-4 hover:text-foreground">Cookie policy</Link>
      </p>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => choose("declined")} className="flex-1 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition">
          Decline
        </button>
        <button type="button" onClick={() => choose("accepted")} className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft">
          Accept
        </button>
      </div>
    </div>
  );
};
