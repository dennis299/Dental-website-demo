import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import sarahAvatar from "@/assets/sarah-avatar.jpg";
import invisalignImg from "@/assets/invisalign.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  COPY,
  CLINIC,
  FAQ_CATEGORIES,
  FAQ_TREE,
  INVISALIGN_STEPS,
  INVISALIGN_WHY,
  TREATMENT_INFO,
  TREATMENT_MAP,
  TREATMENT_OPTIONS,
  detectIntent,
  getTimeSlots,
  type FaqCategoryKey,
  type TreatmentKey,
} from "./script";

type Step =
  | "menu"
  | "faq_category"
  | "faq_answer"
  | "ask_email"
  | "ask_otp"
  | "ask_name"
  | "ask_treatment"
  | "treatment_info"
  | "ask_phone"
  | "ask_date"
  | "ask_time"
  | "ask_notes"
  | "confirm"
  | "submitting"
  | "done"
  // Returning patient flows
  | "returning_menu"
  | "reschedule_date"
  | "reschedule_time"
  | "reschedule_confirm"
  | "cancel_confirm"
  | "rescheduled"
  | "cancelled"
  | "question_open"
  | "error";

type Msg = {
  id: string;
  from: "bot" | "user";
  text: string;
  image?: string;
};

const uid = () => Math.random().toString(36).slice(2);
const delay = () => 600 + Math.random() * 500;
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isPhone = (v: string) => v.replace(/\D/g, "").length >= 7;
const isOtp = (v: string) => /^\d{6}$/.test(v.trim());

const formatWhen = (date: string, time: string) => {
  try {
    const d = new Date(`${date}T${time}:00`);
    return d.toLocaleString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return `${date} ${time}`;
  }
};

const formatISOWhen = (iso: string) => {
  try {
    return new Date(iso).toLocaleString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const addDaysISO = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const nextNonSundayISO = (startOffset: number) => {
  for (let i = startOffset; i < startOffset + 7; i++) {
    const iso = addDaysISO(i);
    if (new Date(`${iso}T00:00:00`).getDay() !== 0) return iso;
  }
  return addDaysISO(startOffset);
};
const minBookingISO = () => {
  // Lazy import-safe: getTimeSlots imported at top
  return getTimeSlots(todayISO()).length > 0 ? todayISO() : nextNonSundayISO(1);
};

type Data = {
  email: string;
  name: string;
  treatment?: TreatmentKey;
  phone?: string;
  date?: string;
  time?: string;
  notes?: string;
};

type ExistingBooking = {
  treatment: string | null;
  whenISO: string;
};

export const SarahChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState<Step>("ask_email");
  const [input, setInput] = useState("");
  const [data, setData] = useState<Data>({ email: "", name: "" });
  const [existing, setExisting] = useState<ExistingBooking | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const greetedRef = useRef(false);

  useEffect(() => {
    const COOLDOWN_MS = 20_000;
    const SCROLL_THRESHOLD = 0.25;

    const lastDismissed = () =>
      Number(sessionStorage.getItem("sarah_last_dismissed_at") || "0");

    const openExternally = () => {
      sessionStorage.removeItem("sarah_last_dismissed_at");
      setOpen(true);
    };
    window.addEventListener("open-sarah", openExternally);

    const tryOpen = () => {
      if (Date.now() - lastDismissed() < COOLDOWN_MS) return;
      setOpen((o) => o || true);
    };

    const timer = setTimeout(() => {
      if (!lastDismissed()) tryOpen();
    }, 6000);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_THRESHOLD) tryOpen();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("open-sarah", openExternally);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open && !greetedRef.current) {
      greetedRef.current = true;
      sendBot(COPY.greetingAskEmail);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (
      open &&
      (step === "ask_email" ||
        step === "ask_otp" ||
        step === "ask_name" ||
        step === "ask_phone" ||
        step === "ask_notes" ||
        step === "question_open")
    ) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, step]);

  const sendBot = async (text: string, image?: string) => {
    setTyping(true);
    await new Promise((r) => setTimeout(r, delay()));
    setTyping(false);
    setMessages((m) => [...m, { id: uid(), from: "bot", text, image }]);
  };

  const sendUser = (text: string) => {
    setMessages((m) => [...m, { id: uid(), from: "user", text }]);
  };

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("sarah_last_dismissed_at", String(Date.now()));
  };

  const resetChat = async () => {
    setData({ email: "", name: "" });
    setExisting(null);
    setSessionToken(null);
    setMessages([]);
    setStep("ask_email");
    greetedRef.current = false;
    await sendBot(COPY.greetingAskEmail);
    greetedRef.current = true;
  };

  // Ask the server to email a 6-digit verification code. Server is
  // intentionally vague about whether the address belongs to a patient,
  // so we always advance to the OTP step.
  const requestOtp = async (email: string): Promise<boolean> => {
    const { error } = await supabase.functions.invoke("patient-actions", {
      body: { action: "request_otp", email },
    });
    return !error;
  };

  // Submit the OTP. On success the server returns patient state (if any)
  // plus a short-lived session token used for subsequent mutations.
  const verifyOtp = async (email: string, otp: string) => {
    const { data: res, error } = await supabase.functions.invoke("patient-actions", {
      body: { action: "lookup", email, otp },
    });
    if (error) return { ok: false as const, status: (error as any)?.context?.status };
    return {
      ok: true as const,
      payload: res as {
        found: boolean;
        name?: string;
        has_active_booking?: boolean;
        next_appointment_at?: string;
        next_treatment?: string | null;
        session_token: string;
      },
    };
  };

  const handleTextSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    if (!v && step !== "ask_notes") return;
    setInput("");

    if (step === "ask_email") {
      sendUser(v);
      if (!isEmail(v)) {
        await sendBot(COPY.invalidEmail);
        return;
      }
      setData((d) => ({ ...d, email: v }));
      const ok = await requestOtp(v);
      if (!ok) {
        await sendBot(COPY.errorRetry);
        return;
      }
      setStep("ask_otp");
      await sendBot(COPY.otpSent(v));
    } else if (step === "ask_otp") {
      sendUser(v.replace(/\d/g, "•"));
      if (!isOtp(v)) {
        await sendBot(COPY.invalidOtp);
        return;
      }
      const result = await verifyOtp(data.email, v);
      if (!result.ok || !result.payload) {
        await sendBot(COPY.invalidOtp);
        return;
      }
      const res = result.payload;
      setSessionToken(res.session_token);
      if (res.found) {
        setData((d) => ({ ...d, name: res.name ?? "" }));
        if (res.has_active_booking && res.next_appointment_at) {
          setExisting({
            treatment: res.next_treatment ?? null,
            whenISO: res.next_appointment_at,
          });
          setStep("returning_menu");
          await sendBot(
            COPY.welcomeBackBooked(
              res.name ?? "there",
              formatISOWhen(res.next_appointment_at),
              res.next_treatment ?? "your appointment",
            ),
          );
        } else {
          setStep("ask_treatment");
          await sendBot(COPY.welcomeBackNoBooking(res.name ?? "there"));
        }
      } else {
        setStep("ask_name");
        await sendBot(COPY.newPatientAfterOtp);
        await sendBot(COPY.askName);
      }
    } else if (step === "ask_name") {
      if (v.length < 2) {
        sendUser(v);
        await sendBot(COPY.invalidName);
        return;
      }
      const name = v.split(/\s+/)[0].replace(/[^\p{L}'-]/gu, "");
      sendUser(name);
      setData((d) => ({ ...d, name }));
      setStep("ask_treatment");
      await sendBot(COPY.niceToMeet(name));
    } else if (step === "ask_phone") {
      sendUser(v);
      if (!isPhone(v)) {
        await sendBot(COPY.invalidPhone);
        return;
      }
      setData((d) => ({ ...d, phone: v }));
      setStep("ask_date");
      await sendBot(COPY.askDate);
    } else if (step === "ask_notes") {
      sendUser(v || "(no notes)");
      setData((d) => ({ ...d, notes: v || undefined }));
      await goToConfirm({ ...data, notes: v || undefined });
    } else if (step === "question_open") {
      sendUser(v);
      await sendBot(
        "Thanks — I've passed that on to the team and they'll follow up by email shortly. Anything else I can help with?",
      );
    }
  };

  const resendOtp = async () => {
    sendUser("Resend code");
    const ok = await requestOtp(data.email);
    await sendBot(ok ? COPY.otpResent : COPY.errorRetry);
  };

  const goToConfirm = async (d: Data) => {
    setStep("confirm");
    const when = formatWhen(d.date!, d.time!);
    await sendBot(
      COPY.confirm({
        name: d.name,
        treatment: d.treatment ?? "General Consultation",
        email: d.email,
        phone: d.phone ?? "",
        when,
      }),
    );
  };

  const pickTreatment = async (t: TreatmentKey) => {
    sendUser(t);
    setData((d) => ({ ...d, treatment: t }));
    setStep("treatment_info");
    if (t === "Invisalign") {
      await sendBot(TREATMENT_INFO[t], invisalignImg);
      await sendBot(INVISALIGN_WHY);
      await sendBot(INVISALIGN_STEPS);
    } else {
      await sendBot(TREATMENT_INFO[t]);
    }
  };

  const goBook = async () => {
    sendUser(data.treatment === "Invisalign" ? "Book my consultation" : "Book with me");
    // Returning patients already have phone; skip to date
    if (data.phone && isPhone(data.phone)) {
      setStep("ask_date");
      await sendBot(COPY.askDate);
    } else {
      setStep("ask_phone");
      await sendBot(COPY.askPhone(data.name));
    }
  };

  const viewResults = () => {
    sendUser("View Before & After");
    handleClose();
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const pickDate = async (date: string) => {
    if (date < todayISO()) {
      await sendBot(COPY.invalidDate);
      return;
    }
    const d = new Date(`${date}T00:00:00`);
    const lastText = messages[messages.length - 1]?.text;
    if (d.getDay() === 0) {
      if (lastText !== COPY.closedSunday) await sendBot(COPY.closedSunday);
      return;
    }
    const slots = getTimeSlots(date);
    if (slots.length === 0) {
      if (lastText !== COPY.noSlotsToday) await sendBot(COPY.noSlotsToday);
      return;
    }
    const pretty = d.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    sendUser(pretty);
    setData((dd) => ({ ...dd, date }));
    setStep("ask_time");
    await sendBot(COPY.askTime);
  };


  const pickTime = async (time: string) => {
    sendUser(time);
    setData((d) => ({ ...d, time }));
    setStep("ask_notes");
    await sendBot(COPY.askNotes);
  };

  const skipNotes = async () => {
    sendUser("Skip");
    await goToConfirm({ ...data, notes: undefined });
  };

  const submitBooking = async () => {
    sendUser("Confirm booking");
    setStep("submitting");
    await sendBot(COPY.submitting);

    const treatmentValue = data.treatment ? TREATMENT_MAP[data.treatment] : null;
    const preferred = new Date(`${data.date}T${data.time}:00`).toISOString();

    const { data: res, error } = await supabase.functions.invoke("patient-actions", {
      body: {
        action: "book",
        name: data.name,
        phone: data.phone!,
        email: data.email,
        treatment: treatmentValue,
        preferredDatetime: preferred,
        message: data.notes ?? null,
      },
    });

    if (error || !(res as any)?.success) {
      setStep("error");
      await sendBot(COPY.errorRetry);
      return;
    }

    setStep("done");
    await sendBot(COPY.success(formatWhen(data.date!, data.time!)));
  };

  // Returning-patient actions
  const startReschedule = async () => {
    sendUser("Reschedule");
    setStep("reschedule_date");
    await sendBot(COPY.rescheduleAskDate);
  };

  const startCancel = async () => {
    sendUser("Cancel");
    setStep("cancel_confirm");
    await sendBot(COPY.cancelConfirm);
  };

  const askQuestion = async () => {
    sendUser("I have a question");
    setStep("question_open");
    await sendBot(COPY.askQuestion);
  };

  const pickRescheduleDate = async (date: string) => {
    if (date < todayISO()) {
      await sendBot(COPY.invalidDate);
      return;
    }
    const d = new Date(`${date}T00:00:00`);
    const lastText = messages[messages.length - 1]?.text;
    if (d.getDay() === 0) {
      if (lastText !== COPY.closedSunday) await sendBot(COPY.closedSunday);
      return;
    }
    const slots = getTimeSlots(date);
    if (slots.length === 0) {
      if (lastText !== COPY.noSlotsToday) await sendBot(COPY.noSlotsToday);
      return;
    }
    const pretty = d.toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    sendUser(pretty);
    setData((dd) => ({ ...dd, date }));
    setStep("reschedule_time");
    await sendBot(COPY.askTime);
  };


  const pickRescheduleTime = async (time: string) => {
    sendUser(time);
    setData((d) => ({ ...d, time }));
    setStep("reschedule_confirm");
    await sendBot(COPY.rescheduleConfirm(formatWhen(data.date!, time)));
  };

  const confirmReschedule = async () => {
    if (!existing || !sessionToken) return;
    sendUser("Confirm");
    setStep("submitting");
    const newISO = new Date(`${data.date}T${data.time}:00`).toISOString();
    const { data: res, error } = await supabase.functions.invoke("patient-actions", {
      body: {
        action: "reschedule",
        sessionToken,
        newDatetime: newISO,
      },
    });
    if (error || !(res as any)?.success) {
      setStep("error");
      await sendBot(COPY.errorRetry);
      return;
    }
    setStep("rescheduled");
    await sendBot(COPY.rescheduleDone(formatWhen(data.date!, data.time!)));
  };

  const confirmCancel = async () => {
    if (!existing || !sessionToken) return;
    sendUser("Yes, cancel");
    setStep("submitting");
    const { data: res, error } = await supabase.functions.invoke("patient-actions", {
      body: {
        action: "cancel",
        sessionToken,
      },
    });
    if (error || !(res as any)?.success) {
      setStep("error");
      await sendBot(COPY.errorRetry);
      return;
    }
    setStep("cancelled");
    await sendBot(COPY.cancelDone);
  };

  const activeTimeSlots = useMemo(
    () => (data.date ? getTimeSlots(data.date) : []),
    [data.date],
  );

  const textInputActive =
    step === "ask_email" ||
    step === "ask_otp" ||
    step === "ask_name" ||
    step === "ask_phone" ||
    step === "ask_notes" ||
    step === "question_open";
  const placeholder =
    step === "ask_email"
      ? "you@example.com"
      : step === "ask_otp"
      ? "6-digit code"
      : step === "ask_name"
      ? "Type your first name…"
      : step === "ask_phone"
      ? "Your phone number"
      : step === "ask_notes"
      ? "Any notes for the team…"
      : step === "question_open"
      ? "Type your question…"
      : "";

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(true)}
            aria-label="Open chat with Sarah"
            className="fixed bottom-5 right-5 left-auto z-40 flex items-center gap-3 rounded-full bg-primary text-primary-foreground pl-2 pr-4 py-2 shadow-elegant hover:-translate-y-0.5 transition-transform"
          >
            <span className="relative inline-block">
              <img
                src={sarahAvatar}
                alt="Sarah"
                width={36}
                height={36}
                loading="lazy"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-primary-foreground/30"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-primary" />
            </span>
            <span className="hidden sm:inline text-sm font-medium">Chat with Sarah</span>
            <MessageCircle className="sm:hidden h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={handleClose}
            />
            <motion.div
              key="panel"
              role="dialog"
              aria-label="Chat with Sarah"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "fixed z-50 bg-card text-card-foreground shadow-elegant border border-border flex flex-col overflow-hidden",
                "bottom-0 left-0 right-0 h-[85vh] max-h-[85vh] rounded-t-3xl",
                "md:left-auto md:right-5 md:bottom-5 md:w-[380px] md:h-[560px] md:max-h-none md:rounded-2xl",
              )}
            >
              <div className="flex items-center gap-3 p-4 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
                <span className="relative inline-block">
                  <img
                    src={sarahAvatar}
                    alt="Sarah"
                    width={40}
                    height={40}
                    loading="lazy"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold leading-tight">Sarah</div>
                  <div className="text-xs text-muted-foreground">Treatment Coordinator · Online</div>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Close chat"
                  className="rounded-full p-1.5 hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn("flex gap-2", m.from === "user" ? "justify-end" : "justify-start")}
                  >
                    {m.from === "bot" && (
                      <img
                        src={sarahAvatar}
                        alt=""
                        width={28}
                        height={28}
                        loading="lazy"
                        className="h-7 w-7 rounded-full object-cover mt-auto"
                      />
                    )}
                    <div
                      className={cn(
                        "max-w-[78%] rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line overflow-hidden",
                        m.from === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm px-3.5 py-2"
                          : "bg-card text-card-foreground border border-border rounded-bl-sm",
                      )}
                    >
                      {m.image && (
                        <img src={m.image} alt="" loading="lazy" className="w-full h-auto block" />
                      )}
                      {m.text && (
                        <div className={cn(m.from === "bot" && "px-3.5 py-2")}>{m.text}</div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {typing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-end">
                    <img
                      src={sarahAvatar}
                      alt=""
                      width={28}
                      height={28}
                      loading="lazy"
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Sarah is typing</span>
                        <span className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!typing && step === "ask_otp" && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    <Button size="sm" variant="outline" onClick={resendOtp} className="rounded-full">
                      Resend code
                    </Button>
                  </div>
                )}

                {!typing && step === "returning_menu" && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    <Button size="sm" onClick={startReschedule} className="rounded-full">Reschedule</Button>
                    <Button size="sm" variant="outline" onClick={startCancel} className="rounded-full">Cancel</Button>
                    <Button size="sm" variant="outline" onClick={askQuestion} className="rounded-full">I have a question</Button>
                  </div>
                )}

                {!typing && step === "ask_treatment" && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    {TREATMENT_OPTIONS.map((t) => (
                      <button
                        key={t}
                        onClick={() => pickTreatment(t)}
                        className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-card text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}

                {!typing && step === "treatment_info" && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    <Button size="sm" onClick={goBook} className="rounded-full">
                      {data.treatment === "Invisalign" ? "Book my consultation" : "Book with me"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={viewResults} className="rounded-full">
                      View Before & After
                    </Button>
                  </div>
                )}

                {!typing && (step === "ask_date" || step === "reschedule_date") && (() => {
                  const lastText = messages[messages.length - 1]?.text;
                  const showTomorrowShortcut =
                    lastText === COPY.noSlotsToday || lastText === COPY.closedSunday;
                  const shortcutISO = nextNonSundayISO(1);
                  const shortcutLabel = new Date(`${shortcutISO}T00:00:00`).toLocaleDateString(
                    undefined,
                    { weekday: "long", day: "numeric", month: "long" },
                  );
                  const handler = step === "ask_date" ? pickDate : pickRescheduleDate;
                  return (
                    <div className="pt-1 pl-9 flex flex-wrap gap-2 items-center">
                      <Input
                        type="date"
                        min={minBookingISO()}
                        onChange={(e) => e.target.value && handler(e.target.value)}
                        className="rounded-full max-w-[220px]"
                      />
                      {showTomorrowShortcut && (
                        <Button
                          size="sm"
                          onClick={() => handler(shortcutISO)}
                          className="rounded-full"
                        >
                          Pick {shortcutLabel}
                        </Button>
                      )}
                    </div>
                  );
                })()}


                {!typing && (step === "ask_time" || step === "reschedule_time") && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    {activeTimeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() =>
                          step === "ask_time" ? pickTime(t) : pickRescheduleTime(t)
                        }
                        className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-card text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}

                {!typing && step === "ask_notes" && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    <Button size="sm" variant="outline" onClick={skipNotes} className="rounded-full">
                      Skip
                    </Button>
                  </div>
                )}

                {!typing && step === "confirm" && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    <Button size="sm" onClick={submitBooking} className="rounded-full shadow-elegant">
                      Confirm booking
                    </Button>
                  </div>
                )}

                {!typing && step === "reschedule_confirm" && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    <Button size="sm" onClick={confirmReschedule} className="rounded-full shadow-elegant">
                      Confirm
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setStep("reschedule_date"); sendBot(COPY.rescheduleAskDate); }} className="rounded-full">
                      Pick another date
                    </Button>
                  </div>
                )}

                {!typing && step === "cancel_confirm" && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    <Button size="sm" onClick={confirmCancel} className="rounded-full">
                      Yes, cancel
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setStep("returning_menu"); sendBot("No problem — your appointment is still on. Anything else I can help with?"); }} className="rounded-full">
                      Keep my appointment
                    </Button>
                  </div>
                )}

                {!typing && step === "error" && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    <Button size="sm" onClick={resetChat} className="rounded-full">
                      Start over
                    </Button>
                  </div>
                )}

                {!typing && (step === "done" || step === "rescheduled" || step === "cancelled") && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    <Button size="sm" variant="outline" onClick={handleClose} className="rounded-full">
                      Close chat
                    </Button>
                  </div>
                )}
              </div>

              <div className="border-t border-border p-3 bg-card">
                {textInputActive ? (
                  <form onSubmit={handleTextSubmit} className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={placeholder}
                      type={step === "ask_email" ? "email" : step === "ask_phone" ? "tel" : step === "ask_otp" ? "text" : "text"}
                      inputMode={step === "ask_otp" ? "numeric" : undefined}
                      autoComplete={step === "ask_otp" ? "one-time-code" : undefined}
                      maxLength={step === "ask_otp" ? 6 : undefined}
                      className="rounded-full"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="rounded-full shrink-0"
                      disabled={step !== "ask_notes" && !input.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <p className="text-xs text-center text-muted-foreground py-2">
                    {step === "submitting"
                      ? "Just a moment…"
                      : step === "done" || step === "rescheduled" || step === "cancelled"
                      ? "Thanks for chatting 💙"
                      : "Tap a button above to continue"}
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
