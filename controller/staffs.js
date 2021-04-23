const Staff = require("../models/Staff");
const Error = require("../utils/Error");
const asyncHandler = require("express-async-handler");
const Branch = require("../models/Branch");
const User = require("../models/User");

exports.getStaffs = asyncHandler(async (req, res, next) => {
	const staffs = await Staff.find();
	res.status(200).json({
		success: true,
		data: staffs,
	});
});

exports.getStaff = asyncHandler(async (req, res, next) => {
	if (req.userId !== req.params.id) {
		throw new Error("Хэрэглэгч байхгүй!", 400);
	}

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
	const user = await User.find({ email: req.body.email });
	console.log(user);

	if (user.length > 0) {
		throw new Error("Имэйл бүртгэгдсэн байна", 400);
	}

	const branch = await Branch.findById(req.body.branchId);

	if (!branch) {
		throw new Error(req.body.branchId + " ID-тай салбар байхгүй байна", 400);
	}

	const staff = await Staff.create(req.body);

	if (staff.password) staff.password = null;

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
