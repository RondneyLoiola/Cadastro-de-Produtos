import { Request, Response } from "express";
import {z} from 'zod'
import prisma from "../../config/prisma";

class ProductController {
    async store(req: Request, res: Response){
        try {
            const schema = z.object({
                name: z.string(),
                price: z.number(),
                description: z.string(),
                quantity: z.number(),
                categoryId: z.string()
            })

            const {name, price, description, quantity, categoryId} = schema.parse(req.body)

            if(!name || !categoryId) {
                return res.status(400).json({error: 'Name and CategoryId are required'})
            }

            const product = await prisma.product.create({
                data: {
                    name,
                    price, 
                    description,
                    quantity,
                    category: {
                        connect: {
                            id: categoryId
                        }
                    }
                },
                include: {
                    category: true
                }
            })

            if(!product) {
                return res.status(400).json({error: 'Produto não foi criado'})
            }

            return res.status(201).json(product)
        } catch (error) {
            console.error(error)
            return res.status(400).json({error: 'Erro ao criar produto'})
        }
    }

    async index(req: Request, res: Response) {
        try {
            const products = await prisma.product.findMany({
                where:{
                    quantity: {
                        gt: 0
                    }
                },
                include: {
                    category: true
                }
            })

            if(!products) {
                return res.status(400).json({error: 'Produtos não encontrados'})
            }

            return res.status(200).json(products)
        } catch (error) {
            console.error(error)
            return res.status(400).json({error: 'Erro ao listar produtos'})
        }
    }

    async show(req: Request, res: Response){
        try {
            const product = await prisma.product.findUnique({
                where: {
                    id: String(req.params.productId)
                }
            })

            if(!product){
                return res.status(400).json({error: 'Produto nao encontrado'})
            }

            return res.status(200).json(product)
        } catch (error) {
            console.error(error)
            return res.status(400).json({error: 'Erro ao listar produto'})
        }
    }

    async edit(req: Request, res: Response){
        try {
            const {name, price, description, quantity, categoryId} = req.body

            const editProduct = await prisma.product.update({
                where: {
                    id: String(req.params.productId)
                },
                data: {
                    name,
                    price,
                    description,
                    quantity,
                    categoryId
                },
                include: {
                    category: true
                }
            })

            if(!editProduct){
                return res.status(400).json({error: 'Produto não encontrado'})
            }

            return res.status(200).json({message: 'Produto editado com sucesso', editProduct})
        } catch (error) {
            console.error(error)
            return res.status(400).json({error: 'Erro ao editar produto'})
        }
    }
}

export default new ProductController