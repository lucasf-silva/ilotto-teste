import { Base } from "src/base/dto/base.entity";

export class User extends Base{
    name: string;
    email: string;
    password: string;
    balance: number;
    emailConfirmed: boolean;
    inactive: boolean;
}
