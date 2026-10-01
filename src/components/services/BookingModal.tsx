import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  email: z.string().trim().email("Invalid email").max(255),
  treatment: z.string().optional(),
  datetime: z.string().min(1, "Pick a date & time"),
  message: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  treatments: string[];
  preselect?: string;
  prefill?: { name?: string; email?: string; phone?: string };
};

export const BookingModal = ({ open, onOpenChange, treatments, preselect, prefill }: Props) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { treatment: preselect ?? "", name: "", phone: "", email: "", datetime: "", message: "" },
  });

  useEffect(() => {
    if (open) {
      setValue("treatment", preselect ?? "");
      if (prefill?.name) setValue("name", prefill.name);
      if (prefill?.email) setValue("email", prefill.email);
      if (prefill?.phone) setValue("phone", prefill.phone);
    }
  }, [open, preselect, prefill, setValue]);


  const onSubmit = async (values: FormValues) => {
    const preferred = new Date(values.datetime).toISOString();
    const { data: res, error } = await supabase.functions.invoke("patient-actions", {
      body: {
        action: "book",
        name: values.name,
        phone: values.phone,
        email: values.email,
        treatment: values.treatment || null,
        preferredDatetime: preferred,
        message: values.message || null,
      },
    });

    if (error || !(res as any)?.success) {
      const reason = (res as any)?.error;
      if (reason === "already_booked") {
        toast({
          title: "You already have a booking",
          description: "Please use the chat to reschedule or cancel your existing appointment first.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again or call us directly.",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Booking confirmed",
      description: "Check your inbox, we've just sent a confirmation with all the details.",
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl tracking-display">Book your appointment</DialogTitle>
          <DialogDescription>Fill in your details and we'll confirm by phone or email.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Treatment interest</Label>
              <Select value={watch("treatment") || ""} onValueChange={(v) => setValue("treatment", v)}>
                <SelectTrigger><SelectValue placeholder="Select a treatment" /></SelectTrigger>
                <SelectContent className="bg-popover">
                  {treatments.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="datetime">Preferred date & time</Label>
              <Input id="datetime" type="datetime-local" {...register("datetime")} />
              {errors.datetime && <p className="text-xs text-destructive">{errors.datetime.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea id="message" rows={3} {...register("message")} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Confirm booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
