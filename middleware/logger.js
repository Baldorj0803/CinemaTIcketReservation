module.exports = (req, res, next) => {
	console.log(
		`${req.method} ${req.protocol}://${req.hostname}${req.originalUrl}`.yellow
			.underline
	);
	next();
};
