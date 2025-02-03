const URLS = {
  API: "http://localhost:3001",
  WS: "ws://localhost:8080",
};

const COLLECTION_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
};

const CHECK_COLLECTION_STATUS_INTERVAL = 5000;

const config = {
  URLS,
  COLLECTION_STATUS,
  CHECK_COLLECTION_STATUS_INTERVAL,
};

export default config;
