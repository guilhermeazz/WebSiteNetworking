import { Router } from 'express';
import { ProjectGroupController } from '../controllers/projectGroup.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ProjectGroups
 *   description: Grupos de desenvolvimento
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectGroup:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         requiredSkills:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Skill'
 */

router.post('/', ProjectGroupController.create);

/**
 * @swagger
 * /groups/{id}/recommend:
 *   get:
 *     summary: Recomenda usuários com base nas skills do grupo
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
 */
router.get('/:id/recommend', ProjectGroupController.recommendMembers);

/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     summary: Deleta um grupo e seus relacionamentos
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
 *         description: Grupo deletado
 */
router.delete('/:id', ProjectGroupController.delete);

export default router;
