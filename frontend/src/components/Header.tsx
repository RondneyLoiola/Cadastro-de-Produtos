export const Header = () => {
	return (
		<header className="w-full p-4 bg-white border-b border-blue-100">
			<div className="flex items-center justify-between">
				<h2>ERP NEXUS</h2>

				<div className="flex items-center justify-center gap-4">
					<ul className="font-bold hover:text-gray-700">
						<a href="/">Novo Produto</a>
					</ul>
					<ul className="font-bold hover:text-gray-700 text-gray-400">
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
