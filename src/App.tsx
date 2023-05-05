import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Store from './pages/Store'
import About from './pages/About'
import LayoutComponent from './components/LayoutComponent'
import Cart from './pages/Cart'

export default function App() {
     return (
          <div className="app container mx-auto px-8 py-4">
               <Routes>
                    <Route path='/' element={<LayoutComponent />}>
                         <Route index element={<Home />} />
                         <Route path='/store' element={<Store />} />
                         <Route path='/about' element={<About />} />
                         <Route path='/cart' element={<Cart />} />
                    </Route>
               </Routes>
          </div>
     )
}
