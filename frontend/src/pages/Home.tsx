/** biome-ignore-all lint/correctness/useExhaustiveDependencies: useEffect */

import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
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
}

export const Home = () => {
	const navigate = useNavigate();
	const [categories, setCategories] = useState<Category[]>([]);
	const [_products, setProducts] = useState<Product[]>([]);

	const schema = z.object({
		name: z.string().min(1, "Coloque o nome do produto"),
		description: z.string().min(1, "Coloque a descrição do produto"),
		image: z.string(),
		price: z.coerce
			.number()
			.positive("Preço do produto precisa ser maior que zero"),
		quantity: z.coerce.number().positive("Quantidade precisa ser maior que zero"),
		category: z.string().min(1, "Categoria é obrigatória"),
	});

	const getCategories = async () => {
		try {
			const { data } = await api.get("/categories");
			setCategories(data);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getCategories();
	}, []);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.input<typeof schema>>({
		resolver: zodResolver(schema),
	});

	const newProduct = async () => {
		// try {
		// 	const { data } = await api.post("/products");
		// 	setProducts(data);
		// 	console.log(data);
		// } catch (error) {
		// 	console.log(error);
		// }

		console.log('certo')
	};

	return (
		<section className="w-full h-full bg-gray-100">
			<div className="flex items-center justify-center min-h-screen">
				<div className="mx-auto py-8 p-4">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-semibold text-gray-900 mb-2">
							Cadastre um novo produto
						</h1>
						<p className="text-sm text-gray-500">
							Preencha os detalhes essenciais para adicionar um novo item.
						</p>
					</div>

					<form className="space-y-6">
						<Input
							label="Nome do Produto"
							placeholder="Nome do Produto"
							type="text"
							{...register("name")}
						/>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									className="block text-sm font-medium text-gray-900 mb-2"
									htmlFor="categoria"
								>
									Categoria
								</label>
								<select
									{...register("category")}
									id="categoria"
									className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									<option value="">Selecione uma categoria</option>
									{categories.map((category) => (
										<option key={category.id} value={category.name}>
											{category.name}
										</option>
									))}
								</select>
							</div>

							<Input
								label="SKU / Referência"
								placeholder="SKU-10293"
								type="text"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<Input
								label="Preço da unidade"
								placeholder="R$ 0,00"
								type="text"
								{...register("price")}
							/>
							<Input
								label="Quantidade no estoque"
								placeholder="0"
								type="number"
								{...register("quantity")}
							/>
						</div>

						<div className="flex items-center justify-between pt-2">
							<div className="flex items-center gap-8">
								<div className="flex items-center gap-3">
									<label
										htmlFor="status"
										className="text-sm font-medium text-gray-900"
									>
										Status
									</label>
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											id="status"
											className="sr-only peer"
											defaultChecked
										/>
										<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.56 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
									</label>
								</div>
							</div>

							<button
								type="button"
								className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
							>
								<Image />
								Adicionar Imagem
							</button>
						</div>

						<div className="flex gap-4 pt-4">
							<Button
								variant="primary"
								type="submit"
								onClick={newProduct}
							>
								Salvar Produto
							</Button>
							<Button
								variant="secondary"
								type="reset"
							>
								Cancelar
							</Button>
						</div>
						<div className="flex items-center justify-center">
							<button
								className="text-blue-700 hover:text-blue-600 hover:underline"
								type="button"
								onClick={() => navigate("/produtos")}
							>
								Ver Produtos
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
};
