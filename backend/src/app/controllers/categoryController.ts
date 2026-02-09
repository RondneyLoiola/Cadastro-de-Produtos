import type { Request, Response } from "express";
import { z } from "zod";
import prisma from "../../config/prisma";
import { buildValidationErrorMessage } from "../../utils/validatorErrors";

class CategoryController {
	async store(req: Request, res: Response) {
		try {
			const schema = z.object({
				name: z.string('Nome da categoria é obrigatorio'),
			});

			const category = schema.safeParse(req.body);

			if(!category.success){
				const errors = buildValidationErrorMessage(category.error.issues);

				return res.status(422).json({
					message: errors,
				});
			}

			const { name } = category.data;

			const existingCategory = await prisma.category.findUnique({
				where: {
					name,
				},
			});

			if (existingCategory) {
				return res.status(400).json({ error: "Esta categoria já existe" });
			}

			const newCategory = await prisma.category.create({
				data: {
					name,
				},
			});

			return res.status(201).json(newCategory);
		} catch (error) {
			console.error(error);
			return res.status(400).json({ error: "Erro ao criar categoria" });
		}
	}

	async index(_req: Request, res: Response) {
		try {
			const categories = await prisma.category.findMany();

			return res.status(200).json(categories);
		} catch (error) {
			console.error(error);
			return res.status(400).json({ error: "Erro ao listar categorias" });
		}
	}

	async show(req: Request, res: Response) {
		try {
			const { categoryId } = req.params;

			const category = await prisma.category.findUnique({
				where: {
					id: String(categoryId),
				},
				include: {
					product: true,
				},
			});

			return res.status(200).json(category);
		} catch (error) {
			console.error(error);
			return res.status(400).json({ error: "Erro ao listar categoria" });
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { categoryId } = req.params;
			const { name } = req.body;

			const category = await prisma.category.update({
				where: {
					id: String(categoryId),
				},
				data: {
					name,
				},
			});

			return res.status(200).json(category);
		} catch (error) {
			console.error(error);
			return res.status(400).json({ error: "Erro ao atualizar categoria" });
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { categoryId } = req.params;

			const category = await prisma.category.delete({
				where: {
					id: String(categoryId),
				},
			});

			return res.status(200).json(category);
		} catch (error) {
			console.error(error);
			return res.status(400).json({ error: "Erro ao deletar categoria" });
		}
	}
}

export default new CategoryController();
