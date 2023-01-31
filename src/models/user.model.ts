import { v4 as createUuid } from "uuid";
import { cpf as cpfValidator } from "cpf-cnpj-validator";

export class User {
  private _id: string;
  private _transactions: string[];

  constructor(
    private _nome: string,
    private _cpf: string,
    private _email: string,
    private _idade: number
  ) {
    this._id = createUuid();
    this._transactions = [];
  }

  public get id() {
    return this._id;
  }

  public get cpf() {
    return this._cpf;
  }

  public toJson() {
    return {
      id: this._id,
      nome: this._nome,
      cpf: cpfValidator.format(this._cpf.toString().padStart(11, "0")),
      email: this._email,
      idade: this._idade,
      transacoes: this._transactions,
    };
  }
}
