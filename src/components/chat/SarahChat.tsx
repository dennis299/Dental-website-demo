import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import sarahAvatar from "@/assets/sarah-avatar.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  COPY,
  TIME_SLOTS,
  TREATMENT_INFO,
  TREATMENT_MAP,
  TREATMENT_OPTIONS,
  type TreatmentKey,
} from "./script";

type Step =
  | "ask_name"
  | "ask_treatment"
  | "treatment_info"
  | "ask_email"
  | "ask_phone"
  | "ask_date"
  | "ask_time"
  | "ask_notes"
  | "confirm"
  | "submitting"
  | "done"
  | "error";

type Msg =
  | { id: string; from: "bot"; text: string }
  | { id: string; from: "user"; text: string };

const uid = () => Math.random().toString(36).slice(2);
const delay = () => 800 + Math.random() * 700;
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isPhone = (v: string) => v.replace(/\D/g, "").length >= 7;

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

const todayISO = () => new Date().toISOString().slice(0, 10);

type Data = {
  name: string;
  treatment?: TreatmentKey;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  notes?: string;
};

export const SarahChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState<Step>("ask_name");
  const [input, setInput] = useState("");
  const [data, setData] = useState<Data>({ name: "" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const greetedRef = useRef(false);

  // Auto-trigger: 6s OR 35% scroll
  useEffect(() => {
    if (sessionStorage.getItem("sarah_dismissed")) return;
    let opened = false;
    const trigger = () => {
      if (opened) return;
      opened = true;
      setOpen(true);
    };
    const timer = setTimeout(trigger, 6000);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.35) trigger();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Body scroll lock on mobile when open
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

  // Initial greeting
  useEffect(() => {
    if (open && !greetedRef.current) {
      greetedRef.current = true;
      sendBot(COPY.greeting);
    }
  }, [open]);

  // Autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // Focus input when relevant
  useEffect(() => {
    if (open && (step === "ask_name" || step === "ask_email" || step === "ask_phone" || step === "ask_notes")) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, step]);

  const sendBot = async (text: string) => {
    setTyping(true);
    await new Promise((r) => setTimeout(r, delay()));
    setTyping(false);
    setMessages((m) => [...m, { id: uid(), from: "bot", text }]);
  };

  const sendUser = (text: string) => {
    setMessages((m) => [...m, { id: uid(), from: "user", text }]);
  };

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("sarah_dismissed", "1");
  };

  const resetChat = async () => {
    setData({ name: "" });
    setMessages([]);
    setStep("ask_name");
    greetedRef.current = false;
    await sendBot(COPY.greeting);
    greetedRef.current = true;
  };

  const handleTextSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    if (!v && step !== "ask_notes") return;
    setInput("");

    if (step === "ask_name") {
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
    } else if (step === "ask_email") {
      sendUser(v);
      if (!isEmail(v)) {
        await sendBot(COPY.invalidEmail);
        return;
      }
      setData((d) => ({ ...d, email: v }));
      setStep("ask_phone");
      await sendBot(COPY.askPhone);
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
    }
  };

  const goToConfirm = async (d: Data) => {
    setStep("confirm");
    const when = formatWhen(d.date!, d.time!);
    await sendBot(
      COPY.confirm({
        name: d.name,
        treatment: d.treatment ?? "General Consultation",
        email: d.email ?? "",
        phone: d.phone ?? "",
        when,
      }),
    );
  };

  const pickTreatment = async (t: TreatmentKey) => {
    sendUser(t);
    setData((d) => ({ ...d, treatment: t }));
    setStep("treatment_info");
    await sendBot(TREATMENT_INFO[t]);
  };

  const goBook = async () => {
    sendUser("Book with me");
    setStep("ask_email");
    await sendBot(COPY.askEmail(data.name));
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
    const pretty = new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    sendUser(pretty);
    setData((d) => ({ ...d, date }));
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

    const { error } = await supabase.from("bookings").insert({
      name: data.name,
      phone: data.phone!,
      email: data.email!,
      treatment: treatmentValue,
      preferred_datetime: preferred,
      message: data.notes ?? null,
    });

    if (error) {
      setStep("error");
      await sendBot(COPY.errorRetry);
      return;
    }

    setStep("done");
    await sendBot(COPY.success(formatWhen(data.date!, data.time!), data.phone!));
  };

  const editDetails = async () => {
    sendUser("Edit details");
    setStep("ask_date");
    await sendBot("No problem — let's pick a different date.");
  };

  const textInputActive =
    step === "ask_name" || step === "ask_email" || step === "ask_phone" || step === "ask_notes";
  const placeholder =
    step === "ask_name"
      ? "Type your first name…"
      : step === "ask_email"
      ? "you@example.com"
      : step === "ask_phone"
      ? "Your phone number"
      : step === "ask_notes"
      ? "Any notes for the team…"
      : "";

  return (
    <>
      {/* Launcher */}
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
            className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-primary text-primary-foreground pl-2 pr-4 py-2 shadow-elegant hover:-translate-y-0.5 transition-transform"
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

      {/* Widget */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile backdrop */}
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
                "md:bottom-5 md:right-5 md:w-[380px] md:h-[560px] md:rounded-2xl",
                "inset-x-0 bottom-0 max-h-[85vh] h-[85vh] rounded-t-3xl md:inset-x-auto md:max-h-none",
              )}
            >
              {/* Header */}
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

              {/* Messages */}
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
                        "max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm whitespace-pre-line",
                        m.from === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-card text-card-foreground border border-border rounded-bl-sm",
                      )}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}

                {typing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2 items-end"
                  >
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

                {/* Quick reply buttons */}
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
                      Book with me
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={viewResults}
                      className="rounded-full"
                    >
                      View Before & After
                    </Button>
                  </div>
                )}

                {!typing && step === "ask_date" && (
                  <div className="pt-1 pl-9">
                    <Input
                      type="date"
                      min={todayISO()}
                      onChange={(e) => e.target.value && pickDate(e.target.value)}
                      className="rounded-full max-w-[220px]"
                    />
                  </div>
                )}

                {!typing && step === "ask_time" && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        onClick={() => pickTime(t)}
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
                    <Button size="sm" variant="outline" onClick={editDetails} className="rounded-full">
                      Edit details
                    </Button>
                  </div>
                )}

                {!typing && step === "error" && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    <Button size="sm" onClick={submitBooking} className="rounded-full">
                      Try again
                    </Button>
                  </div>
                )}

                {!typing && step === "done" && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    <Button size="sm" variant="outline" onClick={resetChat} className="rounded-full">
                      Book another time
                    </Button>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-border p-3 bg-card">
                {textInputActive ? (
                  <form onSubmit={handleTextSubmit} className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={placeholder}
                      type={step === "ask_email" ? "email" : step === "ask_phone" ? "tel" : "text"}
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
                      ? "Booking your appointment…"
                      : step === "done"
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
