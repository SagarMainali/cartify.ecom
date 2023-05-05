import { createContext, useContext, ReactNode } from "react";

type ContextType = {
     addToCart: () => void,
     removeFromCart: () => void,
}

const ShoppingCartContext = createContext<ContextType>({} as ContextType)

console.log(ShoppingCartContext)

// custom hook
export function useShoppingCartContext() {
     return useContext(ShoppingCartContext)
}

export function ShoppingCartContextProvider({ children }: { children: ReactNode }) {

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