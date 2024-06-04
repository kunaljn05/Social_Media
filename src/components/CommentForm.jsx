import React from 'react'
import { useForm } from 'react-hook-form'
import userprofile from '../assets/userprofile.png'
import { useState } from 'react'
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import TextInput from './TextInput'
import Loading from './Loading';
import CustomButton from './CustomButton';
import { apiRequest } from '../utils';
const CommentForm = ({user,id,replyAt,getComments}) => {

    const [errMsg,setErrMsg] = useState("")
    const [loading,setLoading] = useState(false);
    const {register,handleSubmit,reset,formState :{ errors}} = useForm({mode : 'onChange'});

    const onSubmit = async(data)=>{
         try{
            setLoading(true);
            setErrMsg("");


            const url = !replyAt ? "/posts/comment/" + id : "/posts/reply-comment/" + id;

            const newData = {
                comment : data?.comment,
                from : user?.firstName + " " + user?.lastName,
                replyAt : replyAt
            };

            console.log(newData)

            const res = await apiRequest({
                url : url,
                data : newData,
                token : user?.token,
                method : "POST"
            });

            console.log(res)

            if(res?.status==="failed"){
             setErrMsg(res);
            }
            else{
                reset({comment : ""});
                setErrMsg("");
                await getComments();
            }
            setLoading((false));
         }
         catch(error){
            console.log(error);
            setLoading(false);
         }
    }

  return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex gap-2 items-center'>
                {/* image  */}
                <img src={user?.profileUrl ?? userprofile} alt="img" className='h-12 w-12 object-cover rounded-full' />
                {/* comment-input  */}
                <TextInput
                name='comment'
                styles='w-full rounded-full p-3'
                placeholder = {replyAt ? `Reply @ ${replyAt}` : 'Comment this Post'}
                register = {
                    register('comment',{required : 'comment can not be empty'})
                }
                error = {errors?.comment ? errors?.comment?.message : ""}
                />
            </div>
            {/* displaying error  */}
            {
             errMsg?.message && (<span role='alert' className={`text-sm mt-0.5 ${errMsg?.status=='failed' ? "text-[#f64949fe]" : "text-[#2ba150fe]"}`}>{errMsg.message}</span>)
            }
            {/* submit button for comment */}
            <div className='flex items-end justify-end pb-2 mt-2'>
                {
                    loading ? (<Loading/>) : (<CustomButton
                     title='comment'
                     type='submit'
                     containerStyles='bg-[#0444a4] text-white rounded-full px-3 py-1 font-semibold'
                    />)
                }
            </div>
        </form>

  )
}

export default CommentForm