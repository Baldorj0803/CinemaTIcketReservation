const mongoose = require("mongoose");

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
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Category", CategorySchema);
