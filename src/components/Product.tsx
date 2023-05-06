import { useShoppingCartContext } from "../context/context"
import { ProductType } from "../types/product_type"

export default function Product({ image, id, title, price, rating }: ProductType) {

     const shoppingCartContext = useShoppingCartContext()

     // console.log(shoppingCartContext)

     const counter = 0

     return (
          <div className="product p-4 bg-white border-2 hover:bg-slate-100 duration-150 text-sm flex flex-col gap-4 items-center">
               <div>
                    <img src={image} alt={`product${id}`} className="object-cover h-[9rem]" />
               </div>
               <hr className="w-full" />
               <h2>{title}</h2>
               <h3>{price}</h3>
               <h3>{rating.rate}</h3>
               {counter < 1
                    ? <button onClick={() => shoppingCartContext.addToCart(id)} className="bg-blue-500 py-2 text-white rounded-md mt-auto w-full hover:scale-105 duration-150">Add to cart</button>
                    : <div className="bottom-3 flex items-center mt-auto">
                         <button onClick={() => shoppingCartContext.removeFromCart(id)} className="flex justify-center items-center bg-gray-300 rounded-full h-10 w-10 hover:scale-110 duration-150">-</button>
                         <span className="px-3">3 in cart</span>
                         <button onClick={() => shoppingCartContext.addToCart(id)} className="flex justify-center items-center bg-gray-300 rounded-full h-10 w-10 hover:scale-110 duration-150">+</button>
                    </div>
               }
          </div>
     )
}
