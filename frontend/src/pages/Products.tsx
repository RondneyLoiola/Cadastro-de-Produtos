import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card, IsActive } from "../components/Card";
import { api } from "../services/api";

interface Category {
	id: number;
	name: string;
}
interface Product {
	id: string;
	name: string;
	price: number;
	description: string;
	quantity: number;
	category: Category;
	isActive: IsActive;
	image: string;
}

export const Products = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);

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
			} catch (error) {
				console.log(error);
			}
		};

		getCategories();
		getProducts();
	}, []);

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
								className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						<select
							name="categories"
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
							className="text-gray-900 bg-gray-50 border border-gray-300 px-2 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="">Status</option>
							<option value={IsActive.ATIVO}>{IsActive.ATIVO}</option>
							<option value={IsActive.INATIVO}>{IsActive.INATIVO}</option>
						</select>

						<Button variant="primary">Pesquisar</Button>
					</div>
				</div>
			</div>

			<div className="flex mt-4">
				{products.map((product) => (
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
				))}
			</div>
		</section>
	);
};
