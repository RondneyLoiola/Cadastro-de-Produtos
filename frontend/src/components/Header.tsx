import { useLocation } from "react-router";

export const Header = () => {
	const {pathname} = useLocation();

	return (
		<header className="w-full p-4 bg-white border-b border-blue-100">
			<div className="flex items-center justify-between">
				<h2>ERP NEXUS</h2>

				<div className="flex items-center justify-center gap-4">
					<ul className={`${pathname === '/' ? 'font-bold text-blue-500' : 'text-gray-500'} font-bold hover:text-gray-700`}>
						<a href="/">Novo Produto</a>
					</ul>
					<ul className={`${pathname === '/produtos' ? 'font-bold text-blue-500' : 'text-gray-500'} font-bold hover:text-gray-700`}>
						<a href="/produtos">Ver Produtos</a>
					</ul>
				</div>

				<div>
					<div className="w-10 h-10 bg-gray-300 rounded-full" />
				</div>
			</div>
		</header>
	);
};
