import { ProductType } from "../types/types"
import { useShoppingCartContext } from "../context/context"

export default function ProductInCart({ image, id, title, price, cartQuantity }: ProductType) {

     const { removeAll } = useShoppingCartContext()

     return (
          <div className="product-in-cart grid grid-cols-[9.5rem_auto] gap-3">
               <div className="img-container w-full flex justify-center border-2">
                    <img src={image} alt={`product${id}`} className="object-cover h-[6.5rem]" />
               </div>
               <div className="details">
                    <h2 className="leading-5 mb-2 text-sm sm:text-base">{title} <button onClick={() => removeAll(id)} className="text-xs text-red-600 font-semibold bg-gray-200 px-2 rounded-lg">Remove</button></h2>
                    <h2 className="text-sm">Quantity <span className="font-semibold">({cartQuantity})</span></h2>
                    <h2 className="text-sm">Price <span className="font-semibold">${(price * cartQuantity).toFixed(2)}</span></h2>
               </div>
          </div>
     )
}
