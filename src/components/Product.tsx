import { useShoppingCartContext } from "../context/context"
import { ProductType } from "../types/product_type"

export default function Product({ image, id, title, price, rating, cartQuantity }: ProductType) {

     const shoppingCartContext = useShoppingCartContext()

     // console.log(shoppingCartContext)
     console.log('product rendered')


     return (
          <div className="product p-4 bg-white border-2 hover:bg-slate-100 duration-150 text-sm flex flex-col flex-1 gap-4 items-center">
               <div>
                    <img src={image} alt={`product${id}`} className="object-cover h-[9rem]" />
               </div>
               <hr className="w-full" />
               <h2 className="text-start w-full px-1">{title}</h2>
               <div className="stick-bottom mt-auto w-full">
                    <div className="number-details flex justify-between items-center w-full mb-4 px-1">
                         <h3>Rating <span className="font-semibold text-md">{rating.rate}</span></h3>
                         <h3>Price <span className="font-semibold text-md">${price}</span></h3>
                    </div>
                    {cartQuantity < 1
                         ? <button onClick={() => shoppingCartContext.addToCart(id)} className="bg-blue-500 py-2 text-white rounded-md w-full hover:scale-105 duration-150">Add to cart</button>
                         : <div className="bottom-3 flex justify-center items-center">
                              <button onClick={() => shoppingCartContext.removeFromCart(id)} className="flex justify-center items-center bg-gray-300 rounded-full h-10 w-10 hover:scale-110 duration-150">-</button>
                              <span className="px-3">{cartQuantity} in cart</span>
                              <button onClick={() => shoppingCartContext.addToCart(id)} className="flex justify-center items-center bg-gray-300 rounded-full h-10 w-10 hover:scale-110 duration-150">+</button>
                         </div>
                    }
               </div>
          </div>
     )
}
