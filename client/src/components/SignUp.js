import { useEffect, useState } from "react";
import api from "../api";

function SignUp({ setUserName }) {
  const [name, setName] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const storageUserName = sessionStorage.getItem("username");

      if (!storageUserName) {
        setLoaded(true);
        return;
      }

      const response = await api.signup(storageUserName);

      if (!response) {
        setLoaded(true);
        return;
      }

      setUserName(storageUserName);
    })();

    return () => {
      setName("");
    };
  }, [setUserName]);

  async function submit(e) {
    e.preventDefault();

    try {
      const response = await api.signup(name);

      if (!response) {
        setResponseMessage("something went wrong");
        return;
      }

      setUserName(name);
      setResponseMessage("");

      sessionStorage.setItem("username", name);
    } catch (err) {
      setResponseMessage(err.response.data);
    }
  }

  if (!loaded) {
    return <p>Loading ...</p>;
  }

  return (
    <div className="w-full h-screen border border-black flex flex-col justify-center items-center">
      <div className="w-1/3 border border-black p-10">
        <p className="pb-3">Sign up</p>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            className="border border-black px-3 py-1"
          />
          {responseMessage && (
            <label className="text-red-500 text-sm">{responseMessage}</label>
          )}
          <button type="submit" className="border border-black px-3 py-1">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
