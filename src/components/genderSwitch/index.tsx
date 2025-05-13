"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import React from "react";

type GenderType = "men" | "women";

interface GenderSwitchProps {
  activeGender: GenderType;
  setActiveGender: (gender: GenderType) => void;
}

export const GenderSwitch: React.FC<GenderSwitchProps> = ({
  activeGender,
  setActiveGender,
}) => {
  return (
    <div className="flex justify-center mb-4 md:mb-8">
      <div className="flex border gap-0.5 rounded-[15px] bg-[#F2F2F2] p-1 sm:p-2">
        <Button
          className={clsx(
            "rounded-[10px] px-3 py-3 sm:px-5 sm:py-5 text-xs sm:text-sm font-bold",
            activeGender === "men"
              ? "bg-white text-black shadow hover:bg-white"
              : "bg-transparent text-black shadow-none hover:bg-transparent"
          )}
          onClick={() => setActiveGender("men")}
        >
          Мужчинам
        </Button>
        <Button
          className={clsx(
            "rounded-[10px] px-3 py-3 sm:px-5 sm:py-5 text-xs sm:text-sm font-bold",
            activeGender === "women"
              ? "bg-white text-black shadow hover:bg-white"
              : "bg-transparent text-black shadow-none hover:bg-transparent"
          )}
          onClick={() => setActiveGender("women")}
        >
          Женщинам
        </Button>
      </div>
    </div>
  );
};
