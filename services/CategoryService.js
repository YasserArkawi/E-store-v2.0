// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

class CategoryService {
  static async getAllCategories() {
    return await prisma.category.findMany({
      deletedAt: null,
    });
  }

  static async getCategoryById(id) {
    return await prisma.category.findFirst({
      where: {
        id: +id,
        deletedAt: null,
      },
    });
  }

  static async addCategory(data) {
    return await prisma.category.create({
      data: {
        title: data.title,
        imagePath: data.imagePath,
      },
    });
  }

  static async editCategory(data) {
    const oldCategory = await this.getCategoryById(+data.id);
    if (oldCategory.imagePath !== null && data.imagePath !== null) {
      fs.unlinkSync(oldCategory.imagePath);
    }
    return await prisma.category.update({
      where: {
        id: +data.id,
        deletedAt: null,
      },
      data: {
        title: data.title || oldCategory.title,
        imagePath: data.imagePath || oldCategory.imagePath,
      },
    });
  }

  static async deleteCategory(id) {
    const deleted = await prisma.category.update({
      where: {
        id: +id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    if (deleted.imagePath !== null) {
      fs.unlinkSync(deleted.imagePath);
    }
    return deleted;
  }
}

module.exports = CategoryService;
