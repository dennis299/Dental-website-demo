import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { MobileCallBanner } from "@/components/MobileCallBanner";
import { BookingProvider } from "@/components/services/BookingProvider";
import { PageTransition } from "@/components/PageTransition";
import { useEffect } from "react";
import { CookieBanner } from "@/components/CookieBanner";

const ScrollToTopOnNav = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
};

export const SiteLayout = () => {
  const location = useLocation();
  return (
    <BookingProvider>
      <ScrollToTopOnNav />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
        <Footer />
        <MobileCallBanner />
        <ScrollToTop />
        <CookieBanner />
      </div>
    </BookingProvider>
  );
};
