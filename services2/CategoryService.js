const mysql = require("mysql2");

const connection = mysql.createConnection({
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

class CategoryService {
  static async getAllCategories() {
    const results = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM category";
      connection.query(query, [], (err, result) => {
        if (err) return reject(new Error(err));
        resolve(result);
      });
    });
    return results;
  }

  static async getCategoryById(id) {
    const result = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM category WHERE category_id = ?";
      connection.query(query, [+id], (err, result) => {
        if (err) return reject(new Error(err));
        resolve(result[0]);
      });
    });
    return result;
  }

  static async addCategory(data) {
    // const id = data.id;
    const title = data.title;
    const image_path = data.image_path;
    const result = await new Promise((resolve, reject) => {
      const query = "INSERT INTO category (title,image_path) VALUES (?,?)";
      connection.query(query, [title, image_path], (err, result) => {
        if (err) reject(new Error(err));
        resolve(result);
      });
    });
    return result;
  }

  static async editCategory(data) {
    const oldCategory = this.getCategoryById(id);

    const id = data.categoryId || oldCategory.categoryId;
    const title = data.title || oldCategory.title;
    const imagePath = data.image_path || oldCategory.image_path;

    const result = await new Promise((resolve, reject) => {
      const query =
        "UPDATE category SET title = ?, image_path = ? WHERE category_id = ?";
      connection.query(query, [title, imagePath, +id], (err, result) => {
        if (err) return reject(new Error(err));
        resolve(result);
      });
    });
    return {
      category_id: id,
      title: title,
      image_path: imagePath,
    };
  }

  static async deleteCategory(id) {
      const result = await new Promise((resolve, reject) => {
        const query = "DELETE FROM category WHERE category_id = ?";
        connection.query(query, [+id], (err, result) => {
          if (err) return reject(new Error(err));
          if (result.affectedRows === 0) {
            resolve("Already deleted");
          }
          resolve(id);
        });
      });
      return result;
  }
}

module.exports = CategoryService;
