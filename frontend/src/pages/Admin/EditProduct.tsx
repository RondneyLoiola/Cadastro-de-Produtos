/** biome-ignore-all lint/correctness/useExhaustiveDependencies: useEffect */

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useUser } from "../../hook/auth";
import { api } from "../../services/api";

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

export const EditProduct = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { userInfo } = useUser();
	const [categories, setCategories] = useState<Category[]>([]);
	const [product, setProduct] = useState<Product | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

	const schema = z.object({
		name: z.string().min(1, "Coloque o nome do produto"),
		description: z.string().min(1, "Coloque a descrição do produto"),
		price: z.number({ message: 'Coloque o preço do produto' }).positive("Preço do produto precisa ser maior que zero"),
		quantity: z.number({ message: 'Coloque a quantidade do produto' }).positive("Quantidade precisa ser maior que zero"),
		category: z.string().min(1, "Selecione a categoria do produto"),
		isActive: z.boolean(),
		image: z.any().optional()
	});

	type FormData = z.infer<typeof schema>;

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitting },
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

	const getProduct = async () => {
		try {
			setLoading(true);
			const { data } = await api.get(`/products/${id}`);
			setProduct(data);
			
			// Preencher o formulário com os dados do produto
			setValue("name", data.name);
			setValue("description", data.description);
			setValue("price", data.price);
			setValue("quantity", data.quantity);
			setValue("category", data.category.id);
			setValue("isActive", data.isActive);
			
			// Setar a imagem atual para preview
			if (data.image) {
				setImagePreview(data.image);
			}
		} catch (error) {
			console.log(error);
			setMensagem({ texto: "Erro ao carregar produto", tipo: 'erro' });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// Verificar se o usuário é admin
		if (userInfo && !userInfo.isAdmin) {
			setMensagem({ texto: 'Acesso negado: Apenas administradores podem editar produtos', tipo: 'erro' });
		}
		getCategories();
		getProduct();
	}, [userInfo, id]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
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
		try {
			const productFormData = new FormData();
			productFormData.append('name', data.name);
			productFormData.append('price', data.price.toString());
			productFormData.append('categoryId', String(data.category));
			productFormData.append('description', data.description);
			productFormData.append('quantity', String(data.quantity));
			productFormData.append('isActive', String(data.isActive));

			// Apenas enviar imagem se uma nova foi selecionada
			if (data.image && data.image.length > 0) {
				productFormData.append('image', data.image[0]);
			}

			const response = await api.put(`/products/${id}`, productFormData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			if (response.status === 200) {
				setMensagem({ texto: 'Produto atualizado com sucesso!', tipo: 'sucesso' });
				
				// Esconder mensagem após 2 segundos e redirecionar
				setTimeout(() => {
					navigate('/admin/ver-produtos');
				}, 2000);
			}
		} catch (error: any) {
			console.error('=== ERRO ao atualizar produto ===', error);
			console.error('Resposta do erro:', error.response?.data);
			
			if (error.response?.status === 401) {
				setMensagem({ texto: 'Não autorizado: Faça login como administrador', tipo: 'erro' });
			} else if (error.response?.status === 403) {
				setMensagem({ texto: 'Acesso negado: Apenas administradores podem editar produtos', tipo: 'erro' });
			} else if (error.response?.status === 404) {
				setMensagem({ texto: 'Produto não encontrado', tipo: 'erro' });
			} else if (error.response?.status === 422) {
				const errorMessage = error.response.data.message || 'Erro de validação';
				setMensagem({ texto: `Erro de validação: ${errorMessage}`, tipo: 'erro' });
			} else {
				const errorMsg = error.response?.data?.message || error.message || 'Erro ao atualizar produto. Tente novamente.';
				setMensagem({ texto: errorMsg, tipo: 'erro' });
			}
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		);
	}

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
				{/* Botão Voltar */}
				<button
					onClick={() => navigate("/admin/ver-produtos")}
					className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
				>
					<ArrowLeft size={20} />
					<span className="font-medium">Voltar para Produtos</span>
				</button>

				<div className="flex flex-col gap-2">
					<h1 className="md:text-4xl text-3xl font-extrabold">Editar Produto</h1>
					<p className="text-xl text-gray-500">
						Atualize as informações do produto
					</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col md:flex-row items-start gap-4 mt-6 w-full"
				>
					{/* Lado Esquerdo */}
					<div className="w-full md:w-[70%] flex flex-col items-left justify-center gap-4 px-4 md:px-6 py-4 bg-white border border-blue-100 rounded-xl">
						<div className="flex flex-col gap-6">
							<div className="pb-2 border-b border-gray-200 mb-2">
								<h2 className="text-xl md:text-2xl font-bold p-2">Informações básicas</h2>
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

							<div className="w-full flex flex-col md:flex-row items-start justify-between gap-4">
								<div className="w-full md:w-1/2">
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
								<div className="w-full md:w-1/2">
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
					<div className="w-full md:w-[30%] max-h-full flex flex-col items-left gap-6">
						<div className="flex flex-col gap-4 bg-white px-4 md:px-6 py-4 border border-blue-100 rounded-xl">
							<h2 className="text-xl md:text-2xl font-bold">Imagem do Produto</h2>
							<p className="text-sm text-gray-500">
								Deixe vazio para manter a imagem atual
							</p>
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

						<div className="flex flex-col gap-4 bg-white p-4 md:p-6 border border-blue-100 rounded-xl">
							<h2 className="text-xl md:text-2xl font-bold">Configurações</h2>
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
								disabled={isSubmitting}
								className="flex items-center justify-center gap-2"
							>
								<Save size={20} /> 
								{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
							</Button>
							<Button 
								type="button" 
								variant="secondary"
								onClick={() => navigate("/admin/ver-produtos")}
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
