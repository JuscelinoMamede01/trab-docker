const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analisar o corpo das requisições
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// Rota para página de login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rota para página de cadastro
app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cadastro.html"));
});

// Rota para processar o cadastro
app.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;
  pool.query('INSERT INTO usuarios (nome, email) VALUES (?, ?, ?)', [nome, email, senha ], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: results.insertId, nome, email, senha });
  }); 
});

// Rota para processar o login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1 AND senha = $2",
      [email, senha]
    );

    if (result.rows.length > 0) {
      res
        .status(200)
        .json({
          message: "Login realizado com sucesso!",
          usuario: result.rows[0],
        });
    } else {
      res.status(401).json({ message: "Email ou senha incorretos." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao realizar login." });
  }
});

// Rota para buscar todos os usuários
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar usuários." });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
