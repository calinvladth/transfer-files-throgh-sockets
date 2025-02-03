import { useState } from "react";
import api from "../api";
import config from "../config";

function UsersCollection({ userName, collection, setCollection }) {
  const [connectTo, setConnectTo] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  async function submit(e) {
    e.preventDefault();

    if (!connectTo) {
      setResponseMessage("missing user");
      return;
    }

    if (connectTo === userName) {
      setResponseMessage("you can't add yourself");
      return;
    }

    if (connectTo in collection) {
      setResponseMessage("name already exists");
      return;
    }

    const response = await api.checkUser(connectTo);

    if (!response) {
      setResponseMessage(`can't connect to ${connectTo}`);
      return;
    }

    setCollection((prevValue) => ({
      ...prevValue,
      [connectTo]: { status: config.COLLECTION_STATUS.ONLINE },
    }));
    setResponseMessage("");
    setConnectTo("");
  }

  function removeKeyFromCollection(key) {
    setCollection((prevVal) => {
      const newState = { ...prevVal };
      delete newState[key];
      return newState;
    });
  }

  return (
    <div className="w-full p-7 border border-black">
      <p className="font-semibold">Add user to collection</p>
      <form onSubmit={submit} className="flex flex-col gap-3 mt-3">
        <input
          type="text"
          value={connectTo}
          onChange={(e) => setConnectTo(e.target.value)}
          className="border border-black px-3 py-1"
        />
        {responseMessage && (
          <label className="text-red-500 text-sm">{responseMessage}</label>
        )}
        <button type="submit" className="border border-black px-3 py-1">
          Submit
        </button>
      </form>

      <div className="w-full mt-3">
        {JSON.stringify(collection) !== "{}" ? (
          <>
            <p className="font-semibold">Collection</p>
            <ul>
              {Object.entries(collection).map(([key, value]) => (
                <li
                  key={key}
                  className={`list-disc list-inside flex items-center justify-between gap-3 border-b border-black py-3 ${
                    value.status === config.COLLECTION_STATUS.ONLINE
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {key}
                  <span
                    onClick={() => {
                      removeKeyFromCollection(key);
                    }}
                    className="text-sm text-red-500 cursor-pointer"
                  >
                    [x]
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="font-semibold">Empty collection</p>
        )}
      </div>
    </div>
  );
}

export default UsersCollection;
