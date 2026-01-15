import "./globals.css";

export const metadata = {
  title: "Affiliate Analytics Dashboard",
  description: "Comprehensive affiliate management and analytics platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="emerald" className="h-full">
      <body className="antialiased h-full bg-base-200 text-base-content">
        {children}
      </body>
    </html>
  );
}