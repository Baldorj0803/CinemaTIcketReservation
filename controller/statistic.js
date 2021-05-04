const Staff = require("../models/Staff");
const Error = require("../utils/Error");
const asyncHandler = require("express-async-handler");
const Branch = require("../models/Branch");
const Hall = require("../models/Hall");
const paginate = require("../utils/paginate");
const Movie = require("../models/Movie");

exports.adminStatistic = asyncHandler(async (req, res, next) => {
	const totalBranch = await Branch.countDocuments();
	const totalStaff = await Staff.countDocuments();
	const totalHall = await Hall.countDocuments();
	const totalMovie = await Movie.countDocuments();

	res.status(200).json({
		success: true,
		data: { totalBranch, totalStaff, totalHall, totalMovie },
	});
});
