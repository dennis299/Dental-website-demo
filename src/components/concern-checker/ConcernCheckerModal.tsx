import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle, Phone, MessageCircle, ChevronLeft } from "lucide-react";
import { ToothMap } from "./ToothMap";
import { EMPTY_ASSESSMENT, QUICK_REGIONS, summarize, type Assessment, type Symptom, type Onset, type YesNoUnsure } from "./types";
import { cn } from "@/lib/utils";
import { gtagEvent } from "@/lib/analytics";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onBookWithSummary: (summary: string) => void;
  onChatWithSummary: (summary: string) => void;
};

const SYMPTOMS: Symptom[] = [
  "Pain", "Sensitivity", "Swelling", "Bleeding",
  "Broken Tooth", "Loose Tooth", "Cosmetic Concern", "Missing Tooth", "Other",
];
const ONSETS: Onset[] = ["Today", "This week", "This month", "Longer"];

const CLINIC_PHONE = "020 7935 7777";
const CLINIC_TEL = "+442079357777";

export const ConcernCheckerModal = ({
  open,
  onOpenChange,
  onBookWithSummary,
  onChatWithSummary,
}: Props) => {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Assessment>(EMPTY_ASSESSMENT);

  const reset = () => {
    setStep(0);
    setA(EMPTY_ASSESSMENT);
  };

  const close = (v: boolean) => {
    onOpenChange(v);
    if (!v) setTimeout(reset, 300);
  };

  const toggleTooth = (t: number) =>
    setA((cur) => ({
      ...cur,
      teeth: cur.teeth.includes(t) ? cur.teeth.filter((x) => x !== t) : [...cur.teeth, t],
    }));

  const toggleRegion = (teeth: number[]) =>
    setA((cur) => {
      const all = teeth.every((t) => cur.teeth.includes(t));
      return {
        ...cur,
        teeth: all
          ? cur.teeth.filter((t) => !teeth.includes(t))
          : Array.from(new Set([...cur.teeth, ...teeth])),
      };
    });

  const toggleSymptom = (s: Symptom) =>
    setA((cur) => ({
      ...cur,
      symptoms: cur.symptoms.includes(s) ? cur.symptoms.filter((x) => x !== s) : [...cur.symptoms, s],
    }));

  const canNext = (): boolean => {
    if (step === 0) return a.teeth.length > 0;
    if (step === 1) return a.symptoms.length > 0;
    if (step === 2) return a.onset !== null && a.swelling !== null && a.emergency !== null;
    return true;
  };

  const handleNext = () => {
    if (step === 2) gtagEvent("concern_checker_completed", { teeth: a.teeth.length, symptoms: a.symptoms.length });
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleBook = () => {
    gtagEvent("concern_checker_to_booking", { from: "book_button" });
    onBookWithSummary(summarize(a));
    close(false);
  };
  const handleChat = () => {
    gtagEvent("concern_checker_to_booking", { from: "chat_button" });
    onChatWithSummary(summarize(a));
    close(false);
  };

  const isEmergency = a.emergency === "Yes";

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>🦷 Dental Concern Checker</span>
            <span className="text-xs font-normal text-muted-foreground ml-auto">
              Step {step + 1} of 4
            </span>
          </DialogTitle>
          <DialogDescription className="flex items-start gap-2 text-xs rounded-lg bg-muted/60 border border-border p-2.5">
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-600" />
            <span>This assessment is for guidance only and does not provide a medical diagnosis.</span>
          </DialogDescription>
        </DialogHeader>

        {/* Step 0, Teeth */}
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Where are you experiencing discomfort? Tap any teeth involved.</p>
            <ToothMap selected={a.teeth} onToggle={toggleTooth} />
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REGIONS.map((r) => {
                const active = r.teeth.every((t) => a.teeth.includes(t));
                return (
                  <button
                    key={r.label}
                    onClick={() => toggleRegion(r.teeth)}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-full border transition-colors",
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary",
                    )}
                  >
                    {r.label}
                  </button>
                );
              })}
              <button
                onClick={() => toggleRegion(QUICK_REGIONS.flatMap((r) => r.teeth))}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:border-primary transition-colors"
              >
                Gums / Whole mouth
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Selected: {a.teeth.length ? a.teeth.join(", ") : "none yet"}
            </p>
          </div>
        )}

        {/* Step 1, Symptoms */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">What are you experiencing? (select all that apply)</p>
            <div className="flex flex-wrap gap-1.5">
              {SYMPTOMS.map((s) => {
                const active = a.symptoms.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={cn(
                      "text-sm px-3.5 py-2 rounded-full border transition-colors",
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2, Details */}
        {step === 2 && (
          <div className="space-y-5">
            {a.symptoms.includes("Pain") && (
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">Pain level</span>
                  <span className="text-muted-foreground">{a.painLevel}/10</span>
                </div>
                <Slider
                  value={[a.painLevel]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={([v]) => setA((c) => ({ ...c, painLevel: v }))}
                />
              </div>
            )}

            <DetailRow label="When did it start?">
              {ONSETS.map((o) => (
                <Chip key={o} active={a.onset === o} onClick={() => setA((c) => ({ ...c, onset: o }))}>
                  {o}
                </Chip>
              ))}
            </DetailRow>

            <DetailRow label="Does hot or cold make it worse?">
              {(["Yes", "No", "Unsure"] as YesNoUnsure[]).map((v) => (
                <Chip key={v} active={a.thermalSensitivity === v} onClick={() => setA((c) => ({ ...c, thermalSensitivity: v }))}>
                  {v}
                </Chip>
              ))}
            </DetailRow>

            <DetailRow label="Any visible swelling?">
              {(["Yes", "No"] as const).map((v) => (
                <Chip key={v} active={a.swelling === v} onClick={() => setA((c) => ({ ...c, swelling: v }))}>
                  {v}
                </Chip>
              ))}
            </DetailRow>

            <DetailRow label="Is this an emergency?">
              {(["Yes", "No"] as const).map((v) => (
                <Chip key={v} active={a.emergency === v} onClick={() => setA((c) => ({ ...c, emergency: v }))}>
                  {v}
                </Chip>
              ))}
            </DetailRow>
          </div>
        )}

        {/* Step 3, Summary */}
        {step === 3 && (
          <div className="space-y-4">
            {isEmergency && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-destructive shrink-0" />
                <div className="text-sm">
                  <div className="font-semibold">If this feels like an emergency, please call us right away.</div>
                  <a href={`tel:${CLINIC_TEL}`} className="text-destructive font-medium underline">
                    {CLINIC_PHONE}
                  </a>
                </div>
              </div>
            )}
            <div className="rounded-xl bg-muted/40 border border-border p-4">
              <p className="text-sm leading-relaxed">
                Thanks for sharing. Based on what you've told us, we recommend scheduling an examination with one of our dentists so they can take a proper look. Sarah can help you book the most appropriate appointment.
              </p>
            </div>
            <div className="text-xs text-muted-foreground rounded-lg bg-card border border-border p-3">
              <div className="font-medium text-foreground mb-1">Summary we'll pass to Sarah:</div>
              {summarize(a)}
            </div>
            <p className="text-sm font-medium">Ready to speak with our team?</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleBook} className="rounded-full flex-1">
                Book Appointment
              </Button>
              <Button onClick={handleChat} variant="outline" className="rounded-full flex-1">
                <MessageCircle className="h-4 w-4 mr-1.5" /> Chat with Sarah
              </Button>
            </div>
          </div>
        )}

        {/* Footer nav */}
        {step < 3 && (
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button onClick={handleNext} disabled={!canNext()} className="rounded-full">
              {step === 2 ? "See recommendation" : "Continue"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <div className="text-sm font-medium mb-1.5">{label}</div>
    <div className="flex flex-wrap gap-1.5">{children}</div>
  </div>
);

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={cn(
      "text-sm px-3.5 py-1.5 rounded-full border transition-colors",
      active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary",
    )}
  >
    {children}
  </button>
);
