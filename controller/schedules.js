const Schedule = require("../models/Schedule");
const asyncHandler = require("express-async-handler");
const Error = require("../utils/Error");
const Staff = require("../models/Staff");
const Movie = require("../models/Movie");
const Hall = require("../models/Hall");

exports.getSchedules = asyncHandler(async (req, res, next) => {
	const schedules = await Schedule.find();

	res.status(200).json({
		success: true,
		data: schedules,
	});
});

exports.getSchedule = asyncHandler(async (req, res, next) => {
	const schedule = await Schedule.findById(req.params.id);

	if (!schedule) {
		throw new MyError(req.params.id + " ID-тэй хуваарь байхгүй!", 400);
	}

	res.status(200).json({
		success: true,
		data: schedule,
	});
});

exports.createSchedule = asyncHandler(async (req, res, next) => {
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

	//Дуусах хугацааг тодорхойлох
	let start = new Date(req.body.startTime);
	//20 минутын зайтай байна
	let end = new Date(start.getTime() + movie.duration * 20 * 60 * 1000);

	req.body.startTime = start;
	req.body.endTime = end;

	console.log(req.body);
	//Хуваарь давхцаж байгаа эсэхийг шалгах
	let sch = Schedule.checkSchedule(start, end, req.body.hallId);

	if (sch) {
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
	const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!schedule) {
		throw new MyError(req.params.id + " ID-тэй хуваарь байхгүйээээ.", 400);
	}

	res.status(200).json({
		success: true,
		data: schedule,
	});
});

exports.deleteSchedule = asyncHandler(async (req, res, next) => {
	const schedule = await Schedule.findByIdAndDelete(req.params.id);

	if (!schedule) {
		throw new MyError(req.params.id + " ID-тэй хуваарь байхгүйээээ.", 400);
	}

	res.status(200).json({
		success: true,
		data: req.params.id + " ID-тэй хуваарь устгагдлаа",
	});
});
