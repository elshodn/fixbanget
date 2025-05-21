"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GenderState {
  gender: IGender;
  toggleGender: () => void;
  setGender: (gender: IGender) => void;
}

export const useGenderStore = create<GenderState>()(
  persist(
    (set) => ({
      gender: "male", // Boshlang'ich qiymat
      toggleGender: () =>
        set((state) => ({
          gender: state.gender === "male" ? "female" : "male",
        })),
      setGender: (gender) => set({ gender }),
    }),
    {
      name: "gender-storage", // localStorage kalit nomi
    }
  )
);
