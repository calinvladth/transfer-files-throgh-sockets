import { useEffect, useState } from "react";
import api from "../api";
import config from "../config";

function WatchCollectionStatus({ collection, setCollection }) {
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    clearInterval(timeoutId);

    if (JSON.stringify(collection) === "{}") {
      return;
    }

    const intervalId = setInterval(async () => {
      for (const key of Object.keys(collection)) {
        const response = await api.checkUser(key);
        if (!response) {
          setCollection((prevValue) => ({
            ...prevValue,
            [key]: { status: config.COLLECTION_STATUS.OFFLINE },
          }));
          continue;
        }

        setCollection((prevValue) => ({
          ...prevValue,
          [key]: { status: config.COLLECTION_STATUS.ONLINE },
        }));
      }
    }, config.CHECK_COLLECTION_STATUS_INTERVAL);
    setTimeoutId(intervalId);

    return () => {
      clearInterval(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, setCollection]);

  return;
}

export default WatchCollectionStatus;
