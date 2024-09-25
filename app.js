const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const redis = require("redis");
const bcrypt = require("crypto");
const cors = require("cors");
import routes from "./routes/router";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: "http://localhost:3000",
  },
});

const client = redis.createClient().on("error", (err) => console.log());
await client.connect();

io.on("connection", (socket) => {
  // ...
});

client.on("message", (message, channel) => {
  const message = JSON.parse(message);
  const SocketID = client.HGET("user_to_socket", message.receiverId);

  io.to(SocketID).emit("getMessage", {
    conversationId: message.conversationId,
    message: message.message,
    receiverId: message.receiverId,
    senderId: message.senderId,
  });
});
httpServer.listen(8000);


app.use(routes);
app.post("/sendMessage", async (req, res) => {
  const receiverId = req.receiverId;
  const message = {
    senderId: req.UserId,
    receiverId: receiverId,
    message: req.message,
  };
  await client.publish(receiverId, JSON.stringify(message));

  return res.status(200).json("success");
});

app.post("/sign", (req, res) => {
  // .. - create Account using bcrypt - use Postgres
});
app.post("/login", async (req, res) => {
  // ..
  const userId = req.UserId;
  const password = req.password;

  // const decrytedPassword=bcrypt

  await client.subscribe(userId);
  await client.subscribe("notifications");
});
