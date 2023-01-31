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
}
