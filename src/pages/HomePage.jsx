import {Outlet} from "react-router-dom"
import Loading from "../component/static/Loading"
import ServerOff from "../component/static/ServerOff"

import {useLoadReduxData} from "../hooks/useLoadReduxData"
import {useJoinRealTimeChat} from "../hooks/useJoinRealTimeChat"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearState, load_selectedChat_msg } from "../redux/slices/oldChatMessageSlice"


function Homepage(){
    const {isReduxLoading}=useLoadReduxData();
    const isMsgLoading=useJoinRealTimeChat(isReduxLoading);


    const dispatch=useDispatch();
    const selectedChat=useSelector(state=>state.selectedChat.chatId);
    // Load old messages when selectedChat changes in useEffect
    useEffect(()=>{      // its chat component effect i placed it here bcz it not need to re-render when chatpage,messagepage mount unmount when we run navigate
        if(selectedChat){
            dispatch(clearState());
            if(selectedChat)    dispatch(load_selectedChat_msg());
        }
    },[selectedChat]);


    console.log("home page re-rendering!!");
    if(isMsgLoading)  return <Loading></Loading>

    return (
        <div>
            <Outlet/>{/* outlet will render Chats or Messages depending on the URL */}
        </div>
      );
}
export default Homepage;