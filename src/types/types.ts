import { User } from "firebase/auth"

export type ProductType = {
     id: number,
     image: string,
     title: string,
     rating: {rate: number},
     rate: number,
     price: number,
     category: string,
     cartQuantity: number,
     description: string
}

export type FormDataType = {
     email: string,
     password: string,
     confirm_pw?: string
}

export type ProductContextType = {
     products: ProductType[],
     addToCart: (id: number) => void,
     removeFromCart: (id: number) => void,
     removeAll: (id: number) => void,
     clearCart: () => void,
}

export type AuthContextType = {
     signUp: (email: string, password: string, confirm_pw?: string) => Promise<void>,
     login: (email: string, password: string) => Promise<void>,
     logout: () => Promise<void>,
     loggedInUser: User | null,
     errorMsg: string | null
}