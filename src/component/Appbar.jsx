import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ChatRequest from "./ChatRequest";

import { loadChat } from "../redux/slices/chatSlice";
import { useSocket } from "../context/SocketContext";
import UserInfoAndOther from "./UserInfoAndOther";

function Appbar(){
  const server_url=import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const dispatch= useDispatch();
  const socket=useSocket();
  const [showChatRequest, setShowChatRequest] = useState(false);
  const [showReceivedRequests, setShowReceivedRequests] = useState(false);
  const [showUserInfo,setShowUserInfo]=useState(false);
  // const [requests, setRequests] = useState([{username:"name1"},{username:"name2"},{username:"name3"}]);
  const [requests, setRequests] = useState([]);

  // Get authentication state
  const jwt=useSelector((state) => state.userData.jwt);
  const userInfo=useSelector((state) => state.userData.userInfo);

  const fetchRequest=useCallback(()=>{
    fetch(`${server_url}/api/requests/pending`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json",
        Authorization:jwt
      },
    }).then(res=>res.json()).then(data=>setRequests(data.allRequests));
  },[server_url,jwt]);

  const accept=useCallback((requestId)=>{
    if(jwt && requestId){
      fetch(`${server_url}/api/requests/accept/${requestId}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:jwt
        },
      }).then(async res=>{
        if(res.ok){
          fetchRequest();
          dispatch(loadChat());
          // window.location.href=import.meta.env.VITE_FRONTEND_URL; // not industry standard so update it to commented code + join new chat room
        }
      })
    }
  },[server_url,jwt],fetchRequest,dispatch,loadChat);

  const reject=(requestId)=>{
    if(jwt && requestId){
      fetch(`${server_url}/api/requests/reject/${requestId}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:jwt
        },
      }).then(res=>{
        if(res.ok){
          fetchRequest();
        }
      })
    }
  }

  useEffect(()=>{
    if(jwt){
      fetchRequest();
    }
  },[jwt]);


  return (
    <div className="bg-gradient-to-r from-[#16122d] via-[#1c133e] to-[#231a54] w-full h-16 text-white flex justify-between items-center p-4 shadow-md relative">
      <h1 className="text-base font-bold">Chatify</h1>

      <div className="flex gap-2 sm:gap-4">
        {jwt && userInfo ? (
          <>
            {/* Requests Sent Button */}
            <button
              onClick={() =>{setShowChatRequest(!showChatRequest);setShowReceivedRequests(false)}}
              className="bg-gradient-to-r from-blue-600 to-purple-600  hover:opacity-90 shadow-md  text-white font-semibold px-1.5 py-1.5  sm:px-3 rounded-md transition duration-300 text-base"
            >
              Send request
            </button>

            {/* Requests Received Button */}

            <button
                onClick={() =>{
                  setShowReceivedRequests(!showReceivedRequests);
                  setShowChatRequest(false);
                  if(jwt) fetchRequest();
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-md hover:opacity-90 transition text-white font-semibold px-1.5 py-1.5  sm:px-3  rounded-md duration-300 text-base"
            >
                Requests 2U
            </button>

            {/* Logout Button */}
            <button
              onClick={()=>{
                setShowUserInfo(!showUserInfo);
              }}
            >
              {/* <div className="bg-gradient-to-r from-indigo-900  to-indigo-600  w-10 h-10 flex items-center justify-center text-white font-bold rounded-full text-lg">
                  {userInfo.username[0].toUpperCase()}
              </div> */}
              <div className="p-[3px] rounded-full bg-gradient-to-r from-blue-700 to-pink-700">
                {userInfo.profileSignedUrl?<img src={userInfo.profileSignedUrl} alt="User" className="w-10 h-10 rounded-full border-4 border-[#1c1b29]"/>:<div className="w-10 h-10 rounded-full border-4 border-[#1c1b29] flex justify-center items-center text-2xl">{userInfo.username[0].toUpperCase()}</div>
                }
              </div>
            </button>
          </>
        ) : (
          <>
            {/* Login Button */}
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:opacity-90 shadow-md  text-white font-semibold px-1.5 py-1.5  sm:px-3 rounded-md transition duration-300 text-base"
            >
              Login
            </button>

            {/* Register Button */}
            <button
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-blue-600 to-blue-900   hover:opacity-90 shadow-md  text-white font-semibold px-1.5 py-1.5  sm:px-3 rounded-md transition duration-300 text-base"
            >
              Register
            </button>
          </>
        )}
      </div>

      {/* ChatRequest Popup (Only Load When Logged In) */}
      {showChatRequest && jwt && userInfo && (
        <div className="absolute top-18 right-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg w-80 border border-gray-800 sm:w-96 md:w-[28rem] max-w-full z-5">
          <ChatRequest onClose={() => setShowChatRequest(false)} />
        </div>
      )}

      {showUserInfo && jwt && userInfo && (
        <div className="absolute top-18 right-4 rounded-lg shadow-lg max-w-full z-10">
          <UserInfoAndOther onClose={() => setShowUserInfo(false)}></UserInfoAndOther>
        </div>
      )}


      {showReceivedRequests && (
        <div className="absolute top-18 right-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg w-80 border border-gray-800 sm:w-96 md:w-[28rem] max-w-full">
          <h2 className="text-lg font-semibold mb-3 text-gray-200">Requests</h2>
          <ul>
            {requests && requests.map((request, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-800 p-2 mb-2 rounded-md">
                <span className="truncate overflow-hidden max-w-[60%]">{request.senderName}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => accept(request._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => reject(request._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default Appbar;