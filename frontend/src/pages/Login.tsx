/** biome-ignore-all lint/a11y/useKeyWithClickEvents: onClick */
/** biome-ignore-all lint/suspicious/noExplicitAny: catch error type */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: onClick */

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useUser } from "../hook/auth";
import { api } from "../services/api";

interface UserType {
	email: string;
	password: string;
}

export const Login = () => {
	const navigate = useNavigate();
	const { putUserData } = useUser();
	const [mensagem, setMensagem] = useState<{
		texto: string;
		tipo: "sucesso" | "erro";
	} | null>(null);

	const schema = z.object({
		email: z.email("Insira um E-mail inválido"),
		password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserType>({
		resolver: zodResolver(schema),
	});

	const onSubmit = async (data: UserType) => {
		try {
			const { data: response } = await api.post("/session", {
				email: data.email,
				password: data.password,
			});

			// Adaptar o formato da resposta do backend para o formato esperado pelo frontend
			const userData = {
				id: response.user.id,
				name: response.user.name,
				isAdmin: response.user.isAdmin,
				token: response.token,
				user: {
					name: response.user.name,
					email: response.user.email,
				},
			};

			putUserData(userData);
			setMensagem({
				texto: "Login realizado com sucesso! Redirecionando...",
				tipo: "sucesso",
			});
			setTimeout(() => {
				navigate("/");
			}, 2300);
		} catch (error: any) {
			if (error.response?.status === 401) {
				setMensagem({
					texto: "Email ou senha incorretos. Tente novamente.",
					tipo: "erro",
				});
			} else if (error.response?.status === 404) {
				setMensagem({
					texto: "Usuário não encontrado. Verifique seu email.",
					tipo: "erro",
				});
			} else {
				setMensagem({
					texto: "Falha no Sistema! Tente novamente.",
					tipo: "erro",
				});
			}
		}
	};

	return (
		<section className="h-screen flex flex-col items-center justify-center py-6 relative">
			{/* Mensagem Toast */}
			{mensagem && (
				<div
					className={`fixed top-4 right-4 left-4 md:left-auto md:w-96 p-4 rounded-lg shadow-lg animate-slide-in ${
						mensagem.tipo === "sucesso"
							? "bg-green-100 border border-green-400 text-green-700"
							: "bg-red-100 border border-red-400 text-red-700"
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

			<div className="flex flex-col gap-4">
				<div className="flex flex-col items-start justify-center gap-2">
					<h1 className="text-4xl font-extrabold">Bem-Vindo ao ERP NEXUS</h1>
					<p className="text-gray-500 text-xl">
						Faça login para acessar sua conta
					</p>
				</div>
				<div className="flex flex-col items-center justify-center w-110 p-4 bg-white rounded-xl border border-blue-100 shadow-2xl shadow-blue-100">
					<form
						className="w-full p-4 flex flex-col gap-6"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="flex flex-col">
							<Input
								placeholder="example@example.com"
								label="E-mail"
								type="email"
								{...register("email")}
							/>
							{errors.email && (
								<span className="text-red-500">{errors.email.message}</span>
							)}
						</div>
						<div className="flex flex-col">
							<Input
								placeholder="Insira sua Senha de Acesso"
								label="Senha"
								type="password"
								{...register("password")}
							/>
							{errors.password && (
								<span className="text-red-500">{errors.password.message}</span>
							)}
						</div>
						<Button type="submit">Entrar</Button>
						<div className="flex flex-col gap-4 items-center justify-center">
							<div className="w-full border-b border-blue-100" />
							<p className="text-center">
								Ainda não tem conta?{" "}
								<span
									className="text-blue-500 cursor-pointer"
									onClick={() => navigate("/cadastro")}
								>
									Faça o Cadastro
								</span>
							</p>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
};
