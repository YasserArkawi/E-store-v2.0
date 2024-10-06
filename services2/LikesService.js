const mysql = require("mysql2");
const connection = mysql.createConnection({
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

class LikesService {
  static async getLikesByUser(user_id) {
    const results = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM likes WHERE user_id = ?";
      connection.query(query, [user_id], (err, result) => {
        if (err) return reject(new Error(err));
        resolve(result);
      });
    });
    return results;
  }

  static async addLike(data) {
    const user_id = data.user_id;
    const product_id = data.product_id;

    const getUserLikes = await new Promise((resolve, reject) => {
      const query =
        "SELECT user_id,product_id FROM likes WHERE user_id = ? AND product_id = ?";
      connection.query(query, [user_id, product_id], (err, result) => {
        if (err) reject(new Error(err));
        resolve(result[0]);
      });
    });

    if (!getUserLikes) {
      const result = await new Promise((resolve, reject) => {
        const query = "INSERT INTO likes (user_id,product_id) VALUES (?,?)";
        connection.query(query, [user_id, product_id], (err, result) => {
          if (err) return reject(new Error(err));
          resolve(result.insertId);
        });
      });
      return result;
    } else {
      throw new Error(
        `User with Id ${user_id} already liked product with Id ${product_id}`
      );
    }
  }

  static async deleteLike(data) {
    const user_id = data.user_id;
    const product_id = data.product_id;

    const getUserLikes = await new Promise((resolve, reject) => {
      const query = "DELETE FROM likes WHERE user_id = ? AND product_id = ?";
      connection.query(query, [user_id, product_id], (err, result) => {
        if (err) reject(new Error(err));
        if (result.affectedRows === 0) return reject(new Error("Not existed"));
        resolve(result);
        console.log(result);
      });
    });
    return `Like with product ${product_id} and user ${user_id} Deleted`;
  }
}
module.exports = LikesService;
