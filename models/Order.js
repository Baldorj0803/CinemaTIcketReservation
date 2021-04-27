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
				row: { type: Number, required: true },
				column: { type: Number, required: true },
			},
		],
		status: {
			type: Boolean,
			required: [true, "Төлөвгүй байна"],
			default: false,
		},
		email: String,
		totalPrice: Number,
		date: Date,
		child: {
			type: Number,
			default: 0,
		},
		adult: {
			type: Number,
			default: 0,
		},
		movieName: String,
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

OrderSchema.index(
	{
		scheduleId: 1,
		"seats.row": 1,
		"seats.column": 1,
	},
	{
		unique: true,
	}
);

OrderSchema.statics.checkOrder = async function (st, schId) {
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

OrderSchema.pre("save", async function () {
	const schedule = await this.model("Schedule")
		.findById(this.scheduleId)
		.populate("movieId");

	if (schedule) this.movieName = schedule.movieId.movName;
	this.totalPrice =
		this.child * schedule.priceChild + this.adult * schedule.priceAdults;
	console.log("total Price", this.totalPrice);
});

module.exports = mongoose.model("Order", OrderSchema);
