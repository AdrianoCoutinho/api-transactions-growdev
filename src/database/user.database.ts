import { User } from "../models/user.model";
import { Users } from "./users";

export class UserDatabase {
  public list() {
    return [...Users];
  }

  public get(id: string) {
    return Users.find((user: User) => user.id === id);
  }

  public getByCpf(cpf: string) {
    return Users.find((user: User) => user.cpf === cpf);
  }

  public create(user: User) {
    Users.push(user);
  }

  public delete(index: number) {
    Users.splice(index, 1);
  }
}
