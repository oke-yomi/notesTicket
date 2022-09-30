import express from "express";
import path from "path";
// import dotenv from 'dotenv';
// import morgan from 'morgan';
import rootRoutes from "./routes/root.js";

const app = express();

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

app.use(express.json());

const __dirname = path.resolve();

app.use(
	"/",
	express.static(path.join(__dirname, "public"))
);

app.use("/", rootRoutes);

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
	if (err) console.log(err);
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
	);
});
