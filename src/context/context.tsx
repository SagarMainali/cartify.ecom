import { createContext, ReactNode, useContext } from "react";

const ShoppingCartContext = createContext({})

export function useShoppingCart() {
     return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({ children }: { children: ReactNode }) {
     return (
          <ShoppingCartContext.Provider value={{ ShoppingCartContext }} >
               {children}
          </ShoppingCartContext.Provider>
     )
}