const mongoose = require("mongoose");

const HallSchema = new mongoose.Schema(
	{
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
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

HallSchema.virtual("schedules", {
	ref: "Schedule",
	localField: "_id",
	foreignField: "hallId",
	justOne: false,
});

module.exports = mongoose.model("Hall", HallSchema);
