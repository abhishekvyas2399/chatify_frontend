import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useSocket } from "../context/SocketContext";

import {addMessage} from "../redux/slices/newMessageSlice"

export const useJoinRealTimeChat=(isReduxLoading)=>{
    const dispatch=useDispatch();
    const Chats=useSelector(state=>state.Chats);
    const socket=useSocket();
    const [isMsgLoading,setIsMsgLoading]=useState(true);

    const joinRooms=useCallback(()=>{
        if(isMsgLoading==false)   return;
        if(!Chats.data)       return;
        Chats.data.forEach(ele=>{
            socket.emit("joinRoom",ele._id);
        })
        socket.on("chat Message",(newMessage)=>{
            const chatId=newMessage.chatId;
            const message=newMessage.text;
            const message_time=new Date(newMessage.timestamp).toLocaleString();
            const senderName=newMessage.senderName;
            dispatch(addMessage({chatId,messageData:{senderName,message,message_time}}));
        })
        console.log("all chats real Time now .....");
        setIsMsgLoading(false);
        // load new message here
    },[socket,Chats])

    useEffect(()=>{
        if(!isReduxLoading){


            if(socket){
                if(socket.connected)
                    joinRooms();
                else
                    socket.on("connect",joinRooms) // When the connection is established, the "connect" event automatically triggers,
            }

            return ()=>{
                if(socket){
                    socket.off("connect",joinRooms)
                    socket.off("chat Message");
                }
            }
        }
    },[isReduxLoading,socket])

    return isMsgLoading;
}