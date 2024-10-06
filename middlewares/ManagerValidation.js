const managerValidation = (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).send({ message: "Forbidden" });
    }
  } catch (error) {
    console.log(`manager validation error \n ${error.message}\n`);
  }
};

module.exports = { managerValidation };
