import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { LoginRequest, LoginResponse, User } from "../types/auth";

import { prisma } from "../prisma";

//LOGIN
export async function login(req: Request, res: Response) {
    try {
        //1.obtener datos del body
        const { email, password } = req.body as LoginRequest;

        //2.validar que llegaron los datos
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        //3.buscar ususario por email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        //4.validar password (user.password is the hash)
        const isPasswordValid = await bcrypt.compare(password, user.password); // Using 'password' field from DB model which stores hash
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        //5.generar token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'default_secret', // Usar una variable de entorno para el secreto
            { expiresIn: '1h' }
        );

        //6.preparar respuesta sin password
        const userData: User = {
            id: user.id,
            email: user.email,
            name: user.name,
            rol: user.role // Mapping Prisma 'role' to AuthType 'rol'
        };

        //7.enviar respuesta
        const response: LoginResponse = {
            user: userData,
            token
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}