"use client";

import { useState } from "react";

type Props = {
  slug: string;
};

type SubmitState =
  | { tone: "idle"; message: string }
  | { tone: "success"; message: string }
  | { tone: "error"; message: string };

const DEFAULT_STATE: SubmitState = {
  tone: "idle",
  message: "Need to re-send the latest note email? Use this to send it again.",
};

export default function SendUpdateEmailButton({ slug }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState<SubmitState>(DEFAULT_STATE);

  async function handleClick() {
    setIsSubmitting(true);
    setState(DEFAULT_STATE);

    try {
      const response = await fetch("/api/posts/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        email?: {
          message?: string;
          status?: "sent" | "skipped" | "failed";
        };
      };

      if (!response.ok || !result.ok) {
        setState({
          tone: "error",
          message:
            result.email?.message ||
            result.error ||
            "The email could not be sent right now.",
        });
        return;
      }

      setState({
        tone: result.email?.status === "sent" ? "success" : "error",
        message: result.email?.message || "The email update has been sent.",
      });
    } catch {
      setState({
        tone: "error",
        message: "The email could not be sent right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-email-resend">
      <button
        type="button"
        className="nav-link admin-email-button"
        onClick={handleClick}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending email..." : "Send update email"}
      </button>

      <p className={`admin-email-status is-${state.tone}`}>{state.message}</p>
    </div>
  );
}
