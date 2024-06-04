import React from 'react'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import userprofile from '../assets/userprofile.png'
import {LiaEditSolid} from 'react-icons/lia'
import { BsFacebook, BsInstagram, BsPersonFillAdd } from 'react-icons/bs'
import {CiLocationOn} from 'react-icons/ci'
import { BsBriefcase } from 'react-icons/bs'
import moment from 'moment'
import {FaTwitterSquare} from 'react-icons/fa'
import { MdVerified } from "react-icons/md";
import { UpdateProfile } from '../redux/userSlice'

const ProfileCard = ({user}) => {
    const {user:data , edit} = useSelector(state=>state.user)
    const dispatch =  useDispatch()

    const handleEdit = ()=>{dispatch(UpdateProfile(true))}
  return (
    <div className='w-full bg-primary flex flex-col rounded-xl px-4 py-6 shadow-sm'>

      {/* first div-container  */}
      <div className='w-full flex items-center justify-between border-b border-[#66666645] pb-3'>
        {/* profile picture */}
        <Link to={'/profile/'+user._id} className='flex gap-2 p-1 items-center mt-1'>
            <img src={user?.profileUrl ?? userprofile } alt={user?.email} className='h-12 w-12 rounded-full object-cover pl-1'/>
            {/* firstname and lastname and proffesion */}
        <div className='flex flex-col justify-center'>
            <p className='text-ascent-1 font-medium'>{user?.firstName} {user?.lastName}</p>
            <span className='text-sm text-ascent-2'>{user?.profession ?? 'No Proffesion'}</span>
        </div>
        </Link>
        {/* edit option */}
        <div className='mr-1 cursor-pointer'>
            {user?._id===data?._id ? (<LiaEditSolid size={18} className='text-[#0f52b6]' onClick={()=>{handleEdit()}}/>) : (<BsPersonFillAdd onClick={()=>{}} size={20} className='text-[#0f52b6]'/>)}
        </div>
      </div>

      {/* second div-container  */}
      <div className='w-full flex flex-col gap-2 border-b border-[#66666645] ml-1 py-2'>
        {/* location-icon-part  */}
        <div className='flex gap-2 items-center text-ascent-2'>
         <CiLocationOn size={20} className='text-ascent-1'/>
         <span className='text-ascent-1'>{user?.location ?? "Add Location"}</span>
        </div>
        {/* message-icon-part  */}
        <div className='flex gap-2 items-center text-ascent-2 ml-1'>
          <BsBriefcase size={15} className='text-ascent-1'/>
          <span className='text-ascent-1'>{user?.profession ?? "Add Proffession"}</span>
        </div>
      </div>

      {/* third div-container  */}
      <div className='w-full flex flex-col gap-2 border-b border-[#66666645] ml-2 py-3'>
        {/* friends-part  */}
        <p className='text-xl font-semibold text-ascent-1'>{user?.friends?.length} Friends</p>
        {/* profile-viewed section  */}
        <div className='flex items-center justify-between'>
          <p>Who viewed your profile</p>
          <span className='text-xl font-semibold text-ascent-1 mr-2'>{user?.views?.length}</span>
        </div>
        {/* verified account part  */}
        <p>{user?.verified ? (<span className='text-blue font-semibold flex gap-1 items-center'><span>Account Verified </span> <span>{<MdVerified size={16}/>}</span></span>) :(<span className="font-semibold text-ascent-2">Not Verified</span>)}</p>
        {/* joined days part  */}
        <p>Joined {moment(user?.createdAt).fromNow()}</p>
      </div>

      {/* fourth social links part */}
      <div className='flex flex-col gap-4 py-4 pb-6 justify-start ml-2'>
        <p className='text-xl font-semibold text-ascent-1'>Social Profile</p>

        <div className='flex gap-2 items-center text-ascent-2'>
          <BsInstagram className='text-xl text-ascent-1'/>
          <span>Instagram</span>
        </div>

        <div className='flex gap-2 items-center text-ascent-2'>
          <FaTwitterSquare className='text-xl text-ascent-1'/>
          <span>Twitter</span>
        </div>

        <div className='flex gap-2 items-center text-ascent-2'>
          <BsFacebook className='text-xl text-ascent-1'/>
          <span>Facebook</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard