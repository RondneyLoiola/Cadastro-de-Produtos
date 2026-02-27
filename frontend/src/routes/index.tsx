import { BrowserRouter, Route, Routes } from "react-router";
import { UserLayout } from "../layout/UserLayout";
import { Home } from "../pages/Admin/Home";
import { Products } from "../pages/Admin/Products";
import { Login } from "../pages/Login";
import UserProvider from "../hook/auth";
import PrivateRoutes from "./PrivateRoutes";
import { AdminLayout } from "../layout/AdminLayout";
import { PublicProducts } from "../pages/PublicProducts";

export const AppRoutes = () => {
	return (
		<UserProvider>
			<BrowserRouter>
				<Routes>
					<Route element={<UserLayout />}>
							<Route path="/" element={<PublicProducts />} />
						</Route>
					<Route element={<PrivateRoutes />}>
						<Route path="/admin" element={<AdminLayout/>}>
							<Route path="/admin/novo-produto" element={<Home />} />
							<Route path="/admin/ver-produtos" element={<Products />} />
						</Route>
					</Route>
					<Route path="/entrar" element={<Login />} />
				</Routes>
			</BrowserRouter>
		</UserProvider>
	);
};
