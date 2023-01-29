import express from "express";
import { User } from "./user";
import { usersData } from "./database/usersData";

const app = express();
app.use(express.json());

// GET http://localhost:3333
app.get("/", (req, res) => {
  res.send({
    ok: true,
    message: "Tudo ok",
  });
});

app.post("/users", (req, res) => {
  try {
    const { name, cpf, email, age } = req.body;

    if (!name) {
      return res.status(400).send({
        ok: false,
        message: "Nome não foi preenchido",
      });
    }
    if (!cpf) {
      return res.status(400).send({
        ok: false,
        message: "CPF não foi preenchido",
      });
    }
    if (!age) {
      return res.status(400).send({
        ok: false,
        message: "Idade não foi preenchida",
      });
    }

    if (!email) {
      return res.status(400).send({
        ok: false,
        message: "Email não foi preenchido",
      });
    }

    let newUser = new User(name, cpf, email, age);
    usersData.push(newUser);

    res.status(201).send({
      ok: true,
      message: "Usuário criado com sucesso",
      data: newUser,
    });
  } catch (error: any) {
    return res.status(500).send({
      ok: false,
      message: error.toString(),
    });
  }
});

// GET http://localhost:3333/growdever
app.get("/users", (req, res) => {
  try {
    res.status(200).send({
      ok: true,
      message: "Lista de usuários",
      data: usersData,
    });
  } catch (error: any) {
    return res.status(500).send({
      ok: false,
      message: error.toString(),
    });
  }
});

// // GET http://localhost:3333/growdever/abc-1234
// app.get("/growdever/:growdeverId", new GrowdeverController().get);

// POST http://localhost:3333/growdever
//app.post("/growdever", new GrowdeverController().create);

// // DELETE http://localhost:3333/growdever/abc-1234
// app.delete("/growdever/:id", new GrowdeverController().delete);

// // PUT http://localhost:3333/growdever/abc-1234
// app.put("/growdever/:id", new GrowdeverController().update);

// http://localhost:3333
app.listen(3333, () => {
  console.log("API está rodando!");
});
