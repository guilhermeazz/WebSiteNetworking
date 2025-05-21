import { Request, Response } from 'express';
import { driver } from '../config/neo4j';
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';

export const UserController = {
  create: async (req: Request, res: Response): Promise<void> => {
    const id = uuidv4();
    const {name, email, password, skills = [], interests = [], fieldsOfWork = [] } = req.body;
    const session = driver.session();

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      await session.run(
        `CREATE (u:User {id: $id, name: $name, email: $email, password: $password})`,
        { id, name, email, password: hashedPassword }
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

  update: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, email, skills = [], interests = [], fieldsOfWork = [] } = req.body;
    const session = driver.session();

    try {
      await session.run(
        `MATCH (u:User {id: $id})
         SET u.name = $name, u.email = $email`,
        { id, name, email }
      );

      await session.run(`MATCH (u:User {id: $id})-[r:HAS_SKILL|INTERESTED_IN|WORKS_IN]->() DELETE r`, { id });

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

      res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ message: 'Erro ao atualizar usuário' });
    } finally {
      await session.close();
    }
  },

  findAll: async (_: Request, res: Response): Promise<void> => {
    const session = driver.session();

    try {
      const result = await session.run(`
        MATCH (u:User)
        OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
        OPTIONAL MATCH (u)-[:INTERESTED_IN]->(i:Interest)
        OPTIONAL MATCH (u)-[:WORKS_IN]->(f:FieldOfWork)
        RETURN u, collect(DISTINCT s) AS skills, collect(DISTINCT i) AS interests, collect(DISTINCT f) AS fieldsOfWork
      `);

      const users = result.records.map(record => {
        const u = record.get('u').properties;

        return {
          ...u,
          skills: record.get('skills').map((s: any) => s.properties),
          interests: record.get('interests').map((i: any) => i.properties),
          fieldsOfWork: record.get('fieldsOfWork').map((f: any) => f.properties)
        };
      });

      res.status(200).json(users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    } finally {
      await session.close();
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const session = driver.session();
    try {
      await session.run(`MATCH (u:User {id: $id}) DETACH DELETE u`, { id: req.params.id });
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ message: 'Erro ao deletar usuário' });
    } finally {
      await session.close();
    }
  },
};
