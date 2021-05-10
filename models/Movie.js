const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
	{
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
			type: Number,
			required: [true, "Киноны бүтсэн огноог оруулна уу"],
		},
		duration: {
			type: Number,
			required: [true, "Киноны үргэлжлэх хугацааг оруулна уу"],
		},
		photo: {
			type: String,
			default: "no-photo-movie.jpg",
		},
		movGenre: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Category",
				required: [true, "Киноны төрөлийг оруулна уу"],
			},
		],

		rateCount: {
			type: Number,
			default: 0,
		},
		rateValue: {
			type: Number,
			default: 0,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

MovieSchema.virtual("schedules", {
	ref: "Schedule",
	localField: "_id",
	foreignField: "movieId",
	justOne: false,
});
MovieSchema.virtual("category", {
	ref: "Category",
	localField: "movGenre",
	foreignField: "_id",
	justOne: false,
	select: "name",
});

MovieSchema.statics.total = async function (start, end, search) {
	const obj = await this.aggregate([
		{
			$match: {
				movName: { $regex: search, $options: "$i" },
			},
		},
		{
			$lookup: {
				from: "schedules",
				localField: "_id",
				foreignField: "movieId",
				as: "schedules",
			},
		},
		{
			$match: {
				schedules: { $ne: [] },
			},
		},
		{
			$unwind: {
				path: "$schedules",
			},
		},
		{
			$match: {
				$and: [
					{
						"schedules.startTime": { $gte: start },
					},
					{
						"schedules.startTime": { $lt: end },
					},
				],
			},
		},

		{
			$group: { _id: "$_id", count: { $sum: 1 } },
		},
		{
			$group: { _id: null, count: { $sum: 1 } },
		},
	]);

	if (obj.length !== 0) {
		return obj[0].count;
	} else {
		return 0;
	}
};

MovieSchema.statics.nowPlaying = async function (
	limit,
	skip,
	start,
	end,
	search,
	caterogy
) {
	console.log("Одоо гарч буй", start, end);
	let cat = [];

	caterogy.map((c) => cat.push(new mongoose.Types.ObjectId(c._id ? c._id : c)));

	console.log("search", search);
	console.log("category", cat);

	const obj = await this.aggregate([
		{
			$match: {
				movName: { $regex: search, $options: "$i" },
				movGenre: {
					$in: cat,
				},
			},
		},
		{
			$lookup: {
				from: "schedules",
				localField: "_id",
				foreignField: "movieId",
				as: "schedules",
			},
		},
		{
			$match: {
				schedules: { $ne: [] },
			},
		},
		{
			$unwind: {
				path: "$schedules",
			},
		},
		{
			$sort: {
				"schedules.startTime": 1,
			},
		},
		{
			$match: {
				$and: [
					{
						"schedules.startTime": { $gte: start },
					},
					{
						"schedules.startTime": { $lt: end },
					},
				],
			},
		},

		{
			$lookup: {
				from: "halls",
				localField: "schedules.hallId",
				foreignField: "_id",
				as: "hall",
			},
		},
		{
			$addFields: {
				"schedules.hall": { $first: "$hall" },
			},
		},
		{
			$lookup: {
				from: "branches",
				localField: "schedules.hall.branch",
				foreignField: "_id",
				as: "branch",
			},
		},
		{
			$addFields: {
				"schedules.branch": { $first: "$branch" },
			},
		},

		{
			$group: {
				_id: "$_id",
				photo: { $first: "$photo" },
				movName: { $first: "$movName" },
				movAuthor: { $first: "$movAuthor" },
				duration: { $first: "$duration" },
				createdDate: { $first: "$createdDate" },
				ageLimit: { $first: "$ageLimit" },
				movDesc: { $first: "$movDesc" },
				movGenre: { $first: "$movGenre" },
				schedules: { $push: "$schedules" },
			},
		},

		{
			$sort: {
				movName: 1,
			},
		},
		{
			$skip: skip,
		},
		{
			$limit: limit,
		},
	]);

	return obj;
};

MovieSchema.pre("remove", async function (next) {
	await this.model("Schedule").deleteMany({ movieId: this._id });
	await this.model("Rates").deleteMany({ movieId: this._id });
	next();
});

module.exports = mongoose.model("Movie", MovieSchema);
