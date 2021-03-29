const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
	movName: {
		type: String,
		required: [true, "Киноны нэрийг оруулна уу"],
		trim: true,
		maxlength: [100, "Киноны нэрны дээд тал 100 тэмдэгт байх ёстой"],
	},
	movAuthor: {
		type: String,
		required: [true, "Киноны зохиолчийг оруулна уу"],
		trim: true,
	},
	movDesc: {
		type: String,
		trim: true,
		required: [true, "Киноны тайлбарыг оруулна уу"],
		maxlength: [5000, "Тайлбарын дээд тал 5000 тэмдэгт байх ёстой"],
	},
	ageLimit: {
		type: Number,
		required: [true, "Киноны насны хязгаарыг оруулна уу"],
		min: [1, "Насны хязгаар буруу байна"],
	},
	createdDate: {
		type: Date,
		required: [true, "Киноны бүтсэн огноог оруулна уу"],
	},
	duration: {
		type: Number,
		required: [true, "Киноны үргэлжлэх хугацааг оруулна уу"],
	},
	averageRating: {
		type: Number,
		min: [1, "Рейтинг хамгийн багадаа 1 байх ёстой"],
		max: [10, "Райтиг хамгийн ихдээ 10 байх ёстой"],
	},
	photo: {
		type: String,
		default: "no-photo-user.jpg",
	},
	movGenre: {
		type: mongoose.Schema.ObjectId,
		ref: "Category",
		required: [true, "Киноны төрөлийг оруулна уу"],
	},
});

module.exports = mongoose.model("Movie", MovieSchema);
