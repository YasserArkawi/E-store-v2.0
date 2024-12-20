const UserServices = require("../services/UserService");
const { generateToken } = require("../auth/auth");
const fs = require("fs");
const sendEmail = require("../helper/SendMail");

module.exports = {
  registerUser: async (req, res, next) => {
    try {
      const data = req.body;
      data.imagePath = req.file?.path;
      const result = await UserServices.registerUser(data);
      sendEmail(result.email, "Welcome!", "You signed up to our application!");
      res.status(201).send({
        id: result.id,
        name: result.name,
        email: result.email,
        image: result.imagePath,
        success: true,
      });
    } catch (error) {
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  },

  loginUser: async (req, res, next) => {
    try {
      const data = req.body;
      const result = await UserServices.loginUser(data);
      result.password = null;
      result.imagePath = null;
      const token = generateToken(result);
      sendEmail(
        result.email,
        "Welcome Back!",
        "You logged in to our application!"
      );
      res.status(200).send({
        id: result.id,
        token: token,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  managerLogin: async (req, res, next) => {
    try {
      const data = req.body;
      const result = await UserServices.managerLogin(data);
      result.password = null;
      const token = generateToken(result);
      res.status(200).send({
        id: result.id,
        token: token,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  editUser: async (req, res, next) => {
    try {
      const data = req.body;
      data.userId = req.user.id;
      data.imagePath = req.file?.path;
      const result = await UserServices.editUser(data);
      res.status(200).send({
        data: result,
        success: true,
      });
      sendEmail(
        result.email,
        "Edited!",
        `Account with ID: ${data.userId} has edited the account.`
      );
    } catch (error) {
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  },

  // manager /////////////////////////////////////////////////////

  getUserById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await UserServices.getUserById(id);
      res.status(200).send({
        data: result,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  getUserByName: async (req, res, next) => {
    try {
      const name = req.body.name;
      const result = await UserServices.getUserByName(name);
      res.status(200).send({
        data: result,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const skip = +req.query.skip || undefined;
      const take = +req.query.take || undefined;
      const data = { skip, take };
      const results = await UserServices.getAllUsers(data);
      // implement hashing passwords in the database
      results.map((user) => {
        user.password = null;
      });
      res.status(200).send({
        data: results,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  editBalance: async (req, res, next) => {
    try {
      const data = req.body;
      data.userId = req.params.id;
      const result = await UserServices.editBalance(data);
      res.status(200).send({
        id: result.id,
        balance: result.balance,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },
};
