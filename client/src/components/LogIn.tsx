import React, { useEffect } from "react"
import axios from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom"
import { useOurContext } from "../contexts/ThemeContext.tsx";

type LogInFormDataType={
    email:string, 
    password:string,
}


export const LogIn =()=>{
  const {id,setNewId}=useOurContext()
    const navigate =useNavigate()
    const{register, 
        handleSubmit, 
        formState:{errors}
    }=useForm<LogInFormDataType>()

    const onSubmit:SubmitHandler<LogInFormDataType>= async(data:LogInFormDataType)=>{
        try{
            const res =await axios.post('http://localhost:4000/api/', {
                email:data.email, 
                password:data.password,
            })
            if(res.status===200){
             
              setNewId(res.data._id)
                navigate('/homepage')
                
            }
            
        }
        catch(err){
            console.error("Ошибка входа: ", err)
            alert('Неверный email или пароль')
        }
    }
      return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#5e041f] via-[#c92e2e] to-[#ffbaba] p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-xl rounded-2xl p-8  max-w-md flex flex-col justify-between"
        style={{ minHeight: "400px", maxHeight: "600px" }}
      >
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-extrabold mb-8 text-gray-800">Log in</h1>
        </div>

        <div className="mb-6">
          <input
            type="email"
            placeholder="Enter your email"
             style={{
                WebkitBoxShadow: "0 0 0 1000px #f3f4f6 inset",
              }}
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-[#5e041f] focus:bg-white"
      {...register("email", { required: true })}
            {...register("email", {
              required: "Email обязателен",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Некорректный email",
              },
            })}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        <div className="mb-2">
          <input
            type="password"
            placeholder="Enter your password"
             style={{
                WebkitBoxShadow: "0 0 0 1000px #f3f4f6 inset",
              }}
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-[#5e041f] focus:bg-white"
            {...register("password", {
              required: "Пароль обязателен",
              minLength: { value: 6, message: "Минимум 6 символов" },
            })}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          className="mt-5 tracking-wide font-semibold bg-[#5e041f] text-gray-100 w-full py-4 rounded-lg hover:bg-[#ffbaba] transition-all duration-300 ease-in-out flex items-center justify-center"
        >
          <span className="ml-2">Next</span>
        </button>

        <Link to="/register" className="mt-4">
          <button
            type="button"
            className="tracking-wide font-semibold bg-[#ffbaba] text-gray-100 w-full py-4 rounded-lg hover:bg-[#fadede] transition-all duration-300 ease-in-out flex items-center justify-center"
          >
            <svg
              className="w-6 h-6 -ml-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6M23 11h-6" />
            </svg>
            <span className="ml-3">Sign Up</span>
          </button>
        </Link>

        <p className="mt-6 text-xs text-gray-600 text-center">
          I agree to abide by templatana's&nbsp;
          <a href="#" className="border-b border-gray-500 border-dotted">
            Terms of Service&nbsp;
          </a>
          and its&nbsp;
          <a href="#" className="border-b border-gray-500 border-dotted">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  )


}