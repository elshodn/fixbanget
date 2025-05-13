 interface Main {
    id:number,
    name:string,
    price:number,
    image:string,
 }
 interface Product extends Main{
    category: string,
    gender: string[],
    colors: string[],
    sizes: number[],
    rating: number,
    reviews: number,
    oldPrice?: number,
}
interface StyledData extends Main{
    quantity: number,
    link:string,
    stylist:string,
    season:string,
    items:ItmesType[],




}
declare module '*.png' {
    const value: string;
    export default value;
  }
  
type ItmesType  = { name: string, brand: string }