const Note = require("../models/noteModel");
const asyncHandler = require("express-async-handler");

const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    res.status(400);
    throw new Error("Please fill all the fields");
  } else {
    const note = new Note({ user: req.user._id, title, content, category }); //New note created
    //its coming from middleware
    const createdNote = await note.save(); //we are saving this note into database

    res.status(201).json(createdNote); //it will send back the created note
  }
});

const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id); //we have put :id in noteRoutes,we are getting it from there
  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ message: "Note not found" });
  }
});

const UpdateNote = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  const note = await Note.findById(req.params.id);

  if (note.user.toString() !== req.user._id.toString()) {
    //comparing the user we want to update and currently loggedin user
    res.status(401);
    throw new Error("You can't perform this action");
  }
  if (note) {
    //if note exists of the particular id then perform update
    note.title = title;
    note.content = content;
    note.category = category;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.json(404);
    throw new Error("Note not found");
  }
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You can't perform this action");
  }

  if (note) {
    await note.remove();
    res.json({ message: "Note removed" });
  } else {
    res.json(404);
    throw new Error("Note not found");
  }
});

module.exports = { getNotes, createNote, getNoteById, UpdateNote, deleteNote };
