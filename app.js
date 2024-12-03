const express = require("express");
const app = express();
const env = require("dotenv");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const mainRoutes = require("./routes/MainRoutes");
const { myLog } = require("./middlewares/MyLogging");
const errorHandling = require("./middlewares/ErrorHandling");
env.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeadears: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Init rateLimiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 3 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: { message: "Too many requests, please try again later." },
});
// using limiter
app.use(limiter);
app.set("trust-proxy", 1);

// using my own logger 
app.use(myLog);

app.use("/store/public", express.static("public"));

app.use("/store", mainRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`the app is running.`);
});

app.use(errorHandling);

// app.use("/store/category", require("./routes/CategoryRouter"));
// app.use("/store/user", require("./routes/UserRouter"));
// app.use("/store/product", require("./routes/ProductRouter"));
// app.use("/store/order", require("./routes/OrderRouter"));
// app.use("/store/rate", require("./routes/RatingRouter"));
// app.use("/store/ad", require("./routes/AdsRouter"));
// app.use("/store/like", require("./routes/LikesRouter"));
