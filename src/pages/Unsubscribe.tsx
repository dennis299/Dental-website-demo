import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State = "loading" | "ready" | "already" | "invalid" | "done" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<State>("loading");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return setState("invalid");
    (async () => {
      try {
        const res = await fetch(`${FN_URL}?token=${encodeURIComponent(token)}`, {
          headers: { apikey: ANON },
        });
        const json = await res.json();
        if (res.ok && json.valid) setState("ready");
        else if (json.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      } catch {
        setState("error");
      }
    })();
  }, [token]);

  const confirm = async () => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) setState("error");
      else if ((data as any)?.success) setState("done");
      else if ((data as any)?.reason === "already_unsubscribed") setState("already");
      else setState("error");
    } catch {
      setState("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container max-w-lg py-20">
      <SEO title="Unsubscribe, Evergreen Dental" description="Manage your email preferences for Evergreen Dental." path="/unsubscribe" noindex />
      <h1 className="text-3xl font-semibold mb-4">Email preferences</h1>
      {state === "loading" && <p className="text-muted-foreground">Checking your link…</p>}
      {state === "ready" && (
        <>
          <p className="text-muted-foreground mb-6">
            Click below to unsubscribe from My Dental emails. You'll still receive appointment confirmations you specifically request.
          </p>
          <Button onClick={confirm} disabled={submitting} size="lg">
            {submitting ? "Unsubscribing…" : "Confirm unsubscribe"}
          </Button>
        </>
      )}
      {state === "done" && <p>You've been unsubscribed. We're sorry to see you go.</p>}
      {state === "already" && <p>This address is already unsubscribed.</p>}
      {state === "invalid" && <p>This unsubscribe link is invalid or has expired.</p>}
      {state === "error" && <p>Something went wrong. Please try again later.</p>}
    </main>
  );
};

export default Unsubscribe;
