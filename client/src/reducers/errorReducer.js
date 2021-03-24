import {GET_POST_ERROR} from "../actions/postAction";
import {GET_USER_ERROR} from "../actions/userActions";

const initialState = {postError: [], userError: []}

export default function errorReducer(state = initialState, action) {
  switch (action.type){
    case GET_POST_ERROR:
      return{
        postError: action.payload,
        userError: []
      }
    case GET_USER_ERROR:
      return{
        userError: action.payload,
        postError: []
      }
    default:
      return state;
  }
}