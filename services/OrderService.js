// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const { or } = require("sequelize");
const ProductService = require("../services/ProductService");
const UserService = require("../services/UserService");
const prisma = new PrismaClient();

class OrderService {
  static async makeNewOrder(data) {
    const userId = data.userId;
    const products = data.products;

    let total = 0;
    let quantities = [];
    let i = 0;

    const orderdProducts = products.map((product) => {
      if (!product.quantity) product.quantity = 1;
      quantities.push(product.quantity);
      return product.id;
    });

    let dataProducts = await ProductService.getAllProductsByIds(orderdProducts);

    // let dataProducts = await prisma.product.findMany({
    //   where: {
    //     id: {
    //       in: orderdProducts,
    //     },
    //     deletedAt: null,
    //   },
    //   select: {
    //     id: true,
    //     availables: true,
    //     price: true,
    //   },
    // });

    dataProducts.forEach((dP) => {
      total += dP.price * quantities[i];
      if (
        dP.availables - quantities[i] < 0 ||
        dP.availables === null ||
        dP.availables === 0
      )
        throw new Error(
          "No enough availables from product with Id : " + dataProducts[i].id
        );
      i++;
    });

    const user = await UserService.getUserById(userId);

    // const user = await prisma.user.findUnique({
    //   select: {
    //     balance: true,
    //   },
    //   where: {
    //     id: userId,
    //   },
    // });

    if (user.balance - total < 0) {
      throw new Error("No enough balance from user with Id : " + userId);
    }

    return await prisma.$transaction(
      async (tx) => {
        const order = await tx.order.create({
          data: {
            userId: userId,
            total: total,
          },
        });

        let linkedOrders = [];
        let updatedProducts = [];

        for (i = 0; i < orderdProducts.length; i++) {
          linkedOrders.push(
            await tx.linkedOrder.create({
              data: {
                orderId: order.id,
                productId: orderdProducts[i],
                quantity: quantities[i],
              },
            })
          );

          updatedProducts.push(
            await ProductService.editProductOrder(
              {
                id: orderdProducts[i],
                quantities: quantities[i],
              },
              tx
            )
          );
          // await tx.product.update({
          //   data: {
          //     availables: {
          //       decrement: quantities[i],
          //     },
          //   },
          //   where: {
          //     id: orderdProducts[i],
          //   },
          // })
        }

        await tx.payment.create({
          data: {
            OrderId: order.id,
            amount: total,
            paymentType: data.paymentType,
          },
        });

        await UserService.editBalance(
          {
            userId: userId,
            balance: -total,
          },
          tx
        );
        // await tx.user.update({
        //   data: {
        //     balance: {
        //       decrement: total,
        //     },
        //   },
        //   where: {
        //     id: userId,
        //   },
        // });
        return { order, linkedOrders, userId: user.id, userEmail: user.email };
      },
      { timeout: 10000 }
    );
  }

  static async manageOrder(data) {
    const order = await prisma.order.findFirst({
      include: {
        Payment: true,
        LinkedOrder: true,
      },
      where: {
        Payment: {
          id: data.paymentId,
        },
      },
    });
    let i = 0;
    let ids = [];
    const quantities = order?.LinkedOrder.map((lo) => {
      ids.push(lo.productId);
      return lo.quantity;
    });

    if (order !== null && order.Payment.status === "PENDING") {
      if (data.paymentStatus === "ACCEPTED") {
        return await prisma.$transaction(async (tx) => {
          const user = await UserService.getUserById(order.userId);
          const payment = await tx.payment.update({
            where: {
              id: data.paymentId,
            },
            data: {
              paymentDate: new Date(),
              status: data.paymentStatus,
            },
          });
          return {
            payment,
            userId: user.id,
            userEmail: user.email,
            userBalance: user.balance,
          };
        });
      } else if (data.paymentStatus === "REJECTED") {
        return await prisma.$transaction(async (tx) => {
          const user = await tx.user.update({
            where: {
              id: order.userId,
            },
            data: {
              balance: {
                increment: (order.total * 90) / 100,
              },
            },
          });
          await tx.product.updateMany({
            where: {
              id: {
                in: ids,
              },
            },
            data: {
              availables: {
                increment: quantities[i++],
              },
            },
          });
          const payment = await tx.payment.update({
            where: {
              id: data.paymentId,
            },
            data: {
              status: data.paymentStatus,
            },
          });
          return {
            payment,
            userId: user.id,
            userEmail: user.email,
            userBalance: user.balance,
          };
        });
      } else {
        return "Pending";
      }
    } else {
      throw new Error("Payment not found");
    }
  }

  static async getOrdersByUserId(data) {
    return await prisma.order.findMany({
      where: {
        userId: +data.id,
        deletedAt: null,
      },
      include: {
        LinkedOrder: {
          select: {
            orderId: true,
            productId: true,
            quantity: true,
          },
        },
        Payment: true,
      },
      take: data.take,
      skip: data.skip,
    });
  }

  static async deleteOrder(userId, ids) {
    const order = await prisma.order.findMany({
      where: {
        id: {
          in: ids,
        },
        deletedAt: null,
      },
      include: {
        Payment: {
          select: {
            status: true,
            amount: true,
          },
        },
      },
    });

    if (order.length === 0) {
      throw new Error("No orders: " + ids + " for user with Id: " + userId);
    }

    let total = 0;

    for (let i = 0; i < order.length; i++) {
      const element = order[i].Payment.status;
      if (element !== "PENDING") {
        throw new Error("Operation can not be done");
      }
      total += order[i].Payment.amount;
    }

    return await prisma.$transaction(async (tx) => {
      // prisma.user.update({
      //   where: {
      //     id: userId,
      //   },
      //   data: {
      //     balance: {
      //       increment: total * (90 / 100),
      //     },
      //   },
      //   select: {
      //     name: true,
      //     email: true,
      //     phone: true,
      //     imagePath: true,
      //     balance: true,
      //   },
      // }),
      const user = await UserService.editBalance(
        { userId, balance: total * (90 / 100) },
        tx
      );
      const order = await tx.order.updateMany({
        data: {
          deletedAt: new Date(),
        },
        where: {
          deletedAt: null,
          userId: userId,
          AND: {
            id: {
              in: ids,
            },
          },
        },
      });
      return { order, user };
    });
  }

  static async getAllOrders(data) {
    return await prisma.order.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        LinkedOrder: {
          select: {
            orderId: true,
            productId: true,
            quantity: true,
          },
        },
        Payment: true,
      },
      take: data.take,
      skip: data.skip,
    });
  }

  // All categories for the manager (even deleted categories)
  static async getAllAllOrders(data) {
    return await prisma.order.updateMany({
      include: {
        LinkedOrder: {
          select: {
            orderId: true,
            productId: true,
            quantity: true,
          },
        },
        Payment: true,
      },
      take: data.take,
      skip: data.skip,
    });
  }
}

module.exports = OrderService;
