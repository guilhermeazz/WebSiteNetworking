import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/', UserController.findAll);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário com suas relações
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado
 */
router.post('/', UserController.create);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário e seus relacionamentos
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuário removido
 */
router.delete('/:id', UserController.delete);

export default router;
