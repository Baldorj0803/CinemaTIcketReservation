const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema(
	{
		movieId: {
			type: mongoose.Schema.ObjectId,
			ref: "Movie",
			required: true,
		},
		hallId: {
			type: mongoose.Schema.ObjectId,
			ref: "Hall",
			required: true,
		},
		staffId: {
			type: mongoose.Schema.ObjectId,
			ref: "Staff",
			required: true,
		},
		startTime: {
			type: Date,
			required: [true, "Эхлэх хугацааг оруулна уу"],
			default: Date.now(),
		},
		endTime: {
			type: Date,
			default: Date.now(),
		},
		priceAdults: {
			type: Number,
			required: [true, "Том хүний тасалбарын үнийг оруулна уу"],
		},
		priceChild: {
			type: Number,
			required: [true, "Хүүхдийн тасалбарын үнийг оруулна уу"],
		},
		branch: {
			type: String,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

ScheduleSchema.statics.checkSchedule = async function (start, end, hall) {
	const obj = await this.aggregate([
		{
			$match: {
				$and: [
					{ hallId: new mongoose.Types.ObjectId(hall) },

					{
						$or: [
							{
								startTime: {
									$gte: start,
									$lt: end,
								},
							},
							{
								endTime: {
									$gte: start,
									$lt: end,
								},
							},
						],
					},
				],
			},
		},
		{ $limit: 1 },
	]);
	return obj;
};

ScheduleSchema.statics.comingSoon = async function (limit, skip, monthSearch) {
	let now = new Date();
	now.setHours(now.getHours() + 8);

	console.log("Удахгүй гарах", now);

	const obj = await this.aggregate([
		{ $sort: { startTime: 1 } },
		{
			$group: {
				_id: "$movieId",
				count: {
					$sum: 1,
				},
				schedules: { $push: "$startTime" },
			},
		},
		{
			$project: {
				first: { $arrayElemAt: ["$schedules", 0] },
				month: { $month: { $arrayElemAt: ["$schedules", 0] } },
			},
		},
		{
			$match: {
				first: { $gte: now },
				month: { $in: monthSearch },
			},
		},
		{
			$lookup: {
				from: "movies",
				localField: "_id",
				foreignField: "_id",
				as: "movie",
			},
		},
		{
			$match: {
				movie: { $ne: [] },
			},
		},
		{
			$project: {
				movie: { $arrayElemAt: ["$movie", 0] },
			},
		},
		{
			$sort: {
				"movie.createdDate": 1,
			},
		},
		{ $skip: skip },
		{ $limit: limit },
	]);

	return obj;
};

ScheduleSchema.virtual("orders", {
	ref: "Order",
	localField: "_id",
	foreignField: "scheduleId",
	justOne: false,
});
ScheduleSchema.virtual("hall", {
	ref: "Hall",
	localField: "_id",
	foreignField: "scheduleId",
	justOne: false,
});

ScheduleSchema.pre("save", async function () {
	const resultHall = await this.model("Hall")
		.findById(this.hallId)
		.populate("branch");
	if (resultHall) this.branch = resultHall.branch.branchName;
});
ScheduleSchema.pre("remove", async function () {
	console.log("removing...");
	const r = await this.model("Order").deleteMany({ scheduleId: this._id });
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
