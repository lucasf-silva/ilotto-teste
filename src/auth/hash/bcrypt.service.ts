import { HashingServiceProtocol } from "./hashing.service";
import * as bcrypt from 'bcrypt';

export class BcryptService extends HashingServiceProtocol {
    async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}