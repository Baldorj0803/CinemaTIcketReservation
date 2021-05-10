const Order = require("../models/Order");
const asyncHandler = require("express-async-handler");
const Error = require("../utils/Error");
const User = require("../models/User");
const Schedule = require("../models/Schedule");
const Movie = require("../models/Movie");
const paginate = require("../utils/paginate");
const sendEmail = require("../utils/email");
const Hall = require("../models/Hall");
exports.createOrder = asyncHandler(async (req, res) => {
	let seats = req.body.seats;
	if (seats.length > 10) {
		throw new Error("Захиалгын тоо 10 аас бага байх ёстой", 400);
	}
	const user = await User.findById(req.userId);

	if (!user) {
		throw new Error(req.userId + " та нэвтрэнэ үү", 400);
	}

	req.body.userId = req.userId;

	const schedule = await Schedule.findById(req.body.scheduleId)
		.populate({
			path: "orders",
			select: "seats",
		})
		.populate({
			path: "hallId",
			select: "row column",
		});

	if (!schedule) {
		throw new Error(req.body.scheduleId + " ID-тай хуваарь байхгүй байна", 400);
	}

	let Row = schedule.hallId.row,
		Column = schedule.hallId.column;

	console.log(Row, Column);

	// Захиалсан суудал үнэн зөв эсэхийг шалгах
	let n = null;
	for (let i = 0; i < seats.length; i++) {
		if (
			seats[i].row > Row ||
			seats[i].row <= 0 ||
			seats[i].column > Column ||
			seats[i].column <= 0
		) {
			throw new Error("Алдаатай захиалга байна!", 400);
		}
	}

	const date = new Date();
	req.body.date = date;
	const order = await Order.create(req.body);
	console.log("date", date);

	setTimeout(async function () {
		const o = await Order.findOne({
			_id: order._id,
			status: false,
		});

		if (o) {
			o.remove({}, function (err, result) {
				if (err) {
					throw new Error("Захиалга устгахад алдаа гарлаа", 400);
				} else {
					console.log("Захиалга устгагдлаа", result);
					console.log("Өдөр", date);
				}
			});
		}
	}, 20 * 60 * 1000);

	date.setMinutes(date.getMinutes() + 20);
	console.log("duusah", date);

	res.status(200).json({
		success: true,
		data: order,
		date,
	});
});

exports.getOrders = asyncHandler(async (req, res) => {
	const select = req.query.select;
	const sort = req.query.sort;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;

	["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

	const pagination = await paginate(page, limit, Order);

	const orders = await Order.find(req.query, select)
		.sort(sort)
		.skip(pagination.start - 1)
		.limit(limit)
		.populate("userId")
		.populate("scheduleId");

	res.status(200).json({
		success: true,
		data: orders,
		pagination,
	});
});

exports.orderConfirm = asyncHandler(async (req, res) => {
	req.body.status = true;

	const order = await Order.findByIdAndUpdate(
		{ _id: req.params.id, userId: req.userId },
		req.body,
		{
			new: true,
			runValidators: true,
		}
	)
		.populate("scheduleId")
		.populate("userId");

	if (!order) {
		throw new Error(req.params.id + " ID -тай захиалга байхгүй байна");
	}

	const hall = await Hall.findById(order.scheduleId.hallId);

	//email ilgeeh message
	let sit = "";
	order.seats.forEach((e) => {
		sit = sit + e.row + "-" + e.column + " ";
	});

	const message = {
		id: order._id,
		branch: order.scheduleId.branch,
		sitNumber: sit,
		time: order.scheduleId.startTime.toString().slice(16, 21),
		hall: hall.hallNumber,
		totalPrice: order.totalPrice,
		movie: order.movieName,
		date: order.scheduleId.startTime.toString().slice(0, 15),
	};

	const info = await sendEmail({
		email: order.userId.email,
		subject: "Тасалбар захиалах",
		message,
	});

	res.status(200).json({
		success: true,
		data: order,
	});
});

exports.deleteOrder = asyncHandler(async (req, res, next) => {
	const order = await Order.findOneAndDelete({
		_id: req.params.id,
		status: false,
	});
	if (!order) {
		throw new Error(req.params.id + " ID -тай захиалга байхгүй байна");
	}
	console.log("Захиалга устгагдлаа");

	res.status(200).json({
		success: true,
		data: req.params.id + " ID-тэй захиалга устгагдлаа",
	});
});

exports.myoders = asyncHandler(async (req, res, next) => {
	console.log(req.userId);
	const orders = await Order.find({
		userId: req.userId,
		status: true,
	})
		.populate("scheduleId")
		.sort({ date: 1 });
	if (!orders) {
		throw new Error("Захиалга байхгүй байна", 400);
	}

	// const movie= await Movie.findById(orders.)

	res.status(200).json({
		success: true,
		data: orders,
	});
});
