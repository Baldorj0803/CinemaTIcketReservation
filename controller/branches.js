const Branch = require("../models/Branch");
const MyError = require("../utils/Error");
const asyncHandler = require("express-async-handler");

exports.getBranches = asyncHandler(async (req, res, next) => {
	const branches = await Branch.find();

	res.status(200).json({
		success: true,
		data: branches,
	});
});

exports.getBranch = asyncHandler(async (req, res, next) => {
	const branch = await Branch.findById(req.params.id).populate("halls");

	if (!branch) {
		throw new MyError(req.params.id + " ID-тэй салбар байхгүй!", 400);
	}

	res.status(200).json({
		success: true,
		data: branch,
	});
});

exports.createBranch = asyncHandler(async (req, res, next) => {
	const branch = await Branch.create(req.body);

	res.status(200).json({
		success: true,
		data: branch,
	});
});

exports.updateBranch = asyncHandler(async (req, res, next) => {
	const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!branch) {
		throw new MyError(req.params.id + " ID-тэй салбар байхгүй!", 400);
	}

	res.status(200).json({
		success: true,
		data: branch,
	});
});

exports.deleteBranch = asyncHandler(async (req, res, next) => {
	const branch = await Branch.findByIdAndUpdate(req.params.id);

	if (!branch) {
		throw new MyError(req.params.id + " ID-тэй салбар байхгүй!", 400);
	}

	res.status(200).json({
		success: true,
		data: req.params.id + " ID-тэй салбар устгагдлаа",
	});
});
