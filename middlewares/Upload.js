const multerUpload = require("./MulterUpload");

const userUpload = multerUpload("./images/users");
const adUpload = multerUpload("./images/ads");
const categoryUpload = multerUpload("./images/categories");
const productUpload = multerUpload("./images/products");

module.exports = { userUpload, adUpload, categoryUpload, productUpload };
