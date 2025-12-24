import type { Metadata } from "next";
import "./globals.css";
// 1. ایمپورت کردن کامپوننت‌ها
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "پرتو آکادمی | آموزش‌های تخصصی پرتو",
    description: "مرجع تخصصی آموزش‌های حفاظت در برابر اشعه و تصویربرداری پزشکی",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fa" dir="rtl">
        <head>
            <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/misc/Farsi-Digits/font-face.css" rel="stylesheet" type="text/css" />
        </head>
        <body>
        {/* 2. قرار دادن هدر در بالا */}
        <Header />

        {/* محتوای صفحات اینجا رندر میشه */}
        {children}

        {/* 3. قرار دادن فوتر در پایین */}
        <Footer />
        </body>
        </html>
    );
}