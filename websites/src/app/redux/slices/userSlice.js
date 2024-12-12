import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const cookieData=JSON.parse(localStorage.getItem('user-data'))

const initialState= {
    value: cookieData,
};
export const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        login:(state,action)=>{
            state.value=action.payload
          
        },
        logout:(state,action)=>{
            state.value = null; // Clear the user state
            localStorage.removeItem('user-data');
        },
        filepath:(state,action)=>{
            state.value=action.payload
        }
        
    }   
})

export const {login,logout}=userSlice.actions
export default userSlice.reducer;