import { v4 as createUuid } from "uuid";

export class Transaction {
  public id: string;
  public title: string;
  public value: number;
  public type: "income" | "outcome";

  constructor(title: string, value: number, type: "income" | "outcome") {
    this.id = createUuid();
    this.title = title;
    this.value = value;
    this.type = type;
  }
}
