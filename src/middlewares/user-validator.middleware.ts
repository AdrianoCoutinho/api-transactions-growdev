import { NextFunction, Request, Response } from "express";
import { UserDatabase } from "../database/user.database";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.error";
import { cpf as cpfValidator } from "cpf-cnpj-validator";

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

      if (!nome) {
        return RequestError.fieldNotProvided(res, "nome");
      }

      if (typeof nome != "string") {
        return RequestError.methodNotAllowed(
          res,
          "O nome precisa ser do tipo string"
        );
      }

      if (!cpf) {
        return RequestError.fieldNotProvided(res, "cpf");
      }

      if (typeof cpf != "string") {
        return RequestError.methodNotAllowed(
          res,
          "O cpf precisa ser do tipo string"
        );
      }

      if (!cpfValidator.isValid(cpf)) {
        return res.status(400).send({
          ok: false,
          message: "Este CPF não é valido",
          cpf: cpf,
        });
      }

      if (cpfExists) {
        return res.status(400).send({
          ok: false,
          message: "Já existe um usuário com este CPF",
          cpf: cpf,
        });
      }

      if (!email) {
        return RequestError.fieldNotProvided(res, "email");
      }

      if (typeof email != "string") {
        return RequestError.methodNotAllowed(
          res,
          "O email precisa ser do tipo string"
        );
      }

      if (emailExists) {
        return res.status(400).send({
          ok: false,
          message: "Já existe um usuário com este email",
          email: email,
        });
      }

      if (!idade) {
        return RequestError.fieldNotProvided(res, "idade");
      }

      if (typeof idade != "number") {
        return RequestError.methodNotAllowed(
          res,
          "A idade precisa ser do tipo number"
        );
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
  public static validateUserExists(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;

      const database = new UserDatabase();
      const user = database.get(userId);

      if (!userId) {
        return RequestError.fieldNotProvided(res, "userId");
      }

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
