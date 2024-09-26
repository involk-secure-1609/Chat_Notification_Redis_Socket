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
  // cors: {
  //   origin: "http://localhost:3000",
  // },
});
const notificationListener = async(message, channel) => {
  console.log(channel);
  console.log(message);
  // const SocketID = await redisClient.HGET(
  //   "user_to_socket",
  //   DecodedMessage.receiverId
  // );

  // io.to(SocketID).emit("getMessage", DecodedMessage);
};
const messageListener = async (message, channel) => {
  console.log(channel);
  console.log(message);
  const SocketID = await redisClient.HGET(
    "user_to_socket",
    channel.toString(),
  );

   io.to(SocketID).emit("getMessage", DecodedMessage);
};

io.on("connection", (socket) => {
  console.log("io connection established");
  // ...
  socket.on("initialize", async (userId) => {
    const socketId = socket.id;
    await redisClient.HSET("user_to_socket", userId, socketId);
    redisMessageSubscriber.subscribe(userId, messageListener);
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
