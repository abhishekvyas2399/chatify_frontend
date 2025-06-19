import { createSlice} from "@reduxjs/toolkit"

const userDataSlice=createSlice({
    name:"userData",
    initialState:{
        jwt:null,
        userInfo:null,
    },
    reducers:{
        setUserData:(state,action)=>{
            state.jwt=action.payload.jwt;
            state.userInfo=action.payload.userInfo;
        },
        clearUserData:(state)=>{
            state.jwt=null;
            state.userInfo=null;
        },
    },
});

export const {setUserData,clearUserData}=userDataSlice.actions;

export default userDataSlice.reducer;