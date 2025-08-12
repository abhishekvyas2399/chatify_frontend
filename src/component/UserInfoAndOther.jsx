import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/slices/userDataSlice";
import axios from "axios"

export default function UserInfoAndOther(){
    const dispatch=useDispatch();
    const server_url=import.meta.env.VITE_SERVER_URL;
    const jwt=useSelector((state) => state.userData.jwt);
    const userInfo=useSelector((state) => state.userData.userInfo);
    const fileInputRef=useRef(null);
    
  
    const handleLogout = () => {
        localStorage.removeItem("Authorization");
        window.location.href="/";
    };

    const uploadImg=useCallback(async (event)=>{
      const selectedFileCopy=event.target.files[0];
      fileInputRef.current.value=null;
      if(!selectedFileCopy) return;
      
      if(selectedFileCopy.size>10485760){
          alert("file size must less than 10MB ...");
          return;
      }
      let response;
      try{
          response=await axios.post(`${server_url}/api/uploads/avatar`,{fileType:selectedFileCopy.type},
              {headers:{Authorization:jwt}},
          );
      }catch(e){
          console.error("error while upload process ...",e.response.data.msg);
          alert(e.response.data.msg);
          return;
      }
      const data=response.data;
      let uploadRes;
      try{
          uploadRes=await axios.put(data.signedUrl,selectedFileCopy,{headers:{'Content-Type': selectedFileCopy.type,}});
      }catch(e){
          console.error("error while upload process ...",e.response.data.msg);
          alert(e.response.data.msg);
          return;
      }

      try{
          const response= await axios.put(`${server_url}/api/users/${userInfo.id}`,{name:userInfo.name,profilePic:data.filePath},{headers:{Authorization:jwt}});
          // update data on userInfo dispatcher
          dispatch(setUserData({jwt,userInfo:response.data}))
      }catch(e){
          console.log("error while upload profile...");
          return;
      }
    },[]);

    return     (
    <div className="w-64 bg-gradient-to-b from-[#1e1740] to-[#261f46] text-white flex flex-col p-5 shadow-lg rounded-lg">
      
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="p-[3px] rounded-full bg-gradient-to-r from-blue-500 to-pink-500">
          {userInfo.profileSignedUrl?<img src={userInfo.profileSignedUrl} alt="User" className="w-20 h-20 rounded-full border-4 border-[#1c1b29]"/>:<div className="w-20 h-20 rounded-full border-4 border-[#1c1b29] flex justify-center items-center text-4xl">{userInfo.username[0].toUpperCase()}</div>
          }
        </div>
        <h3 className="mt-3 text-lg font-semibold">{userInfo.name}</h3>
        <p className="text-sm text-gray-400">{userInfo.username}</p>
      </div>

      {/* Buttons */}
        <label className="mb-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white  py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition text-center">
            Upload Profile
            <input type="file" ref={fileInputRef} id="profileUplaod" className="hidden" onChange={(e) => uploadImg(e)}/>
        </label>

                                

      <button className="bg-[#1f1f2f] border border-[#3b3b5a] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#2b2b3f] transition" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}