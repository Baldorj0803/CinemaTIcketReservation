const Staff = require("../models/Staff");
const Error = require("../utils/Error");
const asyncHandler = require("express-async-handler");
const Branch = require("../models/Branch");

exports.getStaffs = asyncHandler(async (req, res, next) => {
	const staffs = await Staff.find();
	res.status(200).json({
		success: true,
		data: staffs,
	});
});

exports.getStaff = asyncHandler(async (req, res, next) => {
	const staff = await Staff.findById(req.params.id);

	if (!staff) {
		throw new Error(req.params.id + " ID-тэй ажилтан байхгүй!", 400);
	}

	res.status(200).json({
		success: true,
		data: staff,
	});
});

//register
exports.createStaff = asyncHandler(async (req, res, next) => {
	const branch = await Branch.findById(req.body.branchId);

	if (!branch) {
		throw new Error(req.body.branchId + " ID-тай салбар байхгүй байна", 400);
	}

	const staff = await Staff.create(req.body);

	res.status(200).json({
		success: true,
		data: staff,
	});
});

exports.updateStaff = asyncHandler(async (req, res, next) => {
	const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!staff) {
		throw new Error(req.params.id + " ID-тэй ажилтан байхгүйээээ.", 400);
	}

	res.status(200).json({
		success: true,
		data: staff,
	});
});

exports.deleteStaff = asyncHandler(async (req, res, next) => {
	const staff = await Staff.findByIdAndDelete(req.params.id);

	if (!staff) {
		throw new Error(req.params.id + " ID-тэй ажилтан байхгүйээээ.", 400);
	}

	res.status(200).json({
		success: true,
		data: req.params.id + " ID-тэй ажилтан устгагдлаа",
	});
});
