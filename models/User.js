const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Овогоо оруулна уу?"],
		maxlength: [30, "Овогийн урт дээд тал нь 30 тэмдэгт"],
		trim: true,
	},
	password: {
		type: String,
		required: [true, "Нууц үгээ оруулна уу"],
		minlength: 4,
		select: false, // энэ талбарыг front-end рүү явуулахгүй
	},
	role: {
		type: String,
		required: [true, "Хэрэглэгчийн эрхийг оруулна уу"],
		default: "user",
	},
	email: {
		type: String,
		required: [true, "Хэрэглэгчийн имэйл хаягийг оруулж өгнө үү"],
		unique: true,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			"Имэйл хаяг буруу байна.",
		],
	},
	age: {
		type: Number,
		required: [true, "Насаа оруулж өгнө үү"],
	},
	rNum: {
		type: String,
		required: [true, "Регистерийн дугаар аа оруулна уу"],
		unique: true,
		validate: {
			validator: function (v) {
				return v.length === 10;
			},
			message: (props) => `${props.value} форматын алдаатай байна`,
		},
	},
	phoneNum: Number,
	photo: {
		type: String,
		default: "no-photo-user.jpg",
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.methods.getJsonWebToken = function () {
	const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRESIN,
	});
	return token;
};

UserSchema.methods.checkPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

UserSchema.pre("save", async function () {
	//Хэрэглэгч create хийхэд нууц үгийг bcrypt лэж өөрөөр хадгалах
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);

	//Хэрэглэгч бүртгүүлэхэд token буцааж өгнө
});

module.exports = mongoose.model("User", UserSchema);
