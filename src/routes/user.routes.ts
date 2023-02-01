import { Request, Response, Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { UserController } from "../controllers/user.controller";
import { TransactionValidatorMiddleware } from "../middlewares/transaction-validator.middleware";
import { UserValidatorMiddleware } from "../middlewares/user-validator.middleware";

export const userRoutes = () => {
  const app = Router();

  app.get("/", (req: Request, res: Response) => {
    res.status(200).send({
      ok: true,
      message: "Api está rodando corretamente...",
    });
  });

  app.post(
    "/users",
    [UserValidatorMiddleware.validateMandatoryFields],
    new UserController().create
  );

  app.get("/users", new UserController().listFilter);

  app.get("/users/:userId", new UserController().get);

  app.delete("/users/:userId", new UserController().delete);

  app.put("/users/:userId", new UserController().update);

  app.post(
    "/user/:userId/transactions",
    [
      TransactionValidatorMiddleware.validateMandatoryFields,
      TransactionValidatorMiddleware.validateUserExists,
    ],
    new TransactionController().create
  );

  app.get(
    "/user/:userId/transactions/:transactionId",
    [TransactionValidatorMiddleware.validateUserExists],
    new TransactionController().get
  );

  app.get(
    "/user/:userId/transactions",
    [TransactionValidatorMiddleware.validateUserExists],
    new TransactionController().list
  );

  app.put(
    "/users/:userId/transactions/:transactionId",
    [TransactionValidatorMiddleware.validateUserExists],
    new TransactionController().update
  );

  app.delete(
    "/users/:userId/transactions/:transactionId",
    [TransactionValidatorMiddleware.validateUserExists],
    new TransactionController().delete
  );

  return app;
};
