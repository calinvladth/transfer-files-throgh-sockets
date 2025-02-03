import { useEffect, useState } from "react";
import SignUp from "./components/SignUp";
import SocketConnection from "./components/SocketConnection";
import UsersCollection from "./components/UsersCollection";
import SendFiles from "./components/SendFiles";
import ReceiveFiles from "./components/ReceiveFiles";
import WatchCollectionStatus from "./components/WatchCollectionStatus";
import isOnlineInCollection from "./utils/isOnlineInCollection";

function App() {
  const [userName, serUserName] = useState("");
  const [collection, setCollection] = useState({});
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (!userName) {
      if (ws) {
        ws.close();
      }

      setWs(null);
      setCollection({});
    }
  }, [userName, ws]);

  return (
    <div className="w-full h-full p-5 flex flex-col gap-5">
      {userName ? (
        <>
          <SocketConnection
            ws={ws}
            setWs={setWs}
            userName={userName}
            setUserName={serUserName}
          />
          <UsersCollection
            ws={ws}
            userName={userName}
            collection={collection}
            setCollection={setCollection}
          />
          {isOnlineInCollection(collection) && (
            <SendFiles ws={ws} collection={collection} />
          )}

          <ReceiveFiles ws={ws} />
          <WatchCollectionStatus
            collection={collection}
            setCollection={setCollection}
          />
        </>
      ) : (
        <SignUp ws={ws} setUserName={serUserName} />
      )}
    </div>
  );
}

export default App;
