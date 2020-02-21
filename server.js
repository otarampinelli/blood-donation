// configurando o servidor 
const express = require("express");
const server = express();

// configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'));

// habilitar body do form
server.use(express.urlencoded({ extended: true }));

// configurar a conexão com o db
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    password: 'somepassword',
    host: 'localhost',
    post: 5432,
    database: 'donors' 
})

// configurando a template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true,
});


// configurar a apresentação da página
server.get("/", function(req, res) {
    return res.render("index.html", { donors });
});

server.post("/", function(req, res) {
    // pegar dados do formulario
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    // coloca os valores dentro do banco de dados
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ('$1, $2, $3')`;
    db.query(query, [name, email, blood]);

     return res.redirect("/");
});

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
    console.log("started server");
});
