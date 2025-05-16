"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Switch } from "@/components/ui/switch"
    
export const PaymentSummary: React.FC = () => {
    const [enabled, setEnabled] = useState(false);
      const addCart = () => {
    alert("добавлено в корзину");
  };
  return (
    <div className="p-4 space-y-1 h-max">
      <div className="p-4 space-y-3 bg-white shadow-md border fixed bottom-0 left-0 right-0 z-50 rounded-t-xl md:static md:rounded-md flex items-center justify-around">
        <div>
            <Switch 
        checked={enabled}
        onCheckedChange={setEnabled}
        className="w-[59px] h-[32px] data-[state=checked]:bg-red-500"
      />
      <p className="text-[12px] font-medium">Сплит: <span className="text-[#FF385C]">4810 ₽</span><br /> остаток потом</p>
        </div>
        <div className="rounded-xl p-2 border-2 ">
        <ShoppingCart   onClick={addCart} />
        </div>
        <Button className=" h-12 rounded-full px-13 bg-[#FF385C] text-white text-lg font-semibold">Купить</Button>
      </div>
    </div>
  );
};
