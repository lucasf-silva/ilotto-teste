export abstract class HashingServiceProtocol {
    abstract hash(data: string): Promise<string>;

    abstract compare(data: string, hash: string): Promise<boolean>;
}