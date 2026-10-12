export const GA_MEASUREMENT_ID = "G-EM2KVT3F2Y";
export const CONSENT_KEY = "cookie_consent";

function getGtag(): typeof window.gtag | undefined {
  return typeof window !== "undefined" ? (window as any).gtag : undefined;
}

/** True only when the visitor has clicked Accept on the cookie banner. */
export function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

/** Send a GA4 event, but only after the visitor accepted cookies. */
export function gtagEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (!hasAnalyticsConsent()) return;
  const gtag = getGtag();
  if (gtag) gtag("event", eventName, params);
}

/** Send a GA4 page_view for the current page (consent-gated). */
export function gtagPageView(pagePath?: string, pageTitle?: string) {
  gtagEvent("page_view", {
    page_location: window.location.href,
    page_path: pagePath ?? window.location.pathname + window.location.search,
    page_title: pageTitle || document.title,
  });
}
