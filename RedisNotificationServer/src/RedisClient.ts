import { RedisClientType,createClient } from "redis";

class RedisClient {
  private constructor() {}
  private static instance: RedisClient;
  private publisher: RedisClientType;
  private initialized: boolean = false;

  public static getInstance(){
    if(!this.instance)
    {
        this.instance = new RedisClient();
    }

    return this.instance;
  }
  async initialize() {
    this.publisher=createClient();
    this.publisher.on("error",()=>console.log("Error"));
    this.publisher.on("connect",()=>console.log("Connection succesfull"));
    this.publisher.on("ready",()=>console.log("publisher ready"));
    await this.publisher.connect();
    this.initialized = true;
  }

  async publish(data: string,userId: string,emailId: string)
  {
    if(!this.initialized)
    {
        this.initialize();
    }
    const channel="notifications"
    const data_to_send={
        data:data,
        userId:userId,
        emailId:emailId,
    }
    console.log(data_to_send);
    const data_to_string=JSON.stringify(data_to_send);
    console.log(data_to_string);
    this.publisher.publish(channel,data_to_string);
  }
}


export default RedisClient;