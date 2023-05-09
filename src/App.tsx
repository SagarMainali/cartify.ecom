import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Store from './pages/Store'
import About from './pages/About'
import LayoutComponent from './components/LayoutComponent'
import Cart from './pages/Cart'
import { ShoppingCartContextProvider, AuthContextProvider } from './context/context'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'


export default function App() {

     return (
          <ShoppingCartContextProvider >
               <AuthContextProvider>
                    <div className="app mx-auto px-4 sm:px-8 py-4">
                         <Routes>
                              <Route path='/login' element={<LoginPage />} />
                              <Route path='/signup' element={<SignupPage />} />
                              <Route path='/' element={<LayoutComponent />}>
                                   <Route index element={<Home />} />
                                   <Route path='/store' element={<Store />} />
                                   <Route path='/about' element={<About />} />
                                   <Route path='/cart' element={<Cart />} />
                              </Route>
                         </Routes>
                    </div>
               </AuthContextProvider>
          </ShoppingCartContextProvider >

     )
}
