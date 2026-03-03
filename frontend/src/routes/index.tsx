import { BrowserRouter, Route, Routes } from "react-router";
import { UserLayout } from "../layout/UserLayout";
import { Home } from "../pages/Admin/Home";
import { Products } from "../pages/Admin/Products";
import { EditProduct } from "../pages/Admin/EditProduct";
import { Login } from "../pages/Login";
import UserProvider from "../hook/auth";
import PrivateRoutes from "./PrivateRoutes";
import { AdminLayout } from "../layout/AdminLayout";
import { PublicProducts } from "../pages/PublicProducts";
import { ProductDetails } from "../pages/ProductDetails";

export const AppRoutes = () => {
	return (
		<UserProvider>
			<BrowserRouter>
				<Routes>
					<Route element={<UserLayout />}>
						<Route path="/" element={<PublicProducts />} />
						<Route path="/produto/:id" element={<ProductDetails />} />
					</Route>
					<Route element={<PrivateRoutes />}>
						<Route path="/admin" element={<AdminLayout/>}>
							<Route path="/admin/novo-produto" element={<Home />} />
							<Route path="/admin/ver-produtos" element={<Products />} />
							<Route path="/admin/editar-produto/:id" element={<EditProduct />} />
						</Route>
					</Route>
					<Route path="/entrar" element={<Login />} />
				</Routes>
			</BrowserRouter>
		</UserProvider>
	);
};
