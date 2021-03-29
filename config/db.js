const mongoose = require("mongoose");

const connectDB = async () => {
	const conn = await mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: true,
		useUnifiedTopology: true,
	});

	console.log(`Mongodb holbogdloo: ${conn.connection.host}`.inverse.blue);
};

module.exports = connectDB;
