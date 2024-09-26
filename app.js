const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
import { redisClient, redisMessageSubscriber,redisNotificationSubscriber } from "./redis";
import routes from "./routes/router";
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

io.on("connection", (socket) => {
  // ...
  socket.on("initialize", async (userId) => {
    const socketId = socket.id;
    await redisClient.HSET("user_to_socket", userId, socketId);
    await redisMessageSubscriber.subscribe(userId);
    await redisNotificationSubscriber.subscribe("notifications");
  });
});

redisMessageSubscriber.on("message", async (channel, message) => {
  console.log(channel);
  const DecodedMessage = JSON.parse(message);
  const SocketID = await redisClient.HGET(
    "user_to_socket",
    DecodedMessage.receiverId
  );

  io.to(SocketID).emit("getMessage", DecodedMessage);
});

redisNotificationSubscriber.on("message", async (channel, message) =>{
  console.log(channel);
  console.log(message);

});
redisNotificationSubscriber.on('error', function(e) {
   console.log('subscriber', e.stack); 
});

redisMessageSubscriber.on('error', function(e) {
   console.log('publisher', e.stack); 
});
httpServer.listen(8000);

app.use(routes);
