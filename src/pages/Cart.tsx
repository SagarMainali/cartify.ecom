import { useShoppingCartContext } from "../context/context"
import ProductInCart from "../components/ProductInCart"

export default function Cart() {
     const { data } = useShoppingCartContext()
     const itemsInCart = data.filter(
          item => item.cartQuantity > 0
     )
     return (
          <div className="cart">
               {itemsInCart.length > 0
                    ? itemsInCart.map(item => <ProductInCart key={item.id} {...item} />)
                    : <h1>Your cart is empty.</h1>
               }
          </div>
     )
}
