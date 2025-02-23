import { useEffect } from "react";
import config from "../config";

function SocketConnection({ ws, setWs, userName, setUserName }) {
  useEffect(() => {
    const websocket = new WebSocket(`${config.URLS.WS}?username=${userName}`);
    websocket.onopen = () => {
      console.log(`WebSocket is connected for ${userName}`);
    };

    websocket.onclose = () => {
      console.log("WebSocket is closed");
    };

    setWs(websocket);

    return () => {};
  }, [userName, setWs]);

  function disconnect() {
    sessionStorage.removeItem("username");
    setUserName("");
  }

  if (!ws) {
    return <p>Socket down</p>;
  }

  return (
    <div className="flex justify-between items-center">
      <p className="text-green-500">{userName}</p>
      <p className="text-red-500 cursor-pointer" onClick={disconnect}>
        Disconnect
      </p>
    </div>
  );
}

export default SocketConnection;
