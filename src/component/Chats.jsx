import { replace, useNavigate } from "react-router-dom";

import {setSelectedChat} from "../redux/slices/selectedChatSlice"
import { useDispatch, useSelector } from "react-redux";

export default function Chats(){
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const Chats =useSelector(state=>state.Chats.data);
    const userData_username =useSelector(state=>state.userData.data.userInfo.username);

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Chats</h2>
            <ul className="divide-y divide-gray-300 space-y-3">
            {Chats.map((chat) => (
                <li
                key={chat._id}
                onClick={() =>{
                    dispatch(setSelectedChat({chatId:chat._id,chatDetails:chat}));
                    if(window.location.pathname=="/"){
                        navigate(`/message`);   
                    }
                    else{
                        navigate(`/message`,{replace:true});   
                    }
                    // {replace:true} so when u click it multiple time it not put /message multiple time in stack instead it replace . so when press back u back to previous page .  but if u not use it then u have to press first to remove /messgae from stack multiple times then u goto previous page.
                }}
                className="cursor-pointer bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-blue-50 hover:shadow-md transition-all duration-200 flex items-center gap-3"
                >
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full">
                        {chat.username[0][0].toUpperCase()}
                    </div>
                    <span className="text-gray-800 font-medium">
                        {chat.username[0] === userData_username ? chat.username[1].toUpperCase() : chat.username[0].toUpperCase()}
                    </span>
                </li>
            ))}
            </ul>
        </div>
    );
}