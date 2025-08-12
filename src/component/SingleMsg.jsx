import MediaFile from "./MediaFile"
import DoubleCheckReadIcon from "../assets/double_tick_read.svg"
import DoubleCheckIcon from "../assets/double_tick.svg"
import singleCheckIcon from "../assets/single_tick.svg"

import formatLocalStringTime_forMsg from "../utils/formatMsgTime";

export default function SingleMsg({msg,index,username,uploading}){
    const msgTime=formatLocalStringTime_forMsg(msg.createdAt);
    return (<>
        <div key={index} className={`p-0.5 my-2 mx-1 flex flex-col max-w-[99%] text-white ${ msg.senderName === username ? "self-end items-end" : "self-start items-start" }`}>
        {/* Message Bubble */}
        <div className={`relative px-4 py-2 text-sm break-words whitespace-pre-wrap shadow-[0_2px_10px_rgba(0,0,0,0.2)] max-w-[85%] sm:max-w-[70%] md:max-w-[60%] ${ msg.senderName === username? "bg-gradient-to-br from-[#3a8ef6] to-[#6f3df4] rounded-tl-xl rounded-tr-xl rounded-bl-xl":"bg-gradient-to-br from-[#00c6ff] to-[#0072ff] rounded-tr-xl rounded-tl-xl rounded-br-xl"}`}>
            {/* Sender Name */}
            <div className="text-xs font-semibold mb-1">{msg.senderName==username?"You":msg.senderName}</div>
            {/* Media File */}
            {msg.fileSignedUrl && ( <MediaFile fileSignedUrl={msg.fileSignedUrl} fileType={msg.fileType}/>)}
            {/* Text Message */}
            {msg.message && <div>{msg.message}</div>}
            {/* Time & Status */}
            <div className="flex justify-end items-center gap-1 mt-1 text-[10px] ">
                <span>{msgTime}</span>
                {uploading && (<div className="w-3 h-3 ml-1 border-2 border-white border-t-blue-400 rounded-full animate-spin"></div>)}
                {msg.senderName === username && msg.isRead === "read" && ( <img src={DoubleCheckReadIcon}  className="w-4 h-4 ml-1"  alt="Read" />)}
                {msg.senderName === username && msg.isRead === "delivered"&&(<img src={DoubleCheckIcon} className="w-4 h-4 ml-1" alt="Delivered"/>)}
                {msg.senderName === username && msg.isRead === "unread" &&( <img src={singleCheckIcon} className="w-3 h-3 ml-1" alt="Sent"/>)}
            </div>
        </div>
        </div>
    </>
    )
}