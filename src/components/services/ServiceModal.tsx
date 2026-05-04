import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

export type ServiceData = {
  icon: LucideIcon;
  title: string;
  description: string;
  pricing: { label: string; price: string }[];
};

type Props = {
  service: ServiceData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBook: (serviceTitle: string) => void;
};

export const ServiceModal = ({ service, open, onOpenChange, onBook }: Props) => {
  if (!service) return null;
  const Icon = service.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary/15 grid place-items-center shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-2xl tracking-display">{service.title}</DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-foreground/70 leading-relaxed">{service.description}</p>

        <div className="mt-2 rounded-xl border border-border bg-muted/30 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-3">Pricing</h4>
          <ul className="divide-y divide-border/60">
            {service.pricing.map((p) => (
              <li key={p.label} className="flex items-center justify-between py-2 text-sm">
                <span className="text-foreground/80">{p.label}</span>
                <span className="font-semibold text-foreground">{p.price}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-foreground/50 italic">
            Final treatment cost will be confirmed after consultation.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={() => onBook(service.title)}>Book Appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
