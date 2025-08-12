import {createSlice} from "@reduxjs/toolkit"

const newMessageSlice=createSlice({
    name:"newMessage",
    initialState:{},
    reducers:{
        addMessage:(state,action)=>{
            const {chatId,messageData}=action.payload;
            if(!state[chatId]){
                state[chatId]=[];  // if state[chatId] not exist initialize a with []
            }
            state[chatId].push(messageData); // modifies the existing array inside the Redux state directly
                    // {
                    //   "chat123": [ { text: "Hello" }, { text: "How are you?" } ],
                    //   "chat456": [ { text: "Hey!" }, { text: "What's up?" } ]
                    // }
        },
        updateMessageReadRecipt:(state,action)=>{
            const {isRead,chatId}=action.payload;
            state[chatId]=state[chatId]?.map(msg=>{
                if(isRead=="unread")    return msg;
                if(isRead=="delivered" && msg.isRead!="unread") return msg;
                msg.isRead=isRead;
                return msg;
            })
        }
    }
})

// dispatch(addMessage({ chatId, message }));    for execute this action
// const messages = useSelector((state) => state.messages[chatId] || []);    for access messages from it

export const {addMessage,updateMessageReadRecipt}=newMessageSlice.actions;

export default newMessageSlice.reducer;