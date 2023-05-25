import { useState } from 'react'
import ProductInStore from '../components/ProductInStore'
import { useShoppingCartContext } from '../context/context'
import { ProductType } from '../types/types'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

export default function Store() {

     const [selectedData, setSelectedData] = useState<string>('electronics')

     function handleChange_Select(event: React.ChangeEvent<HTMLSelectElement>): void {
          setSelectedData(event.target.value)
     }

     const { products } = useShoppingCartContext()

     const category_electronics = products.filter(
          (item: ProductType) => item.category === 'electronics'
     )

     const category_jewelery = products.filter(
          (item: ProductType) => item.category === 'jewelery'
     )

     const category_mensClothing = products.filter(
          (item: ProductType) => item.category === "men's clothing"
     )

     const category_womensClothing = products.filter(
          (item: ProductType) => item.category === "women's clothing"
     )

     return (
          <div>
               <fieldset className='mb-4'>
                    <label htmlFor='select-category'>Category - </label>
                    <select className='focus:outline-0' id='select-category' value={selectedData} onChange={(handleChange_Select)}>
                         <option value="electronics">Electronics</option>
                         <option value="jewelery">Jewelery</option>
                         <option value="mensClothing">Men's Clothing</option>
                         <option value="womensClothing">Women's Clothing</option>
                    </select>

               </fieldset>
               <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                    {selectedData === 'electronics'
                         ? category_electronics.map(product => <ProductInStore key={product.id} {...product} />)
                         : selectedData === 'jewelery'
                              ? category_jewelery.map(product => <ProductInStore key={product.id} {...product} />)
                              : selectedData === 'mensClothing'
                                   ? category_mensClothing.map(product => <ProductInStore key={product.id} {...product} />)
                                   : category_womensClothing.map(product => <ProductInStore key={product.id} {...product} />)
                    }
               </div>
               <ToastContainer
                    position="bottom-center"
                    autoClose={1000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
               />
          </div>
     )
}
