export const GA_MEASUREMENT_ID = "G-EM2KVT3F2Y";

function getGtag(): typeof window.gtag | undefined {
  return typeof window !== "undefined"
    ? (window as any).gtag
    : undefined;
}

/**
 * Send a Google Analytics 4 event via gtag.
 */
export function gtagEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  const gtag = getGtag();
  if (gtag) gtag("event", eventName, params);
}

/**
 * Send a GA4 config (page_view) for SPA route changes.
 */
export function gtagPageView(
  pagePath: string,
  pageTitle?: string,
  pageLocation?: string
) {
  const gtag = getGtag();
  if (gtag) {
    gtag("config", GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: pageLocation || window.location.href,
    });
  }
}

