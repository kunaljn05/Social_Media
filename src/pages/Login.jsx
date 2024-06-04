import React, { useState } from 'react'
import {TbSocial} from 'react-icons/tb'
import {BsShare} from 'react-icons/bs'
import {ImConnection} from 'react-icons/im'
import {AiOutlineInteraction} from 'react-icons/ai'
import { CustomButton,TextInput,Loading } from '../components'
import {useForm} from 'react-hook-form'
import{ Link} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import image from '../assets/img.jpeg'
import { apiRequest } from '../utils'
import { userLogin } from '../redux/userSlice'

const Login = () => {
  const {register,handleSubmit,formState:{errors}} = useForm({mode:"onChange"})
  const [errMsg,setErrMsg] =  useState("")
  const [isSubmitting,setIsSubmitting] = useState(false)
  const dispatch = useDispatch();

  const onSubmit = async(data)=>{
    setIsSubmitting(true);
    try{
      const res = await apiRequest({
        url : "/auth/login",
        method : "POST",
        data : data,
       });
       console.log(res)
      if(res.status==="failed"){
        setErrMsg(res);
        setIsSubmitting(false);
      }
      else{
        console.log("inside else block of login")
        setErrMsg("");
        const newData = {token : res?.data?.token , ...res?.data?.user};
        dispatch(userLogin(newData));
        console.log(newData)
        window.location.replace("/")
        setIsSubmitting(false)
      }
    }
    catch(error){
      console.log(error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center'>
      <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl'>
        {/* left  */}
        <div className='w-full h-full lg:w-1/2 p-10 2xl:p-20 flex flex-col justify-center'>
        {/* logo-container  */}
         <div className='w-full flex gap-2 items-center mb-6'>
          <div className='p-2 bg-[#065ad8] rounded text-white'>
           <TbSocial/>
          </div>
          <span className='text-2xl text-[#065ad8] font-semibold'>ShareFun</span>
         </div>
         
         <p className='text-ascent-1 text-base font-semibold'>Log in to your account</p>
         <span className='text-sm mt-2 text-ascent-2'>Welcome back</span>

         {/* form-container  */}

            <form  className='py-8 flex flex-col gap-5'onSubmit={handleSubmit(onSubmit)}>
          
            {/* Email Component  */}
            <TextInput 
            name="email"
            placeholder="email@example.com"
            label = "Email Address"
            type ="email"
            register={
              register("email",{required : "email is required"})
            }
            styles='w-full rounded-full'
            labelStyles='ml-2'
            error={errors.email ? errors.email.message : ""}
            />

            {/* Password Component  */}
            <TextInput 
            name="password"
            placeholder="password"
            label = "Enter Password"
            type ="password"
            register={
              register("password",{required : "Password is required"})
            }
            styles='w-full rounded-full'
            labelStyles='ml-2'
            error={errors.password ? errors.password.message : ""}
            />

            {/* Forget Password  */}
            <Link to='/reset-password'className='text-sm text-blue text-right font-semibold'>Forget Password ?</Link>
             
            {/* Displaying Error message  */}
            {
             errMsg?.message && (<span className={`text-sm mt-0.5 ${errMsg?.status==='failed' ? "text-[#f64949fe]" : "text-[#2ba150fe]"}`}>{errMsg.message}</span>)
            }

            {/* Sumbiting part And Login Button  */}
            {
              isSubmitting ? <Loading/> : <CustomButton type='submit' containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
              title='login'/>
            }
         </form>

         {/* Don't have account part  */}
         <p className='text-ascent-2 text-sm text-center'>Don't have an account?
          <Link to='/register' className='text-[#065ad8] font-semibold ml-2 cursor-pointer'>Create Account</Link>
         </p>
        </div>
        {/* right  */}
        {/* Image-icon-ui container  */}
        <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue'>
          {/* parent container for the image and other shareable links  */}
         <div className='relative w-full flex items-center justify-center'>
          {/* Image  */}
          <img src={image} alt="main_image" className='rounded-full w-48 2xl:w-64 h-48 2xl:h-64 object-cover'/>
           {/* share icon  */}
           <div className='absolute flex items-center gap-1 top-10 right-12 py-2 px-5 rounded-full bg-white'>
            <BsShare size={14}/>
            <span className='text-xs font-medium'>Share</span>
           </div>
           {/* Im-Connection Icon  */}
           <div className='absolute flex gap-1 items-center bg-white py-2 px-5 rounded-full left-8 top-8'>
            <ImConnection size={14}/>
            <span className='text-xs font-medium'>Connect</span>
           </div>
            {/* AiOutlineInteraction icon  */}
            <div className='absolute flex gap-1 items-center bg-white py-2 px-5 rounded-full left-16 bottom-8'>
              <AiOutlineInteraction/>
              <span className='text-xs font-medium'>Interact</span>
            </div>
         </div>
         {/*social-para-text-container  */}
         <div className='mt-10 text-center'>
          <p className='text-white font-medium '>Connect with friends and have share for fun</p>
          <span className='text-sm text-white/70 text-ascent-1'>Share memories with friends and the world</span>
         </div>
        </div>
      </div>
    </div>
  )
}

export default Login