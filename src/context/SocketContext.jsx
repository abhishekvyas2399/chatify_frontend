import {createContext, useContext, useMemo} from "react";
import {io} from "socket.io-client"

const SocketContext=createContext(null);

export const SocketProvider=({children})=>{
    const serverUrl=import.meta.env.VITE_SERVER_URL;
    console.log("socket provider re-render");
    const socket=useMemo(()=>io(serverUrl),[])
    return <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
}

export const useSocket=()=>{
    const socket=useContext(SocketContext);
    return socket;
}




// code from old code file where socket is set in a normal component
// setSocket(prevSocket=>{
//     if(!prevSocket) return io(server_url);
//     return prevSocket;
// })