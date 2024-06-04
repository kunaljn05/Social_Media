import {SetPosts}from '../redux/postSlice.js'
import axios from 'axios'
const API_URL = 'http://localhost:8800'

export const API = axios.create({
    baseURL : API_URL,
    responseType : "json",
})

export const apiRequest = async ({ url, token, data, method }) => {
    console.log("i am  in api requst")
    try {
      const result = await API({
        url,
        method : method || "GET",
        data: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      return result;
    } 
    catch (error) {
        console.log("api ke andar error")
      const err = error.response?.data;
      return { status: err?.success, message: err?.message };
    }
  }

export const handleFileUpload = async(uploadFile)=>{
const formData = new FormData();
formData.append("file",uploadFile);
formData.append("upload_preset","socialmedia");

try{
    const response = await axios.post(`https://api.cloudinary.com/v1_1/dyx3vbwok/image/upload`
    ,formData);
    return response.data.secure_url;
}
catch(error){
    console.log(error);

}
}

export const fetchPosts = async(token,dispatch,url,data)=>{
    try{
        const res = await apiRequest({
            url : url || "/posts",
            token : token,
            data : data || {},
            method : "POST",
        });
        await dispatch(SetPosts(res.data.data));
        return;
    }
    catch(error){
        console.log(error)
    }
}

export const likePost = async({uri,token})=>{
    try{
        const res = await apiRequest({
            url : uri,
            token : token,
            method : "POST",
        });
        return res;
    }
    catch(error){
        console.log(error);
    }
}

export const deletePost = async(id,token)=>{
try{
    const res = await apiRequest({
        url : "/posts/" + id,
        token : token,
        method : "DELETE"
    });
    return;
}
catch(error){
    console.log(error)
}
}

 export const getUserInfo = async(token,id)=>{
    try{
        // if id is undefined means we want to access your data 
        const uri = id === undefined ? "/users/get-user" : "/users/get-user/" + id;

        const res = await apiRequest({
            url : uri,
            token : token,
            method : "POST",
        });

        if(res.message === "Authentication failed"){
            localStorage.removeItem("user");
            window.alert("User expired. Login again.");
            window.location.replace("/login");
        }
        return res?.data?.user;
    }
    catch(error){
        console.log(error)
    }
 }

 export const sendFriendRequest = async(token,id)=>{
    try{
        const res = await apiRequest({
            url : "/users/friend-request",
            token : token,
            method : "POST",
            data : {requestTo : id},
        });

        return;
    }
    catch(error){
        console.log(error);
    }
 }

 export const viewUserProfile = async(token,id)=>{
    try{
        const res = await apiRequest({
            url : "/users/profile-view",
            token :token,
            method : "POST",
            data : {id},
        }
    )
    return;
 }
 catch(error){
    console.log(error)
 }
}