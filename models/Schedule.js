const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
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
	},
	endTime: {
		type: Date,
	},
	priceAdults: {
		type: Number,
		required: [true, "Том хүний тасалбарын үнийг оруулна уу"],
	},
	priceChild: {
		type: Number,
		required: [true, "Хүүхдийн тасалбарын үнийг оруулна уу"],
	},
});

ScheduleSchema.statics.checkSchedule = async function (start, end, hall) {
	console.log(hall);
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

module.exports = mongoose.model("Schedule", ScheduleSchema);
