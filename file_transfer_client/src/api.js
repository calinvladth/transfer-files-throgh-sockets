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

const api = {
  signup,
};

export default api;
