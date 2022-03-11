import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { AVATAR_COUNT } from "../../constants";

const ChooseAvatar = ({ chooseAvatar, isOpen, close }) => {
  const [selected, setSelected] = useState("dark");

  return (
    <Modal title="Choose Avatar" isOpen={isOpen} close={close}>
      <div className="toggle">
        <button
          className={`toggle-btn ${selected}`}
          onClick={() => setSelected("dark")}
        >
          Dark
        </button>
        <button
          className={`toggle-btn ${selected}`}
          onClick={() => setSelected("light")}
        >
          Light
        </button>
      </div>
      <div className={`avatar-list ${selected}`}>
        {Array.from({ length: AVATAR_COUNT }, (v, i) => (
          <div
            role="presentation"
            key={i}
            className="create-avatar"
            onClick={() => chooseAvatar(`${selected}${i}.png`)}
          >
            <img src={`${selected}${i}.png`} alt="avatar" />
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ChooseAvatar;
