import { createContext, useContext, ReactNode } from "react";

type ContextType = {
     addToCart: (id: number) => void,
     removeFromCart: (id: number) => void,
}

const ShoppingCartContext = createContext<ContextType>({} as ContextType)

// custom hook
export function useShoppingCartContext() {
     return useContext(ShoppingCartContext)
}

export function ShoppingCartContextProvider({ children }: { children: ReactNode }) {

     function addToCart(id: number): void {
          console.log(id)
     }

     function removeFromCart(id: number): void {
          console.log(id)
     }

     return (
          <ShoppingCartContext.Provider value={{ addToCart, removeFromCart }} >
               {children}
          </ShoppingCartContext.Provider>
     )
}