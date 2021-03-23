import axios from "axios";

// posts
export const GET_POSTS = "GET_POSTS";
export const CREATE_POST =  "CREATE_POST";
export const LIKE_POST = "LIKE_POST";
export const UNLIKE_POST = "UNLIKE_POST";
export const UPDATE_POST = "UPDATE_POST";
export const DELETE_POST = "DELETE_POST";

// comments
export const ADD_COMMENT = "ADD_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

// errors
export const GET_POST_ERROR = "GET_POST_ERRORS";

export const getPosts = (num) => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}api/post/`)
      .then((res) => {
        const posts_array = res.data.slice(0, num);
        dispatch({type: GET_POSTS, payload: posts_array})
      })
      .catch((err) => console.log(err))
  }
}

export const likePost = (postId, userId) => {
  return (dispatch) => {
    return axios({
      method: 'patch',
      url: `${process.env.REACT_APP_API_URL}api/post/like-post/` + postId,
      data: {id: userId},
    })
      .then(() => {
        dispatch({type: LIKE_POST, payload: {postId, userId}})
      })
      .catch((err) => console.log(err));
  }
}

export const unlikePost = (postId, userId) => {
  return (dispatch) => {
    return axios({
      method: 'patch',
      url: `${process.env.REACT_APP_API_URL}api/post/unlike-post/` + postId,
      data: {id: userId},
    })
      .then(() => {
        dispatch({type: UNLIKE_POST, payload: {postId, userId}})
      })
      .catch((err) => console.log(err));
  }
}

export const createPost = (data) => {
  return(dispatch) => {
    return axios
      .post(`${process.env.REACT_APP_API_URL}api/post/`, data)
      .then((res) => {
        if (res.data.errors) {
          dispatch({ type: GET_POST_ERROR, payload: res.data.errors });
        } else {
          dispatch({ type: GET_POST_ERROR, payload: "" });
        }
      });
  }
}

export const updatePost = (postId, message) => {
  return (dispatch) => {
    return axios({
      method: 'put',
      url: `${process.env.REACT_APP_API_URL}api/post/${postId}`,
      data: {message},
    })
      .then(() => {
        dispatch({type: UPDATE_POST, payload: {message: message, postId}})
      })
      .catch((err) => console.log(err));
  }
}

export const deletePost = (postId) => {
  return (dispatch) => {
    return axios({
      method: 'delete',
      url: `${process.env.REACT_APP_API_URL}api/post/${postId}`,
    })
      .then(() => {
        dispatch({type: DELETE_POST, payload: {postId}})
      })
      .catch((err) => console.log(err));
  }
}

// COMMENTS

export const addComment = (postId, commenterId, text, commenterPseudo) => {
  return (dispatch) => {
    return axios({
      method: 'patch',
      url: `${process.env.REACT_APP_API_URL}api/post/comment-post/` + postId,
      data: {commenterId, text, commenterPseudo},
    })
      .then(() => {
        dispatch({type: ADD_COMMENT, payload: {postId}})
      })
      .catch((err) => console.log(err));
  }
}

export const editComment = (postId, commentId, text) => {
  return (dispatch) => {
    return axios({
      method: 'patch',
      url: `${process.env.REACT_APP_API_URL}api/post/edit-comment-post/` + postId,
      data: {commentId, text},
    })
      .then(() => {
        dispatch({type: EDIT_COMMENT, payload: {postId, commentId, text}})
      })
      .catch((err) => console.log(err));
  }
}

export const deleteComment = (postId, commentId) => {
  return (dispatch) => {
    return axios({
      method: 'patch',
      url: `${process.env.REACT_APP_API_URL}api/post/delete-comment-post/` + postId,
      data: {commentId},
    })
      .then(() => {
        dispatch({type: DELETE_COMMENT, payload: {postId, commentId}})
      })
      .catch((err) => console.log(err));
  }
}