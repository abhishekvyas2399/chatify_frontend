import { useState, useEffect, useContext, useRef } from "react";
import { Socket } from "../context/socketContext";
import { useDispatch, useSelector } from "react-redux";

import  {load_selectedChat_msg} from "../redux/slices/oldChatMessageSlice"
import {clearState} from "../redux/slices/oldChatMessageSlice"
import { current } from "@reduxjs/toolkit";

export default function Messages() {
    const server_url=import.meta.env.VITE_SERVER_URL;
    const dispatch=useDispatch();
    const {socket}=useContext(Socket);
    const jwt=useSelector(state=>state.userData.data.jwt);
    const selectedChat=useSelector(state=>state.selectedChat.chatId);
    const selectedChatDetails=useSelector(state=>state.selectedChat.chatDetails);
    const userInfo=useSelector(state=>state.userData.data.userInfo);
    const messageRef=useRef();
    const chatContainerRef=useRef();
    let debounceTimeOut=useRef(); // we make debounce useRef bcz to prevent it while re-render bcz if we lost it we not clear old timeout which make not prevent alot of request and it load our server from request. 

    const oldChatMessage=useSelector(state=>state.oldChatMessage.data);
    const AllUnreadMessage=useSelector(state=>state.AllUnreadMessage.data.unreadMessage[selectedChat]);
    const newMessage=useSelector(state=>state.newMessage[selectedChat]);

    // Load old messages when selectedChat changes in useEffect
    useEffect(()=>{
        if(selectedChat){
            dispatch(clearState());
            if(selectedChat)    dispatch(load_selectedChat_msg());
        }
    },[selectedChat]);

    // Handle sending a new message
    const sendMessage = () => {
        // *********** first send data to server for save in mongoDb then send to socket
        const newMessage=messageRef.current.value;
        messageRef.current.value="";
        if (newMessage.trim() === "") return;
        if (selectedChat){
            fetch(`${server_url}/api/messages`,{
                method:"POST",
                headers:{
                  "Content-Type":"application/json",
                  Authorization:jwt
                },
                body:JSON.stringify({chat_Id:selectedChat,message:newMessage}),
              }).then(res=>{
                if(res.ok){
                    // if save to DB sent it to socket
                    socket.emit("chat Message",{chatId:selectedChat,newMessage,senderId:userInfo.id,senderName:userInfo.username});
                }
              });
        }
    };


    // event=>scrolling to top will fetch more 20 old message from backend by redux thunk action dispatch
    const handleScroll=async ()=>{
        const chatDiv=chatContainerRef.current;
        const prevHeight=chatDiv.scrollHeight;

        if(chatDiv.scrollTop===0){
            if(selectedChat){

                clearTimeout(debounceTimeOut); // maybe user scroll very fast can lead "overload the server or cause unnecessary network requests" so make him request only after 2 seconds
                debounceTimeOut=setTimeout(async ()=>{
                    await dispatch(load_selectedChat_msg()).unwrap();
                    chatDiv.scrollTop=chatDiv.scrollHeight-prevHeight; // for smooth rendering by make scroll fix to current position when new data load
                },1000);
            } 
        } 
    }
    useEffect(()=>{
        const chatDiv=chatContainerRef.current;
        if(!chatDiv) return;
        chatDiv.addEventListener("scroll",handleScroll);
        return ()=>{
            chatDiv.removeEventListener("scroll",handleScroll);
        }
    },[chatContainerRef.current])  // initially chatContainerRef.current null bcz ref={chatContainerRef} run after useEffect so add chatContainerRef.current in dependancy array so in next re-render it run again bcz  chatContainerRef.current now null to <div>


    useEffect(()=>{
        if(chatContainerRef.current)
            chatContainerRef.current.scrollTop=chatContainerRef.current.scrollHeight-chatContainerRef.current.clientHeight;
    },[newMessage,AllUnreadMessage])

    return (
            <div className="flex flex-col h-full w-full">
                {selectedChat ? (
                    <div className="flex flex-col h-full bg-white shadow-md rounded-lg border border-gray-200 p-4">
                        <h2 className="text-xl font-semibold text-gray-900 text-center py-2 border-b border-gray-300 shadow-sm tracking-wide mb-4">{selectedChatDetails.username[0]==userInfo.username?selectedChatDetails.username[1].toUpperCase():selectedChatDetails.username[0].toUpperCase()}</h2>
                        <div className="flex-grow overflow-y-auto p-3 rounded-lg bg-white shadow-md border border-gray-300" ref={chatContainerRef}>
                            {oldChatMessage?oldChatMessage.map((msg,index) => (
                                <div key={index} className={`p-3 my-2 rounded-lg ${msg.sender_name === userInfo.username ? "bg-blue-500 text-white text-right ml-auto" : "bg-gray-300 text-black"}`}>
                                    <div className="text-sm font-semibold mb-1">{msg.sender_name==userInfo.username?"You":msg.sender_name}</div>
                                    <div className="bg-gray-200 p-2 rounded-md max-w-[70%] inline-block shadow-sm text-black w-fit  break-words  whitespace-pre-wrap">{msg.message}</div>
                                </div>
                            )):null}
                            {AllUnreadMessage?AllUnreadMessage.map((msg,index) => (
                                <div key={index} className={`p-2 my-1 rounded ${msg.sender_name === userInfo.username ? "bg-blue-500 text-white text-right" : "bg-gray-300 text-black"}`}>
                                    <div className="text-sm font-semibold mb-1">{msg.sender_name==userInfo.username?"You":msg.sender_name}</div>
                                    <div className="bg-gray-200 p-2 rounded-md max-w-[70%] inline-block shadow-sm text-black w-fit  break-words  whitespace-pre-wrap">{msg.message}</div>
                                </div>
                            )):null}
                            {newMessage?newMessage.map((msg,index) => (
                                <div key={index} className={`p-2 my-1 rounded ${msg.senderName === userInfo.username ? "bg-blue-500 text-white text-right" : "bg-gray-300 text-black"}`}>
                                    <div className="text-sm font-semibold mb-1">{msg.senderName==userInfo.username?"You":msg.senderName}</div>
                                    <div className="bg-gray-200 p-2 rounded-md max-w-[70%] inline-block shadow-sm text-black w-fit  break-words  whitespace-pre-wrap">{msg.message}</div>
                                </div>
                            )):null}
                        </div>

                        {/* Input Box */}
                        <div className="mt-4 flex items-center gap-2 shadow-2xl rounded-lg p-2 bg-white ">
                            <input
                                type="text"
                                className="flex-1 p-3 border-none outline-none bg-transparent text-gray-700 placeholder-gray-400"
                                placeholder="Type a message..."
                                ref={messageRef}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}  // trigger on press Enter
                            />
                            <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                                Send
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-600">Select a chat to start messaging.</p>
                )}
            </div>
    );
}




//  database -----> r--> 1,2,3,4,5,6,7,8,9,10  ur--> 11 12 13 14 15 16 17 18 19 20

// oldreaded:-  1,2,3,4,5
// unreaded:-   11 12 13 14 15 16 17 18 19 20
// printing 
// oldreaded= 1,2,3,4,5
// unread= 11 12 13 14 15 16 17 18 19 20
//----------------
// oldreaded:-  1,2,3,4,5  +  6,7,8,9,10
// oldreaded= 1,2,3,4,5,6,7,8,9,10  
// unread= 11 12 13 14 15 16 17 18 19 20


// oldreaded= 10,9,8,7,6   (createdAt:-1)
// unread= 11 12 13 14 15 16 17 18 19 20
// printing
// oldreaded= reverse(10,9,8,7,6)     6,7,8,9,10
// unread= 11 12 13 14 15 16 17 18 19 20
//--------------- lastmessage=oldreaded[1],
// oldreaded= [...reverse(5,4,3,2,1),...oldreaded( 6,7,8,9,10 )]    ==> 1,2,3,4,5,6,7,8,9,10
// unread= 11 12 13 14 15 16 17 18 19 20
// 
//