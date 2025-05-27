"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Download, Upload, RefreshCw, Database, ShoppingCart, User, Calendar, Package } from "lucide-react"
import { useCartStorage } from "@/stores/cart-storage"
import { toast } from "@/components/ui/use-toast"

export function LocalStorageViewer() {
  const [isOpen, setIsOpen] = useState(false)
  const [storageData, setStorageData] = useState<any>({})
  const [storageSize, setStorageSize] = useState<string>("0 KB")

  const cartStorage = useCartStorage()

  const refreshStorageData = () => {
    const data: any = {}
    let totalSize = 0

    // Get all localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        if (value) {
          try {
            data[key] = JSON.parse(value)
          } catch {
            data[key] = value
          }
          totalSize += value.length
        }
      }
    }

    setStorageData(data)
    setStorageSize(`${(totalSize / 1024).toFixed(2)} KB`)
  }

  useEffect(() => {
    if (isOpen) {
      refreshStorageData()
    }
  }, [isOpen])

  const clearAllStorage = () => {
    localStorage.clear()
    cartStorage.clearCart()
    refreshStorageData()
    toast({
      title: "LocalStorage очищен",
      description: "Все данные удалены из локального хранилища",
    })
  }

  const exportStorage = () => {
    const dataStr = JSON.stringify(storageData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `localStorage-backup-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Данные экспортированы",
      description: "LocalStorage данные сохранены в файл",
    })
  }

  const importStorage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value))
        })
        refreshStorageData()
        toast({
          title: "Данные импортированы",
          description: "LocalStorage данные восстановлены из файла",
        })
      } catch (error) {
        toast({
          title: "Ошибка импорта",
          description: "Не удалось прочитать файл",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("ru-RU")
  }

  const cartData = storageData["cart-storage"]?.state || {}
  const cartItems = cartData.items || []
  const customerInfo = cartData.customerInfo || {}

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="fixed bottom-4 right-4 z-50 bg-white shadow-lg border-2">
          <Database className="h-4 w-4 mr-2" />
          LocalStorage
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            LocalStorage Viewer
          </DialogTitle>
          <DialogDescription>Просмотр и управление данными локального хранилища</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Storage Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Размер: {storageSize}</Badge>
              <Badge variant="secondary">Ключей: {Object.keys(storageData).length}</Badge>
              <Badge variant="secondary">Товаров в корзине: {cartItems.length}</Badge>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={refreshStorageData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={exportStorage}>
                <Download className="h-4 w-4" />
              </Button>
              <label>
                <Button size="sm" variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                  </span>
                </Button>
                <input type="file" accept=".json" onChange={importStorage} className="hidden" />
              </label>
              <Button size="sm" variant="destructive" onClick={clearAllStorage}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[500px] w-full">
            <div className="space-y-4">
              {/* Cart Data */}
              {cartItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ShoppingCart className="h-5 w-5" />
                      Корзина ({cartItems.length} товаров)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {cartItems.map((item: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{item.product_name}</h4>
                          <Badge variant="outline">{item.quantity} шт.</Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>
                            ID: {item.id} | Product ID: {item.product_id}
                          </p>
                          <p>
                            Цвет: {item.variant_details?.color?.name} | Размер: {item.variant_details?.size?.name}
                          </p>
                          <p>
                            Цена: {item.price} ₽ | Итого: {item.total_price} ₽
                          </p>
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatTimestamp(item.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    <div className="flex justify-between font-semibold">
                      <span>Общая сумма:</span>
                      <span>{cartStorage.getTotalPrice()} ₽</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Customer Info */}
              {(customerInfo.name || customerInfo.phone) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5" />
                      Информация о клиенте
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Имя:</span>
                        <p className="font-medium">{customerInfo.name || "Не указано"}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Телефон:</span>
                        <p className="font-medium">
                          {customerInfo.countryCode}
                          {customerInfo.phone || "Не указан"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Филиал:</span>
                        <p className="font-medium">{customerInfo.selectedBranch || "Не выбран"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* All Storage Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5" />
                    Все данные LocalStorage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-60">
                    {JSON.stringify(storageData, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
