import { v4 as createUuid } from "uuid";

export class User {
  public id: string;
  public name: string;
  public cpf: string;
  public email: string;
  public age: number;
  public transactions: object[];

  constructor(name: string, cpf: string, email: string, age: number) {
    this.id = createUuid();
    this.name = name;
    this.cpf = cpf;
    this.email = email;
    this.age = age;
    this.transactions = [];
  }
}
