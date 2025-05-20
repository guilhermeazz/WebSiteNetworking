import { Request, Response } from 'express';
import { driver } from '../config/neo4j';

export const ProjectGroupController = {
  create: async (req: Request, res: Response): Promise<void> => {
    const { id, name, description, requiredSkills = [] } = req.body;
    const session = driver.session();

    try {
      await session.run(
        `CREATE (g:ProjectGroup {id: $id, name: $name, description: $description})`,
        { id, name, description }
      );

      for (const skill of requiredSkills) {
        await session.run(
          `MERGE (s:Skill {name: $name})
           WITH s
           MATCH (g:ProjectGroup {id: $groupId})
           MERGE (g)-[:NEEDS]->(s)`,
          { name: skill.name, groupId: id }
        );
      }

      res.status(201).json({ message: 'Grupo criado com sucesso!' });
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      res.status(500).json({ message: 'Erro ao criar grupo' });
    } finally {
      await session.close();
    }
  },

  recommendMembers: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const session = driver.session();

    try {
      const result = await session.run(
        `MATCH (g:ProjectGroup {id: $groupId})-[:NEEDS]->(s:Skill)<-[:HAS_SKILL]-(u:User)
         RETURN DISTINCT u`,
        { groupId: id }
      );

      const recommended = result.records.map(record => record.get('u').properties);
      res.status(200).json(recommended);
    } catch (error) {
      console.error('Erro ao recomendar membros:', error);
      res.status(500).json({ message: 'Erro ao recomendar membros' });
    } finally {
      await session.close();
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const session = driver.session();
    try {
      await session.run(
        `MATCH (g:ProjectGroup {id: $id}) DETACH DELETE g`,
        { id: req.params.id }
      );
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
      res.status(500).json({ message: 'Erro ao deletar grupo' });
    } finally {
      await session.close();
    }
  }
};
