import { NavLink } from "react-router-dom"
import { useState } from 'react'
import { FormDataType } from '../types/types'
import { useAuthContext } from "../context/context"

export default function SignupPage() {

     const { signUp, errorMsg } = useAuthContext()

     const [formData, setFormData] = useState<FormDataType>(
          {
               email: '',
               password: '',
               confirm_pw: ''
          }
     )

     function handleChange_singup(e: React.ChangeEvent<HTMLInputElement>) {

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
          <div className="login-page flex flex-col justify-center items-center gap-6 mt-20">
               <div className="title">
                    <h2 className="text-blue-500 text-2xl font-semibold text-center ">Cartify</h2>
                    <h2 className="font-semibold text-sm text-gray-600">Create new account</h2>
               </div>
               <input className="bg-slate-100 w-[20rem] px-4 py-2 rounded-md outline-0" name="email" type="email" placeholder="Email" onChange={handleChange_singup} value={formData.email} />
               <input className="bg-slate-100 w-[20rem] px-4 py-2 rounded-md outline-0" name="password" type="password" placeholder="Password" onChange={handleChange_singup} value={formData.password} />
               <input className="bg-slate-100 w-[20rem] px-4 py-2 rounded-md outline-0" name="confirm_pw" type="password" placeholder="Confirm Password" onChange={handleChange_singup} value={formData.confirm_pw} />
               <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => signUp(formData.email, formData.password, formData.confirm_pw)}>Sign Up</button>
               <h2 className="text-gray-600">Already have an account? <NavLink className='text-blue-500 font-semibold hover:underline' to='/login' replace>Login instead</NavLink></h2>
               {errorMsg && <p className="text-sm text-red-600 italic">*{errorMsg}*</p>}
          </div>
     )
}
