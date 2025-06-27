import { useSelector } from "react-redux";
import callEndSvg from "../assets/call_end.svg"

export default function VideoCall_calling({callerData,EndVideoCall}){
    const username=useSelector(state=>state.userData.userInfo.username);

    return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center">
      {/* User Info */}
      <div className="text-white mt-4 text-xl">{callerData.username[0]==username?
      (callerData.username[1].length>8?callerData.username[1].slice(0,6)+"...":callerData.username[1]):
      (callerData.username[0].length>8?callerData.username[0].slice(0,6)+"...":callerData.username[0])}
      </div>
      <div className="text-white mt-4 text-xl">Calling...</div>

      {/* Call Controls */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={()=>EndVideoCall()}
          className="bg-red-600 text-white p-3 rounded-full hover:bg-red-500"
        >
          <img src={callEndSvg} alt="cut call" className="w-6 h-6" />
        </button>
      </div>
    </div>
    )
}