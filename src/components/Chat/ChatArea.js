import React, { useEffect, useRef, useState } from "react";
import Messages from "./Messages";
import { jwtDecode } from "jwt-decode";
import { ChatMsg } from "../../redux/ChatSlice";
import { useDispatch, useSelector } from "react-redux";
import { SOCKET } from "../../constants/urls";
import InputEmoji from "react-input-emoji";
import { IoMdSend } from "react-icons/io";
import moment from "moment";
import styled from "styled-components";
import { Toaster, toast } from "sonner";
import { Badge } from "antd";

import { Avatar } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import VideoFileIcon from "@mui/icons-material/VideoFile";

// boostrap react
import { Button, Col, Row } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const ChatArea = ({ user, username }) => {
  const auth = useSelector((state) => state.auth);

  const authToken = JSON.parse(localStorage.getItem("authTokens"));
  const access = authToken.access;
  const userId = jwtDecode(access)?.user_id;

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  // for multimedia sending

  const [isLoading, setIsLoading] = useState(false);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

// for read message update

  const markMessagesAsRead = (messageIds) => {
    console.log('wordikn');
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      const data = {
        action: "read_status_update",
        message_ids: messageIds,
      };
      socket.send(JSON.stringify(data));
    } else {
      console.error("WebSocket is not open to send read status.");
    }
  };
  

  // functions for multimedia senting
  const handlePhotoClick = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click();
    }
  };

  const handleVideoClick = () => {
    videoInputRef.current.click();
  };

  // ---------- for the photo sending ------------------
  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return; // Handle empty selection (optional)
    }

    setIsLoading(true);
    if (selectedFile.size > 2 * 1024 * 1024) {
      // Check for 3 MB limit
      toast.error("You can only send image less than 2 mb ");
      setIsLoading(false);
      photoInputRef.current.value = null;
      return; // Prevent further processing
    }

    let formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "rtilfwhs");
    formData.append("cloud_name", "dvraiunbw");
    // formData.append("folder", "dvraiunbw");

    fetch("https://api.cloudinary.com/v1_1/dvraiunbw/image/upload", {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        console.log(data.public_id, "helllo");
        console.log(data, "data");

        // if the image is uploaded successfully then send the message
        if (data.public_id) {
          const sender = userId;

          const content = {
            message: data.public_id,
            message_type: "photo",
            action: "chat_message",
          };

          // Send the message via WebSocket
          if (socket && socket.readyState === socket.OPEN) {            
            socket.send(JSON.stringify(content));
          } else {
            console.error("WebSocket is not open");
            // Handle the case when WebSocket is not open (e.g., show an error message)
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });

    // Handle valid photo selection (e.g., upload to server)
    // ... your upload logic here ...
  };

  const handleVideoChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return; // Handle empty selection (optional)
    }

    setIsLoading(true);
    if (selectedFile.size > 50 * 1024 * 1024) {
      // Check for 50 MB limit
      toast.error("You can only send video files less than 50 MB");
      setIsLoading(false);
      return; // Prevent further processing
    }

    let formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "rtilfwhs");
    formData.append("cloud_name", "dvraiunbw");
    // formData.append("folder", "dvraiunbw");

    fetch("https://api.cloudinary.com/v1_1/dvraiunbw/video/upload", {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        console.log(data);
        // If the video is uploaded successfully, send the message
        if (data.public_id) {
          const sender = userId;

          const message = {
            message: data.secure_url,
            message_type: "video",
            action: "chat_message",
          };

          // Send the message via WebSocket
          if (socket && socket.readyState === socket.OPEN) {
            socket.send(JSON.stringify(message));
            console.log(message);
          } else {
            console.error("WebSocket is not open");
            // Handle the case when WebSocket is not open (e.g., show an error message)
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (messages.length > 0) {
      const unreadMessageIds = messages
        .filter((msg) => !msg.is_read && msg.user !== userId)  // Only mark messages from others as read
        .map((msg) => msg.id);  // Assuming each message has a unique ID
  
      if (unreadMessageIds.length > 0) {
        markMessagesAsRead(unreadMessageIds);
      }
    }
  }, [messages]);
  

  useEffect(() => {
    if (userId && access) {
      console.log(user, userId);
      GetChats(user, userId);
    }
  }, [user, username, access]);

  const GetChats = async (user_id1, user_id2) => {
    if (socket) {
      socket.close();
    }

    const id = { user_id1, user_id2 };
    const res = await dispatch(ChatMsg(id));
    setMessages(res.payload);
  };

  useEffect(() => {
    if (socket) {
      socket.close();
    }
    getSocket();
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [user, access]);

  const sendStatusUpdate = (status) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const data = { message_type: "status_update", status: status };
        socket.send(JSON.stringify(data));
    }
};

// // Call this function when the user comes online
// sendStatusUpdate("online");

// // Call this function when the user goes offline
// sendStatusUpdate("offline");


  const getSocket = () => {
    if (user && access) {
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const newSocket = new WebSocket(
        `${SOCKET}/chat/${user}/?token=${access}`
      );
      setSocket(newSocket);

      newSocket.onopen = () => {
        console.log("WebSocket Connected--", newSocket);

        // newSocket.send(JSON.stringify({
        //   'user'
        // }))
      };

      newSocket.onerror = (error) => {
        console.log("WebSocket error:", error);
      };

      newSocket.onclose = () => {
        console.log("WebSocket closed");
        setTimeout(getSocket, 1000); // Attempt to reconnect after 1 second
      };

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.content) {
          console.log('data', data);
          
          setMessages((prevMessages) => [...prevMessages, data]);
        } else {
          console.log(data);
          console.log("Unexpected message format:", data);
        }
      };
    }
  };

  const handleSubmit = () => {
    if (newMessage && socket) {
      if (socket.readyState === WebSocket.CLOSED) {
        getSocket();
      } else if (socket.readyState === WebSocket.OPEN) {
        const data = { message: newMessage, action: "chat_message"};
        socket.send(JSON.stringify(data));
        setNewMessage("");
      }
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleVcall = () => {
    console.log("vcall running");
    // navigate(`/meeting/${userId}/${user}/`) // Example navigation
  };

  const renderMessages = () => {
    let lastDate = null;

    return messages
      .slice()
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map((msg, index) => {
        const messageDate = moment(msg.timestamp).startOf("day");
        const isToday = messageDate.isSame(moment().startOf("day"));
        const showDate = !lastDate || !messageDate.isSame(lastDate, "day");

        lastDate = messageDate;

        return (
          <div key={index}>
            {showDate && (
              <Row className="justify-content-center">
                <Col xs={12} className="text-center my-3">
                  <span style={{ fontSize: "0.9rem", color: "#777" }}>
                    {isToday ? "Today" : messageDate.format("MMMM D, YYYY")}
                  </span>
                </Col>
              </Row>
            )}
            <Messages
              text={msg.content}
              send={msg.user}
              sender={userId}
              timestamp={msg.timestamp}
              type={msg.message_type}
              is_read={msg.is_read}
            />
          </div>
        );
      });
  };

  return (
    <div className="chat-history">
      <div className=" card text-light bg-slate-700">
        <Row>
          <Toaster position="top-center" richColors />
          <Col sm={11}>
            <div className="px-5 py-2 d-flex ">
              <a className="m-2">
                <Avatar />
              </a>
              <div className="mb-2 p-0 text-white">
                <h2 className="mb-0">
                  <strong>{username || "user"}</strong>
                </h2>
                {/* <div className="d-flex align-items-center">
                  <span>online</span>
                  <Badge status="success" className="ml-2" />
                </div> */}
              </div>
            </div>
          </Col>
{/* 
          <Col sm={1}>
            <Button
              className="text-light rounded-circle mt-3"
              variant=""
              onClick={handleVcall}
            >
              <h5 className="pt-2 px-2">
              <i className="fa-solid fa-video"></i>
              </h5>
            </Button>
          </Col> */}
        </Row>
      </div>
      <div ref={chatContainerRef} className="chat-area bg-slate-200">
        <div className="mx-4">{renderMessages()}</div>
      </div>
      <div className="chat-message p-2 bg-slate-200">
        <InputEmoji
          value={newMessage}
          onChange={setNewMessage}
          cleanOnEnter
          onEnter={handleSubmit}
          placeholder="Type a message"
          borderColor="black"
        />
        <div className="mt-3">
          <DropdownButton id="attach-dropdown" title={<AttachFileIcon />}>
            <Dropdown.Item onClick={handlePhotoClick} className="file-options">
              <InsertPhotoIcon className="mx-2" />
              Photo
            </Dropdown.Item>
            <Dropdown.Item onClick={handleVideoClick} className="file-options">
              <VideoFileIcon className="mx-2" />
              Video
            </Dropdown.Item>
          </DropdownButton>
        </div>
        <Button className="send-button" onClick={handleSubmit}>
          <IoMdSend />
        </Button>

        <input
          type="file"
          accept="image/*"
          ref={photoInputRef}
          style={{ display: "none" }}
          onChange={handlePhotoChange}
        />
        <input
          type="file"
          accept="video/*"
          ref={videoInputRef}
          style={{ display: "none" }}
          onChange={handleVideoChange}
        />
      </div>
    </div>
  );
};

export default ChatArea;

const ChatInputContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 78%;
  background-color: #424a86;
  border-radius: 15px;
  z-index: 3; /* Ensure it appears above other elements */

  > form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }

  > form > input {
    flex: 1;
    height: 35px;
    margin-left: 15px;
    border: none;
    padding: 10px;
    outline: none;
    border-radius: 10px;
    background-color: #333; /* Darker background */
    color: white;
  }

  > form > button {
    margin-left: 10px;
    height: 35px;
    padding: 0 15px;
    border: none;
    border-radius: 10px;
    // background-color: #4CAF50;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  > form > button:hover {
    background-color: #45a049;
  }
`;
