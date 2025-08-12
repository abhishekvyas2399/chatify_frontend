import { useDispatch, useSelector } from "react-redux";
import {addMessage, updateMessageReadRecipt} from "../redux/slices/newMessageSlice"
import axios from "axios"
import { useCallback, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { updateUnreadMessageReadRecipt } from "../redux/slices/allUnreadmessageSlice";

export default function useListenChatMsg(){
    const server_url=import.meta.env.VITE_SERVER_URL;
    const dispatch=useDispatch();
    const socket=useSocket();
    const jwt=useSelector(state=>state.userData.jwt);
    const selectedChat=useSelector(state=>state.selectedChat.chatId);

    const msgSocketEventListner=useCallback(()=>{
        socket.on("chat Message",async ({chatId,createdAt,isRead,message,senderId,senderName,filePath,fileType,_id})=>{
            if(selectedChat!=chatId){
                try{
                    await axios.post(`${server_url}/api/messages/singleDelivered/${chatId}`,{msgId:_id},{headers:{Authorization:jwt}});
                    isRead="delivered";
                }catch(e){
                    console.error(e.message);
                }
            }
            else{
                try{
                    await axios.post(`${server_url}/api/messages/singleRead/${chatId}`,{msgId:_id},{headers:{Authorization:jwt}});
                    isRead="read";
                }catch(e){
                    console.error(e.message);
                }
            }
            socket.emit("read recipt",{chatId,isRead});
            if(filePath && fileType){
                try{
                    const res= await axios.post(`${server_url}/api/uploads/downloadSignedUrl`,{filePath},{headers:{Authorization:jwt}});
                    const fileSignedUrl=res.data.signedUrl;
                    dispatch(addMessage({chatId,messageData:{_id,senderId,senderName,message,fileSignedUrl,filePath,fileType,createdAt,isRead}}));
                    return;
                }catch(e){
                    console.error(e.message);
                }
            }
            dispatch(addMessage({chatId,messageData:{_id,senderId,senderName,message,createdAt,isRead}}));
        })
    },[socket,selectedChat,jwt]);

    const readReciptEventListner=useCallback(()=>{
        socket.on("read recipt",(data)=>{
            dispatch(updateMessageReadRecipt(data));
            dispatch(updateUnreadMessageReadRecipt(data));
        });
    },[]);

    useEffect(()=>{
        msgSocketEventListner();
        readReciptEventListner();
        return ()=>{
            if(socket)
                socket.off("chat Message");
                socket.off("read recipt");
        }
    },[socket,msgSocketEventListner])
}