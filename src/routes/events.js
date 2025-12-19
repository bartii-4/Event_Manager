const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.get("/", eventController.list);

router.get("/new", eventController.showCreate);
router.post("/", eventController.create);

router.get("/:id", eventController.detail);

router.get("/:id/edit", eventController.showEdit);
router.post("/:id/edit", eventController.update);

router.post("/:id/delete", eventController.remove);

module.exports = router;
