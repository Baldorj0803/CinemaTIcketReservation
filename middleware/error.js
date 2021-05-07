const errorHandler = (err, req, res, next) => {
	console.log(err.stack.red);

	if (err.message === "jwt malformed") {
		err.message = "Та логин хийж байж энэ үйлдлийг хийх ёстой";
		err.status = 401;
	}

	if (err.code === 1000) {
		err.message = "Бүртгэгдсэн байна";
		err.status = 400;
	}

	if (err.code === 11000 && err.keyPattern.email == 1) {
		err.message = "Бүртгэлтэй имэйл байна";
		err.status = 400;
	}

	if (err.code === 11000 && err.keyValue.scheduleId) {
		const value = err.keyValue;
		err.status = 400;
		err.message = `Алдаа гарлаа, ${value["seats.row"]} мөрний ${value["seats.column"]} суудал давхцаж байна`;
	}

	res.status(err.statusCode || 500).json({
		error: err.message,
	});
};

module.exports = errorHandler;
