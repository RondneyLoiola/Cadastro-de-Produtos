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
	category: Category;
	isActive: boolean;
	image: string;
}

export const Home = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [_products, setProducts] = useState<Product[]>([]);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [_selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveImage = () => {
		setImagePreview(null);
		setSelectedFile(null);
	};

	const schema = z.object({
		name: z.string().min(1, "Coloque o nome do produto"),
		description: z.string().min(1, "Coloque a descrição do produto"),
		price: z.number().positive("Preço do produto precisa ser maior que zero"),
		quantity: z.number().positive("Quantidade precisa ser maior que zero"),
		category: z.string().min(1, "Categoria é obrigatória"),
		isActive: z.boolean(),
		image: z.instanceof(FileList)
			.refine((files) => files && files.length > 0, {
				message: 'Escolha um arquivo para continuar'
			})
			.refine((files) => files[0].size >= 30000, {
				message: 'Carregue arquivos até 3mb'
			})
			.refine((files) => {
				const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
				return validTypes.includes(files[0].type);
			}, {
				message: 'Carregue apenas imagens PNG, JPEG ou JPG'
			})
	});

	type FormData = z.infer<typeof schema>;

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
			setProducts(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getCategories();
		getProducts();
	}, []);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			isActive: true,
		},
	});

	const onSubmit = async (data: FormData) => {
		console.log('clicou')

		try {
			const productFormData = new FormData();
            productFormData.append('name', data.name);
			productFormData.append('price', data.price.toString());
			productFormData.append('category', String(data.category));
			productFormData.append('description', data.description);
			productFormData.append('quantity', String(data.quantity));
			productFormData.append('image', data.image[0]);

			await api.post('/products', productFormData);
		} catch (error) {
			console.log(error);
		}
	}

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
					className="flex items-start gap-4 mt-6 w-8xl"
				>
					{/* Lado Esquerdo */}
					<div className="w-[70%] flex flex-col items-left justify-center gap-4 px-6 py-4 bg-white border border-blue-100 rounded-xl">
						<div className="flex flex-col gap-6">
							<div className="pb-2 border-b border-gray-200 mb-2">
								<h2 className="text-2xl font-bold p-2">Informações básicas</h2>
							</div>

							<div className="flex flex-col">
								<Input
									className={errors.name ? "border-red-500" : ""}
									placeholder="Nome do produto"
									label="Nome do produto"
									type="text"
									{...register("name")}
								/>
								<p className="text-red-500">{errors ? errors.name?.message : ""}</p>
							</div>

							<div className="flex flex-col">
								<label
									htmlFor="category"
									className="block font-bold text-gray-700"
								>
									Categoria
								</label>
								<select
									{...register("category")}
									className={`${errors.category ? "border-red-500" : ""} text-gray-900 bg-white border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
								>
									<option value="">Selecione uma categoria</option>
									{categories.map((category) => (
										<option key={category.id} value={category.id}>
											{category.name}
										</option>
									))}
								</select>
								<p className="text-red-500">{errors ? errors.category?.message : ""}</p>
							</div>

							<div className="w-full flex items-center justify-between gap-4">
								<div className="w-1/2">
									<Input
										className={errors.price ? "border-red-500" : ""}
										placeholder="R$ 0,00"
										label="Preço do produto"
										type="number"
										{...register("price", { valueAsNumber: true })}
									/>
									<p className="text-red-500">{errors ? errors.price?.message : ""}</p>
								</div>
								<div className="w-1/2">
									<Input
										className={errors.quantity ? "border-red-500" : ""}
										placeholder="0"
										label="Quantidade em estoque"
										type="number"
										{...register("quantity", { valueAsNumber: true })}
									/>
									<p className="text-red-500">{errors ? errors.quantity?.message : ""}</p>
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
									className={`${errors.description ? "border-red-500" : ""} w-full h-32 text-gray-900 bg-white border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
									{...register("description")}
								></textarea>
								<p className="text-red-500">{errors ? errors.description?.message : ""}</p>
							</div>
						</div>
					</div>

					{/* Lado Direito */}
					<div className="w-[30%] max-h-full flex flex-col items-left gap-6">
						<div className="flex flex-col gap-4 bg-white px-6 py-4 border border-blue-100 rounded-xl">
							<h2 className="text-2xl font-bold">Imagem do Produto</h2>
							{imagePreview ? (
								<div className="relative w-full h-64 rounded-xl overflow-hidden border border-blue-100">
									<img
										src={imagePreview}
										alt="Preview"
										className="w-full h-full object-cover"
									/>
									<button
										type="button"
										onClick={handleRemoveImage}
										className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<title>Remover imagem</title>
											<line x1="18" y1="6" x2="6" y2="18" />
											<line x1="6" y1="6" x2="18" y2="18" />
										</svg>
									</button>
								</div>
							) : (
								<label className="flex flex-col items-center justify-center w-full h-56 bg-gray-200 rounded-xl border border-blue-100 cursor-pointer hover:bg-gray-300 transition-colors">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="40"
										height="40"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-gray-500 mb-2"
									>
										<title>Ícone de upload de imagem</title>
										<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
										<circle cx="8.5" cy="8.5" r="1.5" />
										<polyline points="21 15 16 10 5 21" />
									</svg>
									<span className="text-gray-500 text-sm">
										Clique para selecionar uma imagem
									</span>
									<input
										type="file"
										className="hidden"
										accept="image/*"
										onChange={handleImageChange}
									/>
								</label>
							)}
						</div>

						<div className="flex flex-col gap-4 bg-white p-6 border border-blue-100 rounded-xl">
							<h2 className="text-2xl font-bold">Configurações</h2>
							<div className="flex items-center justify-between">
								<label htmlFor="status" className="">
									Produto Ativo
								</label>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										className="sr-only peer"
										{...register("isActive")}
									/>
									<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
								</label>
							</div>
						</div>

						<div className="flex flex-col gap-2 mt-auto">
							<Button
								onClick={handleSubmit(onSubmit)}
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
