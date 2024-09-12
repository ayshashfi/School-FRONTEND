import {jwtDecode} from 'jwt-decode'; // Import correctly
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { axiosChatInstance } from '../../axios/AxiosInstance';
import { Avatar } from '@mui/material';
import { stringAvatar } from './mui';
import { Badge } from 'antd';
import { getNotification } from '../../axios/chat/ChatServers';

const LeftChat = ({ Chat = () => {} }) => {
    const auth = useSelector((state) => state.auth);
    const accessToken = auth?.accessToken;

    const [chatUsers, setChatUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotification();
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        const intervalId = setInterval(fetchNotifications, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (accessToken) {
            const userId = jwtDecode(accessToken).user_id;
            const fetchChatUsers = async () => {
                try {
                    const res = await axiosChatInstance.get(`/chat_users/${userId}/`);
                    setChatUsers(res.data);
                } catch (error) {
                    console.error('Error while fetching users:', error);
                }
            };
            fetchChatUsers();
        }
    }, [accessToken]);

    return (
        <div id="plist" className="people-list p-2">
            <ul className="list-unstyled chat-list mt-2 mb-0 px-2">
                {Array.isArray(chatUsers) && chatUsers.length > 0 ? (
                    chatUsers.map((user) => {
                        const userId = jwtDecode(accessToken).user_id;
                        const isCurrentUser = user.user1.id === userId;
                        const displayUser = !isCurrentUser ? user.user1 : user.user2;
                        const chatRoomId = user.id;
                        const unreadCount = notifications.find(notification => notification.chat_room_id === chatRoomId)?.unread_messages_count || 0;

                        return (
                            <ChatUserItem
                                user={user}
                                userId={userId}
                                key={user.id}
                                Chat={Chat}
                                unreadCount={unreadCount}
                            />
                        );
                    })
                ) : (
                    <p>No users available.</p>
                )}
            </ul>
        </div>
    );
};

export default LeftChat;

const ChatUserItem = ({ user, userId, Chat = () => {}, unreadCount }) => {
    const isCurrentUser = user.user1.id === userId;
    const displayUser = !isCurrentUser ? user.user1 : user.user2;

    const isStudent = displayUser.is_student;
    const isTeacher = displayUser.is_teacher;
    const isAdmin = displayUser.is_admin;

    let roleLabel = '';
    if (isStudent) roleLabel = 'Student';
    if (isTeacher) roleLabel = 'Teacher';
    if (isAdmin) roleLabel = 'Admin';

    return (
        <button
            style={{
                width: '100%',
                borderRadius: '5px',
                marginBottom: '10px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
            }}
            onClick={() => Chat({ id: displayUser.id, username: displayUser.username })}
        >
            <Avatar {...stringAvatar(`${displayUser.first_name} ${displayUser.last_name}`)} style={{ marginRight: '10px' }} />
            <div style={{ flex: 1 }}>
                <h5 className="mt-2 mb-0">{displayUser.first_name} {displayUser.last_name}</h5>
                <h6 className="m-0" style={{ color: '#555' }}>{roleLabel}</h6>
            </div>
            {unreadCount > 0 && <Badge count={unreadCount} showZero color="#52c41a" />}
        </button>
    );
};