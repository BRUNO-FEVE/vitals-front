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
    <html
      lang="pt-br"
      className={courierPrime.className}
      style={{ width: "800px", height: "480px", overflow: "hidden" }}
    >
      <head>
        <meta
          name="viewport"
          content="width=800, height=480, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className="font-sans">
        <PasswordProvider>{children}</PasswordProvider>
      </body>
    </html>
  );
}
