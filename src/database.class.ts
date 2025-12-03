import { readFile, writeFile } from "fs/promises";
import { join } from "path";

export class Database {

  async get<T>(key: string): Promise<T | null> {
    try {
      return JSON.parse((await readFile(this.fileName(key))).toString()) as T;
    } catch (err) {
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    await writeFile(this.fileName(key), JSON.stringify(value, undefined, 2));
  }

  private fileName(key: string): string {
    return join('data', key + '.json');
  }

}
