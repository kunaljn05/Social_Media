import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux'
import {CustomButton, Loading, TextInput} from '../components'
import { UpdateProfile, userLogin } from '../redux/userSlice';
import { apiRequest, handleFileUpload } from '../utils';

const EditProfile = () => {
    const {user} = useSelector(state=>state.user);
    const dispatch = useDispatch();
    const [errMsg,setErrMsg] = useState("");
    const [isSubmitting,setIsSubmitting] = useState(false);
    const [picture,setPicture] = useState(null);

    const {register,handleSubmit,formState : {errors}} = useForm({mode : 'onChange', defalutValues : {...user}});

    const handleClose = ()=>{
      dispatch(UpdateProfile(false))
    }

        
    const handleSelect = (e)=>{
      setPicture(e.target.files[0])
    }

    const onSubmit = async(data)=>{
     setIsSubmitting(true);
     setErrMsg("");
     try{
     const uri = picture && (await handleFileUpload(picture)) ;
     const {firstName,lastName,profession,location} = data;
     console.log(firstName,lastName,profession,location)
     
     
     const res = await apiRequest({
      url : "/Users/update-user",
      data : {
        firstName,
        lastName,
        profession,
        location,
        profileUrl : uri ? uri : user?.profileUrl
      },
      method : 'PUT',
      token : user?.token
     });

     if(res.status=="failed"){
      setErrMsg(res);
     }
     else{
      setErrMsg(res.data);
      const newUser = {token : res?.data?.token ,...res?.data?.user}
      dispatch(userLogin(newUser));
      setTimeout(() => {
        dispatch(UpdateProfile(false));
      }, 3000);
      setIsSubmitting(false);
     }
     }
     catch(error){
      console.log(error);
      setIsSubmitting(false);
     }
    }

  return (
<>
<div className='fixed z-50 inset-0 overflow-y-auto'>
 <div className='flex items-center justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0'>
  <div className=' absolute inset-0 bg-[#000] opacity-70'> </div>  
  <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
  &#8203; 
  <div className='inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
  role='dialog'
  aria-modal = 'true'
  aria-labelledby='modal-headline'
  >
    <div className='flex justify-between px-6 pt-5 pb-2'>
      <label htmlFor="name"
      className='block font-medium text-xl text-ascent-1 text-left'>
        Edit Profile
      </label>

      <button className=' text-ascent-1' onClick={handleClose}>
        <MdClose size={22}/>
      </button>
    </div>
    <form className='px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6' onSubmit={handleSubmit(onSubmit)}>

    <TextInput 
           
              placeholder="First Name"
              type="text"
              label="First Name"
              styles='w-full rounded-full'
              labelStyles='ml-2'
              register={
                register('firstName',{
                  required:"firstName is required"
                })
              }
              error = {errors?.firstName ? errors?.message?.firstName : ""}
              />

<TextInput
         
              type='text'
              placeholder="Last Name"
              label="Last Name"
              styles='w-full rounded-full'
              labelStyles='ml-2'
              register={
                register('lastName',{required : 'lastname is required'})
              }
              error = {errors?.lastName ? errors?.message?.lastName : ''}
              />

<TextInput
          
              type='text'
              placeholder="location"
              label="Location"
              styles='w-full rounded-full'
              labelStyles='ml-2'
              register={
                register('location',{required : 'proffession is required'})
              }
              error = {errors?.location ? errors?.message?.location : ''}
              />
 
 <TextInput
            
              type='text'
              placeholder="profession"
              label="Profession"
              styles='w-full rounded-full'
              labelStyles='ml-2'
              register={
                register('profession',{required : 'profession is required'})
              }
              error = {errors?.profession ? errors?.message?.profession : ''}
              />

            <label htmlFor="imgUplaod" className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'>
              <input
              type='file'
              className=''
              id='imgUpload'
              onChange={(e)=>{handleSelect(e)}}
              accept='.jpg , .png , .jpeg'
              />
              </label>   

              {
             errMsg?.message && (<span className={`text-sm mt-0.5 ${errMsg?.status=='failed' ? "text-[#f64949fe]" : "text-[#2ba150fe]"}`}>{errMsg.message}</span>)
            }

            <div className='py-5 sm:flex sm:flex-row-reverse border-t border=[#66666645]'>
              {
                isSubmitting ? (<Loading/>) : (<CustomButton
                type='sumbit'
                containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                title='Submit'
                />)
              }
            </div>
    </form>
  </div>
 </div>
</div>
</>
  )
}

export default EditProfile