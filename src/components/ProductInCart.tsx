import { ProductType } from "../types/product_type"

export default function ProductInCart({ image, id, title, price, cartQuantity }: ProductType) {
     return (
          <div className="product-in-cart my-4 grid grid-cols-[9.5rem_auto] gap-3">
               <div className="img-container w-full flex justify-center border-2">
                    <img src={image} alt={`product${id}`} className="object-cover h-[6.5rem]" />
               </div>
               <div className="details">
                    <h2 className="leading-5 mb-2">{title}</h2>
                    <h2>Quantity <span className="font-semibold text-sm">({cartQuantity})</span></h2>
                    <h2>Price <span className="font-semibold text-sm">${(price * cartQuantity).toFixed(2)}</span></h2>
               </div>
          </div>
     )
}
