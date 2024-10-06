const { PrismaClient } = require("@prisma/client");
const { del } = require("express/lib/application");
const prisma = new PrismaClient();

class LikesService {
  static async getLikesByUser(id) {
    return await prisma.like.findMany({
      where: {
        userId: id,
      },
    });
  }

  static async addLike(data) {
    const oldLike = await prisma.like.findFirst({
      where: {
        userId: data.userId,
        AND: {
          productId: data.productId,
        },
      },
    });
    if (!oldLike) {
      return await prisma.like.create({
        data: {
          userId: data.userId,
          productId: data.productId,
        },
      });
    } else {
      throw new Error(
        `User with Id: ${data.userId} already liked product with Id: ${data.productId}`
      );
    }
  }

  static async deleteLike(data) {
    const deleted = await prisma.like.deleteMany({
      where: {
        userId: data.userId,
        AND: {
          productId: data.productId,
        },
      },
    });
    if (deleted.count === 0) {
      throw new Error(
        `Like with productId : ${data.productId} and userId : ${data.userId} not found.`
      );
    }
    return deleted;
  }

  // manager /////////////////////////////////////
  static async getLikesByProduct(id) {
    return await prisma.like.findMany({
      where: {
        productId: +id,
      },
    });
  }
}

module.exports = LikesService;
