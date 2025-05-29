import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getGenderId = (gender: IGender) => {
  return gender === "male" ? 2 : 1;
};
