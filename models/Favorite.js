const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
	movieId: {
		type: mongoose.Schema.ObjectId,
		ref: "Movie",
		required: true,
	},
	userId: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		default: Date.now,
	},
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
