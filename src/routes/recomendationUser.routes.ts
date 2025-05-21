import { Router } from 'express';
import { RecomendationUserController } from '../controllers/recomendationUser.controller';
import { authMiddleware } from '../middlewares/auth.middleware'; 

const router = Router();

/**
 * @swagger
 * tags:
 *   name: UserRecommendations
 *   description: Endpoints para recomendação de usuários com base em interesses, habilidades e conexões
 */

/**
 * @swagger
 * /users/{id}/recommendations:
 *   get:
 *     summary: Lista usuários recomendados com base em similaridade e amigos de amigos
 *     security:
 *       - bearerAuth: []
 *     tags: [UserRecommendations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário base para recomendação
 *     responses:
 *       200:
 *         description: Lista de usuários recomendados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   score:
 *                     type: integer
 */
router.get('/:id/recommendations', authMiddleware, RecomendationUserController.findRelatedUsers);

/**
 * @swagger
 * /users/search-by-techs:
 *   post:
 *     summary: Busca usuários por tecnologias com ordenação por afinidade
 *     security:
 *       - bearerAuth: []
 *     description: Retorna uma lista de usuários que possuem uma ou mais das tecnologias especificadas. O resultado é ordenado com base na quantidade de tecnologias coincidentes.
 *     tags: [UserRecommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - techs
 *             properties:
 *               techs:
 *                 type: array
 *                 description: Lista de tecnologias (skills) para busca
 *                 items:
 *                   type: string
 *                 example: ["React", "Node.js", "Neo4j"]
 *     responses:
 *       200:
 *         description: Lista de usuários encontrados por tecnologias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "user-123"
 *                   name:
 *                     type: string
 *                     example: "Maria Oliveira"
 *                   score:
 *                     type: integer
 *                     description: Quantidade de tecnologias em comum com as fornecidas
 *                     example: 3
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "React"
 *                   fieldsOfWork:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Desenvolvimento Full Stack"
 */
router.post('/search-by-techs', authMiddleware, RecomendationUserController.findByTechnologies);

export default router;
