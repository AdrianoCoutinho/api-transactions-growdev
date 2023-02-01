import { NextFunction, Request, Response } from "express";
import { UserDatabase } from "../database/user.database";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.error";

export class TransactionValidatorMiddleware {
  public static validateMandatoryFields(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const { title, value, type } = req.body;

      const database = new UserDatabase();
      const user = database.get(userId);

      if (!userId) {
        return RequestError.fieldNotProvided(res, "userId");
      }

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      if (!title) {
        return RequestError.fieldNotProvided(res, "title");
      }

      if (!value) {
        return RequestError.fieldNotProvided(res, "value");
      }

      if (!type) {
        return RequestError.fieldNotProvided(res, "type");
      }

      if (type !== "income" && type !== "outcome") {
        return res.status(405).send({
          ok: false,
          message: "utilize 'income' ou 'outcome como tipo de transação",
        });
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
