import { Outlet } from "react-router";
import { Header } from "../components/Header";

export const AppLayout = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="grow py-6">
				<Outlet />
			</main>
			{/* <Footer/> */}
		</div>
	);
};
