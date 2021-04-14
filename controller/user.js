const User = require("../models/User");
const Error = require("../utils/Error");
const asyncHandler = require("express-async-handler");

exports.getUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find();
	res.status(200).json({
		success: true,
		data: users,
	});
});

exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		throw new Error(req.params.id + " ID-тэй хэрэглэгч байхгүй!", 400);
	}

	res.status(200).json({
		success: true,
		data: user,
	});
});

//register
exports.createUser = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);

	const token = user.getJsonWebToken();

	if (user.password) user.password = null;

	res.status(200).json({
		success: true,
		token,
		data: user,
	});
});

//login
// exports.loginUser = asyncHandler(async (req, res, next) => {
// 	login("user");
// 	//email password орж ирсэн эсэхийг шалгах
// 	const { email, password } = req.body;
// 	if (!email || !password) {
// 		throw new Error("Имэйл болон нууц үгээ дамжуулна уу", 400);
// 	}

// 	//Имэйл хайх
// 	const user = await User.findOne({ email }).select("+password"); //passwordiig awahgvi gj tohiruulsan bolowch .select eer nemj bolno

// 	if (!user) {
// 		throw new Error("Имэйл болон нууц үг буруу байна", 401);
// 	}

// 	//нууц үг шалгах
// 	const ok = await user.checkPassword(password);

// 	if (!ok) {
// 		throw new Error("Имэйл болон нууц үг буруу байна", 401);
// 	}

// 	res.status(200).json({
// 		success: true,
// 		token: user.getJsonWebToken(),
// 		data: user,
// 	});
// });

exports.updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		throw new Error(req.params.id + " ID-тэй хэрэглэгч байхгүйээээ.", 400);
	}

	res.status(200).json({
		success: true,
		data: user,
	});
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.id);

	if (!user) {
		throw new Error(req.params.id + " ID-тэй хэрэглэгч байхгүйээээ.", 400);
	}

	res.status(200).json({
		success: true,
		data: req.params.id + " ID-тэй хэрэглэгч устгагдлаа",
	});
});
