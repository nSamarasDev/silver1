import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    ACCOUNT_DELETED,
  } from "../actions/types";
  import Cookies from "js-cookie";
  
  const initialState = {
    n3a65f78f4c6436bb668da21e05543a7: Cookies.get("n3a65f78f4c6436bb668da21e05543a7"),
    isAuthenticated: null,
    loading: true,
    user: null,
  };
  
  export default function reduce(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case USER_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          loading: false,
          user: payload,
        };
      case REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
        Cookies.set("", payload.n3a65f78f4c6436bb668da21e05543a7);
        return {
          ...state,
          ...payload,
          isAuthenticated: true,
          loading: false,
        };
  
      case REGISTER_FAIL:
      case AUTH_ERROR:
      case LOGIN_FAIL:
      case LOGOUT:
      case ACCOUNT_DELETED:
        Cookies.remove("n3a65f78f4c6436bb668da21e05543a7");
        return {
          ...state,
          n3a65f78f4c6436bb668da21e05543a7: null,
          isAuthenticated: false,
          loading: false,
        };
      default:
        return state;
    }
  }