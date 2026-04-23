import { supabaseAdmin } from "./supabase-admin";

type EmailStatus = "sent" | "skipped" | "failed";

export type PostNotificationResult = {
  deliveries: number;
  message: string;
  status: EmailStatus;
};

export type PublishedPostEmailPayload = {
  slug: string;
  title: string;
  summary?: string | null;
  speaker?: string | null;
  preached_at?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatPreachedAt(value?: string | null) {
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function getPostEmailHtml(post: PublishedPostEmailPayload, postUrl: string) {
  const preachedAt = formatPreachedAt(post.preached_at);
  const title = escapeHtml(post.title);
  const summary = post.summary ? escapeHtml(post.summary) : null;
  const speaker = post.speaker ? escapeHtml(post.speaker) : null;

  return `
    <div style="margin:0;padding:32px 18px;background:#f6eedc;color:#111111;font-family:Georgia, 'Times New Roman', serif;">
      <div style="max-width:640px;margin:0 auto;background:rgba(255,255,255,0.78);border:1px solid rgba(17,17,17,0.12);border-radius:20px;box-shadow:0 18px 40px rgba(0,0,0,0.08);overflow:hidden;">
        <div style="padding:28px 28px 18px;border-bottom:1px solid rgba(17,17,17,0.08);background:linear-gradient(180deg, rgba(255,255,255,0.8), rgba(239,226,200,0.5));">
          <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(17,17,17,0.56);font-weight:700;">Oil for the Journey</div>
          <h1 style="margin:14px 0 10px;font-size:34px;line-height:1.05;">${title}</h1>
          <p style="margin:0;color:rgba(17,17,17,0.7);font-size:16px;line-height:1.7;">A new teaching note is now available to read.</p>
        </div>
        <div style="padding:26px 28px 30px;">
          ${
            summary
              ? `<p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:rgba(17,17,17,0.82);">${summary}</p>`
              : `<p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:rgba(17,17,17,0.82);">Open the latest note to revisit the teaching and keep it close through the week.</p>`
          }
          ${
            speaker || preachedAt
              ? `<p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:rgba(17,17,17,0.62);">${speaker ? `Speaker: ${speaker}` : ""}${speaker && preachedAt ? " | " : ""}${preachedAt ? `Shared: ${preachedAt}` : ""}</p>`
              : ""
          }
          <a href="${postUrl}" style="display:inline-block;padding:13px 22px;border-radius:999px;background:#111111;color:#ffffff;text-decoration:none;font-weight:700;">Read this note</a>
        </div>
      </div>
    </div>
  `.trim();
}

function getPostEmailText(post: PublishedPostEmailPayload, postUrl: string) {
  const lines = [
    "Oil for the Journey",
    "",
    `A new teaching note is now available: ${post.title}`,
  ];

  if (post.summary?.trim()) {
    lines.push("", post.summary.trim());
  }

  const speaker = post.speaker?.trim();
  const preachedAt = formatPreachedAt(post.preached_at);

  if (speaker || preachedAt) {
    lines.push(
      "",
      [speaker ? `Speaker: ${speaker}` : null, preachedAt ? `Shared: ${preachedAt}` : null]
        .filter(Boolean)
        .join(" | ")
    );
  }

  lines.push("", `Read it here: ${postUrl}`);

  return lines.join("\n");
}

function getProviderConfig(siteUrlFallback: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const replyTo = process.env.EMAIL_REPLY_TO;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    siteUrlFallback;

  return {
    apiKey,
    from,
    replyTo,
    siteUrl: siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`,
  };
}

export async function notifySubscribersOfPublishedPost(
  post: PublishedPostEmailPayload,
  siteUrlFallback: string
): Promise<PostNotificationResult> {
  const { apiKey, from, replyTo, siteUrl } = getProviderConfig(siteUrlFallback);

  if (!apiKey || !from) {
    return {
      deliveries: 0,
      message:
        "Post saved, but email sending is not configured yet. Add RESEND_API_KEY and EMAIL_FROM in production.",
      status: "skipped",
    };
  }

  const supabase = supabaseAdmin();
  const { data: subscribers, error } = await supabase
    .from("email_subscribers")
    .select("email")
    .is("unsubscribed_at", null);

  if (error) {
    return {
      deliveries: 0,
      message: `Post saved, but subscribers could not be loaded: ${error.message}`,
      status: "failed",
    };
  }

  const emails = (subscribers ?? [])
    .map((subscriber) => subscriber.email?.trim().toLowerCase())
    .filter((email): email is string => Boolean(email));

  if (!emails.length) {
    return {
      deliveries: 0,
      message: "Post saved. No active email subscribers were found.",
      status: "skipped",
    };
  }

  const postUrl = `${siteUrl.replace(/\/$/, "")}/notes/${post.slug}`;
  const basePayload = {
    from,
    subject: `New note: ${post.title}`,
    html: getPostEmailHtml(post, postUrl),
    text: getPostEmailText(post, postUrl),
    ...(replyTo ? { reply_to: replyTo } : {}),
  };

  let deliveries = 0;

  for (const email of emails) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...basePayload,
        to: [email],
      }),
    });

    if (!response.ok) {
      let providerMessage = `The email provider rejected the request (HTTP ${response.status}) for ${email}.`;

      try {
        const rawBody = await response.text();

        try {
          const body = JSON.parse(rawBody) as {
            message?: string;
            error?: unknown;
            name?: string;
          };

          const detail =
            body.message ||
            (typeof body.error === "string" ? body.error : undefined) ||
            rawBody;

          providerMessage = detail
            ? `${providerMessage}: ${detail}`
            : providerMessage;
        } catch {
          if (rawBody.trim()) {
            providerMessage = `${providerMessage}: ${rawBody.trim()}`;
          }
        }
      } catch {}

      return {
        deliveries,
        message: `Post saved, but the email send failed: ${providerMessage}`,
        status: "failed",
      };
    }

    deliveries += 1;
  }

  return {
    deliveries,
    message: `Post saved and email sent to ${deliveries} subscriber${deliveries === 1 ? "" : "s"}.`,
    status: "sent",
  };
}
