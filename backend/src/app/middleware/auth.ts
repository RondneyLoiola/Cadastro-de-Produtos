import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

const secret_key = process.env.JWT_SECRET_KEY;

export interface AuthRequest extends Request {
	user?: {
		id: string;
		admin: boolean;
		name: string;
	};
}

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ error: "Token não fornecido" });
	}

	const token = authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "Token mal formatado" });
	}

	try {
		const decoded = jwt.verify(token, String(secret_key)) as {
			id: string;
			admin: boolean;
			name: string;
		};

		(req as AuthRequest).user = decoded;

		next();
	} catch (_error) {
		return res.status(401).json({ error: "Token inválido" });
	}
};

export const requireAdmin = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ error: "Token não fornecido" });
	}

	const token = authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "Token mal formatado" });
	}

	try {
		const decoded = jwt.verify(token, String(secret_key)) as {
			id: string;
			admin: boolean;
			name: string;
		};

		if (!decoded.admin) {
			return res
				.status(403)
				.json({
					error:
						"Acesso negado. Apenas administradores podem realizar esta ação.",
				});
		}

		(req as AuthRequest).user = decoded;

		next();
	} catch (_error) {
		return res.status(401).json({ error: "Token inválido" });
	}
};
