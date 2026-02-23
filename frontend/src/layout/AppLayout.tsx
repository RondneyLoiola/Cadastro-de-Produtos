import { Outlet } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const AppLayout = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="grow py-6 mt-16">
				<Outlet />
			</main>
			<Footer/>
		</div>
	);
};
