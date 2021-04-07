const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
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
	commentDesc: {
		type: String,
		required: [true, "Хоосон сэтгэгдэл байна"],
		trim: true,
	},
	writeDate: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Comment", CommentSchema);
