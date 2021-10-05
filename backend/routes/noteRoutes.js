const express = require("express");
const {
  getNotes,
  createNote,
  getNoteById,
  UpdateNote,
  deleteNote,
} = require("../controllers/noteControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getNotes); //Read API
router.route("/create").post(protect, createNote); //For creating notes
router
  .route("/:id")
  .get(getNoteById) //reading single note
  .put(protect, UpdateNote) //For updating notes
  .delete(protect, deleteNote); //For deleting notes

module.exports = router;
