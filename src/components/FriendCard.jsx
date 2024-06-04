import React from 'react'
import { Link } from 'react-router-dom'
import userprofile from '../assets/userprofile.png'

const FriendCard = ({friends}) => {
  return (
    <div className='w-full shadow-sm bg-primary px-6 py-5 rounded-lg'>
       {/* total friends  */}
       <div className='w-full flex items-center justify-between text-ascent-1 border-b border-[#66666645] pb-2'>
        <span className=' font-semibold'>Friends</span>
        <span>{friends?.length ?? '0'}</span>
       </div>

       {/* diplaying Friends  */}
       <div className='w-full flex flex-col gap-3 pt-4'>
        {
          friends.length <=0 ? "" :    friends.map((friend)=>(
            <Link to={'/profile/'+friend?._id} className='flex items-center gap-2' key={friend.__id}>
                <img src={friend?.profileUrl ?? userprofile} alt={friend?.name} className='h-12 w-12 rounded-full object-cover my-1 cursor-pointer' />
                <div>
                    <p className='text-ascent-1 font-semibold'>{friend?.firstName} {friend?.lastName}</p>
                    <p className='text-ascent-2'>{friend?.proffession ?? "No Proffession"}</p>
                </div>
            </Link>

        ))
        }
       </div>
    </div>
  )
}

export default FriendCard