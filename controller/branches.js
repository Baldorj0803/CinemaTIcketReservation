const Branch = require("../models/Branch");
const MyError = require("../utils/Error");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

exports.getBranches = asyncHandler(async (req, res, next) => {
	const select = req.query.select;
	const sort = req.query.sort;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;

	["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

	const pagination = await paginate(page, limit, Branch);

	const branches = await Branch.find()
		.limit(limit)
		.skip(pagination.start - 1)
		.populate("halls");

	res.status(200).json({
		success: true,
		data: branches,
		pagination,
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
	const branch = await Branch.findById(req.params.id);

	if (!branch) {
		throw new MyError(req.params.id + " ID-тэй салбар байхгүй!", 400);
	}
	branch.remove();

	res.status(200).json({
		success: true,
		data: req.params.id + " ID-тэй салбар устгагдлаа",
	});
});
