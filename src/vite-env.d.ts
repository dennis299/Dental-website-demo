/// <reference types="vite/client" />

interface Window {
  dataLayer: unknown[];
  gtag: (
    command: "config" | "event" | "js" | "set" | "consent",
    targetId: string | Date,
    config?: Record<string, string | number | boolean | undefined>
  ) => void;
}

