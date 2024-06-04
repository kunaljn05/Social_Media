import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch} from 'react-redux'
import { Topbar,ProfileCard,FriendCard, Loading, EditProfile} from '../components'
import { friends} from '../assets/data'
import {Link} from 'react-router-dom'
import userprofile from '../assets/userprofile.png'
import {CustomButton,PostCard} from '../components'
import { BsFiletypeGif, BsPersonFillAdd } from 'react-icons/bs'
import { useForm } from 'react-hook-form'
import {TextInput} from '../components'
import {BiImage, BiSolidVideo} from 'react-icons/bi'
// import {posts} from '../assets/data.js'
import { apiRequest, deletePost, fetchPosts, getUserInfo, handleFileUpload, likePost, sendFriendRequest } from '../utils/index.js'
import { userLogin } from '../redux/userSlice.js'



const Home = () => {

  const {user , edit} = useSelector(state=>state.user)
  const [friendRequest,setFriendRequest] = useState([]);
  const [suggestedFriends,setSuggestedFriends] = useState([]);
  const {register,handleSubmit,reset,formState : {errors}} = useForm();
  const [errMsg,setErrMsg] = useState("")
  const [posting,setPosting] = useState(false);
  const [file,setFile] = useState(null);
  const [loading,setLoading] = useState(false);

  const {posts} = useSelector(state=>state.posts);
  const dispatch = useDispatch();

  const handlePostSumbit = async(data)=>{
   setPosting(true);
   setErrMsg("");
   try{
    const uri = file && (await handleFileUpload(file));
    const newData = uri ? {...data,image : uri} : data;
    const res = await apiRequest({
      url : "/posts/create-post",
      data : newData,
      token : user?.token,
      method : "POST",
    });
    console.log(res)
    if(res.data.success === 'failed'){
      setErrMsg(res);
    }
    else{
      reset({
        description : ""
      })
      setFile(null);
      setErrMsg(res);
      await fetchPost();
    }
    setPosting(false);
   }
   catch(error){
    console.log(error);
    setPosting(false);
   }
  }

  const fetchPost = async()=>{
    console.log("in fetch post")
    await fetchPosts(user?.token,dispatch);
    setLoading(false);
  }

  const handleLikePost = async(uri)=>{
    console.log(uri,user?.token)
    await likePost({uri : uri , token : user?.token});
    await fetchPost();
  };

  const handleDelete = async(id)=>{
    await deletePost(id,user?.token);
    await fetchPost();
  };

  const fetchFriendRequest = async()=>{
    try{
   const res = await apiRequest({
    url : "/users/get-friend-request",
    token : user?.token,
    method :"POST"
   });
   setFriendRequest(res?.data);
    }
    catch(error){
      console.log(error);
    }
  };
  const fetchSuggestedFriends = async()=>{
    try{
    const res = await apiRequest({
      url : "/Users/suggested-friends",
      token : user?.token,
      method : "POST"
    });
    setSuggestedFriends(res?.data);
    }
    catch(error){
      console.log(error);
    }
  };

  const handleFriendRequest = async(id)=>{
   try{
    const res = await sendFriendRequest(user.token,id);
    await fetchSuggestedFriends();
   }
   catch(error){
    console.log(error);
   }
  };

  const acceptFriendRequest = async(id,status)=>{
    try{
const res = await apiRequest({
  url : "/Users/accept-request",
  token : user?.token,
  method : "POST",
  data : {rid : id , status}
})
setFriendRequest(res?.data);
    }
    catch(error){
      console.log(error);
    }
  };

  const getUser = async()=>{
    const res = await getUserInfo(user?.token);
    console.log(res + "kunal")
    const newData = {token : user?.token , ...res};
    dispatch(userLogin(newData))
  };
 
  
  useEffect(()=>{
    setLoading(true);
    getUser();
    fetchPost();
    fetchFriendRequest();
    fetchSuggestedFriends();
  },[])



  return (
    
   <>
    <div className='home w-full px-0 lg:px-10 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
      <Topbar/>
      <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
        {/* LEFT  */}
        <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
          {/* profileCard component  */}
          <ProfileCard user={user}/>
          {/* friendcard component  */}
          <FriendCard friends={user?.friends}/>
        </div>
         {/* CENTER  */}

         <div className='h-full flex-1 flex flex-col gap-6 overflow-y-auto'>

          {/* search input  */}
          <form className='bg-primary px-4 rounded-lg' onSubmit={handleSubmit(handlePostSumbit)}>
            {/* image and search input  */}
            <div className='w-full flex items-center justify-between gap-3'>
             <img src={user?.profileUrl ?? userprofile} alt="" className='h-14 w-14 object-cover rounded-full mt-0.3'/>
             <TextInput
             placeholder="What's on your mind..."
             styles="w-full rounded-full py-5"
             name="description"
             register={
              register("description",{required : "Write something about post"})
             }
             error = {errors?.description ? errors.description.message : ""}
             />
            </div>

            {
             errMsg?.message && (<span className={`text-sm mt-0.5 ${errMsg?.status=='failed' ? "text-[#f64949fe]" : "text-[#2ba150fe]"}`}>{errMsg.message}</span>)
            }

               {/* various uploads (image,video,pdg) */}
          <div className='flex items-center justify-between py-4 px-4'>

{/* upload Image  */}
<label htmlFor="imgUpload" className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
  <input type="file" 
  
  onChange={(e)=>{
    // console.log(e.target.files[0])
    setFile(e.target.files[0])}
  }
  className='hidden'
  id='imgUpload'
  data-max-size='5120'
  accept='.jpg ,.png , .jpeg'
  />
  <BiImage/>
  <span>Image</span>
</label>
{/* upload Video  */}
<label htmlFor="videoUpload" className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
  <input
  type='file'
  data-max-size='5120'
  onChange={(e)=>{setFile(e.target.files[0])}}
  id='videoUpload'
  className='hidden'
  accept='.mp3,.wav'
  />
  <BiSolidVideo />
  <span>video</span>
</label>
 {/* uplaod Gif  */}
<label htmlFor="vgifUpload" className='flex gap-1 items-center text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
  <input
  type='file'
  data-max-size='5120'
  onChange={(e)=>{setFile(e.target.files[0])}}
  className='hidden'
  id='vgifUpload'
  accept='.gif'
  />
  <BsFiletypeGif/>
  <span>GIF</span>
</label>
{
  posting ? (<Loading/>) : <CustomButton
  type='submit'
  title='POST'
  containerStyles='bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm'
  />
}
</div>
          </form>
          {/* DISPLAYING POSTS  */}
           {
              loading ? (<Loading/>) : (posts?.length > 0 ? posts?.map((post)=>(
                // rendering post card component 
                <PostCard key={post?._id} post={post}
                user={user}
                deletePost={handleDelete}
                likePost = {handleLikePost}
                />
              )) : (<div className='flex w-full h-full items-center justify-center'>
              <p className='text-lg text-ascent-2'>No Post Available</p>
            </div>))
           }
         </div>
         
        {/* RIGHT  */}
        <div className='hidden w-1/4 lg:flex flex-col gap-8 overflow-y-auto'>
          {/* friends request container  */}
          <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
            {/* total friend-request  */}
            <div className='w-full flex items-center justify-between border-b border-[#66666645]'>
              <span className='font-semibold text-ascent-1 text-lg'>Friend Requests</span>
              <span className='text-ascent-2 text-lg font-semibold'>{friends?.length ?? 0}</span>
            </div>
             {/* displaying friend requests  */}
             {friendRequest.length >0 ? 
             <div className='w-full flex flex-col gap-4 pt-4'>
              {
                friendRequest.map(({_id,requestFrom : from})=>(
                  <div className='w-full flex items-center justify-between' key={_id}>
                    {/* proile-name part  */}
                   <Link to={'/profile/'+_id} className='flex gap-2 items-center cursor-pointer my-1'>
                   <img src={from?.profileUrl ?? userprofile } alt="" className='h-12 w-12 object-cover rounded-full'/>
                   <div>
                      <p className='text-ascent-1  font-medium'>{from?.firstName} {from?.lastName}</p>
                      <span className='text-ascent-2 text-sm'>{from?.profession ?? 'No Proffession'}</span>
                   </div>
                   </Link>
                    {/* accept-deny button part */}
                    <div className='flex gap-2'>
                      {/* accept button  */}
                      <CustomButton
                      onClick={()=>acceptFriendRequest(_id,"Accepted")}
                       title="Accept"
                       containerStyles='bg-[#0444a4] text-white px-2 py-1 rounded-full
                       text-sm hover:text-[#0444a4] hover:bg-white'
                      />
                      {/* deny button  */}
                      <CustomButton
                      onClick={()=>acceptFriendRequest(_id,"Denied")}
                      title='Deny'
                      containerStyles="text-white px-2 py-1 rounded-full bg-[#666] text-sm  hover:text-[#666] hover:bg-white"
                      />
                    </div>
                  </div>
                )
                )
              }
             </div>
             : ""
             }
          </div>
        
            {/* dispalying suggested frineds  */}
          {suggestedFriends.length > 0 ? <> 
            {/* suggested friends container  */}
            <div className='w-full bg-primary rounded-lg px-6 py-5 shadow-sm'>

            <div className='flex items-center justify-between border-b border-[#66666645]'>
              <span className='text-lg text-ascent-1'>Friend Suggestions</span>
            </div>
            <div className='flex flex-col gap-4 mt-3'>
              {
                suggestedFriends.map((friend)=>(
                  <div className='flex justify-between items-center' key={friend._id}>
                    <Link to={'/profile/'+friend?._id} className='flex gap-2 items-center my-1'>
                      <img src={friend?.profileUrl ?? userprofile} alt="" className='h-12 w-12 object-cover rounded-full'/>
                      <div>
                        <p  className='text-ascent-1  font-medium'>{friend?.firstName} {friend?.lastName}</p>
                        <span className='text-ascent-2 text-sm'>{friend?.profession ?? 'No Proffession'}</span>
                      </div>
                    </Link>

                    {/* add-friend button  */}
                    <div>
                      <button className='bg-[#0444a430] text-white rounded-full p-1 text-sm' onClick={()=>handleFriendRequest(friend?._id)}>
                      <BsPersonFillAdd size={20} className='text-[#0f52b6]'/>
                      </button>
                    </div>
                  </div>
                ))
              }
             </div> 
             </div>
          </> : ""}
       

        </div>
        </div>
    </div>
    
   {edit &&  <EditProfile/>}
    </>
  )
}

export default Home