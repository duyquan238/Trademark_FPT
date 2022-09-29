// First we need to import axios.js
import axios from "axios";
import Cookies from "js-cookie";


// Next we make an 'instance' of it
const instance = axios.create({
  // .. where we make our configurations
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

// Where you would set stuff like your 'Authorization' header, etc ...
instance.defaults.headers.common["Authorization"] = "AUTH TOKEN FROM INSTANCE";

// Also add/ configure interceptors && all the other cool stuff

instance.interceptors.request.use(
  function (config) {
    const token = Cookies.get("_token");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
      return response
  },
  async (error) => {
      if (!error.response) {
          window.location.href = "/error";
      }
      return Promise.reject(error)
  }
)

export default instance;
