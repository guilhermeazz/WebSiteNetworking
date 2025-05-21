import { Request, Response } from 'express';
import { driver } from '../config/neo4j';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET!; 

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (u:User {email: $email}) RETURN u`,
      { email }
    );

    if (result.records.length === 0) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    const user = result.records[0].get('u').properties;

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Senha incorreta' });
      return;
    }

    // Remover password do retorno
    delete user.password;

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login bem-sucedido', token, user });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no login' });
  } finally {
    await session.close();
  }
};
