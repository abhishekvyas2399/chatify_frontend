import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"

export const loadChat=createAsyncThunk("loadChat",async (_,{getState})=>{
    const server_url=import.meta.env.VITE_SERVER_URL;
    console.log("loading all chats info (in redux)(all chat).....");
    const jwt=getState().userData.jwt;
    const response=await fetch(`${server_url}/api/chats`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization": jwt,
        }
    });
    return response.json();
})


const chatSlice=createSlice({
    name:"chat",
    initialState:{
        isLoading:false,
        data:null,
        isError:false,
    },
    extraReducers:(builder)=>{
        builder.addCase(loadChat.pending,(state,action)=>{
            state.isLoading=true;
        })
        builder.addCase(loadChat.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.data=action.payload;
        })
        builder.addCase(loadChat.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })
    }
})


export default chatSlice.reducer;