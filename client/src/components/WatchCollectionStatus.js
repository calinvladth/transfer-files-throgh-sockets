import { useEffect, useState } from "react";
import api from "../api";

function WatchCollectionStatus({ collection, setCollection }) {
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    clearInterval(timeoutId);

    const intervalId = setInterval(async () => {
      for (const [key, value] of Object.entries(collection)) {
        console.log(key, value);
        const response = await api.checkUser(key);
        if (!response) {
          setCollection((prevValue) => ({
            ...prevValue,
            [key]: { status: "offline" },
          }));
          return;
        }

        setCollection((prevValue) => ({
          ...prevValue,
          [key]: { status: "online" },
        }));
      }
    }, 5000);
    setTimeoutId(intervalId);

    return () => {
      // Clear timeout
      clearInterval(timeoutId);
    };
  }, [collection, setCollection]);

  //   async function checkCollectionStatus() {}

  return;
}

export default WatchCollectionStatus;
