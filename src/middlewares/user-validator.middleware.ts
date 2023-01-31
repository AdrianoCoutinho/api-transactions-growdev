import { NextFunction, Request, Response } from "express";
import { UserDatabase } from "../database/user.database";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.error";

export class UserValidatorMiddleware {
  public static validateMandatoryFields(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { nome, cpf, email, idade } = req.body;

      const database = new UserDatabase();
      const cpfExists = database.getByCpf(cpf);
      const emailExists = database.getByEmail(email);

      if (cpfExists) {
        return res.status(400).send({
          ok: false,
          message: "Já existe um usuário com este CPF",
          cpf: cpf,
        });
      }

      if (emailExists) {
        return res.status(400).send({
          ok: false,
          message: "Já existe um usuário com este email",
          cpf: cpf,
        });
      }

      if (!nome) {
        return RequestError.fieldNotProvided(res, "nome");
      }

      if (!cpf) {
        return RequestError.fieldNotProvided(res, "cpf");
      }

      if (!email) {
        return RequestError.fieldNotProvided(res, "email");
      }

      if (!idade) {
        return RequestError.fieldNotProvided(res, "idade");
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
