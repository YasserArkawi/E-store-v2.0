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
        return order;
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
        return await prisma.$transaction([
          prisma.payment.update({
            where: {
              id: data.paymentId,
            },
            data: {
              paymentDate: new Date(),
              status: data.paymentStatus,
            },
          }),
        ]);
      } else if (data.paymentStatus === "REJECTED") {
        return await prisma.$transaction([
          prisma.user.update({
            where: {
              id: data.userId,
            },
            data: {
              balance: {
                increment: (order.total * 90) / 100,
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
              availables: {
                increment: quantities[i++],
              },
            },
          }),
          prisma.payment.update({
            where: {
              id: data.paymentId,
            },
            data: {
              status: data.paymentStatus,
            },
          }),
        ]);
      }
    } else {
      throw new Error("Payment not found");
    }
  }

  static async getOrdersByUserId(id) {
    return await prisma.order.findMany({
      where: {
        userId: +id,
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
    });
  }

  static async deleteOrder(userId, ids) {
    // const ids = data.ids;

    // TODO -- manage the deletedAt and out the payment in failed .

    const order = await prisma.payment.findMany({
      where: {
        OrderId: {
          in: ids,
        },
      },
      select: {
        status: true,
        amount: true,
      },
    });

    if (order.length === 0) {
      throw new Error("No orders : " + ids + " for user with Id : " + userId);
    }

    let total = 0;

    for (let i = 0; i < order.length; i++) {
      const element = order[i].status;
      if (element !== "PENDING") {
        throw new Error("Operation can not be done");
      }
      total += order[i].amount;
    }

    return await prisma.$transaction([
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          balance: {
            increment: total * (90 / 100),
          },
        },
        select: {
          name: true,
          email: true,
          phone: true,
          imagePath: true,
          balance: true,
        },
      }),
      prisma.order.updateMany({
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
      }),
    ]);
  }

  static async getAllOrders() {
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
    });
  }

  static async getAllAllOrders() {
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
    });
  }
}

module.exports = OrderService;
