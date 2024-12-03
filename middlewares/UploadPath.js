const multerUpload = require("./MulterUpload");

const userUpload = multerUpload("./public/images/users");
const adUpload = multerUpload("./public/ads");
const categoryUpload = multerUpload("./public/images/categories");
const productUpload = multerUpload("./public/images/products");

module.exports = { userUpload, adUpload, categoryUpload, productUpload };
