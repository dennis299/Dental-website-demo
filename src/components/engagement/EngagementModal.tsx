import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MessageCircle, Stethoscope } from "lucide-react";
import { gtagEvent } from "@/lib/analytics";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onChatWithSarah: () => void;
  onStartAssessment: () => void;
};

export const EngagementModal = ({
  open,
  onOpenChange,
  onChatWithSarah,
  onStartAssessment,
}: Props) => {
  useEffect(() => {
    if (open) gtagEvent("engagement_modal_shown");
  }, [open]);

  const choose = (which: "chat" | "checker") => {
    gtagEvent("engagement_modal_choice", { choice: which });
    onOpenChange(false);
    if (which === "chat") onChatWithSarah();
    else onStartAssessment();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-2xl">How can we help you today?</DialogTitle>
          <DialogDescription className="text-base">
            Choose the option that best fits your needs.
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-3 mt-2">
          <button
            onClick={() => choose("chat")}
            className="group text-left rounded-2xl border border-border bg-card p-5 hover:border-primary hover:shadow-elegant transition-all"
          >
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-base">💬 Chat with Sarah</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-snug">
              Get instant answers, learn about treatments, or book your appointment.
            </p>
            <span className="inline-flex mt-3 text-sm font-medium text-primary">
              Start Chat →
            </span>
          </button>

          <button
            onClick={() => choose("checker")}
            className="group text-left rounded-2xl border border-border bg-card p-5 hover:border-primary hover:shadow-elegant transition-all"
          >
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Stethoscope className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-base">🦷 Dental Concern Checker</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-snug">
              Tell us where you're experiencing discomfort and we'll recommend the most appropriate appointment type.
            </p>
            <span className="inline-flex mt-3 text-sm font-medium text-primary">
              Start Assessment →
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
