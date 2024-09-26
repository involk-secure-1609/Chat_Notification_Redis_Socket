import redis from "redis";

const redisClient = redis.createClient();
redisClient.on("error", (err) => console.error("CLient Redis error:", err));
redisClient.on("ready",()=>console.log("Client is Ready"));
redisClient.on("connect", ()=>console.log("Client Connection established"));
await redisClient.connect();

const redisMessageSubscriber = redisClient.duplicate();
redisMessageSubscriber.on("error", (err) => console.error("Redis message subscriber error:", err));
redisMessageSubscriber.on("ready",()=>console.log("Redis message subscriber Ready"));
redisMessageSubscriber.on("connect", ()=>console.log("Redis message subscriber Connection established"));
await redisMessageSubscriber.connect();

const redisNotificationSubscriber = redisClient.duplicate();
redisNotificationSubscriber.on("error", (err) => console.error("Redis notification subscriber error:", err));
redisNotificationSubscriber.on("ready",()=>console.log("Redis notification subscriber Ready"));
redisNotificationSubscriber.on("connect", ()=>console.log("Redis notification subscriber Connection established"));
await redisNotificationSubscriber.connect();

export { redisClient, redisMessageSubscriber, redisNotificationSubscriber };