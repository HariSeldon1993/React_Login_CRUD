const express = require("express");
const app = express();
const mysql = require("mysql");
const mysql2 = require("mysql2")
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//>>>>>> PARTE DO CRUD <<<<<<

app.use(express.json());
app.use(cors());

//Conexão com o banco
const db2 = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "pwbeta2",
});

//Variávies
const porta = 3003;

//Metódos

//GET
app.get("/get", (req, res) => {
  let sql = "select * from cadastro";
  db2.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//GET PESQUISA ID
app.get("/id/:id", (req, res) => {
  const id = req.params.id;

  let sql = `select * from cadastro where id = '${id}'`;
  db2.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      console.log(req.params.cpf);
      console.log(req.params.matricula);
      console.log(req.params.curso);
      res.send(result);
    }
  });
});

//GET PESQUISA NOME
app.get("/nome/:nome", (req, res) => {
  const nome = req.params.nome;
  let sql = `select * from cadastro where nome like '%${nome}%'`;
  db2.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.json(result);
    }
  });
});

//GET PESQUISA IDADE
app.get("/idade/:idade", (req, res) => {
  const idade = req.params.idade;
  let sql = `select * from cadastro where idade like '%${idade}%'`;
  db2.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  })      
});

//GET PESQUISA CPF
app.get("/cpf/:cpf", (req, res) => {
  const cpf = req.params.cpf;
  let sql = `select * from cadastro where cpf like '%${cpf}%'`;
  db2.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

//GET PESQUISA MATRICULA
app.get("/matricula/:matricula", (req, res) => {
  const matricula = req.params.matricula;
  let sql = `select * from cadastro where matricula like '%${matricula}%'`;
  db2.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

//GET PESQUISA CURSO
app.get("/curso/:curso", (req, res) => {
  const curso = req.params.curso;
  let sql = `select * from cadastro where curso like '%${curso}%'`;
  db2.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

//POST
app.post("/registrar", (req, res) => {
  const { name } = req.body;
  const { idade } = req.body;
  const { cpf } = req.body;
  const { matricula } = req.body;
  const { curso } = req.body;

  let sql = `insert into cadastro (nome,idade,cpf,matricula,curso) values (?, ?, ?, ?, ?)`;
  db2.query(sql, [name, idade, cpf, matricula, curso], (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

//PUT
app.put("/edit", (req, res) => {
  const { id } = req.body;
  const { name } = req.body;
  const { idade } = req.body;
  const { cpf } = req.body;
  const { matricula } = req.body;
  const { curso } = req.body;

  console.log(id);
  console.log(name);
  console.log(idade);
  console.log(cpf);
  console.log(matricula);
  console.log(curso);

  let sql =
    "update cadastro set nome= ?, idade= ?, cpf= ?, matricula= ?, curso= ? where id= ?";
  db2.query(sql, [name, idade, cpf, matricula, curso, id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//DELETE
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  let sql = "DELETE FROM cadastro WHERE id = ?";
  db2.query(sql, id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//porta
app.listen(porta, () => {
  console.log("rodando servidor");
});
//---------------------------------------------------------------------------

//>>>>>> PARTE DO LOGIN!!! <<<<<<
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "pwbeta2",
});

app.use(express.json());
app.use(cors());

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result.length == 0) {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        db.query(
          "INSERT INTO usuarios (email, password) VALUE (?,?)",
          [email, hash],
          (error, response) => {
            if (err) {
              res.send(err);
            }

            res.send({ msg: "Usuário cadastrado com sucesso" });
          }
        );
      });
    } else {
      res.send({ msg: "Email já cadastrado" });
    }
  });
});

app.post("/", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (error) {
          res.send(error);
        }
        if (response) {
          res.send({ msg: "Usuário logado" });
        } else {
          res.send({ msg: "Senha incorreta" });
        }
      });
    } else {
      res.send({ msg: "Usuário não registrado!" });
    }
  });
});

app.listen(3001, () => {
  console.log("rodando na porta 3001");
});
