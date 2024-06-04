import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import userprofile from '../assets/userprofile.png'
import moment from 'moment';
import {BiSolidLike,BiLike, BiComment} from 'react-icons/bi'
import {MdOutlineDeleteOutline} from 'react-icons/md'
import {CommentForm, Loading} from '../components'
import { useSelector } from 'react-redux';
import { postComments } from '../assets/data';
import { current } from '@reduxjs/toolkit';
import { apiRequest } from '../utils';

//  REPLY CARD COMPONENT 
 
const ReplyCard = ({reply,user,handleLike})=>{
    // displaying reply card info 
    return (
        <div className='w-full py-3 mt-1'>
            <div className='flex items-center justify-between'>
            {/* profile image and firstname and lastname  */}
             <div className='flex items-center gap-2'>
                {/* profile image  */}
                <Link to={'/profle/'+reply?.userId?._id}>
                <img src={reply?.userId?.profileUrl ?? userprofile} alt='none' className='w-11 h-11 object-cover rounded-full' />
             </Link>
             {/* firstname and lastname  */}
             <div className=' text-start'>
             <Link to={'/profile/'+reply?.userId?._id}>
             <p className='font-medium text-ascent-1'>{reply?.userId?.firstName} {reply?.userId?.lastName}</p>
             </Link>
             {/* reply content and likes on that reply */}
             <div className='w-full flex gap-5'>
             {/* reply-content  */}
             <span className='text-ascent-1'>{reply?.comment}</span>
             {/* likes on that reply  */}
             <p className='flex gap-1 items-center text-ascent-2' 
             onClick={handleLike}>
             {reply?.likes.includes(user?._id) ? 
             <BiSolidLike size={18} className='text-blue cursor-pointer'/>
             :<BiLike size={20} className=' cursor-pointer'/>
             } {reply?.likes?.length} Likes</p>
             </div>
             </div>
             </div>
            
             {/* time(of replying ) */}
             <span className='text-ascent-2'>{moment(reply?.createdAt).fromNow()}</span>
            </div>
        </div>
    )
}

const PostCard = ({post,user,deletePost,likePost}) => {
 const [showAll,setShowAll] = useState(0);
 const[showReply,setShowReply] = useState(0)
 const[comments,setComments] = useState([])
 const[loading,setLoading] = useState(false)
 const[replyComments,setReplyComments] = useState(0);
 const [showComments,setShowComments] = useState(0);

 const {theme}= useSelector(state=>state.theme)

 const getPostComments = async(id)=>{
  try{
  const res = await apiRequest({
    url : "/posts/comments/" + id,
    method : 'GET',
  });
  return res?.data?.data;
  }
  catch(error){
    console.log(error);
  }
 }

 const getComments = async(id)=>{
    setReplyComments(0);
    const result  = await getPostComments(id);
    setComments(result);
    setLoading(false);
 }


   
// handleLike function 

const handleLike = async(uri)=>{
    console.log("in handlelike")
    await likePost(uri);
    await getComments(post?._id)
}

  return (
    <div className='mb-2 bg-primary rounded-xl p-4 '>
        <div className='flex gap-3 items-center mb-2'>
            {/* profile picture  */}
            <Link to={'/profile/'+post?.userId?._id}>
                <img src={post?.userId?.profileUrl ?? userprofile} className='h-14 w-14 rounded-full object-cover'/>
            </Link>
            <div className='w-full flex items-center justify-between'>
                {/* username and location  */}
                <div className=''>
                    <Link to={'/profile/'+post?.userId?._id}><p className='text-ascent-1 font-semibold'>{post?.userId?.firstName} {post?.userId?.lastName}</p></Link>
                    <span className=' text-ascent-2'>{post?.userId?.location}</span>
                </div>
                {/* posted days ago */}
                {/* {console.log(post?.createdAt)} */}
                <span className={theme === 'dark' ? 'text-white' : 'text-black'}>{moment(post?.createdAt ?? 'posted 7 days ago').fromNow()}</span>
            </div>
        </div>
        
        {/* Displaying description of the post (very great idea for show more and show less)  */}
        <div>
            <p className={theme === 'dark' ? 'text-white' : 'text-black'}>
            {showAll === post?._id ? post?.description : post?.description.slice(0,300)}
             {post?.description.length > 301 && (showAll===post?._id ? <span className='text-blue ml-1 font-medium cursor-pointer' onClick={()=>{setShowAll(0)}}>Show less...</span> : <span className='text-blue font-medium ml-1 cursor-pointer' onClick={()=>{setShowAll(post?._id)}}>Show more...</span>)}
            </p>

            {
                post?.image ? <img src={post?.image} alt='post-image' className='w-full rounded-lg mt-2'/> : ""
            }
        </div>

        {/* displaying comments,likes,delete-post  */}
        <div className='flex justify-between items-center mt-4 px-3 py-2 text-ascent-2 text-base border-t border-[#66666645]'>
            <p className='flex gap-2 items-center text-base cursor-pointer' onClick={()=>handleLike("/posts/like/" + post?._id)}>
                {post?.likes?.includes(user?._id) ? (<BiSolidLike size={20} className='text-blue'/>) : (<BiLike size={20}/>)}
                <span>{post?.likes?.length} Likes</span>
            </p>
            
            {/* handling to show the comments on clicking by changing state of showcomments  */}
            <p className='flex gap-2 items-center cursor-pointer' onClick={()=>{setShowComments(showComments===post?._id ? null : post?._id);getComments(post?._id);}}>
                <BiComment size={20}/>
                <span>{post?.comments?.length} Comments</span>
            </p>

            {user?._id === post?.userId?._id && ( 
                <div className='flex gap-2 items-center text-base cursor-pointer' onClick={()=>{deletePost(post?._id)}}>
                 <MdOutlineDeleteOutline/>
                 <span className=' hover:font-bold transition-all'>Delete</span>
                </div>
            )}
        </div>
         {/* comment form  */}
         {/* using showcomments value to make comments visible on screen  */}
         {
            showComments === post?._id && <div className='w-full border-t mt-4 pt-4 border-[#66666645]'>
                <CommentForm
                user={user}
                id={post?._id}
                getComments = {()=>{getComments(post?._id)}}
                />

{ 
     
            loading ? (<Loading/>) : (comments.length > 0 ? (comments.map(comment=>(
                <div className='w-full py-2' key={comment?._id}>
                    {/* prfile+comment  */}
                    <div className='flex gap-2 items-center'>
                        <Link to={'/profile/'+comment?.userId?._id}>
                         <img src={comment?.userId?.profileUrl ?? userprofile} alt="img" className='h-12 w-12 object-cover rounded-full'/>
                        </Link>
                        <div className='w-full flex items-center justify-between'>
                            <div>
                                <p className=' font-medium text-ascent-1'>{comment?.userId?.firstName} {comment?.userId?.lastName}</p>
                                 <span className={theme === 'dark' ? 'text-white' : 'text-black'}>{comment.comment}</span>
                            </div>
                            <span className='text-ascent-2'>{moment(comment.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    
                    {/* displaying likes of comment and reply to comment  */}
                    <div className='ml-12 w-full flex gap-4 mt-2'>
                    <div className='flex gap-1 items-center'>
                            <p className='text-ascent-2 text-base cursor-pointer' onClick={()=>handleLike("/posts/like-comment/" + comment?._id)}>
                    {comment?.likes.includes(user?._id) ? (<BiSolidLike size={20} className='text-blue'/>) : (<BiLike size={20}/>)} 
                            </p>
                            <span className={theme === 'dark' ? 'text-white' : 'text-black'}>{comment?.likes?.length} Likes</span>
                        </div>
                        <span className='text-blue cursor-pointer font-semibold' onClick={()=>{setReplyComments(comment?._id)}}>
                          Reply
                        </span>
                    </div>
                    {/* reply form input */}
                    {
                        replyComments === comment?._id ? <CommentForm
                        user={user}
                        id={comment?._id}
                        replyAt={comment?.from}
                        getComments={()=>{getComments(post?._id)}}
                        /> : ("")
                    }
                    {/* show reply button  */}
                    <div className='py-2 px-8 mt-6 ml-5'>
                        {
                            comment?.replies?.length > 0 && (<p className={`text-ascent font-medium cursor-pointer  ${theme === 'dark' ? 'text-white' : 'text-black'}`} onClick={()=>{setShowReply( showReply === current?.replies?._id ? 0 : current?.replies?._id)}}>
                             {`(${comment?.replies?.length})`}Show replies
                            </p>)
                        }
                        {
                            showReply === comment?.replies?._id && (comment?.replies?.map(reply=>(
                                <ReplyCard
                                reply = {reply}
                                user = {user}
                                key = {reply?._id}
                                handleLike = {()=>{handleLike('/posts/like-comment'+comment?._id+'/'+reply?._id)}}
                                />
                            )))
                        }
                    </div>
                </div>
            ))) : <span>No Comments, be the first to comment</span>)
         }
            </div>
         }
        
    </div>
  )
}

export default PostCard