import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "VBCI Notes",
  description: "Weekly sermon notes, clearly preserved",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
