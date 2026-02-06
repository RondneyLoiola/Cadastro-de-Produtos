import { PrismaClient } from '../../prisma/generated/client'

const prisma = new PrismaClient()

export const prismaConnect = async () => {
    console.log('Conectando ao banco de dados...')
    try {
        await prisma.$connect()
        console.log('🟢 Banco de dados conectado com sucesso!')
    } catch (error) {
        console.log('❌ Erro ao conectar ao banco de dados')
    }
}

export default prisma

