import prisma from "../prisma_client";
import bcrypt from "bcrypt";
class UserService {
  async createUser(req, res) {
    const { name, email, password } = req;
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userAlreadyExists) {
      return res.status(400).json("User with this email already exists");
    }

    const hashedPassword = bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
        // Store hash in your password DB.
        return hash;
      });
    });
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    return res.status(200).json("User created successfully");
  }

  async findAllUsers(req, res) {
    const allUsers = await prisma.user.findMany();
    return res.status(200).json(allUsers);
  }
  async findUser(req, res) {
    const { email } = req;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return res.status(200).json(user);
  }

  async updateUser(req, res) {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    const user=await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name,
        email: email,
        password: password,
      },
    });

    return res.status(200).json(user);
  }

  async deleteUser(req, res) {
    const userId = req.params.id;
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return res.status(200).json(userId);
  }
}

export default new UserService();
