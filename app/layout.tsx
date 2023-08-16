import "@styles/globals.css";
import type { Metadata } from "next";
import AuthProvider from "@context/AuthProvider";

export const metadata: Metadata = {
  title: "MineMarket Creator",
  description: "Create custom Minecraft webstores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
