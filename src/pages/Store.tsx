import { useState, useEffect } from 'react'
import Product from '../components/Product'
import { ProductType } from '../types/product_type'

export default function Store() {

     const [data, setData] = useState<ProductType[]>()

     // console.log(data)
     console.log('store rendered')


     useEffect(() => {
          fetch(`https://fakestoreapi.com/products/category/electronics?limit=6`)
               .then(response => response.json())
               .then(parsedData => {
                    return parsedData.map((item: ProductType) => ({
                         ...item,
                         cartQuantity: 0

                    }))
               })
               .then((updatedData: ProductType[]) => setData(updatedData))
               .catch(error => console.log(error))
     }, [])

     return (
          <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
               {data ? data.map(item => <Product key={item.id} {...item} />) : <h2 className='text-lg'>loading . . .</h2>}
          </div>
     )
}
