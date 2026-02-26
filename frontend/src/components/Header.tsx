import { useLocation } from "react-router";
import { useState } from "react";
import { useUser } from "../hook/auth";
import { LogOut } from "lucide-react";

export const Header = () => {
	const { pathname } = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { userInfo,logout } = useUser();

	const handleLogout = () => {
		try	{
			logout();
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<header className="fixed w-full p-4 bg-white border-b border-blue-100 z-50">
			<div className="flex items-center justify-between">
				<h2 className="flex items-center gap-2 font-bold cursor-pointer">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="30" height="30">
						<rect x="10" y="60" width="30" height="30" fill="#2196F3"/>
						<rect x="40" y="30" width="30" height="60" fill="#2196F3"/>
						<rect x="70" y="10" width="30" height="80" fill="#2196F3"/>
					</svg>
					ERP NEXUS
				</h2>

				{/* Botão hamburger - visível apenas no mobile */}
				<button
					className="md:hidden p-2"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					aria-label="Menu"
				>
					{isMenuOpen ? (
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="3" y1="12" x2="21" y2="12"></line>
							<line x1="3" y1="6" x2="21" y2="6"></line>
							<line x1="3" y1="18" x2="21" y2="18"></line>
						</svg>
					)}
				</button>

				{/* Menu de navegação - desktop */}
				<div className="hidden md:flex items-center justify-center gap-4">
					<ul
						className={`${pathname === "/" ? "font-bold text-blue-500" : "text-gray-500"} font-bold hover:text-gray-700`}
					>
						<a href="/">Novo Produto</a>
					</ul>
					<ul
						className={`${pathname === "/produtos" ? "font-bold text-blue-500" : "text-gray-500"} font-bold hover:text-gray-700`}
					>
						<a href="/produtos">Ver Produtos</a>
					</ul>
				</div>

				{/* Avatar - visível apenas no desktop */}
				<div className="hidden md:flex md:items-end md:justify-center md:gap-2">
					<div className="flex flex-col gap-1 items-end">
						<h3>{userInfo?.name}</h3>
						<span className="text-xs font-bold text-gray-500">{userInfo?.isAdmin ? "Administrador" : "Usuário"}</span>
					</div>
					<button type="button" className="bg-red-200 p-2 rounded-full text-red-500" onClick={handleLogout}><LogOut/></button>
				</div>
			</div>

			{/* Menu mobile - shown when isMenuOpen is true */}
			{isMenuOpen && (
				<div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
					<ul className="flex flex-col gap-4">
						<li>
							<a 
								href="/" 
								className={`block py-2 ${pathname === "/" ? "font-bold text-blue-500" : "text-gray-500"} font-bold hover:text-gray-700`}
								onClick={() => setIsMenuOpen(false)}
							>
								{userInfo?.isAdmin === true ? "Novo Produto" : ""}
							</a>
						</li>
						<li>
							<a 
								href="/produtos" 
								className={`block py-2 ${pathname === "/produtos" ? "font-bold text-blue-500" : "text-gray-500"} font-bold hover:text-gray-700`}
								onClick={() => setIsMenuOpen(false)}
							>
								{userInfo?.isAdmin ? "Ver Produtos" : "Produtos"}
							</a>
						</li>
						<div className="border-t bg-gray-50 border-blue-200 flex flex-col items-center gap-2 py-2">
							<div className="text-center">
								<h3>{userInfo?.name}</h3>
								<span className="text-xs font-bold text-gray-500">{userInfo?.isAdmin ? "Administrador" : ""}</span>
							</div>
							<button type="button" className="flex gap-2 bg-red-200 p-2 rounded-lg text-red-500" onClick={handleLogout}><LogOut/> Sair</button>
						</div>
					</ul>
				</div>
			)}
		</header>
	);
};
