import User from "../models/UserModel.js";
import Note from "../models/NoteModel.js";
import asyncHandler from "express-async-handler";

// @desc Get all notes
// @route GET /notes
// @access Private
export const getAllNotes = asyncHandler(
	async (req, res) => {
		const notes = await Note.find().lean();

		if (!notes?.length) {
			return res
				.status(400)
				.json({ message: "No Notes found" });
		}

		// Add username to each note before sending the response
		// You could also do this with a for...of loop
		const notesWithUser = await Promise.all(
			notes.map(async (note) => {
				const user = await User.findById(note.user)
					.lean()
					.exec();
				return { ...note, username: user.username };
			})
		);

		res.json({
			status: "success",
			count: notesWithUser.length,
			notesWithUser,
		});
	}
);

// @desc Create new note
// @route POST /notes
// @access Private
export const createNewNote = asyncHandler(
	async (req, res) => {
		const { user, title, text } = req.body;

		// confirm all fields are filled
		if (!user || !title || !text) {
			return res
				.status(400)
				.json({ message: "All fields are required" });
		}

		// check for duplicates
		const duplicate = await User.findOne({ title })
			.lean()
			.exec();

		if (duplicate) {
			return res
				.status(409)
				.json({ message: "Duplicate username" });
		}
		1;

		const noteObject = {
			user,
			title,
			text,
		};

		// create and store new note
		const note = await Note.create(noteObject);

		if (note) {
			// user created successfully
			res.status(201).json({
				message: `New note ${title} created`,
			});
		} else {
			res.status(400).json({
				message: `Invalid note data recieved`,
			});
		}
	}
);

// @desc Update a note
// @route PATCH /notes
// @access Private
export const updateNote = asyncHandler(
	async (req, res) => {
		const { id, user, title, text, completed } =
			req.body;

		if (
			!id ||
			!user ||
			!title ||
			!text ||
			typeof completed !== "boolean"
		) {
			return res
				.status(400)
				.json({ message: "All fields are required" });
		}

		const note = Note.findById(id).exec();

		if (!note) {
			return res
				.status(400)
				.json({ message: "Note not found" });
		}

		// check for duplicate
		const duplicate = await Note.findOne({ title })
			.lean()
			.exec();

		// allow updates to original note
		if (
			duplicate &&
			duplicate?._id.toString() !== id
		) {
			return res
				.status(409)
				.json({ message: `Duplicate note title` });
		}

		note.user = user;
		note.title = title;
		note.text = text;
		note.completed = completed;

		const updatedNote = await note.save();

		res.json({
			message: `${updatedNote.title} updated`,
		});
	}
);

// @desc Delete a note
// @route DELETE /notes
// @access Private
export const deleteNote = asyncHandler(
	async (req, res) => {
		const { id } = req.body;

		// Confirm data
		if (!id) {
			return res
				.status(400)
				.json({ message: "Note ID is required" });
		}

		// Check if notes exist to delete
		const note = await Note.findById(id).exec();

		if (!note) {
			return res
				.status(400)
				.json({ message: "Note not found" });
		}

		const result = await note.deleteOne();

		const reply = `Note ${result.title} with ID ${result.id} deleted`;

		res.json(reply);
	}
);
