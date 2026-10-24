
import "./globals.css";

export const metadata = {
  title: "دفتر رأس المال والتداول",
  description: "دفتر شخصي لتتبع الأرصدة والمعاملات المالية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
