import { BrowserRouter, Route, Routes } from "react-router";
import { AppLayout } from "../layout/AppLayout";
import { Home } from "../pages/Home";
import { Products } from "../pages/Products";

export const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<AppLayout />}>
					<Route path="/" element={<Home />} />
					<Route path="/produtos" element={<Products />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};
