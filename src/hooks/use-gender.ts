"use client";

import { useGenderStore } from "@/stores/use-gender-store";
import { useEffect, useState } from "react";

export function useGender() {
  // Zustand store'dan ma'lumotlarni olish
  const { gender, toggleGender, setGender } = useGenderStore();

  // SSR uchun hydration muammolarini hal qilish
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Agar komponent hali mount qilinmagan bo'lsa, default qiymatni qaytarish
  if (!mounted) {
    return {
      gender: "male" as IGender,
      toggleGender: () => {},
      setGender: () => {},
      isLoading: true,
    };
  }

  return {
    gender,
    toggleGender,
    setGender,
    isLoading: false,
  };
}
