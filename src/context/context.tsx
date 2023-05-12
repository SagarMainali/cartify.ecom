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
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, firestore } from '../firebase/firebaseConfig'
import { useNavigate } from "react-router-dom"



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

     // runs only once at the initial render however this initial run sets the onAuthStateChanged that immediately gets triggered with the current auth state 
     // and gets triggered everytime the auth state next time
     useEffect(() => {
          const checkUserLoginStatus = onAuthStateChanged(auth, (currentUser) => {
               if (currentUser) {
                    navigate('/')
               }
               else {
                    navigate('/login')
               }
               setLoggedInUser(currentUser)
               setBlank(false)
          })
          return () => checkUserLoginStatus()
     }, [])

     async function signUp(email: string, password: string, confirm_pw?: string): Promise<void> {
          const validation: string = formValidation(email, password, confirm_pw)
          if (validation === 'pass') {
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
          const validation: string = formValidation(email, password)
          if (validation === 'pass') {
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
               setErrorMsg('Empty field detected')
               return 'fail'
          }
          else if (password.length < 6) {
               setErrorMsg('Password length must be at least 6')
               return 'fail'
          }
          else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
               setErrorMsg('Invalid email format')
               return 'fail'
          }
          else if (confirm_pw && password !== confirm_pw) {
               setErrorMsg('Passwords do not match')
               return 'fail'
          }
          return 'pass'
     }

     return (
          <AuthContext.Provider value={{ signUp, login, logout, loggedInUser, errorMsg }}>
               {!blank && children}
          </AuthContext.Provider>
     )
}

// -------------------------------------------------------------------------------------------

// for shopping-cart
const ShoppingCartContext = createContext<ProductContextType>({} as ProductContextType)

// custom hook - used at the time of consuming the context
export const useShoppingCartContext = () => {
     return useContext(ShoppingCartContext)
}

export const ShoppingCartContextProvider = ({ children }: { children: ReactNode }) => {

     const { loggedInUser } = useAuthContext()

     const [data, setData] = useState<ProductType[]>([])

     useEffect(() => {

          const fetchProducts = async () => {
               try {
                    // although this component renders only when user is logged in, if statement is used only to avoid 'loggedInUser may possbily be null'
                    if (loggedInUser) {
                         const docRef = doc(firestore, 'user_data', loggedInUser.uid)
                         const docSnap = await getDoc(docRef)

                         if (docSnap.exists()) {
                              console.log('doc found')
                         } else {
                              const response = await fetch(`https://fakestoreapi.com/products`)
                              const parsedData = await response.json()
                              const allProducts = parsedData.map((item: ProductType) => {
                                   // excluding unnecessary description property
                                   const { description, ...rest } = item
                                   return {
                                        ...rest,
                                        cartQuantity: 0
                                   }
                              })
                              setData(allProducts)
                              // localStorage.setItem('products', JSON.stringify(allProducts))
                              await setDoc(doc(firestore, 'user_data', loggedInUser.uid), {
                                   data: allProducts
                              })
                         }
                    }
               } catch (error) {
                    console.log(error)
               }
          }

          const localData = localStorage.getItem('products')
          if (localData) {
               setData(JSON.parse(localData))
          } else {
               fetchProducts()
          }
     }, [])

     async function addToCart(id: number): Promise<void> {
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

          // await setDoc(doc(firestore, 'user_cart_data', 'asdf'), {
          //      data: updatedData
          // })

          localStorage.setItem('products', JSON.stringify(updatedData))
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
          localStorage.setItem('products', JSON.stringify(updatedData))
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
          localStorage.setItem('products', JSON.stringify(updatedData))
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
          localStorage.setItem('products', JSON.stringify(updatedData))
          setData(updatedData)
     }

     return (
          <ShoppingCartContext.Provider value={{ data, addToCart, removeFromCart, removeAll, clearCart }} >
               {children}
          </ShoppingCartContext.Provider>
     )
}
