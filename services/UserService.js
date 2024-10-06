const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

class UserService {
  static async registerUser(data) {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
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
      if (user.password === data.password) {
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
    const oldUser = await prisma.user.findUnique({
      where: {
        id: +data.userId,
      },
    });
    if (oldUser.imagePath !== null && data.imagePath !== null) {
      fs.unlinkSync(oldUser.imagePath);
    }
    return await prisma.user.update({
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

  static async getAllUsers() {
    return await prisma.user.findMany({});
  }

  static async editBalance(data) {
    return await prisma.user.update({
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
        balance: true,
      },
    });
  }
}

module.exports = UserService;
