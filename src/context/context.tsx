import { createContext, useContext, ReactNode } from "react";
import { useState, useEffect } from 'react'
import { ProductType } from '../types/types'
import { ProductContextType, AuthContextType } from '../types/types'
import {
     createUserWithEmailAndPassword,
     signInWithEmailAndPassword,
     onAuthStateChanged,
     signOut,
     User
} from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'
import { useNavigate } from "react-router-dom"

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

     const navigate = useNavigate()

     const [loggedInUser, setLoggedInUser] = useState<User | null>(null)

     const [blank, setBlank] = useState<boolean>(true)

     const [errorMsg, setErrorMsg] = useState<string | null>(null)

     useEffect(() => {
          const checkUserLoginStatus = onAuthStateChanged(auth, (currentUser) => {
               if (currentUser) {
                    navigate('/')
                    setLoggedInUser(currentUser)
               }
               else {
                    navigate('/login')
               }
               setBlank(false)
          })
          return () => checkUserLoginStatus()
     }, [])

     async function signUp(email: string, password: string, confirm_pw?: string): Promise<void> {
          const validation = formValidation(email, password, confirm_pw)
          if (validation === 1) {
               try {
                    errorMsg && setErrorMsg(null)
                    await createUserWithEmailAndPassword(auth, email, password)
               } catch (error: any) {
                    error.code === 'auth/email-already-in-use'
                         ? setErrorMsg('Email already in use')
                         : console.log(error)
               }
          }
     }

     async function login(email: string, password: string): Promise<void> {
          const validation = formValidation(email, password)
          if (validation === 1) {
               try {
                    errorMsg && setErrorMsg(null) //conditional prevents unnecessary render
                    await signInWithEmailAndPassword(auth, email, password)
               } catch (error: any) {
                    if (error.code === 'auth/user-not-found') {
                         setErrorMsg('User not found')
                    } else if (error.code === 'auth/wrong-password') {
                         setErrorMsg('Wrong Password')
                    }
                    else {
                         console.log(error)
                    }
               }
          }
     }

     async function logout() {
          try {
               signOut(auth)
               navigate('/login')
          } catch (error) {
               console.log(error)
          }
     }

     function formValidation(email: string, password: string, confirm_pw?: string) {
          if (!email || !password) {
               setErrorMsg('One of the field is empty')
               return 0
          }
          else if (password.length < 6) {
               setErrorMsg('Password length must be at least 6')
               return 0
          }
          else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
               setErrorMsg('Invalid email format')
               return 0
          }
          else if (confirm_pw && password !== confirm_pw) {
               setErrorMsg('Passwords do not match')
               return 0
          }
          return 1
     }

     return (
          <AuthContext.Provider value={{ signUp, login, logout, loggedInUser, errorMsg }}>
               {!blank && children}
          </AuthContext.Provider>
     )
}    
