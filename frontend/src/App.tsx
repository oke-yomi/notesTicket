import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/Dash/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Public />} />
				<Route path="login" element={<Login />} />

				{/* Protected routes: /dash */}
				<Route path="dash" element={<DashLayout />}>
					<Route index element={<Welcome />} />

					{/* notes route */}
					<Route path="notes">
						<Route index element={<NotesList />} />
					</Route>

					{/* users route */}
					<Route path="users">
						<Route index element={<UsersList />} />
					</Route>
				</Route>
				{/*  End of Protected routes: /dash */}
			</Route>
		</Routes>
	);
}

export default App;
