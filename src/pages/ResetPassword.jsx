import React from 'react'
import {useForm} from 'react-hook-form'
import {apiRequest} from '../utils/index.js'
import {TextInput,Loading,CustomButton} from '../components'

const ResetPassword = () => {

  
  const [errMsg,setErrMsg] =  React.useState("")
  const [isSubmitting,setIsSubmitting] = React.useState(false)


  const{register,handleSubmit,formState : {errors}} = useForm({mode : "onChange"})
 
   const onSubmit = async(data)=>{
    setIsSubmitting(true);
    try{
      const res = await apiRequest({
        url : "/users/request-passwordreset",
        data : data,
        method : "POST"
      });
      console.log(res)
      if(res.status === 'Failed'){
        setErrMsg(res);
      }
      else{
        setErrMsg(res.data);
      }
      setIsSubmitting(false);
    }
    catch(error){
      console.log(error);
      setIsSubmitting(false);
    }
   }
   
  return (
    <div className='w-full h-[100vh] bg-bgColor flex items-center justify-center'>
      <div className='bg-primary shadow-md rounded-lg w-full md:w-1/3 2xl:w-1/4 px-6 py-8'>
        <p className='text-ascent-1 text-lg font-semibold'>Email Address</p>
        <span className='text-ascent-2 text-sm'>Enter email address used during registeration</span>

        <form onSubmit={handleSubmit(onSubmit)} className='py-4 flex flex-col gap-5'>
          <TextInput
          name="email"
          placeholder="example@email.com"
          type="email"
          register = {
            register('email',{
              required : 'Email Address is required'
            })
          }
          styles='w-full rounded-lg'
          labelStyles='ml-2'
          error = {errors.email ? errors.email.message : ""}
          />
          {/* Displaying Error message  */}
          {
             errMsg?.message && (<span className={`text-sm mt-0.5 ${errMsg?.status=='Failed' ? "text-[#f64949fe]" : "text-[#2ba150fe]"}`}>{errMsg.message}</span>)
            }

             {/* Sumbiting part And Login Button  */}
             {
              isSubmitting ? (<Loading/>) : (<CustomButton type='submit' containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
              title='Submit'/>)
            }
        </form>
      </div>
    </div>
  )
}

export default ResetPassword