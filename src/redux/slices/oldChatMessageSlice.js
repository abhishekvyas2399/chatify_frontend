import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"

export const load_selectedChat_msg=createAsyncThunk("selectedChat_msg",async (_,{getState})=>{
    const server_url=import.meta.env.VITE_SERVER_URL;
    console.log("loading old chat (in redux)(selected user chat).....");
    const jwt=getState().userData.data.jwt;
    const selectedChat=getState().selectedChat.chatId;
    let oldMessage=getState().oldChatMessage.data;
    
    let lastMessage;
    if(oldMessage.length>0)
        lastMessage=oldMessage[0]._id;
    const response=await fetch(`${server_url}/api/messages/oldReadedMessage/${selectedChat}?lastMessage=${lastMessage}`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization": jwt,
        },
    });
    if(response.ok){
        const data=await response.json();
        oldMessage=[...(data.messages.reverse()),...oldMessage];  // append chats here instead of replacing
    }
    return oldMessage;
})


const oldChatMessageSlice=createSlice({
    name:"message",
    initialState:{
        isLoading:false,
        data:[],
        isError:false,
    },// bcz in redux state immutable so we cant update so we use object so we update data in its property
    // but you can update state by function return in reducer as we did in loadjwtslice.js
    // its immutable bcz its benifits like debugging, performance optimization.
    extraReducers:(builder)=>{
        builder.addCase(load_selectedChat_msg.pending,(state,action)=>{
            state.isLoading=true;
        })
        builder.addCase(load_selectedChat_msg.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.data=action.payload || [];
        })
        builder.addCase(load_selectedChat_msg.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        })
    },
    reducers:{
        clearState:(state,action)=>{
            state.data=[];
        }
    }
})

export const {clearState}=oldChatMessageSlice.actions;

export default oldChatMessageSlice.reducer;