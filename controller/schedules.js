const Schedule = require("../models/Schedule");
const asyncHandler = require("express-async-handler");
const Error = require("../utils/Error");
const Staff = require("../models/Staff");
const Movie = require("../models/Movie");
const Hall = require("../models/Hall");
const paginate = require("../utils/paginate");
const Order = require("../models/Order");
const mongoose = require("mongoose");

exports.getSchedules = asyncHandler(async (req, res, next) => {
	const select = req.query.select;
	const sort = req.query.sort;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 12;

	["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

	const pagination = await paginate(page, limit, Schedule);

	const schedules = await Schedule.find(req.query, select)
		.sort(sort)
		.skip(pagination.start - 1)
		.limit(limit)
		.populate("hallId")
		.populate("movieId")
		.populate("staffId")
		.populate("orders");

	res.status(200).json({
		success: true,
		data: schedules,
		pagination,
	});
});

exports.getSchedule = asyncHandler(async (req, res, next) => {
	const schedule = await Schedule.findById(req.params.id)
		.populate({
			path: "orders",
			select: "seats",
		})
		.populate({
			path: "hallId",
		})
		.populate("movieId");

	if (!schedule) {
		throw new Error(req.params.id + " ID-тэй хуваарь байхгүй!", 400);
	}

	res.status(200).json({
		success: true,
		data: schedule,
	});
});

//хуваарь үүсгэх
exports.createSchedule = asyncHandler(async (req, res, next) => {
	console.log(req.body);
	const movie = await Movie.findById(req.body.movieId);

	if (!movie) {
		throw new Error(req.body.movieId + " ID-тай кино байхгүй байна", 400);
	}

	const staff = await Staff.findById(req.userId);

	if (!staff) {
		throw new Error(req.body.userId + " ID-тай ажилтан байхгүй байна", 400);
	}

	const hall = await Hall.findById(req.body.hallId);

	if (!hall) {
		throw new Error(req.body.hallId + " ID-тай кино танхим байна", 400);
	}

	// //Дуусах хугацааг тодорхойлох
	let date = req.body.startTime.split("-").map((iNum) => parseInt(iNum));

	if (date.length != 5) throw new Error("Сар өдөрөө оруулна уу", 400);

	//20 минутын зайтай байна
	let add = movie.duration + 20;
	let start = new Date(
		Date.UTC(date[0], date[1] - 1, date[2], date[3], date[4])
	);
	let end = new Date(
		Date.UTC(date[0], date[1] - 1, date[2], date[3], date[4] + add)
	);

	req.body.startTime = start;
	req.body.endTime = end;

	//Хуваарь давхцаж байгаа эсэхийг шалгах
	let sch = await Schedule.checkSchedule(start, end, req.body.hallId);
	sch ? console.log("Давхацсан хуваарь", sch) : "";

	if (sch.length !== 0) {
		throw new Error("Аль нэг хуваарь давхцаж байна", 400);
	}

	//хадгалсан хэрэглэгч тодорхойлох
	req.body.staffId = req.userId;

	const schedule = await Schedule.create(req.body);

	res.status(200).json({
		success: true,
		data: schedule,
	});
});

exports.updateSchedule = asyncHandler(async (req, res, next) => {
	const schedule = await Schedule.findById(req.params.id);

	if (!schedule) {
		throw new Error(req.params.id + " ID-тэй хуваарь байхгүйээээ.", 400);
	}

	if (schedule.staffId.toString() !== req.userId) {
		throw new Error("Таны хуваарь биш байна", 400);
	}

	let ordered = await Order.countDocuments({
		scheduleId: new mongoose.Types.ObjectId(req.params.id),
	});

	if (ordered > 0) {
		throw new Error("Захиалгатай тул засварлах боломжгүй байна", 400);
	}

	if (req.body.startTime) {
		const movie = await Movie.findById(req.body.movieId);

		if (!movie) {
			throw new Error(req.body.movieId + " ID-тай кино байхгүй байна", 400);
		}
		// //Дуусах хугацааг тодорхойлох
		let date = req.body.startTime.split("-").map((iNum) => parseInt(iNum));

		if (date.length != 5) throw new Error("Сар өдөрөө оруулна уу", 400);

		//20 минутын зайтай байна
		let add = movie.duration + 20;
		let start = new Date(
			Date.UTC(date[0], date[1] - 1, date[2], date[3], date[4])
		);
		let end = new Date(
			Date.UTC(date[0], date[1] - 1, date[2], date[3], date[4] + add)
		);

		req.body.startTime = start;
		req.body.endTime = end;

		//Хуваарь давхцаж байгаа эсэхийг шалгах
		let sch = await Schedule.checkSchedule(start, end, req.body.hallId);
		sch ? console.log("Давхацсан хуваарь", sch) : "";

		if (sch.length !== 0) {
			if (sch.length !== 1 && sch._id !== req.params.id) {
				throw new Error("Аль нэг хуваарь давхцаж байна", 400);
			}
		}
	}

	for (const el in req.body) {
		schedule[el] = req.body[el];
	}
	schedule.save();

	res.status(200).json({
		success: true,
		data: schedule,
	});
});

exports.deleteSchedule = asyncHandler(async (req, res, next) => {
	const schedule = await Schedule.findById(req.params.id);

	if (schedule.staffId.toString() !== req.userId) {
		throw new Error("Таны хуваарь биш байна", 400);
	}

	if (!schedule) {
		throw new Error(req.params.id + " ID-тэй хуваарь байхгүйээээ.", 400);
	}
	let ordered = await Order.countDocuments({
		scheduleId: new mongoose.Types.ObjectId(req.params.id),
	});

	console.log(ordered);

	if (ordered > 0) {
		throw new Error("Захиалгатай тул устгах боломжгүй байна", 400);
	}

	schedule.remove();

	res.status(200).json({
		success: true,
		data: req.params.id + " ID-тэй хуваарь устгагдлаа",
	});
});
