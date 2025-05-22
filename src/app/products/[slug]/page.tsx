import React, { FC } from "react";
import ProductDetailCard from "@/components/detail-card";
import { fetchProductsBySlug } from "@/lib/api";
type Props = {
  params: Promise<{ slug: string }>;
};
const page: FC<Props> = async ({ params }) => {
  const { slug } = await params;

  const product = await fetchProductsBySlug(slug);

  if (!product) {
    return <div>Mahsulot topilmadi.</div>;
  }

  return <ProductDetailCard product={product} />;
};

export default page;
