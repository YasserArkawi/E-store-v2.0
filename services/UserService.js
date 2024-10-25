const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const { myHashing, myComparing } = require("../middlewares/Hashing.js");

class UserService {
  static async registerUser(data) {
    const password = await myHashing(data.password);
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: password,
        phone: data.phone,
        imagePath: data.imagePath,
      },
      include: {
        Like: false,
        Order: false,
        Rating: false,
      },
    });
  }

  static async loginUser(data) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      include: {
        Like: false,
        Order: false,
        Rating: false,
      },
    });
    if (!user || user.isAdmin === 1) {
      throw new Error("User not found");
    } else {
      const compare = await myComparing(data.password, user.password);
      if (compare) {
        return user;
      } else {
        throw new Error("Invalid Password");
      }
    }
  }

  static async managerLogin(data) {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
        AND: {
          isAdmin: true,
        },
      },
      include: {
        Like: false,
        Order: false,
        Rating: false,
      },
    });
    if (!user || user.isAdmin === 0) {
      throw new Error("User not found");
    } else {
      if (user.password === data.password) {
        return user;
      } else {
        throw new Error("Invalid Password");
      }
    }
  }

  static async editUser(data) {
    // TODO -- make the return a variable and then delete the photo and then return the variable in all edit services.

    const oldUser = await prisma.user.findUnique({
      where: {
        id: +data.userId,
      },
    });

    const updatedUser = await prisma.user.update({
      where: {
        id: +data.userId,
      },
      data: {
        name: data.name || oldUser.name,
        email: data.email || oldUser.email,
        password: data.password || oldUser.password,
        phone: data.phone || oldUser.phone,
        imagePath: data.imagePath || oldUser.imagePath,
      },
    });
    if (oldUser.imagePath !== null && data.imagePath !== null) {
      fs.unlinkSync(oldUser.imagePath);
    }
    return updatedUser;
  }
  // manager /////////////////////////////////////////////////////

  static async getUserById(id) {
    return await prisma.user.findUnique({
      where: {
        id: +id,
      },
    });
  }

  static async getUserByName(name) {
    return await prisma.user.findUnique({
      where: {
        name: name,
      },
    });
  }

  static async getAllUsers(data) {
    return await prisma.user.findMany({
      take: data.take,
      skip: data.skip,
    });
  }

  static async editBalance(data, tx) {
    const client = tx || prisma;
    return await client.user.update({
      where: {
        id: +data.userId,
      },
      data: {
        balance: {
          increment: data.balance,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        balance: true,
        password: false,
        imagePath: false,
        isAdmin: false,
      },
    });
  }
}

module.exports = UserService;
