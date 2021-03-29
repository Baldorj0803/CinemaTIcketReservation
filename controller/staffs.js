const Staff = require("../models/Staff");

exports.getStaffs = async (req, res, next) => {
	try {
		const staffs = await Staff.find();

		res.status(200).json({
			success: true,
			data: staffs,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

exports.getStaff = async (req, res, next) => {
	try {
		const staff = await Staff.findById(req.params.id);

		if (!staff) {
			return res.status(400).json({
				success: false,
				error: req.params.id + "ID-тай ажилтан байхгүй байна",
			});
		}

		res.status(200).json({
			success: true,
			data: staff,
		});
	} catch (error) {
		res.status(400).json({
			success: true,
			error: error.message,
		});
	}
};
exports.createStaff = async (req, res, next) => {
	try {
		const staff = await Staff.create(req.body);
		res.status(200).json({
			success: true,
			data: staff,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};
exports.updateStaff = async (req, res, next) => {
	try {
		const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!staff) {
			return res.status(400).json({
				success: false,
				error: req.params.id + "ID-тай ажилтан байхгүй байна",
			});
		}

		res.status(200).json({
			success: true,
			data: staff,
		});
	} catch (error) {
		res.status(400).json({
			success: true,
			error: error.message,
		});
	}
};
exports.deleteStaff = async (req, res, next) => {
	try {
		const staff = await Staff.findByIdAndDelete(req.params.id);

		if (!staff) {
			return res.status(400).json({
				success: false,
				error: req.params.id + "ID-тай ажилтан байхгүй байна",
			});
		}

		res.status(200).json({
			success: true,
			data: req.params.id + "ID-тай ажилтан устгагдлаа",
		});
	} catch (error) {
		res.status(400).json({
			success: true,
			error: error.message,
		});
	}
};
