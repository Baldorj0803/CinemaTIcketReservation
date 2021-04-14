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

// Тун удахгүй гарах киног аггрегате ашиглан шүүх
//     -------Хураахад эхэнд гарах учир доод функцийн толгойг эхэнд тавив
// Одоо гарч буй киног аггрегате ашиглан шүүх
// ScheduleSchema.statics.nowmovies = async function (limit, skip) {
// 	let now = new Date();
// 	now.setHours(now.getHours() + 8);

// 	let start = new Date(new Date(now).setHours(00, 00, 00));
// 	let end = new Date(new Date(now).setHours(23, 59, 59));
// 	start.setHours(start.getHours() + 8);
// 	end.setHours(end.getHours() + 8);

// 	console.log("Одоо гарч буй", start, end);

// 	const obj = await this.aggregate([
// 		{
// 			$match: {
// 				startTime: {
// 					$gte: start,
// 					$lt: end,
// 				},
// 			},
// 		},
// 		{
// 			$group: {
// 				_id: "$movieId",
// 				count: {
// 					$sum: 1,
// 				},
// 				schedules: { $push: "$startTime" },
// 			},
// 		},
// 		{
// 			$lookup: {
// 				from: "movies",
// 				localField: "_id",
// 				foreignField: "_id",
// 				as: "movie",
// 			},
// 		},
// 		{
// 			$project: {
// 				movie: { $arrayElemAt: ["$movie", 0] },
// 				schedules: 1,
// 			},
// 		},

// 		{
// 			$sort: {
// 				"movie.movName": 1,
// 			},
// 		},
// 		{
// 			$limit: limit,
// 		},
// 		{
// 			$skip: skip,
// 		},
// 	]);
// 	return obj;
// };

ScheduleSchema.statics.comingSoon = async function (limit, skip) {
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
			},
		},
		{
			$match: {
				first: { $gte: now },
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
			$project: {
				movie: { $arrayElemAt: ["$movie", 0] },
			},
		},
		{
			$sort: {
				"movie.movieName": 1,
			},
		},
		{
			$limit: limit,
		},
		{
			$skip: skip,
		},
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

module.exports = mongoose.model("Schedule", ScheduleSchema);
