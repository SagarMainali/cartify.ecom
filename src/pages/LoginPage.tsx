import { NavLink } from "react-router-dom"
import { useState } from "react"
import { FormDataType } from '../types/types'

export default function LoginPage() {

     const [formData, setFormData] = useState<FormDataType>(
          {
               email: '',
               password: ''
          }
     )

     function handleChange_Login(e: React.ChangeEvent<HTMLInputElement>) {

          const { name, value } = e.target

          setFormData(
               (prevState: FormDataType) => (
                    {
                         ...prevState,
                         [name]: value

                    }
               )
          )

     }

     return (
          <div className="login-page flex flex-col justify-center items-center gap-4 mt-20">
               <h2 className="text-2xl font-semibold">Cartify</h2>
               <input className="bg-slate-100 w-[20rem] px-4 py-2 rounded-md outline-0" name="email" type="text" placeholder="Email" onChange={handleChange_Login} value={formData.email} />
               <input className="bg-slate-100 w-[20rem] px-4 py-2 rounded-md outline-0" name="password" type="password" placeholder="Password" onChange={handleChange_Login} value={formData.password} />
               <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Login</button>
               <h2>Don't have an account? <NavLink className='text-blue-500 font-semibold hover:underline' to='/signup'>Signup instead</NavLink></h2>
          </div>
     )
}
