import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getPosts} from "../actions/postAction";
import {isEmpty} from "./Utils";
import Card from "./Post/Card";

const Thread = () => {
  const [loadPost, setLoadPost] = useState(true);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postReducer);

  useEffect(() => {
    dispatch(getPosts());
    setLoadPost(false);
  }, [loadPost, dispatch])

  return (
    <div className="threadContainer">
      <ul>
        {!isEmpty(posts[0]) &&
          posts.map((post) => {
            return <Card post={post} key={post._id}/>
          })
        }
      </ul>
    </div>
  );
};

export default Thread;
