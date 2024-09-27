import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  redisClient,
  redisMessageSubscriber,
  redisNotificationSubscriber,
} from "./redis.js";
import routes from "./routes/router.js";
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
const notificationListener = async(message, channel) => {
  console.log(channel);
  console.log(JSON.parse(message));
  await redisClient.HGETALL("user_to_socket");
  const SocketID = await redisClient.HGET(
    "user_to_socket",
    DecodedMessage.receiverId
  );

  io.to(SocketID).emit("getNotification", JSON.parse(message));
};
const messageListener = async (message, channel) => {
  console.log(channel);
  console.log(JSON.parse(message));
  await redisClient.HGETALL("user_to_socket");
  const SocketID = await redisClient.HGET(
    "user_to_socket",
    channel.toString(),
  );
  console.log(SocketID);
   io.to(SocketID).emit("getMessage", JSON.parse(message));
};

io.on("connection", (socket) => {
  console.log("io connection established");
  console.log(socket.id);
  // ...
  socket.on("initialize", async (userId) => {
   
    console.log(userId)
    console.log("before setting user_id to socket_id");
    await redisClient.HSET("user_to_socket", userId, socket.id);
    redisMessageSubscriber.subscribe(userId.toString(), messageListener);
  });
});

redisNotificationSubscriber.subscribe("notifications", notificationListener);

redisMessageSubscriber.on("error", function (e) {
  console.log("publisher", e.stack);
});
httpServer.listen(8000, () => {
  console.log("server listening on port 8000");
});

app.use(routes);
