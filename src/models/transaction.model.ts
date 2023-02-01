import { v4 as createUuid } from "uuid";

export class Transaction {
  private _id: string;

  constructor(
    private _title: string,
    private _value: number,
    private _type: "income" | "outcome"
  ) {
    this._id = createUuid();
  }

  public get id() {
    return this._id;
  }

  public get title() {
    return this._title;
  }

  public set title(title: string) {
    this._title = title;
  }

  public get value() {
    return this._value;
  }

  public set value(value: number) {
    this._value = value;
  }

  public get type() {
    return this._type;
  }

  public set type(type: "income" | "outcome") {
    this._type = type;
  }

  public toJson() {
    return {
      id: this._id,
      title: this._title,
      value: this._value,
      type: this._type,
    };
  }
}
