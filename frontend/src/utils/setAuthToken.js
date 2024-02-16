import axios from "axios";
import Cookies from "js-cookie";

const setAuthToken = (n3a65f78f4c6436bb668da21e05543a7) => {
  if (n3a65f78f4c6436bb668da21e05543a7) {
    Cookies.set("n3a65f78f4c6436bb668da21e05543a7", n3a65f78f4c6436bb668da21e05543a7);
    axios.defaults.headers.common["x-auth-token"] = n3a65f78f4c6436bb668da21e05543a7;
  } else {
    Cookies.remove("n3a65f78f4c6436bb668da21e05543a7");
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;