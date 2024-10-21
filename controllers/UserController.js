const UserServices = require("../services/UserService");
const { generateToken } = require("../auth/auth");
const fs = require("fs");

module.exports = {
  registerUser: async (req, res) => {
    try {
      const data = req.body;
      data.imagePath = req.file?.path;
      const result = await UserServices.registerUser(data);
      res.status(201).send({
        id: result.id,
        name: result.name,
        email: result.email,
        image: result.imagePath,
        success: true,
      });
    } catch (error) {
      console.log(error);
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      const data = req.body;
      const result = await UserServices.loginUser(data);
      result.password = null;
      result.imagePath = null;
      const token = generateToken(result);
      res.status(200).send({
        id: result.id,
        token: token,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.send({
        data: error.meta?.cause || error.meta?.target || error.message,
        token: null,
        success: false,
      });
    }
  },

  managerLogin: async (req, res) => {
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
      console.log(error);
      res.send({
        data: error.meta?.cause || error.meta?.target || error.message,
        token: null,
        success: false,
      });
    }
  },

  editUser: async (req, res) => {
    try {
      const data = req.body;
      data.userId = req.user.id;
      data.imagePath = req.file?.path;
      const result = await UserServices.editUser(data);
      res.status(200).send({
        data: result,
        success: true,
      });
    } catch (error) {
      console.log(error);
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },

  // manager /////////////////////////////////////////////////////

  getUserById: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await UserServices.getUserById(id);
      res.status(200).send({
        data: result,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },

  getUserByName: async (req, res) => {
    try {
      const name = req.body.name;
      const result = await UserServices.getUserByName(name);
      res.status(200).send({
        data: result,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },

  getAllUsers: async (req, res) => {
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
      console.log(error);
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },

  editBalance: async (req, res) => {
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
      console.log(error);
      res.status(400).send({
        data: error.meta?.cause || error.meta?.target || error.message,
        success: false,
      });
    }
  },
};
