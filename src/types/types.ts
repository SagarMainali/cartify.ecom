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