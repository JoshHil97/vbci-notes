"use client";

import { useState } from "react";

type Props = {
  source?: string;
  title?: string;
  description?: string;
};

type SubmitState =
  | { tone: "idle"; message: string }
  | { tone: "success"; message: string }
  | { tone: "error"; message: string };

const DEFAULT_STATE: SubmitState = {
  tone: "idle",
  message: "Join the list for weekly note updates and future reminders.",
};

export default function EmailSubscribeCard({
  source = "site",
  title = "Get weekly note emails",
  description = "Receive a simple email when new teaching notes are ready to revisit.",
}: Props) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState<SubmitState>(DEFAULT_STATE);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!email.trim()) {
      setState({
        tone: "error",
        message: "Enter your email address first.",
      });
      return;
    }

    setIsSubmitting(true);
    setState(DEFAULT_STATE);

    const formData = new FormData(form);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source,
          website: String(formData.get("website") ?? ""),
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setState({
          tone: "error",
          message: result.error ?? "Something went wrong. Try again shortly.",
        });
        return;
      }

      setEmail("");
      setState({
        tone: "success",
        message: result.message ?? "You are subscribed.",
      });
      form.reset();
    } catch {
      setState({
        tone: "error",
        message: "Something went wrong. Try again shortly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="email-subscribe-card soft-fade-in">
      <div className="email-subscribe-copy">
        <p className="section-kicker">Email updates</p>
        <h2 className="heading-cursive email-subscribe-title">{title}</h2>
        <p className="text-muted email-subscribe-description">{description}</p>
      </div>

      <form className="email-subscribe-form" onSubmit={handleSubmit}>
        <label className="email-subscribe-field">
          <span className="notes-field-label">Email address</span>
          <input
            className="email-subscribe-input"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
          />
        </label>

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="email-subscribe-honeypot"
          aria-hidden="true"
        />

        <button
          type="submit"
          className="email-subscribe-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Joining..." : "Join email list"}
        </button>
      </form>

      <p
        className={`email-subscribe-status is-${state.tone}`.trim()}
        role="status"
        aria-live="polite"
      >
        {state.message}
      </p>
    </section>
  );
}
