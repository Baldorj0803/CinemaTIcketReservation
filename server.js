const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cors = require("cors");

const connectDB = require("./config/db");
const categoriesRoutes = require("./routes/categories");
const moviesRoutes = require("./routes/movies");
const staffRoutes = require("./routes/staffs");
const branchesRoutes = require("./routes/branches");
const hallsRoutes = require("./routes/halls");
const commentsRoutes = require("./routes/comment");
const usersRoutes = require("./routes/users");
const schedulesRoutes = require("./routes/schedules");
const { login } = require("./controller/login");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error");

// Тохиргоог process.env рүү ачааллах
dotenv.config({ path: "./config/config.env" });
connectDB();

const app = express();

//body parser
app.use(express.json());
app.use(fileupload());
app.use(cors());
app.use("/upload", express.static("upload"));
app.use(logger);
app.use(morgan("dev"));
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/staffs", staffRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/branches", branchesRoutes);
app.use("/api/v1/halls", hallsRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/schedules", schedulesRoutes);
app.post("/api/v1/login", login);
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
