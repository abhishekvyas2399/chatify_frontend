import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ChatRequest from "./ChatRequest";

import { loadChat } from "../redux/slices/chatSlice";
import { useSocket } from "../context/SocketContext";

function Appbar(){
  const server_url=import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const dispatch= useDispatch();
  const socket=useSocket();
  const [showChatRequest, setShowChatRequest] = useState(false);
  const [showReceivedRequests, setShowReceivedRequests] = useState(false);
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
    }).then(res=>res.json()).then(data=>setRequests(data.msg));
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

  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    window.location.href="/";
  };

  return (
    <div className="bg-black text-white flex justify-between items-center p-4 shadow-md relative">
      <h1 className="text-sm sm:text-xl font-bold">Chatify</h1>

      <div className="flex gap-4">
        {jwt && userInfo ? (
          <>
            {/* Requests Sent Button */}
            <button
              onClick={() =>{setShowChatRequest(!showChatRequest);setShowReceivedRequests(false)}}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold sm:py-2 sm:px-4 py-0.5 px-0.5 rounded-md transition duration-300"
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
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold sm:py-2 sm:px-4 py-0.5 px-0.5 rounded-md transition duration-300"
            >
                Requests 2U
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-0.5 px-0.5 sm:py-2 sm:px-4 rounded-md transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Login Button */}
            <button
              onClick={() => navigate("/login")}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold sm:py-2 sm:px-4 py-0.5 px-0.5 rounded-md transition duration-300"
            >
              Login
            </button>

            {/* Register Button */}
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold sm:py-2 sm:px-4 py-0.5 px-0.5 rounded-md transition duration-300"
            >
              Register
            </button>
          </>
        )}
      </div>

      {/* ChatRequest Popup (Only Load When Logged In) */}
      {showChatRequest && jwt && userInfo && (
        <div className="absolute top-18 right-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg w-80 border border-gray-800 sm:w-96 md:w-[28rem] max-w-full">
          <ChatRequest onClose={() => setShowChatRequest(false)} />
        </div>
      )}


      {showReceivedRequests && (
        <div className="absolute top-18 right-4 bg-gray-950 text-white p-4 rounded-lg shadow-lg w-80 border border-gray-800 sm:w-96 md:w-[28rem] max-w-full">
          <h2 className="text-lg font-semibold mb-3 text-gray-200">Requests</h2>
          <ul>
            {requests.map((request, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-800 p-2 mb-2 rounded-md">
                <span className="truncate overflow-hidden max-w-[60%]">{request.sender_name}</span>
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