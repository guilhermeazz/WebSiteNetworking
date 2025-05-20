import { Request, Response } from 'express';
import { driver } from '../config/neo4j';

export const FollowController = {
  follow: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { followerId } = req.body;
    const session = driver.session();

    try {
      await session.run(
        `MATCH (a:User {id: $followerId}), (b:User {id: $id})
         MERGE (a)-[:FOLLOWS]->(b)`,
        { followerId, id }
      );
      res.status(200).json({ message: 'Usuário seguido com sucesso.' });
    } catch (error) {
      console.error('Erro ao seguir usuário:', error);
      res.status(500).json({ message: 'Erro ao seguir usuário.' });
    } finally {
      await session.close();
    }
  },

  unfollow: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { followerId } = req.body;
    const session = driver.session();

    try {
      await session.run(
        `MATCH (:User {id: $followerId})-[r:FOLLOWS]->(:User {id: $id})
         DELETE r`,
        { followerId, id }
      );
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deixar de seguir usuário:', error);
      res.status(500).json({ message: 'Erro ao deixar de seguir usuário.' });
    } finally {
      await session.close();
    }
  },

  getFollowers: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const session = driver.session();

    try {
      const result = await session.run(
        `MATCH (follower:User)-[:FOLLOWS]->(u:User {id: $id})
         RETURN follower`,
        { id }
      );

      const followers = result.records.map(record => record.get('follower').properties);
      res.status(200).json(followers);
    } catch (error) {
      console.error('Erro ao buscar seguidores:', error);
      res.status(500).json({ message: 'Erro ao buscar seguidores.' });
    } finally {
      await session.close();
    }
  },
};
