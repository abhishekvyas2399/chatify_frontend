import { useCallback } from "react";
import callEndSvg from "../assets/call_end.svg";
import phoneSvg from "../assets/accept_call.svg"; // Replace with your actual answer SVG
import { useSocket } from "../context/SocketContext";
import { useSelector } from "react-redux";

export default function VideoCall_answer({callerData,setCallerData,setShowIncomingCallScreen,setStartReceiverCall}) {
    const socket=useSocket();
    const username=useSelector(state=>state.userData.userInfo.username);

    const onAnswer=useCallback(()=>{
        socket.emit("videoCallAnswer",{chatId:callerData._id,call:true});
        setShowIncomingCallScreen(false);
        setStartReceiverCall(true);
    },[socket]);
    const onReject=useCallback(()=>{
        socket.emit("videoCallAnswer",{chatId:callerData._id,call:false});
        setCallerData(null);
        setShowIncomingCallScreen(false);
    },[socket]);
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center">
      
      {/* Calling Text */}
      <div className="text-white mt-4 text-xl">{callerData.username[0]==username?
      (callerData.username[1].length>8?callerData.username[1].slice(0,6)+"...":callerData.username[1]):
      (callerData.username[0].length>8?callerData.username[0].slice(0,6)+"...":callerData.username[0])}
      </div>
      <div className="text-white mt-4 text-xl">Calling...</div>

      {/* Call Controls */}
      <div className="mt-6 flex gap-6">
        
        {/* Answer Button */}
        <button
          onClick={onAnswer}
          className="bg-green-600 text-white p-4 rounded-full hover:bg-green-500 flex items-center justify-center"
        >
          <img src={phoneSvg} alt="answer call" className="w-6 h-6" />
        </button>

        {/* Reject Button */}
        <button
          onClick={onReject}
          className="bg-red-600 text-white p-4 rounded-full hover:bg-red-500 flex items-center justify-center"
        >
          <img src={callEndSvg} alt="reject call" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
