const Staff = require("../models/Staff");
const User = require("../models/User");
const Error = require("../utils/Error");
const asyncHandler = require("express-async-handler");
const login = require("./login");

//login
exports.login = asyncHandler(async (req, res, next) => {
	//email password орж ирсэн эсэхийг шалгах
	const { email, password } = req.body;
	if (!email || !password) {
		throw new Error("Имэйл болон нууц үгээ дамжуулна уу", 400);
	}

	//Имэйл  ажилтанаас хайх
	let user = await Staff.findOne({ email }).select("+password"); //passwordiig awahgvi gj tohiruulsan bolowch .select eer nemj bolno

	if (!user) {
		//Имэйл Хэрэглэгчээс хайх
		user = await User.findOne({ email }).select("+password"); //passwordiig awahgvi gj tohiruulsan bolowch .select eer nemj bolno

		if (!user) {
			throw new Error("Имэйл болон нууц үг буруу байна", 401);
		}
	}

	//нууц үг шалгах
	const ok = await user.checkPassword(password);

	if (!ok) {
		throw new Error("Имэйл болон нууц үг буруу байна", 401);
	}

	if (user.password) user.password = null;

	res.status(200).json({
		success: true,
		token: user.getJsonWebToken(),
		data: user,
	});
});
