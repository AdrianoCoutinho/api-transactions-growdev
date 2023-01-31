import { Request, Response } from "express";
import { UserDatabase } from "../database/user.database";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.error";
import { User } from "../models/user.model";
import { SuccessResponse } from "../util/success.response";

export class UserController {
  public list(req: Request, res: Response) {
    try {
      const database = new UserDatabase();
      let users = database.list();

      const result = users.map((user) => user.toJson());

      res.status(200).send({
        ok: true,
        message: "Usuários listados com sucesso",
        data: result,
      });
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
        const user = database.getByName(nome as string);
        let result = user.map((user) => user.toJsonFilter());

        return res.status(200).send({
          users: result,
        });
      }

      if (cpf) {
        const user = database.getByCpf(cpf as string);
        console.log(user);

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

      res.status(200).send({
        ok: true,
        message: "Usuários listados com sucesso",
        data: result,
      });
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
        user
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public get(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const database = new UserDatabase();
      const user = database.get(userId);

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      res.status(200).send({
        ok: true,
        message: "Usuário encontrado com sucesso",
        data: user,
      });
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

      database.delete(Number(userId));

      res.status(200).send({
        ok: true,
        message: "Usuário deletado com sucesso",
        data: deletedUser,
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
