const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

class ProductService {
  // This service function is used in making order in order service;
  static async getAllProductsByIds(ids) {
    const result = await prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
        deletedAt: null,
      },
    });
    return result;
  }

  // All products for the manager (even deleted products)
  static async getAllAllProducts(data) {
    const products = await prisma.product.findMany({
      take: data.take,
      skip: data.skip,
    });
    return products;
    // const images = await ImagesService.getImagesByType(Types.PRODUCT);
  }

  static async getAllProducts(data) {
    return await prisma.product.findMany({
      where: {
        availables: {
          not: null || 0,
        },
        deletedAt: null,
        price: data.hPrice
          ? {
              lte: data.hPrice,
            }
          : {
              gte: 0,
            },
      },
      include: {
        Images: {
          select: {
            id: true,
            image: true,
          },
        },
      },
      take: data.take,
      skip: data.skip,
    });
  }

  static async getProductById(id) {
    const product = await prisma.product.findUnique({
      where: {
        id: +id,
      },
    });
    const images = await prisma.productImages.findMany({
      where: {
        ProductId: +id,
      },
      select: {
        image: true,
      },
    });
    return { product, images };
  }

  static async getProductsByCategory(id, hPrice = undefined, take, skip) {
    return await prisma.product.findMany({
      where: {
        categoryId: +id,
        availables: {
          not: null || 0,
        },
        deletedAt: null,
        price: hPrice
          ? {
              lte: hPrice,
            }
          : {
              gte: 0,
            },
      },
      take: take,
      skip: skip,
    });
  }

  static async getMostRatedProducts() {
    return await prisma.product.findMany({
      where: {
        availables: {
          not: null || 0,
        },
        deletedAt: null,
      },
      orderBy: {
        rating: "desc",
      },
      take: 10,
    });
  }

  static async getImagesByProduct(id) {
    return await prisma.productImages.findMany({
      where: {
        ProductId: +id,
      },
    });
  }

  static async addProduct(data) {
    const product = await prisma.product.create({
      data: {
        categoryId: +data.categoryId,
        title: data.title,
        descreption: data.descreption,
        price: +data.price,
        availables: +data.availables,
        // imagePath: data.images[0],
      },
    });

    return { product };
  }

  static async addImagesProduct(data) {
    const ProductId = +data.id;
    const list = data.newImages.map((image) => {
      return { ProductId, image };
    });
    return await prisma.productImages.createMany({
      data: list,
    });
  }

  static async editProduct(data) {
    const oldProduct = await this.getProductById(+data.id);
    let newCount;
    if (+data?.rating) {
      newCount = 1;
    } else if (+data?.rating === 0) {
      newCount = -1;
    }
    if (oldProduct.ratingCount + newCount < 0) {
      newCount = 0;
    }
    const updatedProduct = await prisma.product.update({
      data: {
        categoryId: +data.categoryId || oldProduct.categoryId,
        title: data.title || oldProduct.title,
        descreption: data.descreption || oldProduct.descreption,
        price: +data.price || oldProduct.price,
        availables: +data.availables || oldProduct.availables,
        rating: +data.rating || oldProduct.rating,
        // imagePath: data?.images[0] || oldProduct.imagePath,
        ratingCount: {
          increment: newCount || 0,
        },
      },
      where: {
        id: +data.id,
        deletedAt: null,
      },
    });
    return { product: updatedProduct };
  }

  static async editProductImages(data) {
    const oldImagesIds = JSON.parse(data.oldImagesIds);
    const newImages = data.newImages;
    const updatedImages = await prisma.$transaction(async (tx) => {
      for (let i = 0; i < newImages.length; i++) {
        await tx.productImages.update({
          where: {
            id: oldImagesIds[i].toString(),
          },
          data: {
            image: newImages[i],
          },
        });
      }
      return;
    });
    return { count: updatedImages, newImages: newImages };
  }

  static async editProductOrder(data, tx) {
    return tx.product.update({
      data: {
        availables: {
          decrement: data.quantities,
        },
      },
      where: {
        id: +data.id,
        deletedAt: null,
      },
    });
  }

  static async deleteProduct(ids) {
    const deleteProducts = await prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
        deletedAt: null,
      },
    });
    if (deleteProducts.length === 0) {
      return {
        count: 0,
      };
    } else {
      const softDeleted = await prisma.product.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });
      deleteProducts.map((element) => {
        if (element.imagePath !== null) {
          fs.unlinkSync(element.imagePath);
        }
      });
      return softDeleted;
    }
  }
  static async deleteImagesProduct(ids) {
    return await prisma.productImages.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}

module.exports = ProductService;
