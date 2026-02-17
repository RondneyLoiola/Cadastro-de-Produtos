import type { Request, Response } from "express";
import { z } from "zod";
import prisma from "../../config/prisma";
import { buildValidationErrorMessage } from "../../utils/validatorErrors";

class ProductController {
	async store(req: Request, res: Response) {
		try {
			const schema = z.object({
				name: z.string("Nome é obrigatoria"),
				price: z.coerce.number().positive("Preço precisa ser maior que zero"),
				description: z.string().min(1, "Descrição é obrigatoria"),
				quantity: z.coerce
					.number("Quantidade é obrigatoria")
					.positive("Quantidade precisa ser maior que zero"),
				categoryId: z.string("Categória é obrigatoria"),
			});

			const product = schema.safeParse(req.body);

			if (!product.success) {
				const errors = buildValidationErrorMessage(product.error.issues);

				return res.status(422).json({
					message: errors,
				});
			}

			const { name, price, description, quantity, categoryId } = product.data;
			const image = req.file?.filename;

			const newProduct = await prisma.product.create({
				data: {
					name,
					price,
					description,
					quantity,
					image: image ?? null,
					category: {
						connect: {
							id: categoryId,
						},
					},
				},
				include: {
					category: true,
				},
			});

			if (!newProduct) {
				return res.status(400).json({ error: "Produto não foi criado" });
			}

			return res.status(201).json(newProduct);
		} catch (error) {
			console.error(error);
			return res.status(400).json({ error: "Erro ao criar produto" });
		}
	}

	async index(_req: Request, res: Response) {
		try {
			const products = await prisma.product.findMany({
				where: {
					quantity: {
						gt: 0,
					},
				},
				include: {
					category: true,
				},
			});

			if (!products) {
				return res.status(400).json({ error: "Produtos não encontrados" });
			}

			const productsWithImageUrl = products.map((product) => ({
				...product,
				image: product.image
					? `http://localhost:3001/product-file/${product.image}`
					: null,
			}));

			return res.status(200).json(productsWithImageUrl);
		} catch (error) {
			console.error(error);
			return res.status(400).json({ error: "Erro ao listar produtos" });
		}
	}

	async show(req: Request, res: Response) {
		try {
			const product = await prisma.product.findUnique({
				where: {
					id: String(req.params.productId),
				},
			});

			if (!product) {
				return res.status(400).json({ error: "Produto nao encontrado" });
			}
			const productWithImageUrl = {
				...product,
				image: product.image
					? `http://localhost:3001/product-file/${product.image}`
					: null,
			};

			return res.status(200).json(productWithImageUrl);
		} catch (error) {
			console.error(error);
			return res.status(400).json({ error: "Erro ao listar produto" });
		}
	}

	async edit(req: Request, res: Response) {
		try {
			const { name, price, description, quantity, categoryId } = req.body;

			const editProduct = await prisma.product.update({
				where: {
					id: String(req.params.productId),
				},
				data: {
					name,
					price,
					description,
					quantity,
					categoryId,
				},
				include: {
					category: true,
				},
			});

			if (!editProduct) {
				return res.status(400).json({ error: "Produto não encontrado" });
			}

			return res
				.status(200)
				.json({ message: "Produto editado com sucesso", editProduct });
		} catch (error) {
			console.error(error);
			return res.status(400).json({ error: "Erro ao editar produto" });
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { productId } = req.params;

			await prisma.product.delete({
				where: {
					id: String(productId),
				},
			});

			return res.status(200).json({ message: "Produto deletado com sucesso" });
		} catch (error) {
			console.error(error);
			return res.status(400).json({ error: "Erro ao deletar produto" });
		}
	}
}

export default new ProductController();
