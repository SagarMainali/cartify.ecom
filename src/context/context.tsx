import { createContext, useContext, ReactNode } from "react";
import { useState, useEffect } from 'react'
import { ProductType } from '../types/types'
import { ContextType } from '../types/types'

const ShoppingCartContext = createContext<ContextType>({} as ContextType)

// custom hook
export function useShoppingCartContext() {
     return useContext(ShoppingCartContext)
}

export function ShoppingCartContextProvider({ children }: { children: ReactNode }) {

     const [data, setData] = useState<ProductType[]>([])

     useEffect(() => {
          const fetchProducts = async () => {
               try {
                    const response = await fetch(`https://fakestoreapi.com/products`)
                    const parsedData = await response.json()
                    const updatedData = parsedData.map((item: ProductType) => (
                         {
                              ...item,
                              cartQuantity: 0
                         }
                    ));
                    localStorage.setItem('shopping_cart_data', JSON.stringify(updatedData))
                    setData(updatedData)
               } catch (error) {
                    console.log(error)
               }
          }

          const localData = localStorage.getItem('shopping_cart_data')
          if (localData) {
               setData(JSON.parse(localData))
          } else {
               fetchProducts()
          }
     }, [])

     function addToCart(id: number): void {
          const updatedData = data.map(
               (item: ProductType) => (
                    item.id === id
                         ? {
                              ...item,
                              cartQuantity: item.cartQuantity + 1
                         }
                         : item
               )
          )
          localStorage.setItem('shopping_cart_data', JSON.stringify(updatedData))
          setData(updatedData)
     }

     function removeFromCart(id: number): void {
          const updatedData = data.map(
               (item: ProductType) => (
                    item.id === id
                         ? {
                              ...item,
                              cartQuantity: item.cartQuantity - 1
                         }
                         : item
               )
          )
          localStorage.setItem('shopping_cart_data', JSON.stringify(updatedData))
          setData(updatedData)
     }

     function removeAll(id: number): void {
          const updatedData = data.map(
               (item: ProductType) => (
                    item.id === id
                         ? {
                              ...item,
                              cartQuantity: 0
                         }
                         : item
               )
          )
          localStorage.setItem('shopping_cart_data', JSON.stringify(updatedData))
          setData(updatedData)
     }

     function clearCart(): void {
          const updatedData = data.map(
               (item: ProductType) => (
                    {
                         ...item,
                         cartQuantity: 0
                    }
               )
          )
          localStorage.setItem('shopping_cart_data', JSON.stringify(updatedData))
          setData(updatedData)
     }

     return (
          <ShoppingCartContext.Provider value={{ data, addToCart, removeFromCart, removeAll, clearCart }} >
               {children}
          </ShoppingCartContext.Provider>
     )
}