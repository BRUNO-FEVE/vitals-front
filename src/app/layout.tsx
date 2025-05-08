import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import "./globals.css";
import { PasswordProvider } from "@/contexts/password-context";

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vitals",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={courierPrime.className}>
      <body className="font-sans">
        <PasswordProvider>{children}</PasswordProvider>
      </body>
    </html>
  );
}
