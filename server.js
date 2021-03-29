const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const rfs = require("rotating-file-stream");
const colors = require("colors");

const connectDB = require("./config/db");
const categoriesRoutes = require("./routes/categories");
const moviesRoutes = require("./routes/movies");
const staffRoutes = require("./routes/staffs");
const branchesRoutes = require("./routes/branches");
const hallsRoutes = require("./routes/halls");
const commentsRoutes = require("./routes/comment");
const usersRoutes = require("./routes/users");
const schedulesRoutes = require("./routes/schedules");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error");

// Тохиргоог process.env рүү ачааллах
dotenv.config({ path: "./config/config.env" });
connectDB();

//morgan ашиглан хандалтыг хадгалах
var accessLogStream = rfs.createStream("access.log", {
	interval: "1d", // rotate daily
	path: path.join(__dirname, "log"),
});

const app = express();

//body parser
app.use(express.json());
app.use("/upload", express.static("upload"));
app.use(logger);
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/staffs", staffRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/branches", branchesRoutes);
app.use("/api/v1/halls", hallsRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/schedules", schedulesRoutes);
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
