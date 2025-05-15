import React, { FC } from 'react'
type Props = {
    params: Promise<{slug: string}>
}
const page:FC<Props> = async ({params}) => {
    const slug = (await params).slug;
  return (
    <div>
      

    </div>
  )
}

export default page
