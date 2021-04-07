const mongoose = require("mongoose");

const HallSchema = new mongoose.Schema({
	hallNumber: {
		type: String,
		required: [true, "Танхимын дугаарыг оруулна уу"],
	},
	hallType: {
		type: String,
		enum: ["vip", "simple", "3D"],
		required: [true, "Танхимын төрөл өө оруулна уу"],
	},
	row: {
		type: Number,
		required: [true, "Суудлын мөрийн дугаарыг оруулна уу"],
	},
	column: {
		type: Number,
		required: [true, "Суудлын эгнээний дугаарыг оруулна уу"],
	},

	branch: {
		type: mongoose.Schema.ObjectId,
		ref: "Branch",
		required: [true, "Салбараа сонгоно уу"],
	},
});

module.exports = mongoose.model("Hall", HallSchema);
