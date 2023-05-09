import { createContext, useContext, ReactNode } from "react";
import { useState, useEffect } from 'react'
import { ProductType } from '../types/types'
import { ProductContextType, AuthContextType } from '../types/types'
import {
     createUserWithEmailAndPassword,
     // signInWithEmailAndPassword,
     // signOut,
     // onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'


// for shopping-cart
const ShoppingCartContext = createContext<ProductContextType>({} as ProductContextType)

// custom hook - used at the time of consuming the context
export const useShoppingCartContext = () => {
     return useContext(ShoppingCartContext)
}

export const ShoppingCartContextProvider = ({ children }: { children: ReactNode }) => {

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



// for authentication 
export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

// custom hook - used at the time of consuming the context
export const useAuthContext = () => {
     return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {

     function signUp(email: string, password: string): void {
          createUserWithEmailAndPassword(auth, email, password)
               .then((userCredential) => {
                    console.log(userCredential)
               })
               .catch((error) => {
                    console.log(error)
               })
     }

     return (
          <AuthContext.Provider value={{ signUp }}>
               {children}
          </AuthContext.Provider>
     )
}    
