import "./globals.css";

export const metadata = {
  title: "People Desk | Team Directory",
  description: "A clear, simple directory for your workspace team.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
