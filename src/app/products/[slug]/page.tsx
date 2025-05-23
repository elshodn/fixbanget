import ProductDetailCard from "@/components/detail-card";
import { fetchProductsBySlug } from "@/lib/api";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const ProductDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  try {
    const product = await fetchProductsBySlug(slug);

    if (!product) {
      return notFound();
    }

    return <ProductDetailCard product={product} />;
  } catch (error) {
    console.error("Error fetching product:", error);
    return notFound();
  }
};

export default ProductDetailPage;
