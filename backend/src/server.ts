import dotenv from 'dotenv'
dotenv.config()

import app from './app'
import { prismaConnect } from './config/prisma'

const port = process.env.PORT

const startServer = async () => {
    try {
        await prismaConnect()

        app.listen(port, () => {
            console.log(`🚀 Servidor rodando na porta ${port}`)
        })
    } catch (error) {
        console.log(error)
        console.log('❌ Erro ao iniciar o servidor')
    }
}

startServer()
