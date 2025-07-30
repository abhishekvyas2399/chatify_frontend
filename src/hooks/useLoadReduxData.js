import {loadChat} from  "../redux/slices/chatSlice"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch,useSelector } from "react-redux"
import axios from "axios"

import { useSocket } from "../context/SocketContext"
import {setUserData} from "../redux/slices/userDataSlice"
import {load_allUnread_msg} from "../redux/slices/allUnreadmessageSlice"

export const useLoadReduxData=()=>{
    const socket=useSocket();
    const server_url=import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();
    const dispatch=useDispatch();
    const [isDataFetched,setIsDataFetched]=useState(false);
    const [isReduxLoading,setisReduxLoading]=useState(true);
    const Chats=useSelector(state=>state.Chats.data);

    const loadEverything=useCallback(async ()=>{
        try{
            // asyncThunk return action/object but by unwrap it return promise so we can await
            //// unwrap used only with asyncThunk we cant use it with normal action
            await dispatch(loadChat()).unwrap();
            await dispatch(load_allUnread_msg()).unwrap();
            console.log("!!!!!***** task that should run only once at app load !!!!!*****");
            setIsDataFetched(true);
        }catch(e){
            console.error("error in loading data from redux thunk.....",e.message);
        }
    },[loadChat,load_allUnread_msg])

    const userDataLoad=useCallback(async ()=>{
        let jwt=localStorage.getItem("Authorization") || null;
        if(!jwt)   return navigate("/login",{replace:true});

        jwt=JSON.parse(jwt);
        try{
            const response= await axios(`${server_url}/api/auth/me`,{headers:{"Authorization":jwt}}); // Axios automatically throws an exception when the response status is not in [200–299], which makes the code cleaner and easier to handle with try...catch.
            console.log("user jwt is valid");
            const userInfo=response.data;
            dispatch(setUserData({jwt,userInfo}));
            await loadEverything();
        }catch(e){    // do better :- move to login if jwt incorrect but otherwise give server error if server down or ...
            console.error(e.message);
            localStorage.removeItem("Authorization")
            return navigate("/login",{replace:true});
        }
    },[setUserData,loadEverything]);


    useEffect(()=>{
        userDataLoad();
    },[userDataLoad])



    const joinRooms=useCallback(()=>{
        Chats.forEach(chat=>{
            socket.emit("joinRoom",chat._id);
        })
        console.log("all chats real Time now .....");
        setisReduxLoading(false);
    },[socket,Chats])

    useEffect(()=>{
        if(isDataFetched){
            if(socket){
                if(socket.connected)
                    joinRooms();
                else
                    socket.on("connect",joinRooms) // When the connection is established, the "connect" event automatically triggers,
            }
            return ()=>{
                if(socket)
                    socket.off("connect",joinRooms)
            }
        }
    },[isDataFetched,socket,joinRooms])

    return {isReduxLoading};
}