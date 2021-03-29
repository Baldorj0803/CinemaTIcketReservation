const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const CategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Категорийн нэрийг оруулна уу"],
			unique: true,
			trim: true,
			maxlength: [50, "Нэрний урт дээд тал нь 50 тэмдэгт байх ёстой"],
		},
		description: {
			type: String,
			required: [true, "Категорийн тайлбарыг оруулна уу"],
			maxlength: [50, "Тайлбарын урт дээд тал нь 500 тэмдэгт байх ёстой"],
		},
		photo: {
			type: String,
			default: "no-photo.jpg",
		},
		averageRating: {
			type: Number,
			min: [1, "Рейтинг хамгийн багадаа 1 байх ёстой"],
			max: [10, "Райтиг хамгийн ихдээ 10 байх ёстой"],
		},
		averagePrice: Number,
		createdAt: {
			type: Date,
			default: Date.now,
		},
		slug: String,
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CategorySchema.virtual("movies", {
	ref: "Movie",
	localField: "_id",
	foreignField: "movGenre",
	justOne: false,
});

CategorySchema.pre("save", function (next) {
	this.slug = slugify(this.name);
	this.averageRating = Math.floor(Math.random() * 10) + 1;
	this.averagePrice = Math.floor(Math.random() * 100000) + 3000;
	next();
});

module.exports = mongoose.model("Category", CategorySchema);
