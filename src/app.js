const express = require("express");
const cors = require("cors");

// Habilita o uso do uuid - Universal unique ID
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // rota de listagem - Lista todos os repositórios
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  /*
      A rota deve receber title, url e techs dentro do corpo da requisição, 
      sendo a URL o link para o github desse repositório. Ao cadastrar um novo projeto, 
      ele deve ser armazenado dentro de um objeto no seguinte formato: 
      { id: "uuid", 
        title: 'Desafio Node.js', 
        url: 'http://github.com/...', 
        techs: ["Node.js", "..."], 
        likes: 0 }; 
      Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0
  */
  // Como é a rota de criação do repositório, temos que começar com ela, pois as
  // demais (por mais que isso seja óbvio) só vão ser possíveis de ser utilizadas
  // caso exista um repositório.

  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepositoryIndex = repositories.findIndex(repository =>
    repository.id === id
  );

  // Verifica se o repositório existe
  if (findRepositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository does not exists.' });
  } 

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepositoryIndex].likes,
  };

  repositories[findRepositoryIndex] = repository;
  
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(repository =>
    repository.id === id
  );

  // Remove do repositório caso ele não exista
  if (findRepositoryIndex > -1) {
    repositories.splice(findRepositoryIndex, 1); // O splice remove o dito cujo no índice
  } else {
      return response.status(400).json({ error: 'Repository does not exists.' });
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // rota dos likes
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(repository =>
    repository.id === id
  );

  // Verifica se o repositório existe
  if (findRepositoryIndex === -1) {
    return response.status(400).json({ error: 'Repository does not exists.' });
  } 

  repositories[findRepositoryIndex].likes++;

  return response.json(repositories[findRepositoryIndex]);
  
});

module.exports = app;
