import { redisClient,redisMessageSubscriber,redisNotificationSubscriber } from "../redis.js";
import MessageService from "../Service/MessageService.js";
import { afterAll, jest } from "@jest/globals";

describe("sending messages with Message Service", () => {
  const mockRequest = {
    body: {
      message: "test",
      senderId: "1",
      receiverId: "2",
      conversationId: "3",
    },
  };
  const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
  };

  afterAll(() => {
    redisClient.disconnect();
    redisMessageSubscriber.disconnect();
    redisNotificationSubscriber.disconnect();
  });


  it("message doesnt have appropriate arguments", async () => {
    //Promise needs a value to resolve which should be a number
    const spy = jest
      .spyOn(redisClient, "publish")
      .mockImplementationOnce(() => Promise.resolve(1));
    const newMockRequest = {
      body: {
        message: "test",
        senderId: "1",
        conversationId: "3",
      },
    };
    await MessageService.sendMessage(newMockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });
  it("sending fails due to error due to redisClient.publish", async () => {
    //Promise needs a value to resolve
    const spy = jest
      .spyOn(redisClient, "publish")
      .mockImplementationOnce(() => Promise.reject("Failed to publish to redis"));
   
    await MessageService.sendMessage(mockRequest, mockResponse);

    expect(spy).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalled();

    spy.mockRestore();
  });

  it("should send the messages successfully", async () => {
    const spy = jest
      .spyOn(redisClient, "publish")
      .mockImplementationOnce(() => Promise.resolve(1));

    await MessageService.sendMessage(mockRequest, mockResponse);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      mockRequest.body.receiverId,
      JSON.stringify(mockRequest.body)
    );

    expect(mockResponse.status).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalled();
    expect(mockResponse.json).toHaveBeenCalledWith("Message sent successfully");

    spy.mockRestore();
  });
});
