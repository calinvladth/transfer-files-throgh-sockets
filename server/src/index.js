const WebSocket = require("ws");
const path = require("path");
const express = require("express");
const services = require("./services");
const cors = require("cors");
const url = require("url");

const app = express();
global.users = new Map();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join("../file_transfer_client", "build")));

// app.get('*', (req, res) => {
//     res.sendFile(path.join('../file_transfer_client', 'build', 'index.html'));
// });

app.post("/signup", services.signup);
app.get("/check_user", services.checkUser);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws, req) => {
  const { username } = url.parse(req.url, true).query;
  if (!username) {
    return;
  }

  console.log(`Client connected with username: ${username}`);

  global.users.set(username, ws);
  let receivedChunks = 0;

  ws.on("message", (message) => {
    try {
      const jsonMessage = JSON.parse(message);
      const {
        type,
        fileName,
        fileSize,
        chunkIndex,
        data,
        totalChunks,
        collection,
      } = jsonMessage;

      if (type === "metadata") {
        receivedChunks = 0;
      } else if (type === "chunk") {
        const buffer = Buffer.from(data, "base64");

        Object.keys(collection).forEach((user) => {
          const client = global.users.get(user);

          if (!client) {
            return;
          }

          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "clientChunk",
                fileName,
                fileSize,
                totalChunks,
                chunkIndex: chunkIndex + 1,
                buffer,
                from: username,
              })
            );
          }
        });

        receivedChunks++;

        if (receivedChunks === totalChunks) {
          console.log("File transfer completed.");
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    console.log(`Disconnected ${username}`);
    global.users.delete(username);
  });
});
