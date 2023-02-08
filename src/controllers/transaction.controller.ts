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

      const incomes = user.transactions.filter(
        (incomeTransactions) => incomeTransactions.type == "income"
      );

      const outcomes = user.transactions.filter(
        (outcomeTransactions) => outcomeTransactions.type == "outcome"
      );

      const incomeResult = incomes.reduce((current, item) => {
        return current + item.value;
      }, 0);

      const outcomeResult = outcomes.reduce((current, item) => {
        return current + item.value;
      }, 0);

      const balance = {
        income: incomeResult,
        outcome: outcomeResult,
        total: incomeResult - outcomeResult,
      };

      return res.status(200).send({
        ok: true,
        transactions: user.transactions,
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

      const transactionFindedIndex = user.transactions.findIndex(
        (transaction: Transaction) => transaction.id === transactionId
      );

      if (transactionFindedIndex === -1) {
        return RequestError.notFound(res, "Transaction");
      }

      const deletedTransactions = user.transactions.splice(
        transactionFindedIndex,
        1
      );

      return SuccessResponse.ok(res, "Transação deletada", deletedTransactions);
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
        if (type !== "income" && type !== "outcome") {
          return RequestError.methodNotAllowed(
            res,
            "utilize 'income' ou 'outcome como tipo de transação"
          );
        }
        transactionFinded.type = type;
      }

      return SuccessResponse.ok(res, "Transação editada", transactionFinded);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
