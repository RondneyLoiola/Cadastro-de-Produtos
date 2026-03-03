import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../services/api";
import { PriceConverter } from "../utils/priceConverter";
import { Button } from "../components/Button";
import { useUser } from "../hook/auth";
import { ArrowLeft, Package, Tag, Scale, Pencil } from "lucide-react";

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

// 🎨 Função de Estoque com Switch/Case e Cores Dinâmicas
interface StockResult {
	status: string;
	textColor: string;
	bgColor: string;
	icon: string;
}

const getStockWithColors = (quantity: number): StockResult => {
	if (quantity < 0) {
		return {
			status: "Quantidade Inválida",
			textColor: "text-gray-500",
			bgColor: "bg-gray-50",
			icon: "❌",
		};
	}

	switch (true) {
		case quantity === 0:
			return {
				status: "Esgotado",
				textColor: "text-red-600",
				bgColor: "bg-red-50",
				icon: "🚫",
			};

		case quantity <= 5:
			return {
				status: "Estoque Crítico",
				textColor: "text-orange-600",
				bgColor: "bg-orange-50",
				icon: "⚠️",
			};

		case quantity <= 10:
			return {
				status: "Estoque Baixo",
				textColor: "text-yellow-600",
				bgColor: "bg-yellow-50",
				icon: "⚡",
			};

		case quantity <= 50:
			return {
				status: "Estoque Atual",
				textColor: "text-green-600",
				bgColor: "bg-green-50",
				icon: "✅",
			};

		default:
			return {
				status: "Estoque Alto",
				textColor: "text-blue-600",
				bgColor: "bg-blue-50",
				icon: "📦",
			};
	}
};

// 🏷️ Função para gerenciar Badge de Status (Ativo/Inativo)
interface StatusBadge {
	label: string;
	bgColor: string;
	textColor: string;
}

const getStatusBadge = (isActive: boolean): StatusBadge => {
	if (isActive) {
		return {
			label: "ATIVO",
			bgColor: "bg-teal-100",
			textColor: "text-teal-700",
		};
	}

	return {
		label: "INATIVO",
		bgColor: "bg-gray-200",
		textColor: "text-gray-700",
	};
};

export const ProductDetails = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { userInfo } = useUser();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getProduct = async () => {
			try {
				setLoading(true);
				const { data } = await api.get(`/products/${id}`);
				setProduct(data);
				setError(null);
			} catch (err) {
				console.error(err);
				setError("Produto não encontrado");
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			getProduct();
		}
	}, [id]);

	const stockInfo = product ? getStockWithColors(product.quantity) : null;
	const statusBadge = product ? getStatusBadge(product.isActive) : null;

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className="max-w-7xl px-4 mx-auto py-8">
				<div className="text-center py-12">
					<p className="text-red-500 text-xl mb-4">{error || "Produto não encontrado"}</p>
					<Button variant="primary" onClick={() => navigate("/")}>
						Voltar para Produtos
					</Button>
				</div>
			</div>
		);
	}

	return (
		<section className="max-w-7xl px-2 md:px-4 mx-auto py-6 pb-10">
			{/* Botões de Navegação */}
			<div className="flex items-center justify-between mb-6">
				<button
					onClick={() => navigate("/")}
					className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
				>
					<ArrowLeft size={20} />
					<span className="font-medium">Voltar para Produtos</span>
				</button>
				
				{/* Botão Editar - Apenas para Admin */}
				{userInfo?.isAdmin && (
					<button
						onClick={() => navigate(`/admin/editar-produto/${id}`)}
						className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
					>
						<Pencil size={18} />
						<span className="font-medium">Editar Produto</span>
					</button>
				)}
			</div>

			<div className="bg-white rounded-xl border border-blue-200 overflow-hidden">
				<div className="grid grid-cols-1 md:grid-cols-2">
					{/* Imagem do Produto */}
					<div className="bg-gray-50 p-8 flex items-center justify-center">
						{product.image ? (
							<img
								src={product.image}
								alt={product.name}
								className="w-full max-w-md h-80 object-contain"
							/>
						) : (
							<div className="w-full max-w-md h-80 flex items-center justify-center bg-gray-100 rounded-lg">
								<Package size={64} className="text-gray-400" />
							</div>
						)}
					</div>

					{/* Informações do Produto */}
					<div className="p-8">
						{/* Badge de Status */}
						<div className="mb-4">
							<span
								className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusBadge?.bgColor} ${statusBadge?.textColor}`}
							>
								{statusBadge?.label}
							</span>
						</div>

						{/* Categoria */}
						<div className="flex items-center gap-2 mb-2">
							<Tag size={18} className="text-blue-600" />
							<span className="text-blue-600 font-semibold uppercase tracking-wide">
								{product.category.name}
							</span>
						</div>

						{/* Nome do Produto */}
						<h1 className="text-3xl font-bold text-gray-900 mb-4">
							{product.name}
						</h1>

						{/* Preço */}
						<p className="text-4xl font-bold text-gray-900 mb-6">
							{PriceConverter(product.price)}
						</p>

						{/* Descrição */}
						<div className="mb-6">
							<h2 className="text-lg font-semibold text-gray-700 mb-2">
								Descrição
							</h2>
							<p className="text-gray-600 leading-relaxed">
								{product.description}
							</p>
						</div>

						{/* Informações de Estoque */}
						<div className="border-t border-gray-200 pt-6">
							<h2 className="text-lg font-semibold text-gray-700 mb-4">
								Informações de Estoque
							</h2>
							<div className="flex items-center gap-3">
								<Scale size={24} className="text-gray-400" />
								<div
									className={`flex items-center gap-2 px-4 py-2 rounded ${stockInfo?.bgColor}`}
								>
									<span className="text-lg">{stockInfo?.icon}</span>
									<span className={`font-semibold ${stockInfo?.textColor}`}>
										{stockInfo?.status}
									</span>
								</div>
								<span className={`text-xl font-bold ${stockInfo?.textColor}`}>
									{product.quantity} {product.quantity === 1 ? "unidade" : "unidades"}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
