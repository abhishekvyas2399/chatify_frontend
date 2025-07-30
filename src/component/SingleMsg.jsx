import MediaFile from "./MediaFile"
import DoubleCheckReadIcon from "../assets/double_tick_read.svg"
import DoubleCheckIcon from "../assets/double_tick.svg"

export default function SingleMsg({msg,index,username}){
    return (
        <div key={index} className={`p-2 my-1 rounded flex flex-col ${msg.senderName === username ? "bg-blue-500 text-white text-right items-end" : "bg-gray-300 text-black items-start"}`}>
            <div className="text-sm font-semibold mb-1">{msg.senderName==username?"You":msg.senderName}</div>
            {msg.fileSignedUrl && <MediaFile fileSignedUrl={msg.fileSignedUrl} fileType={msg.fileType} ></MediaFile>}
            {msg.message && <div className="bg-gray-200 p-2 rounded-md max-w-[70%]  shadow-sm text-black w-fit  break-words  whitespace-pre-wrap">{msg.message}</div>}
            {msg.senderName===username?
            <div className="flex justify-end">
                {msg.isRead=="read"?<img src={DoubleCheckReadIcon} className="bg-amber-50 rounded-md mt-2" alt="Read" width="35" height="35"/>:""}
                {msg.isRead=="delivered"?<img src={DoubleCheckIcon} className="bg-amber-50 rounded-md mt-2" alt="Read" width="35" height="35"/>:""}
            </div>:""}
            {/* <div className="flex justify-end"> */}
                {/* <div className="bg-amber-50 rounded-md mt-2 text-black">{msg.createdAt}</div> */}
            {/* </div> */}
        </div>
    )
}