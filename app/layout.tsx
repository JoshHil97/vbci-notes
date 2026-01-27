import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Oil for the Journey",
  description: "Scripture, reflection, and teaching for the journey of faith",
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
