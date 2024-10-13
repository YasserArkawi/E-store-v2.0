const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

class AdService {
  static async getAllAds() {
    return await prisma.ad.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  static async getAdById(id) {
    return await prisma.ad.findUnique({
      where: {
        id: +id,
        deletedAt: null,
      },
    });
  }

  static async addAd(data) {
    return await prisma.ad.create({
      data: {
        descreption: data.descreption,
        title: data.title,
        imagePath: data.imagePath,
      },
    });
  }

  static async updateAd(data) {
    const ad = await this.getAdById(+data.id);
    return await prisma.$transaction(async (tx) => {
      if (ad.imagePath !== null && data.imagePath !== null) {
        fs.unlinkSync(ad.imagePath);
      }
      return await tx.ad.update({
        where: {
          id: +data.id,
          deletedAt: null,
        },
        data: {
          descreption: data.descreption || ad.descreption,
          title: data.title || ad.title,
          imagePath: data.imagePath || ad.imagePath,
        },
      });
    });
  }

  static async deleteAd(ids) {
    const deleted = await prisma.ad.findMany({
      where: {
        id: {
          in: ids,
        },
        deletedAt: null,
      },
    });
    return await prisma.$transaction(async (tx) => {
      if (deleted.length !== 0) {
        deleted.map((d) => {
          if (d.imagePath !== null) {
            fs.unlinkSync(d.imagePath);
          }
        });
        return await tx.ad.updateMany({
          data: {
            deletedAt: new Date(),
          },
          where: {
            id: {
              in: ids,
            },
            deletedAt: null,
          },
        });
      } else {
        throw new Error("No ads found.");
      }
    });
  }
}

module.exports = AdService;
