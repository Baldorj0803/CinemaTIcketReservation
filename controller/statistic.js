const Staff = require("../models/Staff");
const Error = require("../utils/Error");
const asyncHandler = require("express-async-handler");
const Branch = require("../models/Branch");
const Hall = require("../models/Hall");
const paginate = require("../utils/paginate");
const Movie = require("../models/Movie");
const User = require("../models/User");
const Schedule = require("../models/Schedule");
const Order = require("../models/Order");

exports.adminStatistic = asyncHandler(async (req, res, next) => {
	const totalBranch = await Branch.countDocuments();
	const totalStaff = await Staff.countDocuments();
	const totalHall = await Hall.countDocuments();
	const totalMovie = await Movie.countDocuments();

	const totalUser = await User.countDocuments();
	const date = new Date();
	date.setHours(date.getHours() + 8);
	const totalSchedule = await Schedule.countDocuments({
		startTime: { $gt: date },
	});
	const order = await Order.aggregate([
		{
			$group: {
				_id: null,
				totalPrice: {
					$sum: "$totalPrice",
				},
				totalOrder: {
					$sum: 1,
				},
			},
		},
	]);

	const totalOrder = order.length === 1 ? order[0]["totalOrder"] : 0;
	const totalPrice = order.length === 1 ? order[0]["totalPrice"] : 0;

	res.status(200).json({
		success: true,
		data: {
			totalBranch,
			totalStaff,
			totalHall,
			totalMovie,

			totalUser,
			totalSchedule,
			totalOrder,
			totalPrice,
		},
	});
});
