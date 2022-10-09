import User from "../models/UserModel.js";
import Note from "../models/NoteModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

// @desc Get all users
// @route GET /users
// @access Private
export const getAllUsers = asyncHandler(
	async (req, res) => {
		const users = await User.find()
			.select("-password")
			.lean();

		if (!users?.length) {
			return res
				.status(400)
				.json({ message: "No users found" });
		}

		res.json({
			status: "success",
			count: users.length,
			users,
		});
	}
);

// @desc Create new user
// @route POST /users
// @access Private
export const createNewUser = asyncHandler(
	async (req, res) => {
		const { username, password, roles } = req.body;

		// confirm all fields are filled
		if (
			!username ||
			!password ||
			!Array.isArray(roles) ||
			!roles.length
		) {
			return res
				.status(400)
				.json({ message: "All fields are required" });
		}

		// check for duplicates
		const duplicate = await User.findOne({ username })
			.lean()
			.exec();

		if (duplicate) {
			return res
				.status(409)
				.json({ message: "Duplicate username" });
		}

		// Hash password
		const hashedPwd = await bcrypt.hash(password, 10);

		const userObject = {
			username,
			password: hashedPwd,
			roles,
		};

		// create and store new user
		const user = await User.create(userObject);

		if (user) {
			// user created successfully
			res.status(201).json({
				message: `New user ${username} created`,
			});
		} else {
			res.status(400).json({
				message: `Invalid user data recieved`,
			});
		}
	}
);

// @desc Update a user
// @route PATCH /users
// @access Private
export const updateUser = asyncHandler(
	async (req, res) => {
		const { id, username, password, roles, active } =
			req.body;

		// confirm all fields are filled
		if (
			!id ||
			!username ||
			!Array.isArray(roles) ||
			!roles.length ||
			typeof active !== "boolean"
		) {
			return res
				.status(400)
				.json({ message: "All fields are required" });
		}

		const user = await User.findById(id).exec();

		if (!user) {
			return res
				.status(400)
				.json({ message: "User not found" });
		}

		// check for duplicate
		const duplicate = await User.findOne({ username })
			.lean()
			.exec();

		// allow updates to original user
		if (
			duplicate &&
			duplicate?._id.toString() !== id
		) {
			return res
				.status(409)
				.json({ message: `Duplicate username` });
		}

		user.username = username;
		user.roles = roles;
		user.active = active;

		if (password) {
			// hash password
			user.password = await bcrypt.hash(password, 10);
		}

		const updatedUser = await user.save();

		res.json({
			message: `${updatedUser.username} updated`,
		});
	}
);

// @desc Delete a user
// @route DELETE /users
// @access Private
export const deleteUser = asyncHandler(
	async (req, res) => {
		const { id } = req.body;

		if (!id) {
			return res
				.status(400)
				.json({ message: "User ID is required" });
		}

		// check if user has notes
		const note = await Note.findOne({ user: id })
			.lean()
			.exec();

		if (note) {
			return res
				.status(400)
				.json({ message: "User has assigned notes" });
		}

		const user = await User.findById(id).exec();

		if (!user) {
			return res
				.status(400)
				.json({ message: "User not found" });
		}

		const result = await user.deleteOne();

		const reply = `Username ${result.username} with ID ${result.id} deleted`;

		res.json(reply);
	}
);
