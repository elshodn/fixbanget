"use client";

import { FC, useState, useMemo } from "react";
import { products } from "@/lib/mockData";
import { useLikeStore } from "@/stores/likeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Minus, Plus } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";



interface ProductDetailCardProps {
  product: Product;
}

const ProductDetailCard: FC<ProductDetailCardProps> = ({ product }) => {

  const { addLike, removeLike, isLiked } = useLikeStore();
  const [mainImage, setMainImage] = useState<string>(product?.image || "");
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    review: "",
  });

  if (!product) return <div>Mahsulot topilmadi.</div>;

  const thumbnails = useMemo(() => Array(4).fill(product.image), [product.image]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Fikr yuborildi:", formData);
    setFormData({ name: "", email: "", title: "", review: "" });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 p-6 max-w-7xl mx-auto">
      {/* Gallery */}
      <div>
        <div className="relative group border rounded-2xl overflow-hidden">
          <Dialog>
            <DialogTrigger asChild>
              <img
                src={mainImage}
                alt="Zoom Image"
                className="cursor-zoom-in w-full aspect-[4/5] object-cover"
              />
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0">
              <img src={mainImage} alt="Large view" className="w-full h-auto" />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex mt-4 gap-2">
          {thumbnails.map((thumb, i) => (
            <img
              key={i}
              src={thumb}
              alt="Thumbnail"
              onClick={() => {
                setCurrentThumbnailIndex(i);
                setMainImage(thumb);
              }}
              className={`w-16 h-16 rounded-xl border ${
                i === currentThumbnailIndex ? "ring-2 ring-black" : ""
              } cursor-pointer`}
            />
          ))}
        </div>

        {/* Mobile Swiper */}
        <div className="md:hidden mt-4">
          <Swiper spaceBetween={10} slidesPerView={1}>
            {thumbnails.map((img, i) => (
              <SwiperSlide key={i}>
                <img src={img} alt="Swiper Slide" className="rounded-xl" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-lg text-muted-foreground">{product.name}</p>
            <p className="text-xl font-semibold mt-2">${product.price}</p>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              isLiked(product.id) ? removeLike(product.id) : addLike(product.id)
            }
          >
            <Heart
              className={`w-6 h-6 ${
                isLiked(product.id) ? "text-red-500 fill-red-500" : ""
              }`}
            />
          </Button>
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div>
            <h3 className="mb-1 font-semibold">Rang:</h3>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? "ring-2 ring-offset-2 ring-black" : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <h3 className="mb-1 font-semibold">Hajm:</h3>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size.toString() ? "default" : "outline"}
                  onClick={() => setSelectedSize(size.toString())}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">Miqdor:</h3>
          <div className="flex items-center border rounded-xl overflow-hidden">
            <Button variant="outline" onClick={() => handleQuantityChange(-1)}>
              <Minus />
            </Button>
            <span className="px-4">{quantity}</span>
            <Button variant="outline" onClick={() => handleQuantityChange(1)}>
              <Plus />
            </Button>
          </div>
        </div>

        <Button className="w-full">Savatga qo‘shish</Button>

        {/* Size help link */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-sm underline text-muted-foreground mt-4">
              O‘lcham bo‘yicha qo‘llanma
            </button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-xl font-semibold">O‘lcham qo‘llanmasi</h2>
            <p className="text-sm">O‘lcham tanlashda yordam uchun jadval.</p>
          </DialogContent>
        </Dialog>

        {/* Review Form */}
        <div className="border-t pt-6 space-y-4">
          <h2 className="text-2xl font-bold">Fikr qoldiring</h2>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <Input
              name="name"
              placeholder="Ismingiz"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
            <Input
              name="title"
              placeholder="Fikr sarlavhasi"
              value={formData.title}
              onChange={handleFormChange}
              required
            />
            <Textarea
              name="review"
              placeholder="Fikringizni yozing"
              value={formData.review}
              onChange={handleFormChange}
              required
            />
            <Button type="submit">Yuborish</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailCard;
