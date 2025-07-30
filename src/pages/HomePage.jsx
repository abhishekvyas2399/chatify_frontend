import {Outlet} from "react-router-dom"
import Loading from "../component/static/Loading"
import ServerOff from "../component/static/ServerOff"

import {useLoadReduxData} from "../hooks/useLoadReduxData"
import useListenChatMsg from "../hooks/useListenChatMsg";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { clearState, load_selectedChat_msg } from "../redux/slices/oldChatMessageSlice"

import VideoCall_calling from "../component/VideoCall_calling"
import VideoCall_answer from "../component/VideoCall_answer"
import VideoCall_sender from "../component/VideoCall_sender"
import VideoCall_reciever from "../component/VideoCall_reciever"
import { useSocket } from "../context/SocketContext";
import { clearVideoCallChatData } from "../redux/slices/videoCallSlice"

//********************************************************
// ✅ Include in [] (store by value → may go stale):
// 	•	props
// 	•	state variables from useState
// 	•	context values
// 	•	Computed variables (const x = something + y)
// 	•	Functions created with useCallback
// 💡 Why? These are value-based, so React can’t track their latest version unless you list them.
// ///
// ❌ Do NOT include (store by reference → auto-updated):
// 	•	navigate (from react-router)
// 	•	location, params, match
// 	•	dispatch (from Redux)
// 	•	setState functions
// 	•	Functions NOT wrapped in useCallback
// 💡 Why? These are reference-based, always point to the latest — including them may cause unnecessary re-renders.
//********************************************************

// Yes ✅, navigate is unstable because React Router creates a new navigate function on every render, so:
// 	•	🔁 It changes on re-render → makes useCallback or useEffect re-run.
// 	•	🚫 If you add it in dependencies, effect keeps firing again.
// 	•	✅ But you can safely exclude it — it always refers to the latest internal router, so it still works fine even if not in dependencies.


function Homepage(){
    const {isReduxLoading}=useLoadReduxData();
    useListenChatMsg();
    const [isServerOff,setIsServerOff]=useState(false);

    // video call hooks
    const socket=useSocket();
    const [callerData,setCallerData]=useState(null);
    const [showCallingScreen,setShowCallingScreen]=useState(false);
    const [showIncomingCallScreen,setShowIncomingCallScreen]=useState(false);
    const [startSenderCall,setStartSenderCall]=useState(false);
    const [startReceiverCall,setStartReceiverCall]=useState(false);
    const currentStream=useRef(null);

    const dispatch=useDispatch();
    const selectedChat=useSelector(state=>state.selectedChat.chatId);
    // Load old messages when selectedChat changes in useEffect
    useEffect(()=>{      // its chat component effect i placed it here bcz it not need to re-render when chatpage,messagepage mount unmount when we run navigate
        if(selectedChat){
            dispatch(clearState());
            if(selectedChat)    dispatch(load_selectedChat_msg());
        }
    },[selectedChat]);



    const VideoChatData=useSelector(state=>state.videoCallChatData.ChatData);
    const Chats =useSelector(state=>state.Chats.data);
    const handleVideoCall=useCallback((chat)=>{
        if(!chat) return;
        const chatId=chat._id;
        if(!chatId) return;
        setCallerData(chat);
        socket.emit("videoCall",chatId);
        setShowCallingScreen(true);
    },[socket]);

    useEffect(()=>{
        if(VideoChatData)    handleVideoCall(VideoChatData);
    },[VideoChatData,handleVideoCall]);

    useEffect(()=>{
        socket.on("videoCallAnswer",({call,offline})=>{
            if(offline){//offline
                // alert("he is offline...");
                setTimeout(()=>{
                    setShowCallingScreen(false);
                    dispatch(clearVideoCallChatData());
                    setCallerData(null);
                },2000);
            }
            else if(call){//online
                setShowCallingScreen(false);
                setStartSenderCall(true);
            }else{//rejected ur call
                if(showCallingScreen)   alert("he rejected your call...");
                setShowCallingScreen(false);
                dispatch(clearVideoCallChatData());
                setCallerData(null);
            }
        })
        return ()=>{
            socket.off("videoCallAnswer");
        }
    },[socket]);

    const EndVideoCall=useCallback(()=>{
        setShowCallingScreen(false);
        setShowIncomingCallScreen(false);
        setStartSenderCall(false);
        setStartReceiverCall(false);
        if(!callerData) return;
        const chatId=callerData._id;
        if(!chatId) return;
        socket.emit("endVideoCall",chatId);
        setCallerData(null);
        dispatch(clearVideoCallChatData());
        if(currentStream.current){
            currentStream.current.getTracks().forEach(track=>{
                track.stop();
            })
        }
    },[socket,callerData,dispatch]);

    useEffect(()=>{
        socket.on("endVideoCall",(chatId)=>{
            if(!callerData) return;
            if(callerData._id==chatId){
                setShowCallingScreen(false);
                setShowIncomingCallScreen(false);
                setStartSenderCall(false);
                setStartReceiverCall(false);
                setCallerData(null);
                dispatch(clearVideoCallChatData());
                if(currentStream.current){
                    currentStream.current.getTracks().forEach(track=>{
                        track.stop();
                    })
                }
            }
        })
        return ()=>{
            socket.off("endVideoCall");
        }
    },[socket,callerData,dispatch]);

    useEffect(()=>{
        socket.on("videoCall",(chatId)=>{
            const validChat=Chats.find(chat=>chat._id==chatId)|| null;
            if(!validChat)  return;
            setCallerData(validChat);
            setShowIncomingCallScreen(true);
        });

        return ()=>{
            socket.off("videoCall");
        }
    },[socket,Chats]);

    useEffect(()=>{
        setTimeout(()=>{
            if(!socket.connected)    setIsServerOff(true);
        },10000)
    },[socket]);

    console.log("home page re-rendering!!");
    if(isServerOff)  return <ServerOff/>
    if(isReduxLoading)  return <Loading/>

    return (
        <div>
            {/* for video call window */}
            <div className="fixed top-35">
                {/* {showCallingScreen && <VideoCall_calling callerData={callerData} EndVideoCall={EndVideoCall} />} */}
                {showIncomingCallScreen && <VideoCall_answer callerData={callerData} setCallerData={setCallerData} setShowIncomingCallScreen={setShowIncomingCallScreen} setStartReceiverCall={setStartReceiverCall}/>}
                {startSenderCall && <VideoCall_sender currentStream={currentStream} EndVideoCall={EndVideoCall} roomId={callerData._id} />}
                {startReceiverCall && <VideoCall_reciever currentStream={currentStream} EndVideoCall={EndVideoCall} roomId={callerData._id} />}
            </div>

            <Outlet/>{/* outlet will render Chats or Messages depending on the URL */}
        </div>
      );
}
export default Homepage;