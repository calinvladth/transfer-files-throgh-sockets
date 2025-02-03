import axios from "axios";
import config from "./config";

async function signup(name) {
  try {
    const response = await axios.post(`${config.URLS.API}/signup`, {
      name,
    });

    return response.status === 201;
  } catch (err) {
    sessionStorage.removeItem("username");
    return;
  }
}

async function checkUser(user) {
  try {
    const response = await axios.get(
      `${config.URLS.API}/check_user?user=${user}`
    );

    return response.status === 200 && response.data === "ok";
  } catch (err) {
    return null;
  }
}

const api = {
  signup,
  checkUser,
};

export default api;
