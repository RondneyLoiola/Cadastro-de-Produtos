import type { Request, Response } from "express";
import { z } from "zod";
import prisma from "../../config/prisma";
import { buildValidationErrorMessage } from "../../utils/validatorErrors";

class UserController {
	async store(req: Request, res: Response) {
		try {
			const schema = z.object({
				name: z.string().min(1, 'Nome é necessário'),
				email: z.email('Email inválido'),
				password: z.string().min(6, 'Senha precisa ter pelo menos 6 caracteres'),
				isAdmin: z.boolean().default(false),
			});

			const user = schema.safeParse(req.body);

			if (!user.success) {
				const errors = buildValidationErrorMessage(user.error.issues);

				return res.status(422).json({
					message: errors,
				});
			}

			const userExists = await prisma.user.findUnique({
				where: {
					email: user.data.email,
				}
			})

			if(userExists) {
				return res.status(400).json({ error: "Usuário com esse email ja cadastrado" });
			}

			const newUser = await prisma.user.create({
				data: {
					name: user.data.name,
					email: user.data.email,
					password: user.data.password,
					isAdmin: user.data.isAdmin,
				},
			});

			return res.status(201).json(newUser);
		} catch (error) {
			return res.status(400).json(error);
		}
	}

	async index(_req: Request, res: Response) {
		try {
			const users = await prisma.user.findMany();

			if (!users) {
				return res.status(400).json({ error: "Nenhum usuário encontrado" });
			}

			return res.status(200).json(users);
		} catch (error) {
			return res.status(400).json(error);
		}
	}

	async getUserById(req: Request, res: Response){
		try {
			const { userId } = req.params;

			const user = await prisma.user.findUnique({
				where: {
					id: String(userId),
				}
			})

			if(!user){
				return res.status(400).json({ error: "Usuário n]ao encontrado" });
			}

			return res.status(200).json(user);
		} catch (error) {
			return res.status(400).json(error);
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { userId } = req.params;

			await prisma.user.delete({
				where: {
					id: String(userId),
				},
			})

			return res.status(200).json({ message: "Usuário deletado com sucesso" });
		} catch (error) {
			return res.status(400).json(error);
		}
	}
}

export default new UserController();
