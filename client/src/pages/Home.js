import React, {useContext} from 'react';
import LeftNav from "../components/LeftNav";
import Thread from "../components/Thread";
import {UidContext} from "../components/AppContext";
import PostForm from "../components/Post/PostForm";
import Log from "../components/Log";
import Trends from "../components/Trends";
import FriendHint from "../components/Profile/FriendHint";

const Home = () => {
  const uid = useContext(UidContext);
    return (
        <div className="home">
            <LeftNav/>
            <div className="main">
              <div className="home-header">
                {uid ? <PostForm/> : <Log signin={true} signup={false} />}
              </div>
              <Thread/>
            </div>
          <div className="right-side">
            <div className="right-side-container">
              <div className="wrapper">
                <Trends/>
                {uid && <FriendHint/>}
              </div>
            </div>
          </div>
        </div>
    );
};

export default Home;
