import { Request, Response } from 'express';
import { driver } from '../config/neo4j';

export const RecomendationGroupController = {
  recommendForGroupWithoutCreation: async (req: Request, res: Response): Promise<void> => {
    const { requiredSkills = [] } = req.body;
    const session = driver.session();

    try {
      const skillNames = requiredSkills.map((skill: { name: string }) => skill.name);

      const result = await session.run(`
        UNWIND $skills AS skillName
        MATCH (s:Skill {name: skillName})<-[:HAS_SKILL]-(u:User)
        OPTIONAL MATCH (u)-[:HAS_SKILL]->(userSkills:Skill)
        OPTIONAL MATCH (u)-[:WORKS_IN]->(userFields:FieldOfWork)
        WITH u, count(DISTINCT s) AS score, collect(DISTINCT userSkills) AS skills, collect(DISTINCT userFields) AS fieldsOfWork
        RETURN u, skills, fieldsOfWork, score
        ORDER BY score DESC
      `, { skills: skillNames });

      const recommendedUsers = result.records.map(record => ({
        ...record.get('u').properties,
        skills: record.get('skills').map((s: any) => s.properties),
        fieldsOfWork: record.get('fieldsOfWork').map((f: any) => f.properties),
        score: record.get('score').toInt()
      }));

      res.status(200).json(recommendedUsers);
    } catch (error) {
      console.error('Erro ao recomendar membros:', error);
      res.status(500).json({ message: 'Erro ao recomendar membros' });
    } finally {
      await session.close();
    }
  }
};
