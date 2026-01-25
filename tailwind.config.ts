import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        glow: "0 0 14px rgba(168, 85, 247, 0.35)",
        "glow-2": "0 0 26px rgba(59, 130, 246, 0.28)",
      },
      boxShadow: {
        glass:
          "0 12px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        pill:
          "0 10px 30px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
