import { Request, Response } from 'express';
import { driver } from '../config/neo4j';

export const MeController = {
  me: async (req: Request, res: Response): Promise<void> => {
    const userId = (req.user as any).id;

    const session = driver.session();

    try {
      const result = await session.run(`
        MATCH (u:User {id: $id})
        OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
        OPTIONAL MATCH (u)-[:INTERESTED_IN]->(i:Interest)
        OPTIONAL MATCH (u)-[:WORKS_IN]->(f:FieldOfWork)
        RETURN u, collect(DISTINCT s) AS skills, collect(DISTINCT i) AS interests, collect(DISTINCT f) AS fieldsOfWork
      `, { id: userId });

      const record = result.records[0];

      if (!record) {
        res.status(404).json({ message: 'Usuário não encontrado' });
        return;
      }

      const user = record.get('u').properties;

      res.status(200).json({
        ...user,
        skills: record.get('skills').map((s: any) => s.properties),
        interests: record.get('interests').map((i: any) => i.properties),
        fieldsOfWork: record.get('fieldsOfWork').map((f: any) => f.properties)
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ message: 'Erro ao buscar perfil' });
    } finally {
      await session.close();
    }
  }
};
