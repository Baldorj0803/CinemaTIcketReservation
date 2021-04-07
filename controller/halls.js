const Hall = require("../models/Hall");
const Error = require("../utils/Error");
const asyncHandler = require("express-async-handler");
const Branch = require("../models/Branch");

exports.getHalls = asyncHandler(async (req, res, next) => {
	const halls = await Hall.find().populate({
		path: "branch",
		select: "branchName photo",
	});

	res.status(200).json({
		success: true,
		data: halls,
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
	const branch = await Branch.findById(req.body.branchId);

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
