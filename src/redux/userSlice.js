import { createSlice } from "@reduxjs/toolkit";
import {user} from '../assets/data.js'

const initialState = {
    user : JSON.parse(window?.localStorage.getItem('user'))?? {},
    edit : false,
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
     login(state,action){
        state.user = action.payload;
        localStorage.setItem('user',JSON.stringify(action.payload));
    },
    logout(state){
        console.log("i am in redux logout")
        state.user=null;
        localStorage?.removeItem('user');
    },
    updateProfile(state,action){
      state.edit = action.payload;
    }
    }
})

export default userSlice.reducer;

export function userLogin(user){
    return (dispatch,getState)=>{
     dispatch(userSlice.actions.login(user));
    }
}

export function Logout(){
    console.log("logout")
    return (dispatch)=>{
        dispatch(userSlice.actions.logout());
    }
}

export function UpdateProfile(val){
    return (dispatch,getState)=>{
        dispatch(userSlice.actions.updateProfile(val));
    }
}