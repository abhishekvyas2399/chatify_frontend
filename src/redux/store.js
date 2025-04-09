import {configureStore} from "@reduxjs/toolkit"

import userInfoSliceReducer from "./slices/userDataSlice"
import chatSliceReducer from "./slices/chatSlice"
import selectedChatReducer from "./slices/selectedChatSlice"
import newMessageSliceReducer from "./slices/newMessageSlice"
import oldChatMessageSliceReducer from "./slices/oldChatMessageSlice"
import AllUnreadMessageSliceReducer from "./slices/allUnreadmessageSlice"

export const store=configureStore({
    reducer:{
        userData:userInfoSliceReducer,   // get jwt from localstorage ,verifyUser by fetch ,fetch all user info & store all
        Chats:chatSliceReducer,    // store,fetch all user chats
        selectedChat:selectedChatReducer,   // which chat now on
        oldChatMessage:oldChatMessageSliceReducer, // store all loaded old chat message of a chat
        AllUnreadMessage:AllUnreadMessageSliceReducer, // store all unread messages of all chat of a user
        newMessage:newMessageSliceReducer,   // store message get from socket
    }
});