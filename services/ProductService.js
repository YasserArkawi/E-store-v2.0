const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const ImagesService = require("./ImagesService");
const { Types } = require("../helper/TypesEnum");

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
    // const images = await prisma.productImages.findMany({ where: {ProductId:} });
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
        imagePath: data.images[0],
      },
    });
    const images = await prisma.productImages.createMany({
      data: data.images,
    });
    // const images = await ImagesService.addImages(
    //   data.images,
    //   product.id,
    //   Types.PRODUCT
    // );
    return { product, images: data.images };
  }

  static async addImagesProduct(data) {
    const ProductId = +data.id;
    const list = data.newImages.map((image) => {
      return { ProductId, image };
    });
    return await prisma.productImages.createMany({
      data: list,
    });
    // return await prisma.$transaction(async (tx) => {
    //   for (let i = 0; i < data.newImages.length; i++) {
    //     await tx.productImages.create({
    //       data: {

    //         image: data.newImages[i],
    //       },
    //     });
    //   }
    // });
  }

  static async editProduct(data) {
    // EXPLAINING :

    // takes the first image and put it in the imagePath in the product, and the rest of the images
    // put in images(product) without the first image ,
    // the updated product takes the first image of the images if it exists or the old image .

    // takes all the images from the front end and compare them in the controller, if the image in the same index of the two images list (make a query to get images for the product in the controller)
    // the old images and the new ones are the same keep the image in the new

    const oldProduct = await this.getProductById(+data.id);
    // const oldImages = await ImagesService.getImagesById(
    //   +data.id,
    //   Types.PRODUCT
    // );
    // oldImages.filter((image) => {
    //   image.image !== oldProduct.imagePath;
    // });
    // console.log("🚀 ~ ProductService ~ oldImages.map ~ oldImages:", oldImages);

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
    // let images,
    //   i = 0;
    // if (data?.newImages) {
    //   if (
    //     data?.updatedOldImages.length === 0 ||
    //     data.newImages.length > data.updatedOldImages.length
    //   ) {
    //     let diff = data.newImages.length - data.updatedOldImages.length;
    //     let imageObjects = [];
    //     if (diff >= 0) {
    //       data.newImages.map((image) => {
    //         imageObjects.push({ image, ProductId: +data.id });
    //       });
    //     } else {
    //       for (let i = 0; i < diff; i++) {
    //         imageObjects.push({
    //           image: data.newImages[-i],
    //           ProductId: +data.id,
    //         });
    //       }
    //     }
    //     console.log(
    //       "🚀 ~ ProductService ~ editProduct ~ imageObjects:",
    //       imageObjects
    //     );
    //     images = await prisma.productImages.createMany({
    //       data: imageObjects,
    //     });
    //   } else {
    //     images = await prisma.productImages.updateMany({
    //       where: {
    //         ProductId: +data.id,
    //         image: {
    //           in: data.updatedOldImages,
    //         },
    //       },
    //       data: {
    //         image: data.newImages[i++],
    //       },
    //     });
    //   }
    // }
    // if (data?.newImages.length !== 0 && data?.updatedOldImages.length !== 0) {
    //   data.updatedOldImages.map((image) => {
    //     fs.unlinkSync(image);
    //   });
    // }
    return { product: updatedProduct };
  }

  static async editProductImages(data) {
    // let i = 0;
    const oldImagesIds = JSON.parse(data.oldImagesIds);
    console.log(
      "🚀 ~ ProductService ~ editProductImages ~ oldImagesIds:",
      oldImagesIds
    );
    const newImages = data.newImages;
    console.log(
      "🚀 ~ ProductService ~ editProductImages ~ newImages:",
      newImages
    );

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
      // await newImages.forEach(async (element) => {
      //   console.log(
      //     "🚀 ~ ProductService ~ awaitnewImages.forEach ~ element:",
      //     element
      //   );
      //   await tx.productImages.update({
      //     where: {
      //       id: {
      //         in: oldImagesIds,
      //       },
      //     },
      //     data: {
      //       image: element,
      //     },
      //   });
      // });
      return;
    });

    // const updatedImages = await prisma.productImages.updateMany({
    //   where: {
    //     id: {
    //       in: oldImagesIds,
    //     },
    //     // ProductId: +data.id,
    //   },
    //   data: {
    //     image: newImages.at(i++),
    //   },
    // });
    // console.log(i);

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
