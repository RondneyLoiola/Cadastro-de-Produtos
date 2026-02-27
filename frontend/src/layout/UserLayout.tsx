import { Outlet } from "react-router";
import { Footer } from "../components/Footer";

export const UserLayout = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="grow py-6 mt-16">
				<Outlet />
			</main>
			<Footer/>
		</div>
	);
};
