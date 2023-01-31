import { Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controller";
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

  return app;
};
