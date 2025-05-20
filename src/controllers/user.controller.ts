import { Request, Response } from 'express';
import { driver } from '../config/neo4j';

export const UserController = {
  create: async (req: Request, res: Response): Promise<void> => {
    const { id, name, email, password, skills = [], interests = [], fieldsOfWork = [] } = req.body;
    const session = driver.session();

    try {
      await session.run(
        `CREATE (u:User {id: $id, name: $name, email: $email, password: $password})`,
        { id, name, email, password }
      );

      for (const skill of skills) {
        await session.run(
          `MERGE (s:Skill {name: $name})
           WITH s
           MATCH (u:User {id: $userId})
           MERGE (u)-[:HAS_SKILL]->(s)`,
          { name: skill.name, userId: id }
        );
      }

      for (const interest of interests) {
        await session.run(
          `MERGE (i:Interest {name: $name})
           WITH i
           MATCH (u:User {id: $userId})
           MERGE (u)-[:INTERESTED_IN]->(i)`,
          { name: interest.name, userId: id }
        );
      }

      for (const field of fieldsOfWork) {
        await session.run(
          `MERGE (f:FieldOfWork {name: $name})
           WITH f
           MATCH (u:User {id: $userId})
           MERGE (u)-[:WORKS_IN]->(f)`,
          { name: field.name, userId: id }
        );
      }

      res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ message: 'Erro ao criar usuário' });
    } finally {
      await session.close();
    }
  },

  findAll: async (_: Request, res: Response): Promise<void> => {
    const session = driver.session();
    try {
      const result = await session.run('MATCH (u:User) RETURN u');
      const users = result.records.map(record => record.get('u').properties);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    } finally {
      await session.close();
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const session = driver.session();
    try {
      await session.run(
        `MATCH (u:User {id: $id}) DETACH DELETE u`,
        { id: req.params.id }
      );
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ message: 'Erro ao deletar usuário' });
    } finally {
      await session.close();
    }
  }
};