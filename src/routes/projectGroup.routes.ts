import { Router } from 'express';
import { ProjectGroupController } from '../controllers/projectGroup.controller';
import { authMiddleware } from '../middlewares/auth.middleware'; 

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ProjectGroups
 *   description: Endpoints para gerenciamento de grupos de projeto e recomendação de membros
 */

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Cria um novo grupo de projeto com habilidades requeridas
 *     security:
 *       - bearerAuth: []
 *     tags: [ProjectGroups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *     responses:
 *       201:
 *         description: Grupo criado com sucesso
 */
router.post('/', authMiddleware, ProjectGroupController.create);

/**
 * @swagger
 * /groups/{id}:
 *   put:
 *     summary: Atualiza um grupo de projeto existente
 *     security:
 *       - bearerAuth: []
 *     tags: [ProjectGroups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do grupo a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *     responses:
 *       200:
 *         description: Grupo atualizado com sucesso
 */
router.put('/:id', authMiddleware, ProjectGroupController.update);

/**
 * @swagger
 * /groups/{id}/recommend:
 *   get:
 *     summary: Recomenda usuários com base nas habilidades necessárias do grupo
 *     security:
 *       - bearerAuth: []
 *     tags: [ProjectGroups]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do grupo
 *         required: true
 *         schema:
 *           type: string
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
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                   fieldsOfWork:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 */
router.get('/:id/recommend', authMiddleware, ProjectGroupController.recommendMembers);

/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     summary: Deleta um grupo e todos os seus relacionamentos
 *     security:
 *       - bearerAuth: []
 *     tags: [ProjectGroups]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do grupo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Grupo deletado com sucesso
 */
router.delete('/:id', authMiddleware, ProjectGroupController.delete);

export default router;
