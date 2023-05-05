import { createContext, ReactNode, useContext } from "react";

type ContextType = {
     addToCart: () => void
     removeFromCart: () => void
}

const ShoppingCartContext = createContext({} as ContextType)

export function useShoppingCart() {
     return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({ children }: { children: ReactNode }) {

     function addToCart() {
          console.log('added')
     }

     function removeFromCart() {
          console.log('removed')
     }

     return (
          <ShoppingCartContext.Provider value={{ addToCart, removeFromCart }} >
               {children}
          </ShoppingCartContext.Provider>
     )
}