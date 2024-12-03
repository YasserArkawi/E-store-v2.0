function paymentEnumMiddleware(req, res, next) {
  if (req.body.paymentType) {
    const data = req.body.paymentType.toLowerCase();
    if (data === "visa") {
      req.body.paymentType = paymentTypes[0];
    } else if (data === "master_card") {
      req.body.paymentType = paymentTypes[1];
    } else if (data === "paypal") {
      req.body.paymentType = paymentTypes[2];
    } else {
      return res.status(400).send({ enumError: "paymentType not valid." });
    }
  }
  if (req.body.paymentStatus) {
    const data = req.body.paymentStatus.toLowerCase();
    if (data === "pending") {
      req.body.paymentStatus = status[0];
    } else if (data === "rejected") {
      req.body.paymentStatus = status[1];
    } else if (data === "accepted") {
      req.body.paymentStatus = status[2];
    } else {
      return res.status(400).send({ enumError: "paymentStatus not valid." });
    }
  }
  next();
}

const paymentTypes = ["VISA", "MASTER_CARD", "PAYPAL"];
const status = ["PENDING", "REJECTED", "ACCEPTED"];

module.exports = { paymentEnumMiddleware };
