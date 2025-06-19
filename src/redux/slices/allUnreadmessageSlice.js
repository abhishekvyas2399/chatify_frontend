import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"

export const load_allUnread_msg=createAsyncThunk("allUnread_msg",async (_,{getState})=>{
    const server_url=import.meta.env.VITE_SERVER_URL;
    console.log("loading unread msg (in redux)(chat all).....");
    const jwt=getState().userData.jwt;
    const chats=getState().Chats.data;
    const chatsLen=chats.length;

    const unreadMessage={};
    for(let i=0;i<chatsLen;i++){
        const response=await fetch(`${server_url}/api/messages/unreadedMessage/${chats[i]._id}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": jwt,
            },
        });
        if(response.ok){
            const data=await response.json();
            unreadMessage[chats[i]._id]=data.messages;
        }
    }
    return {unreadMessage};
})


const allUnreadMessageSlice=createSlice({
    name:"message",
    initialState:{
        isLoading:false,
        data:null,
        isError:false,
    },// bcz in redux state immutable so we cant update so we use object so we update data in its property
    // but you can update state by function return in reducer as we did in loadjwtslice.js
    // its immutable bcz its benifits like debugging, performance optimization.
    extraReducers:(builder)=>{
        builder.addCase(load_allUnread_msg.pending,(state,action)=>{
            state.isLoading=true;
        })
        builder.addCase(load_allUnread_msg.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.data=action.payload;
            // append chats here instead of replacing
        })
        builder.addCase(load_allUnread_msg.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })
    }
})

export default allUnreadMessageSlice.reducer;