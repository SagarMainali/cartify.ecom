import { useShoppingCartContext } from "../context/context"
import ProductInCart from "../components/ProductInCart"

export default function Cart() {
     const { data } = useShoppingCartContext()
     const itemsInCart = data.filter(
          item => item.cartQuantity > 0
     )
     const totalPrice = itemsInCart.map(
          item => (
               item.cartQuantity * item.price
          )
     )
     return (
          <div className="cart flex flex-col gap-4">
               {itemsInCart.length > 0
                    ? itemsInCart.map(item => <ProductInCart key={item.id} {...item} />)
                    : <h1>Your cart is empty.</h1>
               }
               <hr className="border-2 border-gray-300" />
               {itemsInCart.length > 0 &&
                    <div className="checkout text-end flex gap-3 items-center justify-end bg-slate-200 rounded-md px-4 py-2">
                         <h2>Your total: <span className="font-bold">${totalPrice.reduce((result, number) => result + number)}</span></h2>
                         <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Checkout</button>
                    </div>
               }
          </div>
     )
}
