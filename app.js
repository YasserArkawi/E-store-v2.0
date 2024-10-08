const express = require("express");
const app = express();
const env = require("dotenv");
env.config();

app.use(express.json());

app.use("/store/category", require("./routes/CategoryRouter"));
app.use("/store/user", require("./routes/UserRouter"));
app.use("/store/product", require("./routes/ProductRouter"));
app.use("/store/order", require("./routes/OrderRouter"));
app.use("/store/rate", require("./routes/RatingRouter"));
app.use("/store/ad", require("./routes/AdsRouter"));
app.use("/store/like", require("./routes/LikesRouter"));

app.use(express.static("images"));

app.listen(process.env.PORT || 3000, () => {
  console.log(`the app is running.`);
});
