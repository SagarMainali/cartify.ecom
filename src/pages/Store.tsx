import Product from '../components/Product'
import { useShoppingCartContext } from '../context/context'

export default function Store() {

     const { data } = useShoppingCartContext()

     return (
          <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
               {data ? data.map(item => <Product key={item.id} {...item} />) : <h2 className='text-lg'>loading . . .</h2>}
          </div>
     )
}
