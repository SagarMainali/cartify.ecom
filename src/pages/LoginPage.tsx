import { NavLink } from "react-router-dom"

export default function LoginPage() {
     return (
          <div className="login-page flex flex-col justify-center items-center gap-4 mt-20">
               <h2 className="text-2xl font-semibold">Cartify</h2>
               <input className="bg-slate-100 w-[20rem] px-4 py-2 rounded-md outline-0" type="text" placeholder="Email" />
               <input className="bg-slate-100 w-[20rem] px-4 py-2 rounded-md outline-0" type="password" placeholder="Password" />
               <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Login</button>
               <h2>Don't have an account? <NavLink className='text-blue-500 font-semibold hover:underline' to='/signup'>Signup instead</NavLink></h2>
          </div>
     )
}
