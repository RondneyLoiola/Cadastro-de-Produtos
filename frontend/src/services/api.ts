import axios from "axios";
import { userLocalStorageKey } from "../hook/auth";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
	baseURL: BASE_URL,
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
	const userData = localStorage.getItem(userLocalStorageKey);
	
	if (userData) {
		const { token } = JSON.parse(userData);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	
	return config;
});
