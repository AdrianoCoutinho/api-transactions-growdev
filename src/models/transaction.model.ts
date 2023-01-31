import { v4 as createUuid } from "uuid";

export class Transactions {
  private _id: string;

  constructor(
    private _title: string,
    private _value: number,
    private _type: "income" | "outcome"
  ) {
    this._id = createUuid();
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
