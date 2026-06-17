export const GA_MEASUREMENT_ID = "G-EM2KVT3F2Y";

/**
 * Send a Google Analytics 4 event via gtag.
 */
export function gtagEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

/**
 * Send a GA4 config (page_view) for SPA route changes.
 */
export function gtagPageView(
  pagePath: string,
  pageTitle?: string,
  pageLocation?: string
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: pageLocation || window.location.href,
    });
  }
}
