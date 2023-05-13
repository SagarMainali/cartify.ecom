import { useAuthContext, useShoppingCartContext } from "../context/context"
import ProductInCart from "../components/ProductInCart"
import { ProductType } from "../types/types"

export default function Cart() {
     const { productsInCart } = useAuthContext()
     const { clearCart } = useShoppingCartContext()
     const totalPrice = productsInCart.map(
          (item: ProductType) => (
               item.cartQuantity * item.price
          )
     )
     return (
          <div className="cart flex flex-col gap-4">
               {productsInCart.length > 0
                    ? productsInCart.map(product => <ProductInCart key={product.id} {...product} />)
                    : <h1>Your cart is empty.</h1>
               }
               <hr className="border-2 border-gray-300" />
               {productsInCart.length > 0 &&
                    <div className="checkout text-end flex gap-3 items-center justify-end bg-slate-200 rounded-md px-4 py-2">
                         <h2>Your total: <span className="font-bold">${(totalPrice.reduce((result, number) => result + number)).toFixed(2)}</span></h2>
                         <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Checkout</button>
                         <button onClick={clearCart} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Clear Cart</button>
                    </div>
               }
          </div>
     )
}
