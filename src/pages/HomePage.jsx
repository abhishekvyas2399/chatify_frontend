import {Outlet} from "react-router-dom"
import Loading from "../component/static/Loading"
import ServerOff from "../component/static/ServerOff"

import {useLoadReduxData} from "../hooks/useLoadReduxData"
import {useJoinRealTimeChat} from "../hooks/useJoinRealTimeChat"
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { clearState, load_selectedChat_msg } from "../redux/slices/oldChatMessageSlice"

import VideoCall_calling from "../component/VideoCall_calling"
import VideoCall_answer from "../component/VideoCall_answer"
import VideoCall_sender from "../component/VideoCall_sender"
import VideoCall_reciever from "../component/VideoCall_reciever"
import { useSocket } from "../context/SocketContext";
import { clearVideoCallChatData } from "../redux/slices/videoCallSlice"

function Homepage(){
    const {isReduxLoading}=useLoadReduxData();
    const isMsgLoading=useJoinRealTimeChat(isReduxLoading);

    // video call hooks
    const socket=useSocket();
    const [callerData,setCallerData]=useState(null);
    const [isCalling,setIsCalling]=useState(false);
    const [incomingCall,setIncomingCall]=useState(false);
    const [accepted,setAccepted]=useState(false);
    const [callStarted,setCallStarted]=useState(false);

    const dispatch=useDispatch();
    const selectedChat=useSelector(state=>state.selectedChat.chatId);
    // Load old messages when selectedChat changes in useEffect
    useEffect(()=>{      // its chat component effect i placed it here bcz it not need to re-render when chatpage,messagepage mount unmount when we run navigate
        if(selectedChat){
            dispatch(clearState());
            if(selectedChat)    dispatch(load_selectedChat_msg());
        }
    },[selectedChat]);



    const chatData=useSelector(state=>state.videoCallChatData.ChatData);
    const Chats =useSelector(state=>state.Chats.data);
    const handleVideoCall=useCallback((chat)=>{
        const chatId=chat._id;
        if(!chatId) return;
        setCallerData(chat);
        socket.emit("videoCall",chatId);
        setIsCalling(true);
    },[socket,setIsCalling]);

    useEffect(()=>{
        if(chatData)    handleVideoCall(chatData);
    },[chatData,handleVideoCall]);

    useEffect(()=>{
        socket.on("videoCallAnswer",({call,offline})=>{
            console.log(call," ",offline);
            if(offline){
                alert("he is offline...");
                setIsCalling(false);
                dispatch(clearVideoCallChatData());
            }
            else if(call){
                // alert("he is online");
                setIsCalling(false);
                setAccepted(true);
                setCallStarted(true);
            }else{
                if(isCalling)   alert("he rejected your call...");
                // he is offline so give user msg and turn off videocall
                setIsCalling(false);
                dispatch(clearVideoCallChatData());
            }
        })
        return ()=>{
            socket.off("videoCallAnswer");
        }
    },[socket]);

    const EndVideoCall=useCallback(()=>{
        setIsCalling(false);
        setIncomingCall(false);
        setAccepted(false);
        setCallStarted(false);
        if(!callerData) return;
        const chatId=callerData._id;
        socket.emit("endVideoCall",chatId);
        setCallerData(null);
    },[socket,callerData]);

    useEffect(()=>{
        socket.on("endVideoCall",(chatId)=>{
            console.log(chatId);
            console.log(callerData);
            if(!callerData) return;
            if(callerData._id==chatId){
                setCallerData(null);
                setIsCalling(false);
                setIncomingCall(false);
                setAccepted(false);
                setCallStarted(false);         
            }
        })
        return ()=>{
            socket.off("endVideoCall");
        }
    },[socket,callerData]);

    useEffect(()=>{
        socket.on("videoCall",(chatId)=>{
            console.log("got a chat request");
            const validChat=Chats.find(chat=>chat._id==chatId)|| null;
            if(!validChat)  return;
            setCallerData(validChat);
            console.log(validChat);
            setIncomingCall(true);
        });

        return ()=>{
            socket.off("videoCall");
        }
    },[socket,Chats]);

    console.log("home page re-rendering!!");
    if(isMsgLoading)  return <Loading></Loading>

    return (
        <div>
            {/* for video call window */}
            <div className="fixed top-35">
                {isCalling && <VideoCall_calling EndVideoCall={EndVideoCall} clearVideoCallChatData={clearVideoCallChatData}/>}
                {incomingCall && <VideoCall_answer EndVideoCall={EndVideoCall} callerData={callerData} setCallerData={setCallerData} setIncomingCall={setIncomingCall} setCallStarted={setCallStarted}/>}
                {callStarted && accepted && <VideoCall_sender EndVideoCall={EndVideoCall} roomId={callerData._id} setAccepted={setAccepted} setCallStarted={setCallStarted} />}
                {callStarted && !accepted  && <VideoCall_reciever EndVideoCall={EndVideoCall} roomId={callerData._id} setCallStarted={setCallStarted} />}
            </div>

            <Outlet/>{/* outlet will render Chats or Messages depending on the URL */}
        </div>
      );
}
export default Homepage;