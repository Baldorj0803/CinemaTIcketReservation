const Category = require("../models/Category");
const MyError = require("../utils/myError");
// const asyncHandler = require("../middleware/asyncHandler");
const asyncHandler = require("express-async-handler");

exports.getCategories = asyncHandler(async (req, res, next) => {
	const select = req.query.select;
	delete req.query.select;

	const sort = req.query.sort;
	delete req.query.sort;

	const categories = await Category.find(req.query, select).sort(sort);
	res.status(200).json({
		success: true,
		data: categories,
	});
});

exports.getCategory = asyncHandler(async (req, res, next) => {
	const category = await Category.findById(req.params.id).populate("movies");

	if (!category) {
		throw new MyError(req.params.id + " ID-тэй категори байхгүй!", 400);
	}

	res.status(200).json({
		success: true,
		data: category,
	});
});

exports.createCategory = asyncHandler(async (req, res, next) => {
	const category = await Category.create(req.body);

	res.status(200).json({
		success: true,
		data: category,
	});
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
	const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!category) {
		throw new MyError(req.params.id + " ID-тэй категори байхгүйээээ.", 400);
	}

	res.status(200).json({
		success: true,
		data: category,
	});
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
	const category = await Category.findByIdAndDelete(req.params.id);

	if (!category) {
		throw new MyError(req.params.id + " ID-тэй категори байхгүйээээ.", 400);
	}

	res.status(200).json({
		success: true,
		data: req.params.id + " ID-тэй категори устгагдлаа",
	});
});
