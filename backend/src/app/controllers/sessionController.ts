/** biome-ignore-all lint/style/noNonNullAssertion: existingUser */

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "../../config/prisma";

dotenv.config();

const secret_key = process.env.JWT_SECRET_KEY;
const _expires_in = process.env.JWT_EXPIRES_IN;

class SessionController {
	async store(req: Request, res: Response) {
		try {
			const schema = z.object({
				email: z.email(),
				password: z.string(),
			});

			const isValid = schema.safeParse(req.body);

			const emailOrPasswordIncorrect = () => {
				return res.status(400).json({ error: "Email or password incorrect!" });
			};

			if (!isValid) {
				emailOrPasswordIncorrect();
			}

			const { email, password } = req.body;

			const existingUser = await prisma.user.findUnique({
				where: {
					email,
				},
			});

			if (!existingUser) {
				emailOrPasswordIncorrect();
			}

			const isPasswordCorrect = await bcrypt.compare(
				password,
				existingUser!.password,
			);

			if (!isPasswordCorrect) {
				emailOrPasswordIncorrect();
			}

			const token = jwt.sign(
				{
					id: existingUser!.id,
					admin: existingUser!.isAdmin,
					name: existingUser!.name,
				},
				String(secret_key),
				{
					expiresIn: "1d",
				},
			);

			return res.status(200).json({
				user: {
					id: existingUser!.id,
					name: existingUser!.name,
					email: existingUser!.email,
					isAdmin: existingUser!.isAdmin,
				},
				token,
			});
		} catch (error) {
			return res.status(400).json({ error: error });
		}
	}
}

export default new SessionController();
