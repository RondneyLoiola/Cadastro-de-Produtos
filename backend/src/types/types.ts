export interface CreateCategoryBody {
    id: number;
    name: string;
}

export interface CreateProductBody {
	name: string;
	price: number;
	description: string;
	quantity: number;
	category: string;
	isActive: boolean;
	image: string;
}

export interface CreateUserBody {
    name: string;
    email: string;
    password: string;
}

export interface CreateSessionBody {
    email: string;
    password: string;
}