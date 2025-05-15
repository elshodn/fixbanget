import React, { FC } from 'react'
import DetailCard from '..';
import { products } from '@/lib/mockData';
type Props = {
    params: Promise<{slug: string}>
}
const page:FC<Props> = async ({params}) => {
    const decodedSlug = decodeURIComponent((await params).slug); 

    const product = products
        .map((p) => ({ ...p, title: p.name })) 
        .find((p) => p.name === decodedSlug);


    if (!product) {
        return <div>Mahsulot topilmadi.</div>
    };

  return (
    <DetailCard product={product} />
  )
}

export default page
