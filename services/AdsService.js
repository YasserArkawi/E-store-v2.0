const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

class AdService {
  static async getAllAds() {
    return await prisma.ad.findMany({});
  }

  static async getAdById(id) {
    return await prisma.ad.findUnique({
      where: {
        id: +id,
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
    if (ad.imagePath !== null && data.imagePath !== null) {
      fs.unlinkSync(ad.imagePath);
    }
    return prisma.ad.update({
      where: {
        id: +data.id,
      },
      data: {
        descreption: data.descreption || ad.descreption,
        title: data.title || ad.title,
        imagePath: data.imagePath || ad.imagePath,
      },
    });
  }

  static async deleteAd(ids) {
    const deleted = await prisma.ad.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    if (deleted.length !== 0) {
      deleted.map((d) => {
        if (d.imagePath !== null) {
          fs.unlinkSync(d.imagePath);
        }
      });
      return await prisma.ad.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    } else {
      throw new Error("No ads found");
    }
  }
}

module.exports = AdService;
