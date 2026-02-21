import React from 'react';
import { PriceConverter } from '../utils/priceConverter';

enum IsActive {
  ATIVO = "Ativo",
  INATIVO = "Inativo",
}

interface ProductCardProps {
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  isActive?: IsActive;
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
      status: 'Quantidade Inválida',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-50',
      icon: '❌'
    };
  }

  switch (true) {
    case quantity === 0:
      return {
        status: 'Esgotado',
        textColor: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: '🚫'
      };

    case quantity <= 5:
      return {
        status: 'Estoque Crítico',
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-50',
        icon: '⚠️'
      };

    case quantity <= 10:
      return {
        status: 'Estoque Baixo',
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: '⚡'
      };

    case quantity <= 50:
      return {
        status: 'Estoque Atual',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: '✅'
      };

    default:
      return {
        status: 'Estoque Alto',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        icon: '📦'
      };
  }
};

// 🏷️ Função para gerenciar Badge de Status (Ativo/Inativo)
interface StatusBadge {
  label: string;
  bgColor: string;
  textColor: string;
}

const getStatusBadge = (status: IsActive): StatusBadge => {
  switch (status) {
    case IsActive.ATIVO:
      return {
        label: 'ATIVO',
        bgColor: 'bg-teal-100',
        textColor: 'text-teal-700'
      };
    
    case IsActive.INATIVO:
      return {
        label: 'INATIVO',
        bgColor: 'bg-gray-200',
        textColor: 'text-gray-700'
      };
    
    default:
      return {
        label: 'ATIVO',
        bgColor: 'bg-teal-100',
        textColor: 'text-teal-700'
      };
  }
};

export const Card: React.FC<ProductCardProps> = ({
  name,
  category,
  description,
  price,
  quantity,
  imageUrl,
  isActive = IsActive.ATIVO,
}) => {
  // Obtém o status do estoque com cores
  const stockInfo = getStockWithColors(quantity);
  
  // Obtém o badge de status (Ativo/Inativo)
  const statusBadge = getStatusBadge(isActive);

  return (
    <div className="w-80 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Imagem do Produto */}
      <div className="relative bg-gray-50 p-8">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-contain"
        />
        
        {/* Badge de Status - Sempre exibe com cor baseada no enum */}
        <div className={`absolute top-4 right-4 ${statusBadge.bgColor} ${statusBadge.textColor} px-3 py-1 rounded-full text-xs font-medium`}>
          {statusBadge.label}
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-6">
        {/* Categoria */}
        <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide mb-2">
          {category}
        </p>

        {/* Título */}
        <h3 className="text-gray-900 text-xl font-bold mb-2">
          {name}
        </h3>

        {/* Descrição */}
        <p className="text-gray-600 text-sm mb-4">
          {description}
        </p>

        {/* Preço */}
        <p className="text-gray-900 text-3xl font-bold mb-4">
          {PriceConverter(price)}
        </p>

        {/* Informações de Estoque - COM CORES DINÂMICAS */}
        <div className={`flex justify-between items-center text-sm px-3 py-2 rounded ${stockInfo.bgColor}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{stockInfo.icon}</span>
            <span className={`${stockInfo.textColor} font-semibold`}>
              {stockInfo.status}
            </span>
          </div>
          <span className={`font-semibold ${stockInfo.textColor}`}>
            {quantity} {quantity === 1 ? 'unidade' : 'unidades'}
          </span>
        </div>
      </div>
    </div>
  );
};

export { IsActive };