import { createContext, useContext, ReactNode } from "react";
import { useState, useEffect } from 'react'
import { ProductType } from '../types/product_type'

type ContextType = {
     data: ProductType[],
     addToCart: (id: number) => void,
     removeFromCart: (id: number) => void,
}

const ShoppingCartContext = createContext<ContextType>({} as ContextType)

// custom hook
export function useShoppingCartContext() {
     return useContext(ShoppingCartContext)
}

export function ShoppingCartContextProvider({ children }: { children: ReactNode }) {

     const [data, setData] = useState<ProductType[]>([])

     // console.log(data)
     console.log('context rendered')

     useEffect(() => {
          fetch(`https://fakestoreapi.com/products/category/electronics?limit=6`)
               .then(response => response.json())
               .then(parsedData => {
                    return parsedData.map((item: ProductType) => ({
                         ...item,
                         cartQuantity: 0

                    }))
               })
               .then((updatedData: ProductType[]) => setData(updatedData))
               .catch(error => console.log(error))
     }, [])

     function addToCart(id: number): void {
          setData(
               (prevState: ProductType[]) => (
                    prevState.map(
                         (item: ProductType) => (
                              item.id === id
                                   ? {
                                        ...item,
                                        cartQuantity: item.cartQuantity + 1
                                   }
                                   : item
                         )
                    )
               )
          )
     }

     function removeFromCart(id: number): void {
          setData(
               (prevState: ProductType[]) => (
                    prevState.map(
                         (item: ProductType) => (
                              item.id === id
                                   ? {
                                        ...item,
                                        cartQuantity: item.cartQuantity - 1
                                   }
                                   : item
                         )
                    )
               )
          )
     }

     return (
          <ShoppingCartContext.Provider value={{ data, addToCart, removeFromCart }} >
               {children}
          </ShoppingCartContext.Provider>
     )
}