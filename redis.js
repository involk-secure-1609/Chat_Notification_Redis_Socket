import redis from "redis";

const redisClient = redis.createClient();
redisClient.on("error", (err) => console.error("Redis error:", err));
await redisClient.connect();

const redisMessageSubscriber = redisClient.duplicate();
redisMessageSubscriber.on("error", (err) => console.error("Redis message subscriber error:", err));
await redisMessageSubscriber.connect();

const redisNotificationSubscriber = redisClient.duplicate();
redisNotificationSubscriber.on("error", (err) => console.error("Redis notification subscriber error:", err));
await redisNotificationSubscriber.connect();

export { redisClient, redisMessageSubscriber, redisNotificationSubscriber };