import {z} from 'zod'
import {Request, Response} from 'express'
import prisma from '../../config/prisma'

class CategoryController {
    async store(req: Request, res: Response) {
        try {
            const schema = z.object({
                name: z.string()
            })

            const {name} = schema.parse(req.body)

            if(!name) {
                return res.status(400).json({error: 'Name is required'})
            }

            const existingCategory = await prisma.category.findUnique({
                where: {
                    name
                }
            })

            if(existingCategory) {
                return res.status(400).json({error: 'Category already exists'})
            }

            const category = await prisma.category.create({
                data: {
                    name
                }
            })

            return res.status(201).json(category)
        } catch (error) {
            console.error(error)
            console.log('❌ Erro ao criar categoria')
        }
    }

    async index(req: Request, res: Response) {
        try {
            const categories = await prisma.category.findMany()

            return res.status(200).json(categories)
        } catch (error) {
            console.error(error)
            console.log('❌ Erro ao listar categorias')
        }
    }

    async show(req: Request, res: Response) {
        try {
            const {_id} = req.params

            const category = await prisma.category.findUnique({
                where: {
                    id: String(_id)
                }
            })

            return res.status(200).json(category)
        } catch (error) {
            console.error(error)
            console.log('❌ Erro ao listar categoria')
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { _id } = req.params
            const { name } = req.body

            const category = await prisma.category.update({
                where: {
                    id: String(_id)
                },
                data: {
                    name
                }
            })

            return res.status(200).json(category)
        } catch (error) {
            console.error(error)    
            console.log('❌ Erro ao atualizar categoria') 
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { _id } = req.params

            const category = await prisma.category.delete({
                where: {
                    id: String(_id)
                }
            })

            return res.status(200).json(category)
        } catch (error) {
            console.error(error)
            console.log('❌ Erro ao deletar categoria')
        }
    }
}

export default new CategoryController