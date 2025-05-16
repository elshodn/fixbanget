"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import React, { useState, ChangeEvent } from "react";

// Props interfeysi
interface RefundDialogProps {
  open: boolean;
  onClose: () => void;
}

export function RefundDialog({ open, onClose }: RefundDialogProps) {
  const [reason, setReason] = useState<string>("");
  const [images, setImages] = useState<(string | undefined)[]>([]);

  // Image upload handler
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...images];
        updated[index] = reader.result as string;
        setImages(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="text-lg">Возвращать деньги</DialogTitle>
          <X className="cursor-pointer" onClick={onClose} />
        </DialogHeader>

        <div className="mt-4 space-y-5">
          {/* Reason Input */}
          <div>
            <p className="text-sm font-semibold">Причина Возврата (Макс. 150 Слов)</p>
            <textarea
              rows={4}
              maxLength={150}
              placeholder="Напишите причину..."
              className="w-full mt-2 p-3 border rounded resize-none text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Upload Proof */}
          <div>
            <p className="text-sm font-semibold mb-2">Доказательство наличия товара</p>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((index) => (
                <label
                  key={index}
                  className="border-2 border-dashed rounded-md flex items-center justify-center text-center text-xs cursor-pointer h-30 relative"
                >
                  {images[index] ? (
                    <img
                      src={images[index]}
                      alt={`uploaded-${index}`}
                      className="object-cover w-full h-full rounded"
                    />
                  ) : (
                    <span className="text-[#FF385C] font-medium space-y-2">
                      <Upload className="block mx-auto w-max" />
                      <p>Добавить Фото</p>
                      <span className="font-normal text-gray-400 text-xs">или перетащите изображение</span>
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleImageUpload(e, index)}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button className="w-full bg-[#FF385C] hover:bg-[#e0314d] text-white">
            Предоставить на рассмотрение
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}