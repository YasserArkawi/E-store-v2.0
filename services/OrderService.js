// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const { or } = require("sequelize");
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

    // console.log(data);

    let dataProducts = await prisma.product.findMany({
      where: {
        id: {
          in: orderdProducts,
        },
      },
      select: {
        id: true,
        availables: true,
        price: true,
      },
    });

    dataProducts = dataProducts.map((dP) => {
      total += dP.price * quantities[i];
      if (dP.availables - quantities[i] < 0)
        throw new Error(
          "No enough availables from product with Id : " + dataProducts[i].id
        );
      i++;
    });

    const balance = await prisma.user.findUnique({
      select: {
        balance: true,
      },
      where: {
        id: userId,
      },
    });
    if (balance.balance - total <= 0) {
      throw new Error("No enough balance from user with Id : " + userId);
    }

    return await prisma.$transaction(async (tx) => {
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
          await tx.product.update({
            data: {
              availables: {
                decrement: quantities[i],
              },
            },
            where: {
              id: orderdProducts[i],
            },
          })
        );
      }

      await tx.payment.create({
        data: {
          OrderId: order.id,
          amount: total,
          paymentType: data.paymentType,
        },
      });

      await tx.user.update({
        data: {
          balance: {
            decrement: total,
          },
        },
        where: {
          id: userId,
        },
      });
      return order;
    });
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

    // return "kkk"
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
          id: false,
          name: true,
          email: true,
          password: false,
          phone: true,
          isAdmin: false,
          imagePath: true,
          balance: true,
        },
      }),
      prisma.order.deleteMany({
        where: {
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
      // where:{
      //   status:pending
      // }
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
