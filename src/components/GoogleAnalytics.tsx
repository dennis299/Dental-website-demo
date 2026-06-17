import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GA_MEASUREMENT_ID, gtagPageView } from "@/lib/analytics";

const SCROLL_THRESHOLDS = [25, 50, 75, 90];

/**
 * Google Analytics 4 tracking for React SPAs.
 * Handles:
 * - Page views on route changes
 * - Scroll depth milestones (25%, 50%, 75%, 90%)
 * - Outbound link clicks
 * - File downloads
 * - Site search queries
 */
export const GoogleAnalytics = () => {
  const location = useLocation();

  /* ── 1. Page-view tracking ── */
  useEffect(() => {
    gtagPageView(location.pathname + location.search, document.title);
  }, [location]);

  /* ── 2. Scroll-depth tracking ── */
  useEffect(() => {
    const triggered = new Set<number>();

    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const threshold of SCROLL_THRESHOLDS) {
        if (percent >= threshold && !triggered.has(threshold)) {
          triggered.add(threshold);
          if (typeof window.gtag === "function") {
            window.gtag("event", "scroll", {
              percent_scrolled: threshold,
              event_category: "engagement",
              event_label: `${threshold}%`,
              value: threshold,
            });
          }
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  /* ── 3. Outbound-click & download tracking ── */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Outbound links
      if (
        href.startsWith("http") &&
        !href.includes(window.location.hostname)
      ) {
        if (typeof window.gtag === "function") {
          window.gtag("event", "click", {
            event_category: "outbound",
            event_label: href,
            transport_type: "beacon",
          });
        }
        return;
      }

      // File downloads
      const downloadExts = [
        "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
        "zip", "rar", "7z", "csv", "txt",
      ];
      try {
        const url = new URL(href, window.location.href);
        const ext = url.pathname.split(".").pop()?.toLowerCase();
        if (ext && downloadExts.includes(ext)) {
          if (typeof window.gtag === "function") {
            window.gtag("event", "file_download", {
              file_name: url.pathname,
              file_extension: ext,
              link_url: href,
              event_category: "engagement",
            });
          }
        }
      } catch {
        /* invalid URL – ignore */
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  /* ── 4. Site-search tracking ── */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("s") || params.get("search") || params.get("q");
    if (query && typeof window.gtag === "function") {
      window.gtag("event", "search", {
        search_term: query,
        event_category: "engagement",
      });
    }
  }, [location.search]);

  return null;
};
