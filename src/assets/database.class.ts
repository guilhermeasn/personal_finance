import localforage from "localforage";
import type { IDatabase } from "./finance.type";

export class Database implements IDatabase {

  private instance: LocalForage;

  constructor(dbName: string) {
    this.instance = localforage.createInstance({ name: dbName });
  }

  async get<T>(key: string): Promise<T | null> {
    return await this.instance.getItem<T>(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.instance.setItem<T>(key, value)
  }

}
