import { useForm } from "react-hook-form"

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useOurContext } from "../contexts/ThemeContext";
export type FormType={
  username: string;
  email: string;
  passwordFirst: string;
  passwordSecond: string;
}
export type RequestType={
    username:string, 
    email:string, 
    password:string, 
   
}
export const SignUp =()=>{
  const {id, setNewId}=useOurContext()
    const {
        watch, 
        register, 
        handleSubmit,
        formState:{errors}, 
        reset, 
    }=useForm<FormType>()
    
    const onSubmit=async (data:FormType)=>{
      try{
         if (data.passwordFirst !== data.passwordSecond) {
          alert("Passwords don't match");
          return;
    }
         const dataString: RequestType= { 
            username:data.username, 
            email:data.email, 
            password:data.passwordFirst, 
            
          }
           const response =await axios.post('http://localhost:4000/api/register', dataString)
           if (response.status === 201) {
            setNewId(response.data._id)
      alert('Registration successful!');
   
    }}
      catch(err){
console.error('Ошибка регистрации:', err);

alert(err)
      }
        }
    const handleClear =()=>{
        reset()
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#5e041f] via-[#c92e2e] to-[#ffbaba] p-4">
           
      
    <div className="absolute top-4 left-4"> {/* Позиционирование */}
        <Link to="/">
          <button className="tracking-wide font-semibold bg-[#c92e2e] text-white w-[60px] h-[40px] rounded-lg hover:bg-[#ffbaba] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
            <span>Back</span>
          </button>
        </Link>
      </div>
          <form onSubmit={handleSubmit(onSubmit)}  className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full flex flex-col justify-between">
         <div className="flex flex-col items-center">
          <h1 className="text-3xl font-extrabold mb-8 text-gray-800">Log in</h1>
        </div>

        <div className="mb-4">
            <input 
            type="text" 
            id ="name"
            placeholder="Enter your name"
             style={{
                WebkitBoxShadow: "0 0 0 1000px #f3f4f6 inset",
                
              }}
              className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-[#5e041f] focus:bg-white"
           {
                ...register('username', {
                    required:"The name is required", 
                    pattern:{
                        value:/^[A-Z]{3,}$/i, 
                        message:"Only letters (more than 3)"
                    }
                   
                })
            }
            />
            {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
        </div>
        <div className="mb-4">
            <input 
            type="email"
            id="email"
            placeholder="Enter your email"
            style={{
                WebkitBoxShadow: "0 0 0 1000px #f3f4f6 inset",
               
              }}
              className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-[#5e041f] focus:bg-white"
            {...register('email', {
                required:"Email is required", 
                pattern:{
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message:"Incorrect email address"
                }
            })}
            ></input>
            {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
        </div>

        <div className="mb-4">
            <input
            type="password" 
            id="passwordFirst"
            placeholder="Create a new password" 
            style={{
                WebkitBoxShadow: "0 0 0 1000px #f3f4f6 inset",
              }}
               className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-[#5e041f] focus:bg-white"
            {...register('passwordFirst', {
                required: "Required",
                minLength:{
                     value: 6, 
                     message: "Minimum of 6 symbols" 
                }
            })} />
            {errors.passwordFirst && <p style={{ color: 'red' }}>{errors.passwordFirst.message}</p>}
        </div>
         <div  >
          
            <input type="password" 
            id="passwordSecond"
            placeholder="Repeat the password" 
            style={{
                WebkitBoxShadow: "0 0 0 1000px #f3f4f6 inset",
                
              }}
               className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-[#5e041f] focus:bg-white"
            {...register('passwordSecond', {
                required: "Required",
                minLength:{
                     value: 6, 
                     message: "Minimum of 6 symbols" 
                },
                validate: (val)=>{
                    if(watch('passwordFirst')!==val){
                        return "Your passwords do no match"
                    }
                }
            })} />
             {errors.passwordSecond && <p style={{ color: 'red' }}>{errors.passwordSecond.message}</p>}
        </div>
        <div>
            <button
            type="submit"
            className="mt-5 tracking-wide font-semibold bg-[#5e041f] text-gray-100 w-full py-4 rounded-lg hover:bg-[#ffbaba] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
          >
            <span className="ml-3">Create</span>
          </button>
            <button type="button" onClick={handleClear} className="mt-5 tracking-wide font-semibold bg-[#ffbaba] text-gray-100 w-full py-4 rounded-lg hover:bg-[#fcd8d8] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                 <span className="ml-3">Clean</span>
            </button>
        </div>
    </form>
    
 
    
    </div>)
}