import express from "express";
import {
	createNewNote,
	deleteNote,
	getAllNotes,
	updateNote,
} from "../controllers/noteController.js";

const router = express.Router();

router
	.route("/")
	.get(getAllNotes)
	.post(createNewNote)
	.patch(updateNote)
	.delete(deleteNote);

export default router;
