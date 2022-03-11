import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../App";
import UserAvatar from "../UserAvatar/UserAvatar";
import "./Chats.css";
import { formatDate } from "../../Helpers/DateFormat";

const Chats = ({chats}) => {
  const { appSelectedChannel, chatService, socketService, authService } =
    useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

	useEffect(() => {
		setMessages(chats)
	}, [chats])

  useEffect(() => {
    if (!!appSelectedChannel.id) {
      chatService
        .findAllMessagesForChannel(appSelectedChannel.id)
        .then((res) => {
          setMessages(res);
        });
    }
  }, [appSelectedChannel]);

  useEffect(() => {
    socketService.getUserTyping((users) => {
      let names = "";
      let usersTyping = 0;
      for (const [typingUser, chId] of Object.entries(users)) {
        if (typingUser !== authService.name && appSelectedChannel.id === chId) {
          names = names === "" ? typingUser : `${names}, ${typingUser}`;
          usersTyping += 1;
        }
      }
      if (usersTyping > 0) {
        const verb = usersTyping > 1 ? "are" : "is";
        setTypingMessage(`${names} ${verb} typing a message...`);
      } else {
        setTypingMessage("");
      }
    });
  }, [appSelectedChannel]);

  const onTyping = ({ target: { value } }) => {
    if (!value.length) {
      setIsTyping(false);
      socketService.stopTyping(authService.name);
    } else if (!isTyping) {
      socketService.startTyping(authService.name, appSelectedChannel.id);
    } else {
      setIsTyping(true);
    }
    setMessageBody(value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const { id, name, avatarName, avatarColor } = authService;
    const user = {
      userId: id,
      userName: name,
      userAvatar: avatarName,
      userAvatarColor: avatarColor,
    };
    socketService.addMessage(messageBody, appSelectedChannel.id, user);
    socketService.stopTyping(authService.name);
    setMessageBody("");
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <h3>#{appSelectedChannel.name} -&nbsp;</h3>
        <h4>{appSelectedChannel.description}</h4>
      </div>
      <div className="chat-list">
        {!!messages.length ? (
          messages.map((msg) => (
            <div key={msg.id} className="chat-message">
              <UserAvatar
                avatar={{
                  avatarName: msg.userAvatar,
                  avatarColor: msg.userAvatarColor,
                }}
                size="md"
              />
              <div className="chat-user">
                <strong>{msg.userName}</strong>
                <small>{formatDate(msg.timeStamp)}</small>
                <div className="message-body">{msg.messageBody}</div>
              </div>
            </div>
          ))
        ) : (
          <div>No messages...</div>
        )}
      </div>
      <form onSubmit={sendMessage} className="chat-bar">
        <div className="typing">{typingMessage}</div>
        <div className="chat-wrapper">
          <textarea
            value={messageBody}
            placeholder="type a message..."
            onChange={onTyping}
          />
          <input type="submit" value="Send" className="submit-btn" />
        </div>
      </form>
    </div>
  );
};

export default Chats;
