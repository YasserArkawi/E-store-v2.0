const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

class ProductService {
  static async getAllProducts() {
    return await prisma.product.findMany({
      where: {
        availables: {
          not: null || 0,
        },
      },
    });
  }

  static async getAllAllProducts() {
    return await prisma.product.findMany({});
  }

  static async getProductById(id) {
    return await prisma.product.findUnique({
      where: {
        id: +id,
      },
    });
  }

  static async getProductsByCategory(id) {
    return await prisma.product.findFirst({
      where: {
        categoryId: +id,
      },
    });
  }

  static async getMostRatedProducts() {
    return await prisma.product.findMany({
      orderBy: {
        rating: "desc",
      },
      take: 10,
    });
  }

  static async addProduct(data) {
    return await prisma.product.create({
      data: {
        categoryId: +data.categoryId,
        title: data.title,
        descreption: data.descreption,
        price: +data.price,
        availables: +data.availables,
        imagePath: data.imagePath,
      },
    });
  }

  static async editProduct(data) {
    const oldProduct = await this.getProductById(+data.id);
    if (oldProduct.imagePath !== null && data?.imagePath) {
      fs.unlinkSync(oldProduct.imagePath);
    }
    let newCount;
    if (+data?.rating) {
      newCount = 1;
    } else if (+data?.rating === 0) {
      newCount = -1;
    }
    return await prisma.product.update({
      data: {
        categoryId: +data.categoryId || oldProduct.categoryId,
        title: data.title || oldProduct.title,
        descreption: data.descreption || oldProduct.descreption,
        price: +data.price || oldProduct.price,
        availables: +data.availables || oldProduct.availables,
        rating: +data.rating || oldProduct.rating,
        imagePath: data?.imagePath || oldProduct.imagePath,
        ratingCount: {
          increment: newCount || 0,
        },
      },
      where: {
        id: +data.id,
      },
    });
  }

  static async deleteProduct(ids) {
    const deleteProducts = await prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    const deleted = await prisma.product.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    deleteProducts.map((element) => {
      if (element.imagePath !== null) {
        fs.unlinkSync(element.imagePath);
      }
    });
    return deleted;
  }
}

module.exports = ProductService;
