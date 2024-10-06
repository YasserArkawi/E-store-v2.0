const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

class UserService {
  static async geAlltUsers() {
    const results = new Promise((resolve, reject) => {
      const query = "SELECT * FROM user ";
      connection.query(query, [], (err, results) => {
        if (err) return reject(new Error(err));
        resolve(results);
      });
    });
    return results;
  }

  static async getUserById(id) {
    const result = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM user WHERE user_id = ?";
      connection.query(query, [+id], (err, result) => {
        if (err) return reject(new Error(err));
        resolve(result[0]);
      });
    });
    return result;
  }

  static async getUserByName(name) {
    const result = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM user WHERE f_name = ?";
      connection.query(query, [name], (err, result) => {
        if (err) return reject(new Error(err));
        resolve(result[0]);
      });
    });
    return result;
  }

  static async editUser(data) {
    const id = data.user_id;
    const oldUser = await this.getUserById(id);
    // console.log("old User ");
    // console.log(oldUser);
    const name = data.f_name || oldUser.f_name;
    const imagePath = data.imagePath;
    const email = data.email || oldUser.email;
    const phone = data.phone || oldUser.phone;
    const password = data.password || oldUser.password;

    const result = await new Promise((resolve, reject) => {
      const query =
        "UPDATE user SET f_name = ?, image_path = ?, email = ?, password = ?, phone = ? WHERE user_id = ?";
      connection.query(
        query,
        [name, imagePath, email, password, phone, id],
        (err, result) => {
          if (err) return reject(new Error(err));
          resolve(result);
        }
      );
    });
    return {
      user_id: id,
      f_name: name,
      imagePath: imagePath,
      email: email,
      password: password,
      phone: phone,
    };
  }

  static async registerUser(data) {
    const f_name = data.f_name;
    const imagePath = data.imagePath;
    const email = data.email;
    const password = data.password;
    data.phone.toString();
    const phone = data.phone;
    // const is_admin = data.is_admin;
    const result = await new Promise((resolve, reject) => {
      const query =
        "INSERT INTO user (f_name,image_path,email,password,phone) VALUES (?,?,?,?,?)";
      connection.query(
        query,
        [f_name, imagePath, email, password, phone],
        (err, result) => {
          if (err) return reject(Error(err));
          resolve(result);
        }
      );
    });
    return result;
  }

  static async loginUser(data) {
    const email = data.email;
    const password = data.password;
    const result = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM user WHERE email = ?";
      connection.query(query, [email], (err, result) => {
        if (err || result.length === 0 || result[0].is_admin === 1) {
          return reject("Email Not Found");
        } else if (result[0].is_admin === 1) {
          return reject("Access not allowd");
        } else {
          if (result[0].password === password) {
            resolve(result[0]);
          } else {
            return reject("Invalid Password");
          }
        }
      });
    });
    return result;
  }

  static async managerLogin(data) {
    const email = data.email;
    const password = data.password;
    const result = await new Promise((resolve, reject) => {
      const query = "SELECT * FROM user WHERE email = ?";
      connection.query(query, [email], (err, result) => {
        if (err || result.length === 0) {
          return reject("Email Not Found");
        } else if (result[0].is_admin === 0) {
          return reject("Access not allowd");
        } else {
          if (result[0].password === password) {
            resolve(result[0]);
          } else {
            return reject("Invalid Password");
          }
        }
      });
    });
    return result;
  }
}

module.exports = UserService;
