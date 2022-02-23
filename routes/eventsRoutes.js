const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvents,
  updateEvents,
  deleteEvents,
  sendEmail,
} = require("../controllers/eventsControllers");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/home")
  .get(getEvents)
  .post(protect, authorize("publisher"), createEvents);
// .get("/email/:id", sendEmail);

router
  .route("/home/:id")
  .get(getEvent)
  .put(protect, authorize("publisher"), updateEvents)
  .delete(protect, authorize("publisher"), deleteEvents);

module.exports = router;
