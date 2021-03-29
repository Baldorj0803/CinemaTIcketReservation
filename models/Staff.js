const mongoose = require("mongoose");

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
		enum: ["staff", "manager"],
	},
	staffHomeAdd: String,
	staffPhoneNum: Number,
	password: String,
	mail: {
		type: String,
		required: [true, "Е-мэйл хаягаа оруулна уу"],
	},
});

module.exports = mongoose.model("Staff", StaffSchema);
