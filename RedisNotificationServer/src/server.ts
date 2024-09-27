import express, { Request, Response } from 'express';
import RedisClient from "./RedisClient";

const app = express();

// Read the port from the first argument after the script name
const PORT = parseInt(process.argv[2]) ||8002;

const RedisInstance: RedisClient = RedisClient.getInstance();

// Middleware to parse JSON
app.use(express.json());

// POST API to send notification
app.post('/api/notification/sendNotification', (req: Request, res: Response) => {
    const { data, userId, emailId } = req.body;
    RedisInstance.publish(data, userId, emailId);
    res.status(200).json({ message: "Notification sent successfully" });
    return;
});

// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await RedisInstance.initialize(); // Changed to initialize() for clarity
});