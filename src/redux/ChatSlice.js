import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { getChat } from "../axios/chat/ChatServers";


export const ChatMsg = createAsyncThunk('chat/getChats',async (id) =>{
    try{
        const res = getChat(id)
        return res
    }catch(error){
        throw error
    }
})

const initialState= {
    msg: null,
    status: 'idle',
    error: null,
  }

const ChatSlice = createSlice({
    name:'chat',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(ChatMsg.pending,(state)=>{
            state.status = 'Loading'
        })
        .addCase(ChatMsg.fulfilled,(state,action)=>{
            state.status = 'Succeeded'
            state.msg = action.payload
        })
        .addCase(ChatMsg.rejected,(state,action)=>{
            state.status = 'Rejected'
            state.error = action.error.message || 'Something went wrong!'
        })
    }
})

export default ChatSlice.reducer