import { useDispatch, useSelector } from "react-redux";
import {useNavigate } from "react-router-dom";

import {setSelectedChat} from "../redux/slices/selectedChatSlice"

import { addVideoCallChatData } from "../redux/slices/videoCallSlice";

export default function Chats(){
    const server_url=import.meta.env.VITE_SERVER_URL;
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const Chats =useSelector(state=>state.Chats.data);
    const userData_username =useSelector(state=>state.userData.userInfo.username);
    const jwt=useSelector(state=>state.userData.jwt);

    const markChatReaded=async (chatId)=>{
        if (chatId){
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
        }
    }

    return (
        <div className="bg-white overflow-y-auto max-h-[100%] shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Chats</h2>
            <ul className="divide-y divide-gray-300 space-y-3">
            {Chats.map((chat) =>(
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
                    className="cursor-pointer bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-blue-50 hover:shadow-md transition-all duration-200 flex items-center gap-3 overflow-hidden"
                    >
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full">
                            {chat.username[0] === userData_username ? chat.username[1][0].toUpperCase() : chat.username[0][0].toUpperCase()}
                        </div>
                        <span className="text-gray-800 font-medium w-fit  break-words  whitespace-pre-wrap">
                            {chat.username[0] === userData_username ? 
                            (chat.username[1].length>8 ?chat.username[1].slice(0,6).toUpperCase()+"..":chat.username[1].toUpperCase() )
                            :(chat.username[0].length>8?chat.username[0].slice(0,6).toUpperCase()+"..":chat.username[0].toUpperCase())}
                        </span>
                    </li>
                    <div className="m-3 pt-2 pl-2 bg-blue-700 text-white shadow-lg rounded-full h-10 w-10" onClick={()=>dispatch(addVideoCallChatData({chat}))}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </div>
                </div>
            ))}
            </ul>
        </div>
    );
}