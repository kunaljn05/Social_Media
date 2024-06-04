import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import {FriendCard, Loading, PostCard, ProfileCard, Topbar} from '../components'
import { deletePost, fetchPosts, getUserInfo, likePost } from '../utils';

const Profile = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {user} = useSelector(state=>state.user);
    const {posts} = useSelector(state=>state.posts);
    const [userInfo,setUserInfo] = useState(user);
    const [loading,setLoading] = useState(false);


    const uri = "posts/get-user-post"+id;

    const handleDelete = async(id)=>{
     await deletePost(id,user.token);
     await getPost();
    };

    const handleLikePost = async(uri)=>{
     await likePost({uri : uri , token: user?.token});
     await getPost();
    };

    const getUser = async()=>{
      const res = await getUserInfo(user?.token,id);
      console.log(res);
      setUserInfo(res);
    }

    const getPost = async()=>{
    await fetchPosts(user?.token,dispatch,uri);
    setLoading(false);
    }

    useEffect(()=>{
     setLoading(true);
     getUser();
     getPost();
    },[id]);

  return (
    <>
    <div className='home w-full h-screen px-0 lg:px-10 2xl:px-40 bg-bgColor lg:rounded-lg overflow-hidden'>
        <Topbar/>
        <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
           {/* LEFT  */}
        <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
          {/* profileCard component  */}
          <ProfileCard user={userInfo}/>
          {/* friendcard component  */}
          <div className='block lg:hidden'>
          <FriendCard friends={userInfo?.friends}/>
          </div>
        </div>
            {/* CENTER  */}

            <div className='h-full flex-1 flex flex-col gap-6 overflow-y-auto'>
               {/* DISPLAYING POSTS  */}
           {
              loading ? (<Loading/>) : (posts?.length > 0 ? posts?.map((post)=>(
                // rendering post card component 
                <PostCard key={post?._id}
                post={post}
                user={userInfo}
                deletePost={()=>{}}
                likePost = {()=>{}}
                />
              )) : (<div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>))
           }
              </div>

           {/* RIGHT  */}
           <div className='hidden w-1/4 lg:flex flex-col gap-8 overflow-y-auto'>
             <FriendCard friends={userInfo?.friends}/>
            </div>
        </div> 
    </div>
    </>
  )
}

export default Profile