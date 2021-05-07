const mongoose = require("mongoose");

const RatesSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
	movieId: {
		type: mongoose.Schema.ObjectId,
		ref: "Movie",
		required: true,
	},
	value: {
		type: Number,
		max: [10, "Дундаж үнэлгээ хамгийн ихдээ 10 байх ёстой"],
		min: [0, "Дундаж үнэлгээ хамгийн багадаа 0 байх ёстой"],
	},
});

RatesSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model("Rates", RatesSchema);
