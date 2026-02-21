export const stock = (quantity: number): string => {
    if (quantity < 0) return 'Quantidade Inválida';
    
    switch (true) {
        case quantity === 0:
            return 'Esgotado';
        case quantity <= 5:
            return 'Estoque Crítico';
        case quantity <= 10:
            return 'Estoque Baixo';
        case quantity <= 50:
            return 'Estoque Normal';
        default:
            return 'Estoque Alto';
    }
};