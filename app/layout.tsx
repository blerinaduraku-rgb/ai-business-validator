/*import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}*/

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "BusinessLogic.ai",
  description: "Validate and refine your business ideas with AI",
  icons: {
    icon: "/icon.png", // favicon nga public/
  },
};

export const viewport = {
  themeColor: "#0B4D97", // dark blue
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
