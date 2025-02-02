import axios from "axios";

async function signup(name) {
  try {
    console.log(name);
    const response = await axios.post("http://localhost:3001/signup", {
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
