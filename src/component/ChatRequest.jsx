import { useRef } from "react";
import { useSelector } from "react-redux";

const ChatRequest = () => {
  const server_url=import.meta.env.VITE_SERVER_URL;
  const chatRequestRef=useRef();
  const jwt=useSelector(state=>state.userData.jwt);

  const handleSendRequest = () => {
    const chatRequest=chatRequestRef.current.value;
    chatRequestRef.current.value="";

    if (!chatRequest.trim()) return;

    fetch(`${server_url}/api/requests/send`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:jwt
      },
      body:JSON.stringify({request_to:chatRequest}),
    }).then(res=>res.json()).then(data=>{alert(data.msg);console.log(data)});

  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 w-80 sm:w-96 max-w-full overflow-hidden">
      <h2 className="text-lg font-semibold mb-3 text-gray-200">Send Chat Request</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Enter Username or Invite Code"
          className="flex-1 px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 w-full"
          ref={chatRequestRef}
        />
        <button
          onClick={handleSendRequest}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRequest;