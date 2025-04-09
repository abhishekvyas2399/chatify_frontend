import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

export const loadUserData=createAsyncThunk("userData",async ()=>{
    const server_url=import.meta.env.VITE_SERVER_URL;
    console.log(server_url);
    console.log("loading user data.....");
    let canConnect=false;
    let userInfo=null;
    let ISjwtExist=true;
    let jwt=null;

    jwt=localStorage.getItem("Authorization") || null;
    if(!jwt){
        ISjwtExist=false;
        return {ISjwtExist,jwt,canConnect,userInfo};
    }
    jwt=JSON.parse(jwt);

    const response1=await fetch(`${server_url}/api/auth/tokenVerify`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization": jwt
        }
    })
    if(response1.ok)    canConnect=true;
    else{
        localStorage.removeItem("Authorization")
        return {ISjwtExist,jwt,canConnect,userInfo};
    }


    const response2=await fetch(`${server_url}/api/auth/me`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "Authorization": jwt,
        }
    });
    userInfo=await response2.json();
    return {ISjwtExist,jwt,canConnect,userInfo};
})



const userDataSlice=createSlice({
    name:"userData",
    initialState:{
        isLoading:false,
        data:{
            ISjwtExist:true,
            jwt:null,
            canConnect:true,  // rename to canConnect
            userInfo:null,
        },
        isError:false,
    },
    extraReducers:(builder)=>{
        builder.addCase(loadUserData.pending,(state,action)=>{
            state.isLoading=true;
        });
        builder.addCase(loadUserData.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.data.ISjwtExist=action.payload.ISjwtExist;
            state.data.jwt=action.payload.jwt;
            state.data.canConnect=action.payload.canConnect;
            state.data.userInfo=action.payload.userInfo;
        });
        builder.addCase(loadUserData.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
        });
    }
});


export default userDataSlice.reducer;