import { NavLink, Outlet } from 'react-router-dom'
import { useShoppingCartContext } from '../context/context'

export default function LayoutComponent() {
     const { productsInCart } = useShoppingCartContext()
     function getTotalCartQuantity() {
          if (productsInCart.length != 0) {
               const totalCartQuantity = productsInCart.map(
                    product => (
                         product.cartQuantity
                    )
               )
               return totalCartQuantity.reduce((result, number) => result + number)
          }
          else {
               return 0
          }
     }
     return (
          <div>
               <header className='flex items-center p-3 mb-5 bg-slate-100 rounded-md'>
                    <div className="left-nav text-lg flex gap-6 me-auto">
                         <NavLink to='.' className=' hover:text-blue-600'> Home</NavLink>
                         <NavLink to='/store' className=' hover:text-blue-600'>Store</NavLink>
                         <NavLink to='/about' className=' hover:text-blue-600'>About</NavLink>
                    </div>
                    <div className="right-nav">
                         <NavLink to='/cart'>
                              <div className="svg-contaienr border-2 border-green-500 p-3 rounded-full relative">
                                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height='20'>
                                        <path fill='' d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                                   </svg>
                                   <span className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 h-6 w-6 bg-green-500 rounded-full flex justify-center items-center text-white">
                                        {getTotalCartQuantity()}
                                   </span>
                              </div>
                         </NavLink>
                    </div>
               </header>
               <Outlet />
          </div >
     )
}
