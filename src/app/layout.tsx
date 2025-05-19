"use client";

import "./globals.css";
import Navbar from "./Navbar/page";
import Footer from "./Footer/page";
import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
const SFProDisplay = localFont({
  src: [
    {
      path: "../assets/fonts/SF-Pro-Display-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/SF-Pro-Display-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/SF-Pro-Display-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/SF-Pro-Display-Semibold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro-display",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const shouldShowFooter = !(
    isMobile &&
    (pathname.startsWith("/detailCard/") ||
      [
        "/checkout",
        "/paymentMethed",
        "/paymentComplete",
        "/congratulations",
      ].includes(pathname))
  );
  const isShowNav = !["/congratulations"].includes(pathname);
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${SFProDisplay.variable}`}
    >
      <body
        suppressHydrationWarning
        className={`antialiased flex flex-col min-h-screen font-sans`}
      >
        <ToastContainer
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="custom-toast"
        />

        {isShowNav && <Navbar />}
        <main className="flex-grow">{children}</main>
        {shouldShowFooter && <Footer />}
      </body>
    </html>
  );
}
