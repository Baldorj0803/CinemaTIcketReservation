const express = require("express");
const router = express.Router();

const {
	getHalls,
	getHall,
	createHall,
	updateHall,
	deleteHall,
} = require("../controller/halls");

// api/v1/halls
router.route("/").get(getHalls).post(createHall);

//  api/v1/hall/:id
router.route("/:id").get(getHall).put(updateHall).delete(deleteHall);

module.exports = router;
