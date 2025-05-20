import { Request, Response } from 'express';
import { driver } from '../config/neo4j';

export const RecomendationUserController = {
      findRelatedUsers: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const session = driver.session();

    try {
      const result = await session.run(`
        MATCH (u1:User {id: $id})
        MATCH (u2:User)
        WHERE u1 <> u2
        OPTIONAL MATCH (u1)-[:HAS_SKILL]->(s:Skill)<-[:HAS_SKILL]-(u2)
        OPTIONAL MATCH (u1)-[:INTERESTED_IN]->(i:Interest)<-[:INTERESTED_IN]-(u2)
        OPTIONAL MATCH (u1)-[:WORKS_IN]->(f:FieldOfWork)<-[:WORKS_IN]-(u2)
        OPTIONAL MATCH (u1)-[:FOLLOWS]->()-[:FOLLOWS]->(u2) // amigos de amigos
        WITH u2,
             count(DISTINCT s) AS skillScore,
             count(DISTINCT i) AS interestScore,
             count(DISTINCT f) AS fieldScore,
             count(DISTINCT u1) AS fofScore
        WITH u2, (skillScore + interestScore + fieldScore + fofScore) AS score
        WHERE score > 0
        RETURN u2, score
        ORDER BY score DESC
      `, { id });

      const relatedUsers = result.records.map(record => ({
        ...record.get('u2').properties,
        score: record.get('score').toInt()
      }));

      res.status(200).json(relatedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários relacionados:', error);
      res.status(500).json({ message: 'Erro ao buscar usuários relacionados' });
    } finally {
      await session.close();
    }
  },

  findByTechnologies: async (req: Request, res: Response): Promise<void> => {
    const { techs } = req.body; // techs: string[]
    const session = driver.session();

    try {
      const result = await session.run(`
        UNWIND $techs AS tech
        MATCH (s:Skill {name: tech})<-[:HAS_SKILL]-(u:User)
        OPTIONAL MATCH (u)-[:HAS_SKILL]->(userSkills:Skill)
        OPTIONAL MATCH (u)-[:WORKS_IN]->(userFields:FieldOfWork)
        WITH u, count(DISTINCT s) AS score, collect(DISTINCT userSkills) AS skills, collect(DISTINCT userFields) AS fieldsOfWork
        RETURN u, skills, fieldsOfWork, score
        ORDER BY score DESC
      `, { techs });

      const users = result.records.map(record => ({
        ...record.get('u').properties,
        skills: record.get('skills').map((s: any) => s.properties),
        fieldsOfWork: record.get('fieldsOfWork').map((f: any) => f.properties),
        score: record.get('score').toInt()
      }));

      res.status(200).json(users);
    } catch (error) {
      console.error('Erro ao buscar usuários por tecnologias:', error);
      res.status(500).json({ message: 'Erro ao buscar usuários por tecnologias' });
    } finally {
      await session.close();
    }
  }
};