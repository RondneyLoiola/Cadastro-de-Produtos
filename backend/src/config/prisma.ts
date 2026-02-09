import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "../../prisma/generated/client";

const prisma = new PrismaClient({
	datasourceUrl: String(process.env.DATABASE_URL),
});

export const prismaConnect = async () => {
	console.log("Conectando ao banco de dados...");
	try {
		await prisma.$connect();
		console.log("🟢 Banco de dados conectado com sucesso!");
	} catch (_error) {
		console.log("❌ Erro ao conectar ao banco de dados");
	}
};

export default prisma;
