import { useDispatch, useSelector } from "react-redux";
import {useNavigate } from "react-router-dom";

import {setSelectedChat} from "../redux/slices/selectedChatSlice"

import { addVideoCallChatData } from "../redux/slices/videoCallSlice";
import { useSocket } from "../context/SocketContext";
import formatLocalStringTime_forMsg from "../utils/formatMsgTime";

export default function Chats(){
    const socket=useSocket();
    const server_url=import.meta.env.VITE_SERVER_URL;
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const Chats =useSelector(state=>state.Chats.data);
    const userData_username =useSelector(state=>state.userData.userInfo.username);
    const selectedChat=useSelector(state=>state.selectedChat.chatId);
    const jwt=useSelector(state=>state.userData.jwt);
    const newMessage=useSelector(state=>state.newMessage);

    const markChatReaded=async (chatId)=>{
        if (chatId){
            // mark read in DB
            fetch(`${server_url}/api/messages/read/${chatId}`,{
                method:"POST",
                headers:{
                  "Content-Type":"application/json",
                  Authorization:jwt
                },
            }).then(res=>{
                if(res.ok){
                    console.log("mark readed");
                }
            });

            // mark read real time socket 
            socket.emit("read recipt",{chatId,isRead:"read"});
        }
    }

    return (
        <div className="bg-gradient-to-b from-[#121026] to-[#1A1333] overflow-y-auto h-[100%] shadow-2xl rounded-xl p-4 
        ">
            <ul className="divide-y border-[#2A2D41] space-y-3">
            {Chats && Chats.map((chat) =>(
                <div key={chat._id}>
                    <li
                    onClick={() =>{
                        dispatch(setSelectedChat({chatId:chat._id,chatDetails:chat}));
                        markChatReaded(chat._id);
                        if(window.location.pathname!=="/message"){
                            navigate(`message`);
                        }
                        // navigate(`message`,{replace:true}); so when u click it multiple time it not put /message multiple time in stack instead it replace . so when press back u back to previous page .  but if u not use it then u have to press first to remove /messgae from stack multiple times then u goto previous page.
                    }}
                    className={`cursor-pointer px-4 py-3 rounded-lg shadow-md hover:shadow-md hover:bg-[#2A234C] transition-all duration-300 flex items-center gap-3 overflow-hidden hover:scale-[1.02] ${selectedChat==chat._id ? "ring-2 ring-indigo-900 bg-[#2A234C]" : "bg-[#211C3A]"}`}>
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-indigo-900  to-indigo-800 text-white font-bold rounded-full text-lg">
                            {chat.usernames[0] === userData_username ? chat.usernames[1][0].toUpperCase() : chat.usernames[0][0].toUpperCase()}
                        </div>
                        <div className="w-full">
                            <span className="text-white font-medium w-fit tracking-wide text-base break-words whitespace-pre-wrap max-w-[80%]">
                                {chat.usernames[0] === userData_username ? 
                                (chat.usernames[1].length>8 ?chat.usernames[1].slice(0,6).toUpperCase()+"..":chat.usernames[1].toUpperCase() )
                                :(chat.usernames[0].length>8?chat.usernames[0].slice(0,6).toUpperCase()+"..":chat.usernames[0].toUpperCase())}
                            </span>
                            <div className="text-white text-[10px]">
                                {newMessage[chat._id]?.length?
                                <div className="flex flex-row justify-between">
                                    <div className="w-20 truncate">{newMessage[chat._id].at(-1)?.message?newMessage[chat._id].at(-1).message:newMessage[chat._id].at(-1)?.fileType?.split('/')[0]}</div>
                                    <div className="pl-2">{newMessage[chat._id].at(-1)?.message && formatLocalStringTime_forMsg(chat.updatedAt)}</div>
                                </div>
                                :<div className="flex flex-row justify-between">
                                    <div className="w-20 truncate">{chat.lastMessage?chat.lastMessage:chat.fileType?.split('/')[0]}</div>
                                    <div className="pl-2">{chat.lastMessage && formatLocalStringTime_forMsg(chat.updatedAt)}</div>
                                </div>
                                }
                            </div>
                        </div>
                    </li>
                    {/* <div className="m-3 pt-2 pl-2 bg-blue-700 text-white shadow-lg rounded-full h-10 w-10" onClick={()=>dispatch(addVideoCallChatData({chat}))}> */}
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"> */}
                                {/* <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /> */}
                        {/* </svg> */}
                    {/* </div> */}
                </div>
            ))}
            </ul>
        </div>
    );
}