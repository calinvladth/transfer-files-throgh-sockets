import config from "../config";

function isOnlineInCollection(collection) {
  let isOnline = false;

  for (const value of Object.values(collection)) {
    if (value.status === config.COLLECTION_STATUS.ONLINE) {
      isOnline = true;
      break;
    }
  }

  return isOnline;
}

export default isOnlineInCollection;
