import React from 'react'
import {SetTheme} from '../redux/themeSlice.js'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {TbSocial} from 'react-icons/tb'
import { useForm } from 'react-hook-form'
import {TextInput,CustomButton} from '../components'
import { BsMoon,BsSunFill } from 'react-icons/bs'
import {IoMdNotificationsOutline} from 'react-icons/io';
import { Logout } from '../redux/userSlice.js'
import { fetchPosts } from '../utils/index.js'

const Topbar = () => {
    let {theme} = useSelector(state=>state.theme)
    const {user} = useSelector(state=>state.user)
    const dispatch = useDispatch()

    const {register,handleSubmit,formState : {errors}} = useForm()

    const handleSearch = async(data)=>{
    await fetchPosts(user.token,dispatch,"",data);
    }

    const handleTheme = ()=>{
        const themeValue = theme = theme === 'light' ? 'dark' : 'light';
        dispatch(SetTheme(themeValue))
    }  
  return (
    <div className='top w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary'>
        {/* logo container  */}
       <Link to='/' className='flex gap-1'>
       <div className='p-1 md:p-2 bg-[#065ad8] rounded text-white'>
        <TbSocial size={14}/>
       </div>
       <span className='text-xl md:text-2xl font-semibold text-[#065ad8]'>ShareFun</span>
       </Link>

       {/* search input container  */}
       <form onSubmit={handleSubmit(handleSearch)} className='hidden md:flex items-center justify-center'>
         {/* search-input  */}
         <TextInput
         placeholder="Search..."
         styles= "w-[18rem] lg:w-[38rem] py-3 rounded-l-full"
         register = {register("search")}
         />
         {/* Custom Search Button  */}
         <CustomButton
         type='submit'
         title='Search'
         containerStyles='rounded-r-full bg-[#0444a4] text-white py-6 px-2.5 h-[43px] mt-2'
         />
       </form>

       {/* icons and logout container  */}
       <div className='flex items-center gap-10 text-ascent-1 text-md md:text-xl'>
        {/* theme button  */}
        <button className='hidden md:block' onClick={()=>{handleTheme()}}>{theme=='light' ? <BsSunFill/>: <BsMoon/>}</button>
             {/* notification button  */}
        <div className='hidden lg:flex text-md cursor-pointer'>
         <IoMdNotificationsOutline className='text-md'/>
        </div>
        {/* Logout button  */}
         <div>
            <CustomButton
            onClick={()=>{dispatch(Logout())}}
            title='Logout'
            containerStyles='text-sm text-ascent-1 px-4 md-py-6 py-1 md-py-2 border border-[#666] rounded-full'
            />
         </div>
       </div>  
    </div>
  )
}

export default Topbar