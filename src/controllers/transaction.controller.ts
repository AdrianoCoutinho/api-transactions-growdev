import { Request, Response } from "express";
import { UserDatabase } from "../database/user.database";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.error";
import { Transaction } from "../models/transaction.model";
import { SuccessResponse } from "../util/success.response";

export class TransactionController {
  public create(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { title, value, type } = req.body;

      const transaction = new Transaction(title, value, type);

      const database = new UserDatabase();
      const user = database.get(userId);

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      user.transactions = [...user.transactions, transaction];

      return SuccessResponse.created(
        res,
        "A transação foi aceita",
        user.transactions
      );
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public get(req: Request, res: Response) {
    try {
      const { userId, transactionId } = req.params;

      const database = new UserDatabase();
      const user = database.get(userId);

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      const transactionFinded = user.transactions.find(
        (transaction: Transaction) => transaction.id === transactionId
      );

      if (!transactionFinded) {
        return RequestError.notFound(res, "Transaction");
      }

      return SuccessResponse.ok(res, "Exibindo transação", transactionFinded);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public list(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const database = new UserDatabase();
      const user = database.get(userId);

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      const transactions = user.transactions;
      let incomes = transactions.filter((transaction) => {
        return (transaction.type = "income");
      });

      let outcomes = transactions.filter((transaction) => {
        return (transaction.type = "outcome");
      });

      let incomeResult = incomes.reduce((current, item) => {
        return current + item.value;
      }, 0);

      let outcomeResult = outcomes.reduce((current, item) => {
        return current + item.value;
      }, 0);

      const balance = {
        income: incomeResult,
        outcome: outcomeResult,
        total: incomeResult - outcomeResult,
      };

      return res.status(200).send({
        ok: true,
        transactions: transactions,
        balance: balance,
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public delete(req: Request, res: Response) {
    try {
      const { userId, transactionId } = req.params;

      const database = new UserDatabase();
      const user = database.get(userId);

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      const transactionFinded = user.transactions.find(
        (transaction: Transaction) => transaction.id === transactionId
      );

      if (!transactionFinded) {
        return RequestError.notFound(res, "Transaction");
      }

      user.transactions.splice(Number(transactionId), 1);

      return SuccessResponse.ok(res, "Transação deletada", transactionFinded);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public update(req: Request, res: Response) {
    try {
      const { userId, transactionId } = req.params;
      const { title, value, type } = req.body;

      const database = new UserDatabase();
      const user = database.get(userId);

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      let transactions = user.transactions;

      const transactionFinded = user.transactions.find(
        (transaction: Transaction) => transaction.id === transactionId
      );

      if (!transactionFinded) {
        return RequestError.notFound(res, "Transaction");
      }

      if (!title && !value && !type) {
        return RequestError.fieldNotProvided(res, "nenhum campo");
      }

      if (title) {
        transactionFinded.title = title;
      }

      if (value) {
        transactionFinded.value = value;
      }

      if (type) {
        transactionFinded.type = type;
      }

      return SuccessResponse.ok(res, "Transação editada", transactionFinded);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}