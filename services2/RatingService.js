const mysql = require("mysql2");
const connection = mysql.createConnection({
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

class RatingService {
  static async getRateByProduct(product_id) {
    const results = new Promise((resolve, reject) => {
      const query = "SELECT * FROM rateing_table WHERE product_id = ?";
      connection.query(query, [product_id], (err, result) => {
        if (err) return reject(new Error(err));
        resolve(result);
      });
    });
    return results;
  }

  static async addRate(data) {
    const user_id = data.user_id;
    const rating = data.rating;
    const product_id = data.product_id;

    if (rating > 5 || rating < 0) {
      throw new Error("Out of the limit");
    } else {
      const getUserRating = await new Promise((resolve, reject) => {
        const query =
          "SELECT user_id,product_id FROM rating_table WHERE user_id = ? AND product_id = ?";
        connection.query(query, [user_id, product_id], (err, result) => {
          if (err) reject(new Error(err));
          resolve(result[0]);
        });
      });

      if (!getUserRating) {
        const rating_tableQuery = await new Promise((resolve, reject) => {
          const query =
            "INSERT INTO rating_table (user_id,product_id,rating) VALUES (?,?,?)";
          connection.query(
            query,
            [user_id, product_id, rating],
            (err, result) => {
              if (err) reject(new Error(err));
              resolve(result);
            }
          );
        });

        const getRating = await new Promise((resolve, reject) => {
          const query = "SELECT rating FROM product WHERE product_id = ?";
          connection.query(query, [product_id], (err, result) => {
            if (err) reject(new Error(err));
            resolve(result[0]);
          });
        });

        let oldRating = getRating.rating;
        if (oldRating == 0.0) {
          oldRating = rating;
        } else {
          oldRating = rating + Number(oldRating);
          oldRating = oldRating / 2;
        }

        const productRating = await new Promise((resolve, reject) => {
          const query = "UPDATE product SET rating = ? WHERE product_id = ?";
          connection.query(query, [oldRating, product_id], (err, result) => {
            if (err) reject(new Error(err));
            resolve(result);
          });
        });

        return `Product with number ${product_id} is rated by ${user_id} with ${rating}`;
      } else {
        throw new Error(
          `User with Id ${user_id} already rated product with Id ${product_id}`
        );
      }
    }
  }

  static async deleteRatesByUser(id) {
    const user_id = id;
    const result = await new Promise((resolve, reject) => {
      const query = "DELETE FROM ad WHERE user_id = ?";
      connection.query(query, [user_id], (err, result) => {
        if (err) return reject(new Error(err));
        if (result.affectedRows === 0) return reject(new Error("Not Existed"));
        resolve(result.insertId);
      });
    });
    return `Ratings Deleted for user ${user_id}`;
  }

  static async deleteRatesByProduct(id) {
    const product_id = id;
    const result = await new Promise((resolve, reject) => {
      const query = "DELETE FROM ad WHERE product_id = ?";
      connection.query(query, [product_id], (err, result) => {
        if (err) return reject(new Error(err));
        if (result.affectedRows === 0) return reject(new Error("Not Existed"));
        resolve(result.insertId);
      });
    });
    return `Ratings Deleted for product ${product_id}`;
  }
}

module.exports = RatingService;
