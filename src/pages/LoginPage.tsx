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
          <div className="login-page flex justify-center items-center mt-20">
               <div className="flex flex-col justify-center items-center gap-6">
                    <div className="title">
                         <h2 className="text-blue-500 text-2xl font-semibold text-center ">Cartify</h2>
                         <h2 className="font-semibold text-sm text-gray-600">Login to your account</h2>
                    </div>
                    <input className="bg-slate-100 w-[20rem] px-4 py-2 rounded-md outline-0" name="email" type="email" placeholder="Email" onChange={handleChange_Login} value={formData.email} />
                    <input className="bg-slate-100 w-[20rem] px-4 py-2 rounded-md outline-0" name="password" type="password" placeholder="Password" onChange={handleChange_Login} value={formData.password} />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Login</button>
                    <h2 className="text-gray-600">Don't have an account? <NavLink className='text-blue-500 font-semibold hover:underline' to='/signup'>Signup instead</NavLink></h2>
               </div>
          </div>
     )
}
