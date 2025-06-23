import  {createSlice} from "@reduxjs/toolkit"

const videoCallSlice=createSlice({
    name:"videoCallSlice",
    initialState:{
        ChatData:null,
    },
    reducers:{
        addVideoCallChatData:(state,action)=>{
            state.ChatData=action.payload.chat;
        },
        clearVideoCallChatData:(state)=>{
            state.ChatData=null;
        }
    }
});

export const {addVideoCallChatData,clearVideoCallChatData}=videoCallSlice.actions;

export default videoCallSlice.reducer;