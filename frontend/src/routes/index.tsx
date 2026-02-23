import { BrowserRouter, Route, Routes } from "react-router";
import { AppLayout } from "../layout/AppLayout";
import { Home } from "../pages/Home";
import { Products } from "../pages/Products";
import { Register } from "../pages/Register";
import { Login } from "../pages/Login";
import UserProvider from "../hook/auth";
import PrivateRoutes from "./PrivateRoutes";

export const AppRoutes = () => {
	return (
		<UserProvider>
			<BrowserRouter>
				<Routes>
					<Route element={<PrivateRoutes />}>
						<Route element={<AppLayout />}>
							<Route path="/" element={<Home />} />
							<Route path="/produtos" element={<Products />} />
						</Route>
					</Route>
					<Route path="/cadastro" element={<Register />} />
					<Route path="/entrar" element={<Login />} />
				</Routes>
			</BrowserRouter>
		</UserProvider>
	);
};
