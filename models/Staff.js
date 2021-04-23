const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const StaffSchema = mongoose.Schema({
	fName: {
		type: String,
		required: [true, "Нэрээ оруулна уу"],
	},
	lName: {
		type: String,
		required: [true, "Овог оо оруулна уу"],
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
	role: {
		type: String,
		required: [true, "Албан тушаалаа сонгоно уу"],
		enum: ["manager", "admin"],
	},
	branchId: {
		type: mongoose.Schema.ObjectId,
		ref: "Branch",
		required: true,
	},
	staffHomeAdd: String,
	staffPhoneNum: Number,
	password: {
		type: String,
		required: [true, "Нууц үгээ оруулна уу"],
		minlength: 4,
		select: false, // энэ талбарыг front-end рүү явуулахгүй
	},
	email: {
		type: String,
		unique: true,
		required: [true, "Е-мэйл хаягаа оруулна уу"],
	},
	photo: {
		type: String,
		default: "no-photo-staff.jpg",
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
});

StaffSchema.methods.getJsonWebToken = function () {
	const token = jwt.sign(
		{ id: this._id, role: this.role },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRESIN,
		}
	);
	return token;
};

StaffSchema.methods.checkPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

StaffSchema.pre("save", async function () {
	//Ажилтан create хийхэд нууц үгийг bcrypt лэж өөрөөр хадгалах
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("Staff", StaffSchema);
