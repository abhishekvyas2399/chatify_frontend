import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {io} from "socket.io-client"

import {addMessage} from "../redux/slices/newMessageSlice"

export const useSocket=(isReduxLoading)=>{
    const server_url=import.meta.env.VITE_SERVER_URL;
    const dispatch=useDispatch();
    const Chats=useSelector(state=>state.Chats);
    const [socket,setSocket]=useState(null);
    const [isSocketLoading,setisSocketLoading]=useState(true);


    const joinRooms=useCallback(()=>{
        console.log("user connected.....");
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
        setisSocketLoading(false);
        // load new message here
    },[socket,Chats])

    useEffect(()=>{
        if(!isReduxLoading){
            setSocket(prevSocket=>{
                if(!prevSocket) return io(server_url);
                return prevSocket;
            })

            if(socket){
                if(socket.connected)
                    joinRooms();
                else
                    socket.on("connect",joinRooms) // When the connection is established, the "connect" event automatically triggers,
                
                return ()=>{
                }
            }

            return ()=>{
                if(socket){
                    socket.off("connect",joinRooms)
                    // socket.off("chat Message");
                }
                setSocket(prevSocket=>{
                    if(prevSocket)  prevSocket.disconnect();
                    return null;
                })
            }
        }
    },[isReduxLoading,socket])

    return {socket,isSocketLoading};
}