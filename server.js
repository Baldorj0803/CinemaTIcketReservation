const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
var rfs = require("rotating-file-stream");

const connectDB = require("./config/db");
const categoriesRoutes = require("./routes/categories");
const moviesRoutes = require("./routes/movies");
const staffRoutes = require("./routes/staffs");
const branchesRoutes = require("./routes/branches");
const hallsRoutes = require("./routes/halls");
const usersRoutes = require("./routes/users");
const schedulesRoutes = require("./routes/schedules");
const ordersRoutes = require("./routes/orders");
const { login } = require("./controller/login");
const { adminStatistic, managerStatistic } = require("./controller/statistic");
const { protect, authorize } = require("./middleware/protect");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error");

// Тохиргоог process.env рүү ачааллах
dotenv.config({ path: "./config/config.env" });
connectDB();

var accessLogStream = rfs.createStream("access.log", {
	interval: "1d", // rotate daily
	path: path.join(__dirname, "log"),
});

const app = express();
app.set("view engine", "hjs");

//body parser
app.use(express.json());
app.use(fileupload());
app.use(cors());
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(logger);
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/staffs", staffRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/branches", branchesRoutes);
app.use("/api/v1/halls", hallsRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/schedules", schedulesRoutes);
app.use("/api/v1/orders", ordersRoutes);
app.post("/api/v1/login", login);
app.get("/api/v1/statistic/admin", protect, authorize("admin"), adminStatistic);
app.get(
	"/api/v1/statistic/manager",
	protect,
	authorize("manager"),
	managerStatistic
);
app.use(errorHandler);

const server = app.listen(process.env.PORT, (req, res) => {
	console.log(`server ${process.env.PORT} deer ajillaa`.green.inverse);
});

process.on("unhandledRejection", (err, promise) => {
	console.log(`Алдаа гарлаа: ${err.message}.`.red);
	server.close(() => {
		process.exit(1);
	});
});
