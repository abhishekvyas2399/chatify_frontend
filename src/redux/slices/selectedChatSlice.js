import {createSlice} from "@reduxjs/toolkit"

const selectedChatSlice=createSlice({
    name:"selectedChat",
    initialState:{chatId:null,chatDetails:{}},
    reducers:{
        setSelectedChat:(state,action)=>{
            state.chatId=action.payload.chatId;
            state.chatDetails=action.payload.chatDetails || {};
        },
        clearSelectedChat:(state,action)=>{
            state.chatId=null;
            state.chatDetails={};
        }
    }
})

export const {setSelectedChat,clearSelectedChat}=selectedChatSlice.actions;

export default selectedChatSlice.reducer;