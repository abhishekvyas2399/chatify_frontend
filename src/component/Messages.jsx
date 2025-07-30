import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import  {load_selectedChat_msg} from "../redux/slices/oldChatMessageSlice"

import SingleMsg from "./SingleMsg";


export default function Messages() {
    const server_url=import.meta.env.VITE_SERVER_URL;
    const dispatch=useDispatch();
    const socket=useSocket();
    const jwt=useSelector(state=>state.userData.jwt);
    const selectedChat=useSelector(state=>state.selectedChat.chatId);
    const selectedChatDetails=useSelector(state=>state.selectedChat.chatDetails);
    const userInfo=useSelector(state=>state.userData.userInfo);
    const messageRef=useRef();
    const chatContainerRef=useRef();
    let debounceTimeOut=useRef(); // we make debounce useRef bcz to prevent it while re-render bcz if we lost it we not clear old timeout which make not prevent alot of request and it load our server from request. 

    const oldChatMessage=useSelector(state=>state.oldChatMessage.data);
    const AllUnreadMessage=useSelector(state=>state.AllUnreadMessage.data.unreadMessage[selectedChat]);
    const newMessage=useSelector(state=>state.newMessage[selectedChat]);


    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef=useRef();
    const handleFileSelect = (event) => {
        const file=event.target.files[0];
        if(file)    setSelectedFile(file);
    };

    // Handle sending a new message
    const sendMessage =useCallback(async () => {
        // *********** first send data to server for save in mongoDb then send to socket
        const newMessage=messageRef.current.value.trim();
        messageRef.current.value="";
        if(!newMessage && !selectedFile)    return;
        let payload={};
        if(selectedFile){
            if(selectedFile.size>10485760){
                alert("file size must less than 10MB ...");
                setSelectedFile(null);
                fileInputRef.current.value=""; 
                return;
            }
            const response=await axios.post(`${server_url}/api/uploads/uploadSignedUrl`,{fileType:selectedFile.type},
                {headers:{Authorization:jwt}},
            );
            if(response.status!=200){
                console.log("error while upload process ...");
                setSelectedFile(null);
                fileInputRef.current.value=""; 
                return;
            }
            const data=response.data;
            const uploadRes=await axios.put(data.signedUrl,selectedFile,{headers:{'Content-Type': selectedFile.type,}});
            if(uploadRes.status!=200){
                console.log("error while upload process ...");
                setSelectedFile(null);
                fileInputRef.current.value="";
                return;
            }
            payload.filePath=data.filePath;
            payload.fileType=data.fileType;
        }
        if(newMessage){
            payload.newMessage=newMessage;
        }
        payload.chatId=selectedChat;
        // send key,msg everywhere needed like DB,socket by attach it

        
        if (selectedChat){ // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX send image path to DB & save its keypath there
            const response= await axios.post(`${server_url}/api/messages`,payload,
                {headers:{Authorization:jwt}},
            );
            if(response.status==200){
                // if save to DB sent it to socket
                socket.emit("chat Message",response.data);
            }
        }
        setSelectedFile(null);
        fileInputRef.current.value=""; 
    },[messageRef,selectedChat,server_url,jwt,selectedFile]);


    // event=>scrolling to top will fetch more 20 old message from backend by redux thunk action dispatch
    const handleScroll=useCallback(async ()=>{
        const chatDiv=chatContainerRef.current;
        const prevHeight=chatDiv.scrollHeight;

        if(chatDiv.scrollTop===0){
            if(selectedChat){

                clearTimeout(debounceTimeOut); // maybe user scroll very fast can lead "overload the server or cause unnecessary network requests" so make him request only after 2 seconds
                debounceTimeOut=setTimeout(async ()=>{
                    await dispatch(load_selectedChat_msg()).unwrap();
                    chatDiv.scrollTop=chatDiv.scrollHeight-prevHeight; // for smooth rendering by make scroll fix to current position when new data load
                },300);
            }
        }
    },[chatContainerRef,selectedChat,load_selectedChat_msg]);
    useEffect(()=>{
        if(!chatContainerRef.current)   return ;
        const chatDiv=chatContainerRef.current;
        if(!chatDiv) return;
        chatDiv.addEventListener("scroll",handleScroll);
        return ()=>{
            chatDiv.removeEventListener("scroll",handleScroll);
        }
    },[chatContainerRef,handleScroll])  // initially chatContainerRef.current null bcz ref={chatContainerRef} run after useEffect so add chatContainerRef.current in dependancy array so in next re-render it run again bcz  chatContainerRef.current now null to <div>


    useEffect(()=>{
        if(chatContainerRef.current)
            chatContainerRef.current.scrollTop=chatContainerRef.current.scrollHeight-chatContainerRef.current.clientHeight;
    },[chatContainerRef,newMessage,AllUnreadMessage])

    return (
            <div className="flex flex-col h-full w-full">
                {selectedChat ? (
                    <div className="flex flex-col h-full bg-white shadow-md rounded-lg border border-gray-200 p-4">
                        <div className="flex flex-row justify-center text-xl font-semibold text-gray-900 text-center py-2 border-b border-gray-300 shadow-sm tracking-wide mb-4">
                            <h2>{selectedChatDetails.usernames[0]==userInfo.username?
                            (selectedChatDetails.usernames[1].length>8?selectedChatDetails.usernames[1].slice(0,6).toUpperCase()+"..":selectedChatDetails.usernames[1].toUpperCase()):
                            (selectedChatDetails.usernames[0].length>8?selectedChatDetails.usernames[0].slice(0,6).toUpperCase()+"..":selectedChatDetails.usernames[0].toUpperCase())}
                            </h2>
                        </div>
                        {/* <img src={DoubleCheckReadIcon} alt="Read" width="35" height="35" />
                        <img src={DoubleCheckIcon} alt="unRead" width="35" height="35" /> */}
                        <div className="flex-grow overflow-y-auto p-3 rounded-lg bg-white shadow-md border border-gray-300" ref={chatContainerRef}>
                            {oldChatMessage?oldChatMessage.map((msg,index) => (
                                <SingleMsg  key={index} msg={msg} index={index} username={userInfo.username}>
                                {/* add double tick in singleMsg component */}
                                </SingleMsg>
                            )):null}
                            {AllUnreadMessage?AllUnreadMessage.map((msg,index) => (
                                <SingleMsg key={index} msg={msg} index={index} username={userInfo.username}></SingleMsg>
                            )):null}
                            {newMessage?newMessage.map((msg,index) => (
                                <SingleMsg key={index} msg={msg} index={index} username={userInfo.username}></SingleMsg>
                            )):null}
                        </div>

                        {/* Input Box */}
                        <div className="mt-4 flex flex-wrap items-center gap-2 shadow-2xl rounded-lg p-2 bg-white w-full ">
                            <label className="cursor-pointer flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300">
                                <span className="text-xl font-bold text-gray-600">+</span>
                                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileSelect(e)}/>
                            </label>
        
                            <input
                                type="text"
                                className="flex-1 p-3 border-none outline-none bg-transparent text-gray-700 placeholder-gray-400"
                                placeholder="Type a message..."
                                ref={messageRef}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}  // trigger on press Enter
                            />
                            <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                                Send
                            </button>

                            {selectedFile && ( <div className="flex items-center gap-2 text-sm text-gray-700 mt-2 w-full flex-wrap">
                                <span className="truncate max-w-xs">
                                {selectedFile.name}
                                </span>
                                <button
                                onClick={() =>{
                                    setSelectedFile(null);
                                    fileInputRef.current.value="";  // if not remove input value browser not trigger onchange if same file select bcz value same not change
                                }}
                                className="text-red-500 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
                                >
                                Remove
                                </button>
                            </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-600">Select a chat to start messaging.</p>
                )}
            </div>
    );
}




//  database -----> r--> 1,2,3,4,5,6,7,8,9,10  ur--> 11 12 13 14 15 16 17 18 19 20

// oldreaded:-  1,2,3,4,5
// unreaded:-   11 12 13 14 15 16 17 18 19 20
// printing 
// oldreaded= 1,2,3,4,5
// unread= 11 12 13 14 15 16 17 18 19 20
//----------------
// oldreaded:-  1,2,3,4,5  +  6,7,8,9,10
// oldreaded= 1,2,3,4,5,6,7,8,9,10  
// unread= 11 12 13 14 15 16 17 18 19 20


// oldreaded= 10,9,8,7,6   (createdAt:-1)
// unread= 11 12 13 14 15 16 17 18 19 20
// printing
// oldreaded= reverse(10,9,8,7,6)     6,7,8,9,10
// unread= 11 12 13 14 15 16 17 18 19 20
//--------------- lastmessage=oldreaded[1],
// oldreaded= [...reverse(5,4,3,2,1),...oldreaded( 6,7,8,9,10 )]    ==> 1,2,3,4,5,6,7,8,9,10
// unread= 11 12 13 14 15 16 17 18 19 20
// 
//