import axios from "axios";

async function signup(name) {
  console.log(name);
  const response = await axios.post("http://localhost:3001/signup", {
    name,
  });

  return response.status === 201;
}

const api = {
  signup,
};

export default api;
