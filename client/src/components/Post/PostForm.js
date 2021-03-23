import React, {useState, useEffect} from 'react';
import {useSelector} from "react-redux";
import {isEmpty, timestampParser} from "../Utils";
import {NavLink} from "react-router-dom";

const PostForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [picture, setPicture] = useState("");
  const [video, setVideo] = useState("");
  const [file, setFile] = useState(null);
  const userData = useSelector((state) => state.userReducer);

  const handlePicture = (e) => {

  };

  const handlePost = () => {
  };

  const cancelPost = () => {
    setMessage("");
    setPicture("");
    setVideo("");
    setFile(null);
  };

  useEffect(() => {
    if (!isEmpty(userData)) setIsLoading(false);
  }, [userData]);

  return (
    <div className="post-container">
      {isLoading ? (
        <i className={"fas fa-spinner fa-pulse"}></i>
      ) : (
        <>
          <div className="data">
            <p>
              <span>{userData.following ? userData.following.length : 0}</span>{" "}Abonnement{userData.following && userData.following.length > 1 ? "s" : null}
            </p>
            <p>
              <span>{userData.followers ? userData.followers.length : 0}</span>{" "}Abonné{userData.followers && userData.followers.length > 1 ? "s" : null}
            </p>
          </div>
          <NavLink exact to={"/profil"}>
            <div className="user-info">
              <img src={userData.picture} alt="user-img"/>
            </div>
          </NavLink>
          <div className="post-form">
            <textarea name="message" id="message" placeholder={"Quoi de neuf ?"}
                      onChange={(e) => setMessage(e.target.value)}/>
            {message || picture || video.length > 20 ? (
              <li className={"card-container"}>
                <div className={"card-left"}>
                  <img src={userData.picture} alt="user-pic"/>
                </div>
                <div className="card-right">
                  <div className="card-header">
                    <div className="pseudo">
                      <h3>{userData.pseudo}</h3>
                    </div>
                    <span>{timestampParser(Date.now())}</span>
                  </div>
                  <div className="content">
                    <p>{message}</p>
                    <img src={picture} alt=""/>
                    {video && (
                      <iframe
                        src={video}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video}
                      />
                    )}
                  </div>
                </div>
              </li>
            ) : ''}
            <div className="footer-form">
              <div className="icon">
                {isEmpty(video) && (
                  <>
                    <img src="./img/icons/picture.svg" alt="img"/>
                    <input type="file" id={"file-upload"} name={"file"} accept={".jpg, .jpeg, .png"}
                           onChange={(e) => handlePicture(e)}/>
                  </>
                )}
                {video && (
                  <button onClick={() => setVideo("")}>Supprimer vidéo</button>
                )}
              </div>
              <div className="btn-send">
                {message || picture || video.length > 20 || file !== null ? (
                  <button className="cancel" onClick={cancelPost}>Annuler</button>
                ) : null}
                <button className={"send"} onClick={handlePost}>Envoyer</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostForm;
