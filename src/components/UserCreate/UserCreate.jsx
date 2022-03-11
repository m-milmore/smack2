import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import Modal from "../Modal/Modal";
import "./UserCreate.css";
import { AVATAR_COUNT } from "../../constants";
import Alert from "../Alert/Alert";
import UserAvatar from "../UserAvatar/UserAvatar";
import ChooseAvatar from "../ChooseAvatar/ChooseAvatar";

const UserCreate = ({ history }) => {
  const { authService } = useContext(UserContext);
  const INIT_STATE = {
    userName: "",
    email: "",
    password: "",
    avatarName: "avatarDefault.png",
    avatarColor: "none",
  };
  const [userInfo, setUserInfo] = useState(INIT_STATE);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("dark");

  const onChange = ({ target: { name, value } }) => {
    setUserInfo({ ...userInfo, [name]: value });
  };

  const chooseAvatar = (avatarName) => {
    setUserInfo({ ...userInfo, avatarName });
    setModal(false);
  };

  const generateBgColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    setUserInfo({ ...userInfo, avatarColor: `#${randomColor}` });
  };

  const createUser = (e) => {
    e.preventDefault();
    const { userName, email, password, avatarName, avatarColor } = userInfo;
    if (!!userName && !!email && !!password) {
      setLoading(true);
      authService
        .registerUser(email, password)
        .then(() => {
          authService
            .loginUser(email, password)
            .then(() => {
              authService
                .createUser(userName, email, avatarName, avatarColor)
                .then(() => {
                  setUserInfo(INIT_STATE);
                  history.push("/");
                })
                .catch((error) => {
                  console.error("error creating user", error);
                  setError(true);
                });
            })
            .catch((error) => {
              console.error("error login user", error);
              setError(true);
            });
        })
        .catch((error) => {
          console.error("error registering user", error);
          setError(true);
        });
      setLoading(false);
    }
  };

  const { userName, email, password, avatarName, avatarColor } = userInfo;
  const errMsg = "Error creating account. Please try again.";

  return (
    <>
      <div className="center-display">
        {error ? <Alert message={errMsg} type="alert-danger" /> : null}
        {loading ? <div>"Loading..."</div> : null}
        <h3 className="title">Create an account</h3>
        <form onSubmit={createUser} className="form">
          <input
            type="text"
            className="form-control"
            name="userName"
            placeholder="enter a username"
            onChange={onChange}
            value={userName}
          />
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="enter your email"
            onChange={onChange}
            value={email}
          />
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="enter a password"
            onChange={onChange}
            value={password}
          />
          <div className="avatar-container">
            <UserAvatar
              avatar={{ avatarName, avatarColor }}
              className="create-avatar"
            />
            <div onClick={() => setModal(true)} className="avatar-text">
              Choose avatar
            </div>
            <div
              role="presentation"
              onClick={generateBgColor}
              className="avatar-text"
            >
              Generate background color
            </div>
          </div>
          <input type="submit" className="submit-btn" value="create account" />
        </form>
        <div className="footer-text">
          Already have an account? Log in <Link to="/login">HERE</Link>
        </div>
      </div>
      <ChooseAvatar isOpen={modal} close={() => setModal(false)} chooseAvatar={chooseAvatar}/>
      {/* <Modal title="Choose Avatar" isOpen={modal} close={() => setModal(false)}>
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
      </Modal> */}
    </>
  );
};

export default UserCreate;
