/**
 * POST => Inserir um dado
 * GET => Buscar um ou mais dados
 * PUT => Alterar um dado
 * DELETE => remover um dado
 */
/*
 * Body => sempre que eu quiser enviar dados para a minha aplicação
 * Params => tudo o que vem na Url(parâmetros de rota)
 * Query => faz parte da rota, mas não são required. ex: /kanto?id=36172321&value=321673
 */


const express = require("express");
const { randomUUID } = require("crypto"); //random id
const fs = require("fs");

const app = express();
const port = 3000;
const hostname = "127.0.0.1";

app.use(express.json());

let pokedex = [];

fs.readFile("pokedex.json", "utf-8", (err, data) => {
  if (err) console.log(err);
  else pokedex = JSON.parse(data);
});

//inserir um novo pokémon dentro da pokedéx
app.post("/kanto", (req, res) => {
  const { name, number, type } = req.body; //tudo que vem na requisição do body

  const pokemon = {
    name,
    number,
    type,
    id: randomUUID(),
  };

  pokedex.push(pokemon);
  pokedexFile();

  return res.json(pokemon);
});

//vai retornar os dados salvos
app.get("/kanto", (req, res) => {
  return res.json(pokedex);
});

//buscar pelo id
app.get("/kanto/:id", (req, res) => {
  const { id } = req.params;
  const pokemon = pokedex.find((pokemon) => pokemon.id === id);
  return res.json(pokemon);
});

//alterar algum valor ou propriedade do objeto
app.put("/kanto/:id", (req, res) => {
  //para alterar precisa dos dados desse objeto, ou seja, o id e as propriedades
  const { id } = req.params;
  const { name, number, type } = req.body;

  const pokeIndex = pokedex.findIndex((pokemon) => pokemon.id === id);
  pokedex[pokeIndex] = {
    ...pokedex[pokeIndex],
    name,
    number,
    type,
  };

  pokedexFile();

  return res.json({ message: "Produto alterado com sucesso!" });
});

//remover um pokémon
app.delete("/kanto/:id", (req, res) => {
  const { id } = req.body;
  const pokeIndex = pokedex.findIndex((pokemon) => pokemon.id === id);

  //remove 1 item com o id encontrado
  pokedex.splice(pokeIndex, 1);

  pokedexFile();

  return res.json({ message: "Produto removido!" });
});

//servidor
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


function pokedexFile() {
  fs.writeFile("pokedex.json", JSON.stringify(pokedex), (error) => {
    if (error) console.log(error);
    else console.log("Produto inserido!");
  });
}
