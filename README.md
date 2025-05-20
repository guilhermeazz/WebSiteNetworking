# 🧠 ConnectDev — Conectando Desenvolvedores com Propósito

> Plataforma de conexão entre desenvolvedores(as) baseada em perfis, interesses técnicos, habilidades comportamentais e redes em comum.

---

## 📌 Visão Geral

O **ConnectDev** é uma plataforma pensada para impulsionar conexões reais entre devs com base em **similaridades técnicas, comportamentais e contextuais**. Ideal para:

* Desenvolvedores buscando conexões para **projetos, aprendizado ou networking**
* Mentores e mentorados em **busca de afinidade real**
* Comunidades e eventos tech que desejam promover **matchs entre membros**

---

## 🔍 Funcionalidades

* ✅ Cadastro e autenticação de usuários
* ✅ Perfil com habilidades técnicas, soft skills, experiência e objetivos
* ✅ Sistema de recomendações com base em:

  * Habilidades em comum
  * Conexões mútuas
  * Tecnologias complementares
  * Objetivos parecidos
* ✅ Sugestão de conexões com **explicação dos critérios utilizados**
* ✅ Histórico de conexões aceitas, recusadas ou pendentes
* ✅ Integração opcional com GitHub e LinkedIn

---

## 🧱 Tecnologias Utilizadas

### 🖥️ Backend

* ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white) **Node.js**
* ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white) **TypeScript**
* ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white) **Express.js**
* ![Neo4j](https://img.shields.io/badge/Neo4j-008CC1?style=for-the-badge\&logo=neo4j\&logoColor=white) **Neo4j**
* ![Dotenv](https://img.shields.io/badge/Dotenv-ECD53F?style=for-the-badge\&logo=dotenv\&logoColor=black) **Dotenv**

### 💻 Frontend (em desenvolvimento)

* ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge\&logo=react\&logoColor=black) **React.js**
* ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white) **Tailwind CSS**

---

## 🧠 Arquitetura do Projeto

```
connectdev-backend/
├── src/
│   ├── controllers/        # Lógica das rotas
│   ├── routes/             # Endpoints HTTP
│   ├── services/           # Lógica de recomendação e negócio
│   ├── models/             # Queries Cypher e interfaces
│   ├── db/                 # Conexão com Neo4j
│   └── index.ts            # Inicializador do servidor
├── .env
├── tsconfig.json
└── package.json
```

---

## 🔄 Recomendador com Neo4j

Usamos **Neo4j** para mapear relações:

```
(:Pessoa)-[:CONHECE]->(:Pessoa)
(:Pessoa)-[:TEM_HABILIDADE]->(:Skill)
(:Pessoa)-[:BUSCA_OBJETIVO]->(:Objetivo)
```

Essas ligações são analisadas para sugerir conexões com base em:

* Similaridade de perfil (habilidades e objetivos)
* Número de conexões em comum
* Tecnologias que se complementam
* Compatibilidade comportamental

---

## 🚀 Como Rodar o Projeto

1. Clone o repositório:

```bash
git clone https://github.com/seuuser/connectdev-backend.git
cd connectdev-backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o ambiente:
   Crie um arquivo `.env` na raiz do projeto:

```ini
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=suasenha
PORT=3000
```

4. Inicie o servidor:

```bash
npm run dev
```

---

Feito com ❤️ por pessoas desenvolvedoras com o objetivo de criar pontes reais no universo tech.
