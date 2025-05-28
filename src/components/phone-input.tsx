"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PhoneInputProps {
  countryCode: string
  phoneNumber: string
  onCountryCodeChange: (code: string) => void
  onPhoneNumberChange: (number: string) => void
  placeholder?: string
  required?: boolean
}

const phoneFormats = {
  "+7": {
    mask: "### ### ## ##",
    placeholder: "900 123 45 67",
    maxLength: 10,
  },
  "+998": {
    mask: "## ### ## ##",
    placeholder: "91 123 45 67",
    maxLength: 9,
  },
  "+1": {
    mask: "(###) ###-####",
    placeholder: "(555) 123-4567",
    maxLength: 10,
  },
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  placeholder,
  required = false,
}) => {
  const [displayValue, setDisplayValue] = useState("")

  const formatPhoneNumber = (value: string, format: string): string => {
    // Faqat raqamlarni qoldirish
    const numbers = value.replace(/\D/g, "")

    let formatted = ""
    let numberIndex = 0

    for (let i = 0; i < format.length && numberIndex < numbers.length; i++) {
      if (format[i] === "#") {
        formatted += numbers[numberIndex]
        numberIndex++
      } else {
        formatted += format[i]
      }
    }

    return formatted
  }

  const unformatPhoneNumber = (value: string): string => {
    return value.replace(/\D/g, "")
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const currentFormat = phoneFormats[countryCode as keyof typeof phoneFormats]

    if (!currentFormat) return

    // Faqat raqamlarni olish
    const numbersOnly = unformatPhoneNumber(inputValue)

    // Maksimal uzunlikni tekshirish
    if (numbersOnly.length > currentFormat.maxLength) return

    // Formatlanган qiymatni ko'rsatish
    const formatted = formatPhoneNumber(numbersOnly, currentFormat.mask)
    setDisplayValue(formatted)

    // Oddiy formatda parent componentga yuborish
    onPhoneNumberChange(numbersOnly)
  }

  const handleCountryChange = (newCountryCode: string) => {
    onCountryCodeChange(newCountryCode)
    // Davlat o'zgarganda telefon raqamini tozalash
    setDisplayValue("")
    onPhoneNumberChange("")
  }

  // phoneNumber o'zgarganda displayValue ni yangilash
  useEffect(() => {
    const currentFormat = phoneFormats[countryCode as keyof typeof phoneFormats]
    if (currentFormat && phoneNumber) {
      const formatted = formatPhoneNumber(phoneNumber, currentFormat.mask)
      setDisplayValue(formatted)
    } else if (!phoneNumber) {
      setDisplayValue("")
    }
  }, [phoneNumber, countryCode])

  const currentFormat = phoneFormats[countryCode as keyof typeof phoneFormats]

  return (
    <div className="flex gap-2">
      <Select value={countryCode} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="+7">+7</SelectItem>
          <SelectItem value="+998">+998</SelectItem>
          <SelectItem value="+1">+1</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={displayValue}
        onChange={handlePhoneChange}
        placeholder={currentFormat?.placeholder || placeholder || "000"}
        className="flex-1"
        required={required}
        maxLength={currentFormat?.mask.length || 20}
      />
    </div>
  )
}
