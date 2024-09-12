import { axiosChatInstance } from "../AxiosInstance"


export const getChat = async (id)=>{
    const user_id1 = id.user_id1
    const user_id2 = id.user_id2
    console.log(user_id1,user_id2,'users chat get')
    try{
        const res = await axiosChatInstance.get(`/user/${user_id1}/${user_id2}/`)
        return res.data
    }
    catch(error){
        console.log(error);
        
        throw error
    }
}

export const getNotification = async () => {
    try {
        const res = await axiosChatInstance.get('/notification')
        console.log(res.data)
        return res.data
    } catch (error) {
        throw error
    }
}

export const addChatRoom = async (ids)=>{
    try{
        const res = await axiosChatInstance.post(`/add_chat_rooms/`,ids)
        return res.data
    }catch(error){
        throw error
    }
}