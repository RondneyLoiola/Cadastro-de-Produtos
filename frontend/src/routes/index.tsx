import { BrowserRouter, Route, Routes } from "react-router";

import { Home } from "../pages/Home";
import { Products } from "../pages/Products";

export const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/produtos" element={<Products />} />
			</Routes>
		</BrowserRouter>
	);
};
