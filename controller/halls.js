const Hall = require("../models/Hall");
const Error = require("../utils/Error");
const asyncHandler = require("express-async-handler");
const Branch = require("../models/Branch");
const paginate = require("../utils/paginate");

exports.getHalls = asyncHandler(async (req, res, next) => {
	const select = req.query.select;
	const sort = req.query.sort;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;

	["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

	const pagination = await paginate(page, limit, Hall);

	const halls = await Hall.find()
		.limit(limit)
		.skip(pagination.start - 1)
		.populate({
			path: "branch",
			select: "branchName photo",
		});

	res.status(200).json({
		success: true,
		data: halls,
		pagination,
	});
});

exports.getHall = asyncHandler(async (req, res, next) => {
	const hall = await Hall.findById(req.params.id);

	if (!hall) {
		throw new Error(req.params.id + " ID -тай танхим байхгүй байна");
	}

	res.status(200).json({
		success: true,
		data: hall,
	});
});
exports.createHall = asyncHandler(async (req, res, next) => {
	const branch = await Branch.findById(req.body.branch);

	if (!branch) {
		throw new Error(req.body.branchId + " ID-тай салбар байхгүй байна", 400);
	}

	const hall = await Hall.create(req.body);

	res.status(200).json({
		success: true,
		data: hall,
	});
});
exports.updateHall = asyncHandler(async (req, res, next) => {
	const hall = await Hall.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!hall) {
		throw new Error(req.params.id + " ID -тай танхим байхгүй байна");
	}

	res.status(200).json({
		success: true,
		data: hall,
	});
});
exports.deleteHall = asyncHandler(async (req, res, next) => {
	const hall = await Hall.findByIdAndDelete(req.params.id);

	if (!hall) {
		throw new Error(req.params.id + " ID -тай танхим байхгүй байна");
	}

	res.status(200).json({
		success: true,
		data: req.params.id + " ID-тэй танхим устгагдлаа",
	});
});
