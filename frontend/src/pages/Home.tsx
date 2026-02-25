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
import { useUser } from "../hook/auth";
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
	const { userInfo } = useUser();
	const [categories, setCategories] = useState<Category[]>([]);
	const [_products, setProducts] = useState<Product[]>([]);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

	const schema = z.object({
		name: z.string().min(1, "Coloque o nome do produto"),
		description: z.string().min(1, "Coloque a descrição do produto"),
		price: z.number({ message: 'Coloque o preço do produto' }).positive("Preço do produto precisa ser maior que zero"),
		quantity: z.number({ message: 'Coloque a quantidade do produto' }).positive("Quantidade precisa ser maior que zero"),
		category: z.string().min(1, "Selecione a categoria do produto"),
		isActive: z.boolean(),
		image: z
			.custom<FileList>()
			.refine((files) => files?.length > 0, {
				message: 'Escolha um arquivo para continuar'
			})
			.refine((files) => files?.[0]?.size <= 3000000, {
				message: 'Carregue arquivos até 3mb'
			})
			.refine((files) => {
				const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
				return files?.[0] ? validTypes.includes(files[0].type) : false;
			}, {
				message: 'Carregue apenas imagens PNG, JPEG ou JPG'
			})
	});

	type FormData = z.infer<typeof schema>;

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			isActive: true,
		},
	});

	const getCategories = async () => {
		try {
			const { data } = await api.get("/categories");
			setCategories(data);
		} catch (error) {
			console.log(error);
			setMensagem({ texto: "Erro ao carregar categorias", tipo: 'erro' });
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
		// Verificar se o usuário é admin
		if (userInfo && !userInfo.isAdmin) {
			setMensagem({ texto: 'Acesso negado: Apenas administradores podem acessar esta página', tipo: 'erro' });
		}
		getCategories();
		getProducts();
	}, [userInfo]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Apenas para preview visual
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveImage = () => {
		setImagePreview(null);
		setValue('image', undefined as any);
	};

	const onSubmit = async (data: FormData) => {
		console.log('=== DEBUG: Dados do formulário ===');
		console.log('Nome:', data.name);
		console.log('Preço:', data.price);
		console.log('Categoria:', data.category);
		console.log('Descrição:', data.description);
		console.log('Quantidade:', data.quantity);
		console.log('Ativo:', data.isActive);
		console.log('Arquivo:', data.image[0]);

		try {
			const productFormData = new FormData();
			productFormData.append('name', data.name);
			productFormData.append('price', data.price.toString());
			productFormData.append('categoryId', String(data.category));
			productFormData.append('description', data.description);
			productFormData.append('quantity', String(data.quantity));
			productFormData.append('isActive', String(data.isActive));
			productFormData.append('image', data.image[0]);

			const response = await api.post('/products', productFormData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});


			if (response.status === 201) {
				setMensagem({ texto: 'Produto cadastrado com sucesso!', tipo: 'sucesso' });
				
				// Limpar o formulário
				reset();
				setImagePreview(null);
				
				// Recarregar a lista de produtos
				getProducts();
				
				// Esconder mensagem após 3 segundos
				setTimeout(() => {
					setMensagem(null);
				}, 3000);
			}
		} catch (error: any) {
			console.error('=== ERRO ao criar produto ===', error);
			console.error('Resposta do erro:', error.response?.data);
			
			if (error.response?.status === 401) {
				setMensagem({ texto: 'Não autorizado: Faça login como administrador', tipo: 'erro' });
			} else if (error.response?.status === 403) {
				setMensagem({ texto: 'Acesso negado: Apenas administradores podem criar produtos', tipo: 'erro' });
			} else if (error.response?.status === 422) {
				const errorMessage = error.response.data.message || 'Erro de validação';
				setMensagem({ texto: `Erro de validação: ${errorMessage}`, tipo: 'erro' });
			} else {
				const errorMsg = error.response?.data?.message || error.message || 'Erro ao criar produto. Tente novamente.';
				setMensagem({ texto: errorMsg, tipo: 'erro' });
			}
		}
	};

	return (
		<section className="container py-6 relative">
			{/* Mensagem Toast */}
			{mensagem && (
				<div
					className={`fixed top-4 right-4 left-4 md:left-auto md:w-96 p-4 rounded-lg shadow-lg animate-slide-in z-50 ${
						mensagem.tipo === 'sucesso'
							? 'bg-green-100 border border-green-400 text-green-700'
							: 'bg-red-100 border border-red-400 text-red-700'
					}`}
				>
					<div className="flex items-center justify-between">
						<p className="font-medium">{mensagem.texto}</p>
						<button
							type="button"
							onClick={() => setMensagem(null)}
							className="ml-4 text-xl font-bold hover:opacity-70"
						>
							×
						</button>
					</div>
				</div>
			)}

			<div className="w-full">
				<div className="flex flex-col gap-2">
					<h1 className="md:text-4xl font-extrabold">Cadastrar Produto</h1>
					<p className="text-xl text-gray-500">
						Preencha as informações necessárias para cadastrar o produto
					</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
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
								{errors.name && (
									<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
								)}
							</div>

							<div className="flex flex-col">
								<label
									htmlFor="category"
									className="block font-bold text-gray-700 mb-1"
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
								{errors.category && (
									<p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
								)}
							</div>

							<div className="w-full flex items-start justify-between gap-4">
								<div className="w-1/2">
									<Input
										className={errors.price ? "border-red-500" : ""}
										placeholder="R$ 0,00"
										label="Preço do produto"
										type="number"
										{...register("price", { valueAsNumber: true })}
									/>
									{errors.price && (
										<p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
									)}
								</div>
								<div className="w-1/2">
									<Input
										className={errors.quantity ? "border-red-500" : ""}
										placeholder="0"
										label="Quantidade em estoque"
										type="number"
										{...register("quantity", { valueAsNumber: true })}
									/>
									{errors.quantity && (
										<p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
									)}
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
								/>
								{errors.description && (
									<p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
								)}
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
								<label className={`${errors.image ? "border-red-500 bg-red-50" : "bg-gray-50"} flex flex-col items-center justify-center w-full h-56 rounded-xl border-2 border-dashed ${errors.image ? "border-red-500" : "border-gray-300"} cursor-pointer hover:bg-gray-100 transition-colors`}>
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
										className={`${errors.image ? "text-red-400" : "text-gray-400"} mb-2`}
									>
										<title>Ícone de upload de imagem</title>
										<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
										<circle cx="8.5" cy="8.5" r="1.5" />
										<polyline points="21 15 16 10 5 21" />
									</svg>
									<span className={`${errors.image ? "text-red-500" : "text-gray-500"} text-sm font-medium`}>
										Clique para selecionar uma imagem
									</span>
									<span className="text-gray-400 text-xs mt-1">
										PNG, JPEG ou JPG (até 3MB)
									</span>
									<input
										type="file"
										className="hidden"
										accept="image/png,image/jpeg,image/jpg"
										{...register("image", {
											onChange: handleImageChange
										})}
									/>
								</label>
							)}
							{errors.image && (
								<p className="text-red-500 text-sm">{errors.image.message as string}</p>
							)}
						</div>

						<div className="flex flex-col gap-4 bg-white p-6 border border-blue-100 rounded-xl">
							<h2 className="text-2xl font-bold">Configurações</h2>
							<div className="flex items-center justify-between">
								<label htmlFor="isActive" className="font-medium text-gray-700">
									Produto Ativo
								</label>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										className="sr-only peer"
										{...register("isActive")}
									/>
									<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500" />
								</label>
							</div>
						</div>

						<div className="flex flex-col gap-2 mt-auto">
							<Button
								type="submit"
								className="flex items-center justify-center gap-2"
							>
								<Save size={20} /> Salvar Produto
							</Button>
							<Button 
								type="button" 
								variant="secondary"
								onClick={() => {
									reset();
									setImagePreview(null);
								}}
							>
								Cancelar
							</Button>
						</div>
					</div>
				</form>
			</div>
		</section>
	);
};