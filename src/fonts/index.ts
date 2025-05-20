import localFont from "next/font/local";

export const SFProDisplay = localFont({
  src: [
    {
      path: "./SF-Pro-Display-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./SF-Pro-Display-Semibold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro-display",
  display: "swap",
});
