import express from "express";
import http from "http";
import cors from "cors";
import { RawData, WebSocketServer } from "ws";
import url from "url";
import { v4 } from "uuid";

const app = express();

app.use(cors());

const connections = {};
const users = {};

const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });

const broadcast = () => {
  Object.keys(connections).map((userId) => {
    const connection = connections[userId];
    const message = JSON.stringify(users);
    connection.send(message);
  });
};

const handleMessage = (bytes: RawData, userId: string) => {
  const message = JSON.parse(bytes.toString());
  const user = users[userId];
  user.state = message;
  broadcast();
};

const handleCLose = (userId: string) => {
  delete connections[userId];
  delete users[userId];
  broadcast();
};

wsServer.on("connection", (connection, request) => {
  const { username } = url.parse(request.url!, true).query;
  const userId = v4();
  connections[userId] = connection;
  users[userId] = {
    username,
    state: {},
  };

  connection.on("message", (message) => handleMessage(message, userId));
  connection.on("close", () => handleCLose(userId));
});

server.listen(3001, () => console.log("Server is running"));
