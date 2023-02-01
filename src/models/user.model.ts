import { v4 as createUuid } from "uuid";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { Transaction } from "./transaction.model";

export class User {
  private _id: string;
  private _transactions?: Transaction[];

  constructor(
    private _nome: string,
    private _cpf: string,
    private _email: string,
    private _idade: number
  ) {
    this._id = createUuid();
  }

  public get id() {
    return this._id;
  }

  public get transactions() {
    return this._transactions || [];
  }

  public set transactions(transactions: Transaction[]) {
    this._transactions = transactions;
  }

  public get cpf() {
    return this._cpf;
  }

  public set cpf(cpf: string) {
    this._cpf = cpf;
  }

  public get nome() {
    return this._nome;
  }

  public set nome(nome: string) {
    this._nome = nome;
  }

  public get email() {
    return this._email;
  }

  public set email(email: string) {
    this._email = email;
  }

  public get idade() {
    return this._idade;
  }

  public set idade(idade: number) {
    this._idade = idade;
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

  public toJsonFilter() {
    return {
      id: this._id,
      nome: this._nome,
      cpf: cpfValidator.format(this._cpf.toString().padStart(11, "0")),
      email: this._email,
      idade: this._idade,
    };
  }
}
