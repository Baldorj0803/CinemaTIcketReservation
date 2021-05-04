const errorHandler = (err, req, res, next) => {
	console.log(err.stack.red);

	if (err.code === 1000) {
		err.message = "Бүртгэгдсэн байна";
	}

	if (err.code === 11000 && err.keyPattern.email == 1) {
		err.message = "Бүртгэлтэй имэйл байна";
	}

	if (err.code === 11000 && err.keyValue.scheduleId) {
		const value = err.keyValue;
		err.message = `Алдаа гарлаа, ${value["seats.row"]} мөрний ${value["seats.column"]} суудал давхцаж байна`;
	}

	res.status(err.statusCode || 500).json({
		error: err.message,
	});
};

module.exports = errorHandler;
