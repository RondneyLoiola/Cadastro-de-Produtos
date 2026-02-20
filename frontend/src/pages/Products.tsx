import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../services/api";
import { PriceConverter } from "../utils/priceConverter";

interface Product {
	id: string;
	name: string;
	price: number;
	description: string;
	quantity: number;
}

export const Products = () => {
	const navigate = useNavigate();
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		const getProducts = async () => {
			try {
				const { data } = await api.get("/products");
				setProducts(data);
				console.log("produtos na tela");
			} catch (error) {
				console.log(error);
			}
		};

		getProducts();
	}, []);

	return (
		<div>
			{products.map((product) => (
				<div key={product.id}>
					<p>{product.name}</p>
					<p>{PriceConverter(product.price)}</p>
					<p>{product.description}</p>
				</div>
			))}

			<button
				type="button"
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={() => {
					navigate("/");
				}}
			>
				Novo Produto
			</button>
		</div>
	);
};
