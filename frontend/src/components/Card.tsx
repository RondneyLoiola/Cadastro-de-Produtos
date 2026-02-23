import type React from "react";
import { PriceConverter } from "../utils/priceConverter";

interface ProductCardProps {
	name: string;
	category: string;
	description: string;
	price: number;
	quantity: number;
	imageUrl: string;
	isActive?: boolean;
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

export const Card: React.FC<ProductCardProps> = ({
	name,
	category,
	description,
	price,
	quantity,
	imageUrl,
	isActive = true,
}) => {
	// Obtém o status do estoque com cores
	const stockInfo = getStockWithColors(quantity);

	// Obtém o badge de status (Ativo/Inativo)
	const statusBadge = getStatusBadge(isActive);

	return (
		<div className="w-80 h-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
			{/* Imagem do Produto */}
			<div className="relative bg-gray-50">
				<img src={imageUrl} alt={name} className="w-full h-48 object-contain" />

				{/* Badge de Status - Sempre exibe com cor baseada no boolean */}
				<div
					className={`absolute top-4 right-4 ${statusBadge.bgColor} ${statusBadge.textColor} px-3 py-1 rounded-full text-xs font-medium`}
				>
					{statusBadge.label}
				</div>
			</div>

			{/* Conteúdo do Card */}
			<div className="p-4">
				{/* Categoria */}
				<p className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-2">
					{category}
				</p>

				{/* Título */}
				<h3 className="text-gray-900 text-xl font-bold mb-2">{name}</h3>

				{/* Descrição */}
				<div className="w-full h-24">
					<p className="text-gray-600 text-sm mb-4 w-full">{description}</p>
				</div>

				{/* Preço */}
				<p className="text-gray-900 text-3xl font-bold mb-4">
					{PriceConverter(price)}
				</p>

				{/* Informações de Estoque - COM CORES DINÂMICAS */}
				<div
					className={`flex justify-between items-center text-sm px-3 py-2 rounded ${stockInfo.bgColor}`}
				>
					<div className="flex items-center gap-2">
						<span className="text-lg">{stockInfo.icon}</span>
						<span className={`${stockInfo.textColor} font-semibold`}>
							{stockInfo.status}
						</span>
					</div>
					<span className={`font-semibold ${stockInfo.textColor}`}>
						{quantity} {quantity === 1 ? "unidade" : "unidades"}
					</span>
				</div>
			</div>
		</div>
	);
};