/** biome-ignore-all lint/correctness/useExhaustiveDependencies: useEffect */

//TODO: revisar backend
//TODO: fazer footer
//TODO: fazer zod
//TODO: fazer página de produtos
//TODO: fazer as funções para criar produto

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
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
	const _navigate = useNavigate();
	const [categories, setCategories] = useState<Category[]>([]);
	const [_products, _setProducts] = useState<Product[]>([]);

	const schema = z.object({
		name: z.string().min(1, "Coloque o nome do produto"),
		description: z.string().min(1, "Coloque a descrição do produto"),
		image: z.string(),
		price: z.coerce
			.number()
			.positive("Preço do produto precisa ser maior que zero"),
		quantity: z.coerce
			.number()
			.positive("Quantidade precisa ser maior que zero"),
		category: z.string().min(1, "Categoria é obrigatória"),
		isActive: z.boolean().default(true),
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

		console.log("certo");
	};

	return (
		<section className="container py-6">
			<div className="w-full">
				<div className="flex flex-col gap-2">
					<h1 className="md:text-4xl font-extrabold">Cadastrar Produto</h1>
					<p className="text-xl text-gray-500">
						Preencha as informações necessárias para cadastrar o produto
					</p>
				</div>

				<form
					onSubmit={handleSubmit(newProduct)}
					className="flex items-start gap-4 mt-6 w-8xl"
				>
					{/* Lado Esquerdo */}
					<div className="w-[70%] flex flex-col items-left justify-center gap-4 px-6 py-4 bg-white border border-blue-100 rounded-xl">
						<div className="flex flex-col gap-6">
							<div className="pb-2 border-b border-gray-200 mb-2">
								<h2 className="text-2xl font-bold p-2">Informações básicas</h2>
							</div>

							<Input
								placeholder="Nome do produto"
								label="Nome do produto"
								type="text"
								{...register("name")}
							/>
							<div className="flex flex-col gap-2">
								<label
									htmlFor="category"
									className="block font-bold text-gray-700"
								>
									Categoria
								</label>
								<select
									name="category"
									className="text-gray-900 bg-white border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									<option value="">Selecione uma categoria</option>
									{categories.map((category) => (
										<option key={category.id} value={category.id}>
											{category.name}
										</option>
									))}
								</select>
							</div>

							<div className="w-full flex items-center justify-between gap-4">
								<div className="w-1/2">
									<Input
										placeholder="R$ 0,00"
										label="Preço do produto"
										type="number"
										{...register("price")}
									/>
								</div>
								<div className="w-1/2">
									<Input
										placeholder="0"
										label="Quantidade em estoque"
										type="number"
										{...register("quantity")}
									/>
								</div>
							</div>

							<div className="w-full flex flex-col gap-2">
								<label
									htmlFor="description"
									className="block font-bold text-gray-700"
								>
									Descrição do Produto
								</label>
								<textarea
									placeholder="Insira as especificações técnicas detalhadas do produto"
									className="w-full h-32 text-gray-900 bg-white border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									name="description"
								></textarea>
							</div>
						</div>
					</div>

					{/* Lado Direito */}
					<div className="w-[30%] max-h-full flex flex-col items-left gap-6">
						<div className="flex flex-col gap-4 bg-white px-6 py-4 border border-blue-100 rounded-xl">
							<h2 className="text-2xl font-bold">Imagem do Produto</h2>
							<div className="w-full h-56 bg-gray-200 rounded-xl border border-blue-100" />
						</div>

						<div className="flex flex-col gap-4 bg-white p-6 border border-blue-100 rounded-xl">
							<h2 className="text-2xl font-bold">Configurações</h2>
							<div className="flex items-center justify-between">
								<label htmlFor="status" className="">
									Produto Ativo
								</label>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										className="sr-only peer"
										type="checkbox"
										value=""
										{...register("isActive")}
									/>
									<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
								</label>
							</div>
						</div>

						<div className="flex flex-col gap-2 mt-auto">
							<Button
								type="submit"
								className="flex items-center justify-center gap-2"
							>
								<Save /> Salvar Produto
							</Button>
							<Button type="button" variant="secondary">
								Cancelar
							</Button>
						</div>
					</div>
				</form>
			</div>
		</section>
	);
};
