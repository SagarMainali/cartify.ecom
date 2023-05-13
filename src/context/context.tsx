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

     const [productsInCart, setProductsInCart] = useState<ProductType[]>([])

     const navigate = useNavigate()

     const [loggedInUser, setLoggedInUser] = useState<User | null>(null)

     const [blank, setBlank] = useState<boolean>(true)

     const [errorMsg, setErrorMsg] = useState<string | null>(null)

     // runs only once at the initial render however this initial run sets the onAuthStateChanged that immediately gets triggered with the current auth state 
     // and gets triggered everytime the auth state next time
     useEffect(() => {
          const checkUserLoginStatus = onAuthStateChanged(auth, async (currentUser) => {
               if (currentUser) {
                    navigate('/')
                    const docSnap = await getDoc(doc(firestore, 'user_cart_data', currentUser.uid))
                    if (docSnap.exists()) {
                         setProductsInCart(docSnap.data().productsInCart)
                    } else {
                         // docSnap.data() will be undefined in this case
                         console.log("No such document!")
                    }
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
               await signOut(auth)
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
          <AuthContext.Provider value={{ signUp, login, logout, loggedInUser, errorMsg, setProductsInCart, productsInCart }}>
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

     const { productsInCart, setProductsInCart, loggedInUser } = useAuthContext()

     const [products, setProducts] = useState<ProductType[]>([])

     useEffect(() => {
          const fetchProducts = async () => {
               try {
                    const response = await fetch(`https://fakestoreapi.com/products`)
                    const parsedData = await response.json()
                    console.log(parsedData)
                    const products_modified = parsedData.map((item: ProductType) => {
                         // excluding unnecessary description property
                         const { description, ...rest } = item
                         return {
                              ...rest,
                              cartQuantity: 0
                         }
                    })
                    setProducts(products_modified)
                    localStorage.setItem('products', JSON.stringify(products_modified))
               } catch (error) {
                    console.log(error)
               }
          }

          const localData = localStorage.getItem('products')
          if (localData) {
               setProducts(JSON.parse(localData))
          } else {
               fetchProducts()
          }
     }, [])

     async function addToCart(productToAdd: ProductType): Promise<void> {
          let productMatch: boolean = false
          const updatedProductsInCart_match = productsInCart.map(
               (productInCart: ProductType) => {
                    if (productInCart.id === productToAdd.id) {
                         productMatch = true
                         return {
                              ...productInCart,
                              cartQuantity: productInCart.cartQuantity + 1
                         }
                    }
                    else {
                         return productInCart
                    }
               }
          )
          if (productMatch) {
               // if statements nested for more readibility
               if (loggedInUser) {
                    await setDoc(doc(firestore, 'user_cart_data', loggedInUser.uid), {
                         productsInCart: updatedProductsInCart_match
                    })
               }
               setProductsInCart(updatedProductsInCart_match)
          }
          else {
               const updatedProductsInCart_noMatch = [...updatedProductsInCart_match, {
                    ...productToAdd,
                    cartQuantity: 1
               }]
               if (loggedInUser) {
                    await setDoc(doc(firestore, 'user_cart_data', loggedInUser.uid), {
                         productsInCart: updatedProductsInCart_noMatch
                    })
               }
               setProductsInCart(updatedProductsInCart_noMatch)
          }
     }

     function changeQuantity(id: number, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
          const { name } = e.currentTarget
          setProductsInCart(
               (currentItemsInCart: ProductType[]) => (
                    currentItemsInCart.map(
                         (productInCart: ProductType) => {
                              if (productInCart.id === id) {
                                   if (name === 'increment') {
                                        return {
                                             ...productInCart,
                                             cartQuantity: productInCart.cartQuantity + 1
                                        }
                                   }
                                   else {
                                        if (productInCart.cartQuantity === 1) {
                                             return {
                                                  ...productInCart,
                                                  cartQuantity: 1
                                             }
                                        }
                                        else {
                                             return {
                                                  ...productInCart,
                                                  cartQuantity: productInCart.cartQuantity - 1
                                             }
                                        }
                                   }
                              }
                              else {
                                   return {
                                        ...productInCart
                                   }
                              }
                         }
                    )
               )
          )
     }

     function removeFromCart(id: number): void {
          const updatedProductsInCart = productsInCart.filter(
               (productInCart: ProductType) => (
                    productInCart.id !== id
               )
          )
          setProductsInCart(updatedProductsInCart)
     }

     function clearCart(): void {
          setProductsInCart([])
     }

     return (
          <ShoppingCartContext.Provider value={{ products, addToCart, changeQuantity, removeFromCart, clearCart }} >
               {children}
          </ShoppingCartContext.Provider>
     )
}
