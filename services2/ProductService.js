const mysql = require("mysql2");
const connection = mysql.createConnection({
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

class ProductService {
  static async getAllProducts() {
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM product";
        connection.query(query, [], (err, results) => {
          if (err) reject(new Error(err));
          resolve(results);
        });
      });
      return results;
    } catch (error) {}
  }

  static async getProductById(id) {
    try {
      const result = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM product WHERE product_id = ?";
        connection.query(query, [+id], (err, result) => {
          if (err) reject(new Error(err));
          resolve(result);
        });
      });
      return result;
    } catch (error) {}
  }

  static async getProductsByCategory(id) {
    try {
      const results = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM product WHERE category_id = ?";
        connection.query(query, [+id], (err, results) => {
          if (err) reject(new Error(err));
          resolve(results);
        });
      });
      return results;
    } catch (error) {}
  }

  static async addProduct(data) {
    try {
      const category_id = data.category_id;
      const title = data.title;
      const descreption = data.descreption;
      const price = data.price;
      const availables = data.availables;
      const image = data.image || null;
      const rating = data.rating || null;
      const result = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO product (category_id,image,title,descreption,rating,price,availables) VALUES (?,?,?,?,?,?,?)";
        connection.query(
          query,
          [
            +category_id,
            image,
            title,
            descreption,
            rating,
            +price,
            +availables,
          ],
          (err, result) => {
            if (err) {
              reject(new Error(err));
            }
            resolve(result);
          }
        );
      });
      return result;
    } catch (error) {}
  }

  static async editProduct(data) {
    try {
      const product_id = data.id;
      const category_id = data.category_id;
      const title = data.title;
      const descreption = data.descreption;
      const price = data.price;
      const availables = data.availables;
      const image = data.image || null;
      const rating = data.rating || null;
      const result = await new Promise((resolve, reject) => {
        const query =
          "UPDATE product SET category_id = ?,image = ? ,title = ?, descreption = ?, rating = ?, price = ?, availables = ? WHERE product_id = ?";
        connection.query(
          query,
          [
            +category_id,
            image,
            title,
            descreption,
            +rating,
            +price,
            +availables,
            +product_id,
          ],
          (err, result) => {
            if (err) reject(new Error(err));
            resolve(result);
          }
        );
      });
      return "updated";
    } catch (error) {}
  }

  static async deleteProduct(id) {
    try {
      const result = await new Promise((resolve, reject) => {
        const query = "DELETE FROM product WHERE product_id = ?";
        connection.query(query, [+id], (err, results) => {
          if (err) reject(new Error(err));
          if (results.affectedRows === 0) {
            resolve("Already deleted");
          }
          resolve(id);
        });
      });
      return result;
    } catch (error) {}
  }

  static async getMostRatedProducts() {
    try {
      const results = new Promise((resolve, reject) => {
        const query = "SELECT * FROM product ORDER BY rating DESC LIMIT 10";
        connection.query(query, [], (err, results) => {
          if (err) reject(err);
        });
      });
      return results;
    } catch (error) {}
  }
}

module.exports = ProductService;
