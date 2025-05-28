import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { SFProDisplay } from "../fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unicflo",
  description: "Unicflo - продукты для всех возрастов",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${SFProDisplay.variable}`}>
      <script src="https://telegram.org/js/telegram-web-app.js"></script>
      <body className={`antialiased flex flex-col min-h-screen font-sans`}>
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

        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
