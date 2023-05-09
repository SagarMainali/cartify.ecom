export type ProductType = {
     id: number,
     image: string,
     title: string,
     rating: { rate: number },
     price: number,
     category: string,
     cartQuantity: number
}

export type FormDataType = {
     email: string,
     password: string,
     confirm_pw?: string,
}

export type ProductContextType = {
     data: ProductType[],
     addToCart: (id: number) => void,
     removeFromCart: (id: number) => void,
     removeAll: (id: number) => void,
     clearCart: () => void,
}

export type AuthContextType = {
     signUp: (email: string, password: string) => void
}