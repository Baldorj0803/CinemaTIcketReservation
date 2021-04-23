const errorHandler = (err, req, res, next) => {
	console.log(err.stack.red);

	console.log("aldaanii code ", err.code);

	if (err.code === 11000) {
		err.message = "Бүртгэлтэй байна";
	}

	res.status(err.statusCode || 500).json({
		error: err.message,
	});
};

module.exports = errorHandler;
