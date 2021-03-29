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
	date: {
		type: Date,
		default: Date.now,
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

module.exports = mongoose.model("Schedule", ScheduleSchema);
