import express from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import {
	noteRoutes,
	rootRoutes,
	userRoutes,
} from "./routes/index.js";
import {
	errorHandler,
	notFound,
} from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/allowedCorsOrigins.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();
const app = express();

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

const __dirname = path.resolve();

app.use(
	"/",
	express.static(path.join(__dirname, "public"))
);

app.use("/", rootRoutes);
app.use("/users", userRoutes);
app.use("/notes", noteRoutes);

app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(
			path.join(__dirname, "views", "404.html")
		);
	} else if (req.accepts("json")) {
		res.json({
			message: "404 Not found",
			status: 404,
		});
	} else {
		res.type("txt").send("404 Not Found");
	}
});

//ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
	if (err) console.log(err);
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
	);
});
