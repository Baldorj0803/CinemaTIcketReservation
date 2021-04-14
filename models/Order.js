const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "Хэрэглэгч нэвтрээгүй байна"],
		},
		scheduleId: {
			type: mongoose.Schema.ObjectId,
			ref: "Schedule",
			required: true,
		},
		seats: [
			{
				row: Number,
				column: Number,
			},
		],
	},
	// { timestamps: true },
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

OrderSchema.statics.checkOrder = async function (st, schId) {
	console.log(st);

	const obj = await this.aggregate([
		{
			$project: { "seats._id": 0 },
		},
		{
			$match: {
				$and: [
					{
						scheduleId: new mongoose.Types.ObjectId(schId),
					},
					{
						seats: { $in: st },
					},
				],
			},
		},
	]);

	return obj;
};

module.exports = mongoose.model("Order", OrderSchema);
