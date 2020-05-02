// usei o express para criar e configurar meu servidor
const express = require("express")
const server = express()

const db = require("./db")

// Configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

// habilitar o uso do req.body
server.use(express.urlencoded({ extended: true}))

// Configuraço do ninjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
  express: server,
  noCache: true,
})

//criei uma rota / 
// e capturo o pedido do cliente para responder
server.get("/", function(req, res){

  db.all(`SELECT * FROM ideas`, function(err, rows){
    if (err) {
      console.log(err)
      return res.send("Erro no banco de Dados")
    }

    const reversedIdeas = [...rows].reverse()

    let lastIdeas = []
    for (idea of reversedIdeas) {
      if(lastIdeas.length < 2) {
        lastIdeas.push(idea)
      }
    }
  
  return res.render("index.html", { ideas: lastIdeas })
  })

  
})


server.get("/ideas", function(req, res){

  db.all(`SELECT * FROM ideas`, function(err, rows){
    if (err) {
      console.log(err)
      return res.send("Erro no banco de Dados")
    }

    const reversedIdeas = [...rows].reverse()
 
    return res.render("ideas.html", { ideas: reversedIdeas})
  })

  
})

server.post("/", function(req, res){
  // // Inserir Dados na tabeka
  const query = `
  INSERT INTO ideas(
    image,
    title,
    category,
    description,
    link
  ) VALUES (?,?,?,?,?);
  `

  const values = [
    req.body.image,
    req.body.title,
    req.body.category, 
    req.body.description,
    req.body.link,

  ]

  db.run(query, values, function(err){
    if (err) {
      console.log(err)
      return res.send("Erro no banco de Dados")
    }

    return res.redirect("/ideas")

  })
})

// Liguei meu servidor na porta 3000
server.listen(3000)
 
