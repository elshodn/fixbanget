import { notFound } from "next/navigation";
import ProductDetailCard from "@/components/detail-card";
import { getTelegramIdForApi } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
      headers: {
        "X-Telegram-ID": getTelegramIdForApi(),
        Accept: "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    });
    console.log(response);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const product: Product = await response.json();
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <ProductDetailCard product={product} />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.length > 0 ? [product.images[0].image] : [],
    },
  };
}
