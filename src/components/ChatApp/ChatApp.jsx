import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../App";
import { useHistory } from "react-router-dom";
import Modal from "../Modal/Modal";
import UserAvatar from "../UserAvatar/UserAvatar";
import Channels from "../Channels/Channels";
import "./ChatApp.css";
import Chats from "../Chats/Chats";
import ChooseAvatar from "../ChooseAvatar/ChooseAvatar";

const ChatApp = () => {
  const { authService, socketService, chatService } = useContext(UserContext);
  const INIT_STATE = {
    userName: authService.name,
    email: authService.email,
    avatarName: authService.avatarName,
    avatarColor: authService.avatarColor,
  };
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [unreadChannels, setUnreadChannels] = useState([]);
  const [chooseAvatarModal, setChooseAvatarModal] = useState(false);
  const [userInfo, setUserInfo] = useState(INIT_STATE);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    socketService.establishConnection();
    return () => socketService.closeConnection();
  }, []);

  useEffect(() => {
    socketService.getChatMessage((newMessage, messages) => {
      if (newMessage.channelId === chatService.selectedChannel.id) {
        setChatMessages(messages);
      }
      if (chatService.unreadChannels.length) {
        setUnreadChannels(chatService.unreadChannels);
      }
    });
  }, []);

  const logoutUser = () => {
    authService.logoutUser();
    setModal(false);
    history.push("/login");
  };

  const checkUpdateBtn = () => {
    setDisabled(!(JSON.stringify(INIT_STATE) === JSON.stringify(userInfo)));
  };

  const chooseAvatar = (avatarName) => {
    setUserInfo({ ...userInfo, avatarName });
    setChooseAvatarModal(false);
    checkUpdateBtn();
  };

  const updateUser = () => {
    console.log("Update user handler");
  };

  return (
    <div className="chat-app">
      <nav>
        <h1>Smack Chat</h1>
        <div
          className="user-avatar"
          onClick={() => setModal(true)}
          role="presentation"
        >
          <UserAvatar className="nav-avatar" size="sm" />
          <div>{authService.name}</div>
        </div>
      </nav>
      <div className="smack-app">
        <Channels unread={unreadChannels} />
        <Chats chats={chatMessages} />
      </div>
      <Modal title="Profile" isOpen={modal} close={() => setModal(false)}>
        <div className="profile">
          <div onClick={() => setChooseAvatarModal(true)}>
            <UserAvatar
              avatar={{
                avatarName: userInfo.avatarName,
                avatarColor: userInfo.avatarColor,
              }}
              size="md"
              className="profile-avatar"
            />
          </div>
          <h4>Username: {authService.name}</h4>
          <h4>Email: {authService.email}</h4>
        </div>
        <div className="profile-btn-container">
          <button
            onClick={updateUser}
            className={`submit-btn update-btn ${
              disabled && "update-btn-disabled"
            }`}
            disabled={disabled}
          >
            Update User Info
          </button>
          <button onClick={logoutUser} className="submit-btn logout-btn">
            logout
          </button>
        </div>
        <ChooseAvatar
          isOpen={chooseAvatarModal}
          close={() => setChooseAvatarModal(false)}
          chooseAvatar={chooseAvatar}
        />
      </Modal>
    </div>
  );
};

export default ChatApp;
