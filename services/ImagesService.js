const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

class ImagesService {
  static async addImages(images, objectId, type) {
    // let i = 0;
    let data = [];
    images.map((image) => {
      data.push({
        image: image,
        objectId: objectId,
        type: type,
      });
    });
    return await prisma.images.createMany({
      data: data,
    });
  }

  static async getImagesById(objectId, type) {
    return await prisma.images.findMany({
      where: {
        objectId: id,
        type: type,
      },
    });
  }

  static async getImagesByType(type) {
    return await prisma.images.findMany({
      where: {
        type: type,
      },
    });
  }

  static async deleteImages(images, objectId, type) {
    const deleted = await prisma.images.deleteMany({
      where: {
        image: {
          in: images,
        },
        objectId: objectId,
        type: type,
      },
    });
    if (deleted.count !== 0) {
      images.map((image) => {
        fs.unlinkSync(image);
      });
    }
    return deleted;
  }

  static async editImages(newImages, oldImages, objectId, type) {
    let i = 0;
    const edited = await prisma.images.updateMany({
      where: {
        image: {
          in: oldImages,
        },
        objectId: objectId,
        type: type,
      },
      data: {
        image: newImages[i++],
      },
    });
    if (
      newImages.length !== 0 &&
      oldImages.length !== 0 &&
      edited.count !== 0
    ) {
      oldImages.map((image) => {
        fs.unlinkSync(image);
      });
    }
    return { edited, newImages };
  }
}

module.exports = ImagesService;
