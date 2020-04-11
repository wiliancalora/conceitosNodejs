const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//middleware verica se e valido o id caso for prossegue
function validateRepositorieId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid repository ID.'});
  }

  return next();
}

function findIndexRepositorieId(id){
  const repositoryIndex = repositories.findIndex(rep => rep.id === id);

  if ( repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found.'});
  }
  return repositoryIndex;
}

//o middleware aplica-se somente na rota abaixo
app.use('/repositorie/:id', validateRepositorieId);
app.use('/repositorie/:id/:like', validateRepositorieId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  //faz a desestruturação  
  const { title, url, techs } = request.body;
  
  //construo um novo repositorio
  const repository = { 
    id : uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  };
  //adicionar na lista de repositorios
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateRepositorieId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  //validacao
  const repositoryIndex = findIndexRepositorieId(id);

  //atualiza o repositorio
  const repository = {
    id,
    title,
    url,
    techs,
    likes : repositories[repositoryIndex].likes,
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositorieId, (request, response) => {
  
  const { id } = request.params;
  const repositoryIndex = findIndexRepositorieId(id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
 
});

app.post("/repositories/:id/like", validateRepositorieId, (request, response) => {
  const { id } = request.params;

  //validacao
  const repositoryIndex = findIndexRepositorieId(id);

  //atualiza o like do repositorio
  repositories[repositoryIndex].likes++;
  
  return response.json(repositories[repositoryIndex]);
});


module.exports = app;
