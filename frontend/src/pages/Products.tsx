import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { api } from "../services/api";

interface Category {
	id: string;
	name: string;
}

interface Product {
	id: string;
	name: string;
	price: number;
	description: string;
	quantity: number;
	category: Category;
	isActive: boolean;
	image: string;
}

export const Products = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	
	// Estados para os filtros
	const [searchName, setSearchName] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("");
	
	// Estado para produtos filtrados
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

	useEffect(() => {
		const getCategories = async () => {
			try {
				const { data } = await api.get("/categories");
				setCategories(data);
			} catch (error) {
				console.log(error);
			}
		};

		const getProducts = async () => {
			try {
				const { data } = await api.get("/products");
				console.log(data);
				setProducts(data);
				setFilteredProducts(data); // Inicializa com todos os produtos
			} catch (error) {
				console.log(error);
			}
		};

		getCategories();
		getProducts();
	}, []);

	// Função para aplicar os filtros
	const handleFilter = () => {
		let filtered = [...products];

		// Filtro por nome
		if (searchName.trim() !== "") {
			filtered = filtered.filter((product) =>
				product.name.toLowerCase().includes(searchName.toLowerCase())
			);
		}

		// Filtro por categoria
		if (selectedCategory !== "") {
			filtered = filtered.filter(
				(product) => product.category.id === selectedCategory
			);
		}

		// Filtro por status
		if (selectedStatus !== "") {
			const isActive = selectedStatus === "true";
			filtered = filtered.filter((product) => product.isActive === isActive);
		}

		setFilteredProducts(filtered);
	};

	// Função para limpar os filtros
	const handleClearFilters = () => {
		setSearchName("");
		setSelectedCategory("");
		setSelectedStatus("");
		setFilteredProducts(products);
	};

	return (
		<section className="container py-6 flex flex-col gap-4">
			{/* Pesquisas */}
			<div className="w-full">
				<div className="flex flex-col gap-2">
					<h1 className="md:text-4xl font-extrabold">Listagem de Produtos</h1>
					<p className="text-xl text-gray-500">
						Gerencie seu catálogo, preços e níveis de estoque em tempo real
					</p>
				</div>

				<div className="flex p-3 bg-white mt-4 rounded-xl border border-blue-200">
					<div className="w-full flex gap-6 items-center justify-center">
						<div className="w-full">
							<input
								placeholder="Pesquise pelo nome do produto"
								type="text"
								value={searchName}
								onChange={(e) => setSearchName(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleFilter()}
								className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						<select
							name="categories"
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="text-gray-900 bg-gray-50 border border-gray-300 px-2 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="">Todas Categorias</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>

						<select
							name="status"
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value)}
							className="text-gray-900 bg-gray-50 border border-gray-300 px-2 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="">Status</option>
							<option value="true">Ativo</option>
							<option value="false">Inativo</option>
						</select>

						<Button variant="primary" onClick={handleFilter}>
							Pesquisar
						</Button>
						
						<Button variant="secondary" onClick={handleClearFilters}>
							Limpar
						</Button>
					</div>
				</div>
			</div>

			{/* Exibição de resultados */}
			<div className="mt-2">
				<p className="text-gray-600">
					Exibindo {filteredProducts.length} de {products.length} produtos
				</p>
			</div>

			{/* Lista de produtos */}
			<div className="flex flex-wrap gap-4 mt-4">
				{filteredProducts.length > 0 ? (
					filteredProducts.map((product) => (
						<Card
							key={product.id}
							name={product.name}
							description={product.description}
							price={product.price}
							category={product.category.name}
							quantity={product.quantity}
							imageUrl={product.image}
							isActive={product.isActive}
						/>
					))
				) : (
					<div className="w-full text-center py-12">
						<p className="text-gray-500 text-lg">
							Nenhum produto encontrado com os filtros selecionados
						</p>
					</div>
				)}
			</div>
		</section>
	);
};