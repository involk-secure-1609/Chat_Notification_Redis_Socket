import { expect, jest } from "@jest/globals";
import AuthService from "../Service/AuthService";
import prisma from "../prisma_client";
import bcrypt from "bcrypt";

describe("login tests", () => {
  afterAll(() => {
    prisma.$disconnect();
  });
  const mockRequest = {
    body: {
      email: "test",
      password: "test",
    },
  };
  const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
  };
  it("user does not have account", async () => {

    const spy = jest.spyOn(prisma.user, "findUnique").mockImplementation(() => { return null});
    await AuthService.login(mockRequest, mockResponse);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith("Please create an account.");
  });

  it("user does have account but password is incorrect", async () => {

    const findUniqueSpy = jest.spyOn(prisma.user, "findUnique").mockImplementation(() => { return true});
    const bcryptSpy=jest.spyOn(bcrypt,"compare").mockImplementation(()=>false);
    await AuthService.login(mockRequest, mockResponse);

    expect(findUniqueSpy).toHaveBeenCalled();
    expect(findUniqueSpy).toHaveBeenCalledTimes(1);
    expect(bcryptSpy).toBeCalled();
    expect(bcryptSpy).toBeCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith("Your password is incorrect,Please try again.");
  });

  it("user does have account and password is correct", async () => {

    const user={
        id:1,
        email: "user@example.com",
        password:"password"
    }
    const findUniqueSpy = jest.spyOn(prisma.user, "findUnique").mockImplementation(() => { return user});
    const bcryptSpy=jest.spyOn(bcrypt,"compare").mockImplementation(()=>true);
    await AuthService.login(mockRequest, mockResponse);

    expect(findUniqueSpy).toHaveBeenCalled();
    expect(findUniqueSpy).toHaveBeenCalledTimes(1);
    expect(bcryptSpy).toBeCalled();
    expect(bcryptSpy).toBeCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(user);
  });

});
