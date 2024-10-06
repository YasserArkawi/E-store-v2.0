const mysql = require("mysql2");
const connection = mysql.createConnection({
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

// INSERT INTO orders(user_id,total) VALUES (36,211.99);
// INSERT INTO linked_orders(order_id,product_id) VALUES (2,36);
// SELECT orders.order_id,orders.user_id,linked_orders.product_id,orders.total,linked_orders.quantity FROM linked_orders,orders WHERE linked_orders.order_id = orders.order_id;

class OrderService {
  static async makeNewOrder(data) {
    try {
      const user_id = data.user_id;
      const products = data.products;

      const availablityChecks = products.map((product) => {
        return new Promise((resolve, reject) => {
          const availablityQuery =
            "SELECT product_id,availables,price FROM product WHERE product_id = ?";
          connection.query(
            availablityQuery,
            [product.product_id],
            (err, result) => {
              if (err) reject(new Error(err));
              resolve(result[0]);
            }
          );
        });
      });

      const availables = await Promise.all(availablityChecks);

      let total = 0;
      let i = 0;
      const quantities = products.map((product) => {
        if (!product.quantity) product.quantity = 1;
        total += availables[i].price * product.quantity;
        i++;
        return product.quantity;
      });

      for (let i = 0; i < availables.length; i++) {
        if (availables[i].availables < quantities[i]) {
          throw new Error(
            "No enough availables from product with Id : " +
              availables[i].product_id
          );
        }
      }

      const orderQuery = "INSERT INTO orders (user_id,total) VALUES (?,?)";
      const orderResult = await new Promise((resolve, reject) => {
        connection.query(orderQuery, [user_id, total], (err, result) => {
          if (err) reject(new Error(err));
          resolve(result);
        });
      });

      const insertId = orderResult.insertId;

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const quantity = quantities[i];
        
        const linkedOrdersQuery =
          "INSERT INTO linked_orders (order_id,product_id,quantity) VALUES (?,?,?)";
        await new Promise((resolve, reject) => {
          connection.query(
            linkedOrdersQuery,
            [insertId, product.product_id, quantity],
            (err, result) => {
              if (err) reject(new Error(err));
              resolve(result);
            }
          );
        });
        const newAvailable = availables[i].availables - quantities[i];

        const updateAvailable =
          "UPDATE product SET availables = ? WHERE product_id = ?";
        await new Promise((resolve, reject) => {
          connection.query(
            updateAvailable,
            [newAvailable, product.product_id],
            (err, result) => {
              if (err) reject(new Error(err));
              resolve(result);
            }
          );
        });
      }
      return insertId;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // static async makeNewOrder1(data) {
  //   var er = {
  //     true: true,
  //   };
  //   const user_id = data.user_id;
  //   var total = 0;
  //   const products = data.products;
  //   products.forEach((element) => {
  //     if (!element.quantity) element.quantity = 1;
  //     total += element.price * element.quantity;
  //     const availables = getAvailables(element.product_id);
  //     availables
  //       .then((result) => {
  //         console.log("result" + result);
  //         if (result - element.quantity < 0 || result <= 0 || result == null) {
  //           console.log(1111111);
  //           throw new Error("No enough products");
  //         }
  //       })
  //       .catch((error) => {
  //         // console.log(error);
  //         er.error = error;
  //         console.log(er);
  //       })
  //       .finally((error) => {
  //         // if (!er.error) {
  //         console.log(er);
  //         // throw er;
  //         // }
  //       });
  //   });
  //   const result = await new Promise((resolve, reject) => {
  //     const query = "INSERT INTO orders(user_id,total) VALUES (?,?)";
  //     connection.query(query, [user_id, total], (err, result) => {
  //       if (err) reject(new Error(err));
  //       // console.log("OrderService1:      ");
  //       // console.log(result);
  //       resolve(result.insertId);
  //     });
  //   });
  //   return result;
  // }

  // static async makeNewOrder2(order_id, product_id, quantity) {
  //   try {
  //     if (!quantity) {
  //       quantity = 1;
  //       console.log(11111);
  //     }
  //     const result = await new Promise((resolve, reject) => {
  //       const query =
  //         "INSERT INTO linked_orders(order_id,product_id,quantity) VALUES (?,?,?)";
  //       connection.query(
  //         query,
  //         [order_id, product_id, quantity],
  //         (err, result) => {
  //           if (err) reject(new Error(err));
  //           // console.log("OrderService2:      ");
  //           // console.log(result);
  //           resolve(result.insertId);
  //         }
  //       );
  //     });
  //     return result;
  //   } catch (error) {}
  // }

  // static async makeNewOrder4(product_id, quantity) {
  //   try {
  //     // console.log(66666);

  //     let finalAvailables;
  //     const availables = await getAvailables(product_id).then((result) => {
  //       // console.log(3333 + result);
  //       finalAvailables = result;
  //       if (result <= 0) {
  //         return new Error("No enough availables");
  //       } else {
  //         finalAvailables -= quantity;
  //       }
  //     });
  //     console.log("4444" + finalAvailables);

  //     const result = await new Promise((resolve, reject) => {
  //       const query = "UPDATE product SET availables = ? WHERE product_id = ?";
  //       connection.query(
  //         query,
  //         [finalAvailables, product_id],
  //         (err, result) => {
  //           if (err) reject(new Error(err));
  //           // console.log("OrderService2:      ");
  //           // console.log(result);
  //           resolve(result.insertId);
  //         }
  //       );
  //     });
  //     return result;
  //   } catch (error) {}
  // }

  static async getOrdersByUserId(user_id) {
    try {
      const results = await new Promise((resolve, reject) => {
        const query =
          "SELECT orders.order_id,orders.user_id,linked_orders.product_id,orders.total,linked_orders.quantity FROM linked_orders,orders WHERE linked_orders.order_id = orders.order_id && orders.user_id = ?";
        connection.query(query, [user_id], (err, results) => {
          if (err) reject(new Error(err));
          resolve(results);
        });
      });
      return results;
    } catch (error) {}
  }

  static async deleteOrder(user_id, data) {
    try {
      // Create a placeholder string for the number of order_ids
      const placeholders = data.data.map(() => "?").join(",");

      // when you use this values , when you pass it to the connection pass it without a [];

      // const values = [user_id,...data.data];
      // console.log(values);

      const result = await new Promise((resolve, reject) => {
        const query = `DELETE FROM orders WHERE user_id = ? AND order_id IN (${placeholders})`;
        connection.query(query, [user_id, ...data.data], (err, result) => {
          if (err) reject(new Error(err));
          if (result.affectedRows === 0) {
            resolve("Already deleted");
          }
          resolve(result);
        });
      });
      return result;
    } catch (error) {}
  }

  // static async editOrderByUserId1(data) {
  //   try {
  //     var total = 0;
  //     const products = data.products;
  //     products.forEach((element) => {
  //       total += element.price;
  //     });

  //     const result = new Promise((resolve, reject) => {
  //       const query = "UPDATE orders SET total = ?";
  //       connection.query(query, [total], (err, result) => {
  //         if (err) reject(new Error(err));
  //         // console.log("OrderService1:      ");
  //         // console.log(result);
  //         resolve(result);
  //       });
  //     });
  //     return result;
  //   } catch (error) {}
  // }

  // static async editOrderByUserId2(order_id, product_id) {
  //   try {
  //     const result = new Promise((resolve, reject) => {
  //       const query =
  //         "UPDATE linked_orders SET product_id = ? WHERE order_id = ?";
  //       connection.query(query, [product_id, order_id], (err, result) => {
  //         if (err) reject(new Error(err));
  //         // console.log("OrderService1:      ");
  //         // console.log(result);
  //         resolve(result);
  //       });
  //     });
  //     return result;
  //   } catch (error) {}
  // }

  // manager ///////////////////////////////////////////

  static async getAllOrders() {
    try {
      const results = await new Promise((resolve, reject) => {
        const query =
          "SELECT orders.order_id,orders.user_id,linked_orders.product_id,orders.total,linked_orders.quantity FROM linked_orders,orders WHERE linked_orders.order_id = orders.order_id";
        connection.query(query, [], (err, results) => {
          if (err) reject(new Error(err));
          resolve(results);
        });
      });
      return results;
    } catch (error) {}
  }
}

module.exports = OrderService;
