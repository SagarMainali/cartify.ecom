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
import Loading from "../components/loading"
import { toast } from "react-hot-toast"



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

     const [errorMsg, setErrorMsg] = useState<string | null>(null)

     const [loading, setLoading] = useState<boolean>(true)

     // runs only once at the initial render however this initial run sets the onAuthStateChanged that immediately gets triggered with the current auth state 
     // and gets triggered everytime the auth state next time
     useEffect(() => {
          const checkUserLoginStatus = onAuthStateChanged(auth, async (currentUser) => {
               setLoggedInUser(currentUser)
               if (currentUser) {
                    // navigate('/') // this is triggered inside login()
                    const docSnap = await getDoc(doc(firestore, 'user_cart_data', currentUser.uid))
                    if (docSnap.exists()) {
                         setProductsInCart(docSnap.data().productsInCart)
                    } else {
                         console.log('Either signed out or this user has no cart data.')
                    }
               }
               else {
                    navigate('/login')
               }
               setLoading(false)
               // the order of this particular setState is very important because it determines whether to render its children or not. the  children
               // may have their own state and useEffect inside of it that may act weird if the order of this setState is not set correctly.
               // in this case this setState was placed at the beginning of the function which enabled to render its children, below this another
               // state was updated that allowed to access that children leading to running one of the useEffect of that children which updated the
               // data to null on browser refresh. this was solved by placing this setState at last which prevented other setState from accessing th
               // children.
          })
          return () => checkUserLoginStatus()
     }, [])

     // signup
     async function signUp(email: string, password: string, confirm_pw?: string): Promise<void> {
          const validation: string = formValidation(email, password, confirm_pw)
          if (validation === 'pass') {
               try {
                    errorMsg && setErrorMsg(null)
                    setLoading(true)
                    await createUserWithEmailAndPassword(auth, email, password)
                    navigate('/') //this gets overwritten with the else statement inside of the onAuthStateChanged()
               } catch (error: any) {
                    setLoading(false)
                    error.code === 'auth/email-already-in-use'
                         ? setErrorMsg('Email already in use')
                         : console.log(error)
               }
          }
     }

     // signin
     async function login(email: string, password: string): Promise<void> {
          const validation: string = formValidation(email, password)
          if (validation === 'pass') {
               try {
                    errorMsg && setErrorMsg(null) //conditional prevents unnecessary render
                    setLoading(true)
                    await signInWithEmailAndPassword(auth, email, password)
                    navigate('/') //this gets overwritten with the else statement inside of the onAuthStateChanged()
               } catch (error: any) {
                    setLoading(false)
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

     // signout 
     async function logout() {
          try {
               await signOut(auth)
          } catch (error) {
               console.log(error)
          }
     }

     // perform validation and return either 'true' or 'false' for further processing 
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
               {loading ? <Loading /> : children}
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

     const notify = () => toast('Added to cart', {
          duration: 2000,
          position: 'bottom-center',
          style: {

          }
     })

     const [products, setProducts] = useState<ProductType[]>([])

     const { productsInCart, setProductsInCart, loggedInUser } = useAuthContext()

     // see if product data is availabe in local storage, if not fetch and set to state
     useEffect(() => {
          const fetchProducts = async () => {
               try {
                    const response = await fetch(`https://fakestoreapi.com/products`)
                    const parsedData = await response.json()
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

     // save data to firebase whenever there is any change in products in cart
     useEffect(() => {
          const saveDataToFirebase = async () => {
               if (loggedInUser) {
                    await setDoc(doc(firestore, 'user_cart_data', loggedInUser.uid), {
                         productsInCart: productsInCart
                    })
               }
          }
          saveDataToFirebase()
     }, [productsInCart])

     // add products to cart
     function addToCart(productToAdd: ProductType): void {
          setProductsInCart(
               (currentProductsInCart: ProductType[]) => {
                    let productMatch: boolean = false
                    const updatedProductsInCart_match = currentProductsInCart.map(
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
                         return updatedProductsInCart_match
                    }
                    else {
                         return ([...updatedProductsInCart_match, {
                              ...productToAdd,
                              cartQuantity: 1
                         }])
                    }
               }
          )
          notify()
     }

     // dynamic update by either incrementing or decrement based on the name of button
     function changeQuantity(id: number, e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
          const { name } = e.currentTarget
          setProductsInCart(
               (currentProductsIncart: ProductType[]) => {
                    const updatedProductsInCart = currentProductsIncart.map(
                         (productInCart: ProductType) => {
                              if (productInCart.id === id) {
                                   if (name === 'increment') {
                                        return {
                                             ...productInCart,
                                             cartQuantity: productInCart.cartQuantity + 1
                                        }
                                   }
                                   else {
                                        return {
                                             ...productInCart,
                                             cartQuantity: productInCart.cartQuantity - 1
                                        }
                                   }
                              }
                              else {
                                   return productInCart
                              }
                         }
                    )
                    // remove product that has cartQuantity of 0
                    return updatedProductsInCart.filter((productInCart: ProductType) => productInCart.cartQuantity > 0);
               }
          )
     }

     // remove specific product from cart
     function removeFromCart(id: number): void {
          setProductsInCart(
               (currentProductsIncart: ProductType[]) => (
                    currentProductsIncart.filter(
                         (productInCart: ProductType) => (
                              productInCart.id !== id
                         )
                    )
               )
          )
     }

     // set products in cart to empty
     function clearCart(): void {
          setProductsInCart([])
     }

     return (
          <ShoppingCartContext.Provider value={{ products, addToCart, changeQuantity, removeFromCart, clearCart }} >
               {children}
          </ShoppingCartContext.Provider>
     )
}
