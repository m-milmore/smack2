import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../App";
import Modal from "../Modal/Modal";
import "./Channels.css";
import { toCamelCase } from "../../Helpers/CamelCase";

const Channels = ({ unread }) => {
  const INIT = {
    name: "",
    description: "",
  };
  const {
    authService,
    chatService,
    socketService,
    appSetChannel,
    appSelectedChannel,
  } = useContext(UserContext);
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const [newChannel, setNewChannel] = useState(INIT);
  const [unreadChannels, setUnreadChannels] = useState([]);

  useEffect(() => {
    setUnreadChannels(unread);
  }, [unread]);

  useEffect(() => {
    chatService.findAllChannels().then((res) => {
      setChannels(res);
      appSetChannel(res[0]);
    });
  }, []);

  useEffect(() => {
    socketService.getChannel((channelList) => {
      setChannels(channelList);
    });
  }, []);

  const selectChannel = (channel) => () => {
    appSetChannel(channel);
    const unread = chatService.setUnreadChannels(channel);
    setUnreadChannels(unread);
  };

  const onChange = ({ target: { name, value } }) => {
    setNewChannel({ ...newChannel, [name]: value });
  };

  const createChannel = (e) => {
    e.preventDefault();
		const camelChannel = toCamelCase(newChannel.name)
    socketService.addChannel(camelChannel, newChannel.description);
    appSetChannel(newChannel);
    setModal(false);
    setNewChannel(INIT);
  };

  return (
    <>
      <div className="channel">
        <div className="channel-header">
          <h3 className="channel-label">{authService.name}</h3>
        </div>
        <h3 className="channel-label">
          Channels
          <span onClick={() => setModal(true)}>Add +</span>
        </h3>
        <div className="channel-list">
          {!!channels.length ? (
            channels.map((channel) => (
              <div
                key={channel.id}
                onClick={selectChannel(channel)}
                className={`channel-label ${
                  unreadChannels.includes(channel.id) && "unread"
                }`}
              >
                <div
                  className={`inner ${
                    appSelectedChannel.id === channel.id ? "selected" : ""
                  }`}
                >
                  # {channel.name}
                </div>
              </div>
            ))
          ) : (
            <div>No Channels</div>
          )}
        </div>
      </div>
      <Modal title="Create Channel" isOpen={modal} close={setModal}>
        <form onSubmit={createChannel} className="form channel-form">
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="enter channel name"
            value={newChannel.name}
            onChange={onChange}
          />
          <input
            type="text"
            className="form-control"
            name="description"
            placeholder="enter channel description"
            value={newChannel.description}
            onChange={onChange}
          />
          <input type="submit" className="submit-btn" value="Create Channel" />
        </form>
      </Modal>
    </>
  );
};

export default Channels;
