const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const ProductService = require("./ProductService");

class RatingService {
  static async getRateByProduct(id) {
    return await prisma.rating.findMany({
      where: {
        productId: +id,
      },
    });
  }

  static async addRate(data) {
    const rate = await prisma.rating.findFirst({
      where: {
        userId: data.userId,
        AND: {
          productId: data.productId,
        },
      },
    });
    const rate2 = await prisma.rating.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        rating: data.rating,
      },
    });

    if (!rate && !rate2) {
      throw new Error("Somthing wrong");
    }
    const subRating = rate || rate2;
    let finalRating =
      subRating?.rating === 0 || subRating?.rating === data.rating
        ? subRating?.rating
        : Number(((subRating?.rating + data.rating) / 2).toPrecision(2));

    subRating.rating = finalRating;

    await ProductService.editProduct({
      id: data.productId,
      rating: finalRating,
    });
    return subRating;
  }

  static async deleteRatesByUser(id) {
    let ids = await prisma.rating.findMany({
      where: {
        userId: +id,
      },
    });
    ids = ids.map((id) => {
      return id.productId;
    });
    // console.log(ids);
    return await prisma.$transaction([
      prisma.rating.deleteMany({
        where: {
          productId: {
            in: ids,
          },
        },
      }),
      prisma.product.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          rating: 0,
        },
      }),
    ]);
  }

  static async deleteRatesByProduct(id) {
    return await prisma.$transaction([
      prisma.rating.deleteMany({
        where: {
          productId: +id,
        },
      }),
      prisma.product.update({
        where: {
          id: +id,
        },
        data: {
          rating: 0,
        },
      }),
    ]);
  }
}

module.exports = RatingService;
