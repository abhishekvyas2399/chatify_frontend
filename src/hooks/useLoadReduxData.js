import { useDispatch} from "react-redux"

import {loadChat} from  "../redux/slices/chatSlice"
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import {setUserData} from "../redux/slices/userDataSlice"
import {load_allUnread_msg} from "../redux/slices/allUnreadmessageSlice"

export const useLoadReduxData=()=>{
    const server_url=import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();
    const dispatch=useDispatch();

    const [isReduxLoading,setisReduxLoading]=useState(true);

    const loadEverything=useCallback(async ()=>{
        if(isReduxLoading==false)   return;
        try{
            // asyncThunk return action/object but by unwrap it return promise so we can await
            //// unwrap used only with asyncThunk we cant use it with normal action
            await dispatch(loadChat()).unwrap()    
            await dispatch(load_allUnread_msg()).unwrap()
            console.log("!!!!!***** task that should run only once at app load !!!!!*****");
            setisReduxLoading(false);
        }catch(e){
            console.log("error in loading data from redux thunk.....",e.message);
        }
    },[isReduxLoading,dispatch,loadChat,load_allUnread_msg,setisReduxLoading])

    const userDataLoad=useCallback(async ()=>{
        let jwt=localStorage.getItem("Authorization") || null;
        if(!jwt)    navigate("/login",{replace:true});    // return in this  all if it cause re-render by navigate and useEffect flow

        jwt=JSON.parse(jwt);

        const response=await fetch(`${server_url}/api/auth/me`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": jwt,
            }
        });

        if(!response.ok ){    // do better :- move to login if jwt incorrect but otherwise give server error if server down or ...
            localStorage.removeItem("Authorization")
            navigate("/login",{replace:true});
        }

        const userInfo=await response.json();
        dispatch(setUserData({jwt,userInfo}));
        await loadEverything();
    },[navigate,setUserData,loadEverything]);


    useEffect(()=>{
        userDataLoad();
    },[userDataLoad])    // navigate is causing re-rendering alot bcz its state changing by code somewhere so if u find that part update it but if navigate is the reason and its not trustworthy then remove it from dependancy array.

    return {isReduxLoading};
}