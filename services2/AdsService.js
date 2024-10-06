const mysql = require("mysql2");
const connection = mysql.createConnection({
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

class AdsService {
  static async getAllAds() {
    const result = new Promise((resolve, reject) => {
      const query = "SELECT * FROM ad";
      connection.query(query, [], (err, result) => {
        if (err) return reject(new Error(err));
        resolve(result);
      });
    });
    return result;
  }

  static async getAdById(id) {
    const adId = id;
    const result = new Promise((resolve, reject) => {
      const query = "SELECT * FROM ad WHERE ad_id";
      connection.query(query, [adId], (err, result) => {
        if (err) return reject(new Error(err));
        resolve(result);
      });
    });
    return result;
  }

  // manager ///////////////////////////////////////////////////////////////

  static async addAd(data) {
    const image = data.image || null;
    const title = data.title;
    const descreption = data.descreption;
    const result = await new Promise((resolve, reject) => {
      const query = "INSERT INTO ad (image,title,descreption) VALUES (?,?,?)";
      connection.query(query, [image, title, null], (err, result) => {
        if (err) return reject(new Error(err));
        resolve(result.insertId);
      });
    });
    return result;
  }

  static async daleteAd(id) {
    const adId = id;
    const result = await new Promise((resolve, reject) => {
      const query = "DELETE FROM ad WHERE ad_id = ?";
      connection.query(query, [adId], (err, result) => {
        if (err) return reject(new Error(err));
        if (result.affectedRows === 0) return reject(new Error("Not Existed"));
        resolve(result.insertId);
      });
    });
    return "Deleted";
  }

  static async updateAd(data) {
    const title = data.title;
    const descreption = data.descreption;
    const image = data.image;
    const ad_id = data.adId;
    const result = await new Promise((resolve, reject) => {
      const query =
        "UPDATE ad SET title = ?, descreption = ?, image = ? WHERE ad_id = ?";
      connection.query(
        query,
        [title, descreption, image, ad_id],
        (err, result) => {
          if (err) return reject(new Error(err));
          if (result.affectedRows === 0)
            return reject(new Error("Not Existed"));
          resolve(result.insertId);
        }
      );
    });
    return "Updated";
  }
}

module.exports = AdsService;
