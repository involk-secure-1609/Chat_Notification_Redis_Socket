import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";

const BUCKET_REFILL_INTERVAL = 10;
const MAX_BUCKET_SIZE = 10;

const redisClient = createClient();
redisClient.on("error", (err) => console.error("Redis Client Error", err));

interface TokenBucket {
  lastRequestTime: number;
  tokens: number;
}

export const customTokenBucketLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  try {
    const ipAddress = req.ip as string;
    const currentTime = Math.floor(Date.now() / 1000); // Unix timestamp in seconds

    console.log(currentTime);
    const bucket = await getBucket(ipAddress);
    console.log(bucket);
    const updatedBucket = refillBucket(bucket, currentTime);
    console.log(updatedBucket);
    if (updatedBucket.tokens > 0) {
      await updateBucket(ipAddress, {
        ...updatedBucket,
        tokens: updatedBucket.tokens - 1,
      });
      next();
    } else {
        console.log('Too many requests');
      res.status(429).json("Too Many Requests");
      return;
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

async function getBucket(ipAddress: string): Promise<TokenBucket> {
  const bucket = await redisClient.hGetAll(ipAddress);
  return {
    lastRequestTime: parseInt(bucket.lastRequestTime || "0"),
    tokens: parseFloat(bucket.tokens || MAX_BUCKET_SIZE.toString()),
  };
}

function refillBucket(bucket: TokenBucket, currentTime: number): TokenBucket {
  const { lastRequestTime, tokens } = bucket;
  const timePassed = currentTime - lastRequestTime;
  const tokensToAdd = (timePassed / BUCKET_REFILL_INTERVAL)
  return {
    lastRequestTime: currentTime,
    tokens: Math.min(tokens + tokensToAdd, MAX_BUCKET_SIZE),
  };
}

async function updateBucket(ipAddress: string, bucket: TokenBucket): Promise<void> {
  await redisClient.hSet(ipAddress, {
    lastRequestTime: bucket.lastRequestTime.toString(),
    tokens: bucket.tokens.toString(),
  });
}