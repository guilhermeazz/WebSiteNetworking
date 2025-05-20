import { Router } from 'express';
import { FollowController } from '../controllers/follow.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: Endpoints para seguir, deixar de seguir e visualizar seguidores de usuários
 */

/**
 * @swagger
 * /users/{id}/follow:
 *   post:
 *     summary: Seguir um usuário
 *     tags: [Follow]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário a ser seguido
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followerId:
 *                 type: string
 *                 description: ID do usuário que está seguindo
 *     responses:
 *       200:
 *         description: Usuário seguido com sucesso
 *       500:
 *         description: Erro ao seguir o usuário
 */
router.post('/:id/follow', FollowController.follow);

/**
 * @swagger
 * /users/{id}/follow:
 *   delete:
 *     summary: Deixar de seguir um usuário
 *     tags: [Follow]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário a ser deixado de seguir
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followerId:
 *                 type: string
 *                 description: ID do usuário que deixará de seguir
 *     responses:
 *       204:
 *         description: Usuário deixado de seguir com sucesso
 *       500:
 *         description: Erro ao deixar de seguir o usuário
 */
router.delete('/:id/follow', FollowController.unfollow);

/**
 * @swagger
 * /users/{id}/followers:
 *   get:
 *     summary: Lista os seguidores de um usuário
 *     tags: [Follow]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário a ser consultado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de seguidores
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
 *                   email:
 *                     type: string
 */
router.get('/:id/followers', FollowController.getFollowers);

export default router;
