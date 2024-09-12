
import React, { useState } from 'react'
import './Chat.css'
import LeftChat from './LeftChat'
import ChatLayout from './ChatLayout'


const Chat = () => {

    const [user , setUser ] = useState('')
    const [username , setUsername ] = useState('')
    
    
    const Chat = ({id, username}) => {
        console.log('id', id, 'username', username);
        
    setUser(id);
    setUsername(username);
}
    console.log(user, username,'users');
    
    
    const style = {
        marginTop:'20px',
        marginLeft:'70px'
    }
  

  return (
    

    <>
    
      <div className="container" style={style}>
        <div className="row clearfix">
            <div className="col-lg-12">
                {/* <h2>Chat</h2> */}
                
                <div className="card left-area">
                    <LeftChat Chat = {Chat} />
                </div>
                <div className="chat-layout" >
                    <ChatLayout user={user} username= {username} />
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Chat
