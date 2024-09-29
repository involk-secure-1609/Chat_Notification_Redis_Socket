import { expect, jest } from "@jest/globals";
import UserService from "../Service/UserService";
import prisma from "../prisma_client";
import bcrypt from "bcrypt";


describe("findUser tests", () => {
  afterAll(() => {
    prisma.$disconnect();
  });

  const mockRequest = {
    body:{
      email:"test@gmail.com"
    }
  };
  const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
  };

  it("findUser is successfull", async() => {
    const user = {id:1,email: "test@gmail.com"};
    const findUserSpy = jest
      .spyOn(prisma.user, "findUnique")
      .mockImplementationOnce(() => {
        return user;
      });

      await UserService.findUser(mockRequest,mockResponse)
      expect(findUserSpy).toBeCalled();
      expect(findUserSpy).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(user);
  });

  it("findUser fails due to some database  error", async() => {
    const findUserSpy = jest
      .spyOn(prisma.user, "findUnique")
      .mockImplementationOnce(() => Promise.reject("Failed to findUser due to error connecting to Database."));

      await UserService.findUser(mockRequest,mockResponse)
      expect(findUserSpy).toBeCalled();
      expect(findUserSpy).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();

  });
});
describe("findAllUsers tests", () => {
  afterAll(() => {
    prisma.$disconnect();
  });

  const mockRequest = {};
  const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
  };

  it("findAllUsers successfull", async() => {
    const allUsers = [{ id:1 }, { id:2 }];
    const findAllUserSpy = jest
      .spyOn(prisma.user, "findMany")
      .mockImplementationOnce(() => {
        return allUsers;
      });

      await UserService.findAllUsers(mockRequest,mockResponse)
      expect(findAllUserSpy).toBeCalled();
      expect(findAllUserSpy).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
  });

  it("findAllUser fails due to some database  error", async() => {
    const findAllUserSpy = jest
      .spyOn(prisma.user, "findMany")
      .mockImplementationOnce(() => Promise.reject("Failed to findAll due to error connecting to Database."));

      await UserService.findAllUsers(mockRequest,mockResponse)
      expect(findAllUserSpy).toBeCalled();
      expect(findAllUserSpy).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();

  });
});
describe("createUser tests", () => {
  afterAll(() => {
    prisma.$disconnect();
  });

  const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
  };
  it("same user already exists", async () => {
    const mockRequest = {
      body: {
        name: "test",
        email: "test",
        password: "test",
      },
    };
    const mockUser = {
      id: 1,
      email: "testtt@example.com",
      name: "Test User",
      password: "testPassword",
      created_At: new Date(), // This will set the current date and time
    };
    const spy = jest.spyOn(prisma.user, "findUnique");
    spy.mockResolvedValue(mockUser);
    await UserService.createUser(mockRequest, mockResponse);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalled();
  });

  it("user does not exist and user creation is successfull ", async () => {
    const mockRequest = {
      body: {
        name: "test",
        email: "test",
        password: "test",
      },
    };
    const mockUser = {
      id: 1,
      email: "testtt@example.com",
      name: "Test User",
      password: "testPassword",
      created_At: new Date(),
    };

    const findUniqueSpy = jest
      .spyOn(prisma.user, "findUnique")
      .mockResolvedValue(null);
    const createUserSpy = jest
      .spyOn(prisma.user, "create")
      .mockImplementationOnce(() => {
        return mockUser;
      });
    const bcryptSpy = jest.spyOn(bcrypt, "hash");
    await UserService.createUser(mockRequest, mockResponse);
    expect(bcryptSpy).toHaveBeenCalled();
    expect(bcryptSpy).toBeCalledTimes(1);
    expect(findUniqueSpy).toHaveBeenCalled();
    expect(findUniqueSpy).toBeCalledTimes(1);
    expect(createUserSpy).toHaveBeenCalled();
    expect(createUserSpy).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalled();
  });
});


