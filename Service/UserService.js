import prisma from "../prisma_client.js";
import bcrypt from "bcrypt";
class UserService {
  async createUser(req, res) {
    const { name, email, password } = req.body;
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userAlreadyExists) {
      return res.status(400).json({message:"User with this email already exists"});
    }
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password,saltRounds);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    console.log(user);
    return res.status(200).json({ message: "User created successfully",user });
  }

  async findAllUsers(req, res) {
    const allUsers = await prisma.user.findMany();
    return res.status(200).json(allUsers);
  }
  async findUser(req, res) {
    const { email } = req.body;
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

    const user = await prisma.user.update({
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
    const {email} = req.body;
    await prisma.user.delete({
      where: {
        email: email,
      },
    });

    return res.status(200).json(email);
  }
}

export default new UserService();
