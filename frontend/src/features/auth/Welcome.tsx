import { Link } from "react-router-dom";

const Welcome = () => {
	const date: Date = new Date();
	const today: String = new Intl.DateTimeFormat(
		"en-GB",
		{
			dateStyle: "full",
			timeStyle: "long",
		}
	).format(date);

	return (
		<section className="welcome">
			<p>{today}</p>

			<h1>Welcome!</h1>

			<p>
				<Link to="/dash/notes">View techNotes</Link>
			</p>

			<p>
				<Link to="/dash/users">
					View User Settings
				</Link>
			</p>
		</section>
	);
};

export default Welcome;
