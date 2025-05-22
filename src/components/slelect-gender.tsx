"use client";
import React from "react";
import { Button } from "./ui/button";
import { useGender } from "@/hooks/use-gender";

export default function SelectGender() {
  const { gender, setGender } = useGender();
  return (
    <div className="flex flex-col items-stretch gap-4 mb-8">
      <Button
        variant="outline"
        onClick={() => setGender("male")}
        className={`${
          gender === "male" ? "bg-[#EEEDEB]" : "bg-white"
        } rounded-full`}
      >
        {"Для него"}
      </Button>
      <Button
        variant="outline"
        onClick={() => setGender("female")}
        className={`${
          gender === "female" ? "bg-[#EEEDEB]" : "bg-white"
        } rounded-full`}
      >
        {"Для неё"}
      </Button>
    </div>
  );
}
