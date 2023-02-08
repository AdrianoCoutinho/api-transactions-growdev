import { Request, Response } from "express";
import { type } from "os";
import { UserDatabase } from "../database/user.database";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.error";
import { User } from "../models/user.model";
import { SuccessResponse } from "../util/success.response";
import { cpf as cpfValidator } from "cpf-cnpj-validator";

export class UserController {
  public list(req: Request, res: Response) {
    try {
      const database = new UserDatabase();
      let users = database.list();

      const result = users.map((user) => user.toJson());

      return SuccessResponse.ok(
        res,
        "O Usuário foi criado com sucesso",
        result
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public listFilter(req: Request, res: Response) {
    try {
      const { nome, cpf, email } = req.query;

      const database = new UserDatabase();
      let users = database.list();

      const result = users.map((user) => user.toJsonFilter());

      if (nome) {
        if (typeof nome != "string") {
          return res.status(405).send({
            ok: false,
            message: "O nome precisa ser uma string",
          });
        }

        const user = database.getByName(nome as string);

        if (!user) {
          return RequestError.notFound(res, nome.toString());
        }

        let result = user.map((user) => user.toJsonFilter());

        return res.status(200).send({
          users: result,
        });
      }

      if (cpf) {
        const user = database.getByCpf(cpf as string);

        if (!user) {
          return RequestError.notFound(res, cpf.toString());
        }

        return res.status(200).send({
          id: user?.id,
          nome: user?.nome,
          cpf: user?.cpf,
          email: user?.email,
          idade: user?.idade,
        });
      }

      if (email) {
        const user = database.getByEmail(email as string);

        return res.status(200).send({
          id: user?.id,
          nome: user?.nome,
          cpf: user?.cpf,
          email: user?.email,
          idade: user?.idade,
        });
      }

      return SuccessResponse.ok(res, "Usuário(s) obtido(s)", result);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public create(req: Request, res: Response) {
    try {
      const { nome, cpf, email, idade } = req.body;

      const user = new User(nome, cpf, email, idade);

      const database = new UserDatabase();
      database.create(user);

      return SuccessResponse.created(
        res,
        "O Usuário foi criado com sucesso",
        user.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public get(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return RequestError.fieldNotProvided(res, "userId");
      }

      const database = new UserDatabase();
      const user = database.get(userId);

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      return SuccessResponse.ok(res, "Usuário obtido", user.toJson());
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public delete(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const database = new UserDatabase();
      const deletedUser = database.get(userId);

      if (!userId) {
        return RequestError.notFound(res, "User");
      }

      if (!deletedUser) {
        return RequestError.notFound(res, "User");
      }

      const userIndex = database.getIndex(userId);

      database.delete(userIndex);

      return SuccessResponse.ok(
        res,
        "O Usuário deletado com sucesso",
        deletedUser.toJson()
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public update(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { nome, cpf, email, idade } = req.body;
      const database = new UserDatabase();
      const updateUser = database.get(userId);
      const cpfExists = database.getByCpf(cpf);
      const emailExists = database.getByEmail(email);

      if (!userId) {
        return RequestError.fieldNotProvided(res, "userId");
      }

      if (!updateUser) {
        return RequestError.notFound(res, "User");
      }

      if (!nome && !cpf && !email && !idade) {
        return RequestError.fieldNotProvided(res, "nenhum campo");
      }

      if (nome) {
        if (typeof nome != "string") {
          return res.status(405).send({
            ok: false,
            message: "O nome precisa ser do tipo string",
          });
        }

        if ((updateUser.nome = nome)) {
          return res.status(409).send({
            ok: false,
            message: "Digite um nome diferente do atual.",
          });
        }

        updateUser.nome = nome;
      }

      if (cpf) {
        if (typeof cpf != "string") {
          return res.status(405).send({
            ok: false,
            message: "O cpf precisa ser do tipo string",
          });
        }

        if ((updateUser.cpf = cpf)) {
          return res.status(409).send({
            ok: false,
            message: "Digite um cpf diferente do atual.",
          });
        }

        if (cpfExists) {
          return res.status(400).send({
            ok: false,
            message: "Já existe um usuário com este CPF",
            cpf: cpf,
          });
        }

        if (!cpfValidator.isValid(cpf)) {
          return res.status(400).send({
            ok: false,
            message: "Este CPF não é valido",
            cpf: cpf,
          });
        }
        updateUser.cpf = cpf;
      }

      if (email) {
        if (typeof email != "string") {
          return res.status(405).send({
            ok: false,
            message: "O email precisa ser do tipo string",
          });
        }

        if ((updateUser.email = email)) {
          return res.status(409).send({
            ok: false,
            message: "Digite um email diferente do atual.",
          });
        }

        if (emailExists) {
          return res.status(400).send({
            ok: false,
            message: "Já existe um usuário com este email",
            email: email,
          });
        }

        updateUser.email = email;
      }

      if (idade) {
        if (typeof idade != "number") {
          return res.status(405).send({
            ok: false,
            message: "A idade precisa ser do tipo number",
          });
        }

        if ((updateUser.idade = idade)) {
          return res.status(409).send({
            ok: false,
            message: "Digite uma idade diferente da atual.",
          });
        }
        updateUser.idade = idade;
      }

      res.status(200).send({
        ok: true,
        message: "Usuário modificado com sucesso",
        data: updateUser.toJson(),
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
