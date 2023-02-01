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

      database.delete(Number(userId));

      return SuccessResponse.ok(
        res,
        "O Usuário deletado com sucesso",
        deletedUser
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
        updateUser.nome = nome;
      }

      if (cpf) {
        updateUser.cpf = cpf;
      }

      if (email) {
        updateUser.email = email;
      }

      if (idade) {
        updateUser.idade = idade;
      }

      res.status(200).send({
        ok: true,
        message: "Usuário modificado com sucesso",
        data: updateUser,
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
