import { useDispatch, useSelector} from "react-redux"

import {loadChat} from  "../redux/slices/chatSlice"
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import {loadUserData} from "../redux/slices/userDataSlice"
import {load_allUnread_msg} from "../redux/slices/allUnreadmessageSlice"

export const useLoadReduxData=()=>{
    const navigate = useNavigate();
    const dispatch=useDispatch();

    const userData=useSelector(state=>state.userData);
    const [isReduxLoading,setisReduxLoading]=useState(true);

    const maxRetry=useRef(50);
    const [isServerOn,setIsServerOn]=useState(true);


    const loadEverything=useCallback(async ()=>{
        try{
            // asyncThunk return action/object but by unwrap it return promise so we can await
            //// unwrap used only with asyncThunk we cant use it with normal action
            await dispatch(loadChat()).unwrap()    
            await dispatch(load_allUnread_msg()).unwrap()
            setisReduxLoading(false);
        }catch(e){
            console.log("error in loading data from redux thunk.....",e.message);
        }
    },[dispatch])


    useEffect(()=>{
        if(!userData.data.ISjwtExist){
            navigate("/login",{replace:true});
        }
        else if(!userData.data.canConnect){
            navigate("/login",{replace:true});
        }
        else if(!userData.data.jwt){
            if(maxRetry.current>0){
                dispatch(loadUserData());
                maxRetry.current--;
            }else{
                setIsServerOn(false);
            }
        }
        else   loadEverything();
    },[userData,dispatch,navigate,loadEverything])

    return {isServerOn,isReduxLoading};
}