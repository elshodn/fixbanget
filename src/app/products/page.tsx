import React, { Suspense } from "react";
import ProductsClient from "./products-client";

export default function Products() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsClient />
    </Suspense>
  );
}
