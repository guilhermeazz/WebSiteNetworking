import app from './app';
import dotenv from 'dotenv';
import { driver } from './config/neo4j';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Testa a conexão com o Neo4j
    const session = driver.session();
    await session.run('RETURN 1');
    await session.close();

    console.log('✅ Conectado com sucesso ao Neo4j');

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Erro ao conectar ao Neo4j:', error);
    process.exit(1); // Finaliza o processo com erro
  }
};

startServer();
