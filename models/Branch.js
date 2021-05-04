const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema(
	{
		branchName: {
			type: String,
			unique: true,
			required: [true, "Салбарын нэрийг оруулна уу"],
			trim: true,
			maxlength: [50, "Салбарын нэрний урт дээд тал нь 50 тэмдэгт байх ёстой"],
		},
		branchAddress: {
			type: String,
			maxlength: [500, "Салбарын байршилын дээд урт 500 тэмдэгт байх ёстой"],
			trim: true,
		},
		branchPhoneNumber: {
			type: Number,
			min: [5, "Дугаар багадаа ихдээ 5 тэмдэг байна"],
		},
		photo: {
			type: String,
			default: "no-photo-branch.jpg",
		},
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

BranchSchema.virtual("halls", {
	ref: "Hall",
	localField: "_id",
	foreignField: "branch",
	justOne: false,
});

BranchSchema.pre("remove", async function (next) {
	await this.model("Hall").deleteMany({ branch: this._id });
	next();
});

module.exports = mongoose.model("Branch", BranchSchema);
