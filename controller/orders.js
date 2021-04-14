const Order = require("../models/Order");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/Error");
const User = require("../models/User");
const Schedule = require("../models/Schedule");

exports.createOrder = asyncHandler(async (req, res) => {
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

	let seats = req.body.seats;
	let Row = schedule.hallId.row,
		Column = schedule.hallId.column;

	//Захиалсан суудал үнэн зөв эсэхийг шалгах
	let n = null;
	for (let i = 0; i < seats.length; i++) {
		if (
			seats[i].row > Row ||
			seats[i].row <= 0 ||
			seats[i].column > Column ||
			seats[i].column <= 0
		) {
			throw new MyError("Алдаатай захиалга байна!", 400);
		}
		if (n !== null && i < seats.length) {
			if (n === seats[i].row) {
				n = seats[i].row;
				for (let j = i; j < seats.length; j++) {
					if (seats[i - 1].column === seats[j].column) {
						throw new MyError("Алдаатай захиалга байна", 400);
					}
				}
			}
		} else {
			n = seats[0].row;
			continue;
		}
	}

	//давхцсан эсэхийг шалгах js
	// let sta = req.body.seats;
	// schedule.orders.map((order) => {
	// 	order.seats.map((seat) => {
	// 		sta.map((st) => {
	// 			if (st.row == seat.row && st.column === seat.column) {
	// 				throw new MyError("Аль нэг хуваарь давхцаж байна", 400);
	// 			}
	// 		});
	// 	});
	// });

	const obj = await Order.checkOrder(req.body.seats, req.body.scheduleId);

	if (obj.length !== 0) {
		throw new MyError("Аль нэг суудал давхцаж байна", 400);
	}

	const order = await Order.create(req.body);

	res.status(200).json({
		success: true,
		data: order,
	});
});

exports.getOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find().populate({
		path: "scheduleId",
		select: "hallId",
	});

	res.status(200).json({
		success: true,
		data: orders,
	});
});
