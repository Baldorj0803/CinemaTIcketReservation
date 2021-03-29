const mongoose = require("mongoose");

const HallSchema = new mongoose.Schema({
	hallNumber: {
		type: Number,
		required: [true, "Танхимын дугаарыг оруулна уу"],
	},
	hallAllSitNumber: {
		type: Number,
		required: [true, "Танхимын суудлын тоог оруулна уу"],
		min: [1, "1 ээс их тоо байх ёстой"],
	},
	hallType: {
		type: String,
		enum: ["vip", "simple", "3D"],
		required: [true, "Танхимын төрөл өө оруулна уу"],
	},
	branchId: {
		type: mongoose.Schema.ObjectId,
		ref: "Branch",
		required: [true, "Салбараа сонгоно уу"],
	},
});

module.exports = mongoose.model("Hall", HallSchema);
