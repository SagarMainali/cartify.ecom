import { useState, useEffect } from 'react'
import Product from '../components/Product'
import { ShoppingCartContextProvider } from '../context/context'
import { ProductType } from '../types/product_type'

export default function Store() {

     const [data, setData] = useState<ProductType[]>()

     console.log(data)

     useEffect(() => {
          fetch(`https://fakestoreapi.com/products/category/electronics?limit=6`)
               .then(res => res.json())
               .then(json => setData(json))
               .catch(err => console.log(err))
     }, [])

     return (
          <ShoppingCartContextProvider >
               <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                    {data ? data.map(item => <Product key={item.id} {...item} />) : <h2 className='text-lg'>loading . . .</h2>}
               </div>
          </ShoppingCartContextProvider >
     )
}
