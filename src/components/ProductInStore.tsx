import { useShoppingCartContext } from "../context/context"
import { ProductType } from "../types/types"

export default function ProductInStore({ ...product }: ProductType) {

     const { addToCart } = useShoppingCartContext()

     return (
          <div className="product-in-store p-4 bg-white border-2 hover:bg-slate-100 duration-150 text-sm flex flex-col flex-1 gap-4 items-center">
               <div>
                    <img src={product.image} alt={`product${product.id}`} className="object-cover h-[9rem]" />
               </div>
               <hr className="w-full" />
               <h2 className="text-start w-full px-1">{product.title}</h2>
               <div className="stick-bottom mt-auto w-full">
                    <div className="number-details flex justify-between items-center w-full mb-4 px-1">
                         <h3>Rating <span className="font-semibold text-md">{product.rating.rate}</span></h3>
                         <h3>Price <span className="font-semibold text-md">${product.price}</span></h3>
                    </div>
                    <button onClick={() => addToCart(product)} className="bg-blue-500 py-2 text-white rounded-md w-full hover:scale-105 duration-150">Add to cart</button>
               </div>
          </div>
     )
}
