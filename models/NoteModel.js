import mongoose from "mongoose";
// import AutoIncrementFactory from "mongoose-sequence";
// const connection = "mongodb://localhost:5000";
// const AutoIncrement =
// 	AutoIncrementFactory(connection);

const noteSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		completed: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// noteSchema.plugin(AutoIncrement, {
// 	inc_field: "ticket",
// 	id: "ticketNums",
// 	start_seq: 300,
// });

const Note = mongoose.model("Note", noteSchema);
export default Note;
