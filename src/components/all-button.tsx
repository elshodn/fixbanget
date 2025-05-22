"use client";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  route: string;
  className?: string;
}

function AllButton({ route = "/products", className }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-full border gap-2 leading-0 flex items-center justify-center pl-3 py-1",
        className
      )}
    >
      Все
      <ChevronRight className="" />
    </button>
  );
}

export default AllButton;
