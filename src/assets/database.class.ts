import localforage from "localforage";
import type { IDatabase } from "./finance.type";

export class Database implements IDatabase {

  private DB: LocalForage;
  private instance: LocalForage;
  private selectedDB: string;

  constructor() {
    this.selectedDB = 'DB1';
    this.DB = localforage.createInstance({ name: "__DBS__" });
    this.instance = localforage.createInstance({ name: this.selectedDB });
  }

  selected(): string {
    return this.selectedDB;
  }

  async newDB(changeDB: boolean = true): Promise<string[]> {
    const dbs = await this.getDB();
    const newdb = 'DB' + (dbs.length + 1);
    await this.DB.setItem<string[]>('names', [...dbs, newdb]);
    if (changeDB) this.changeDB(newdb);
    return await this.getDB();
  }

  async getDB(): Promise<string[]> {
    const dbs = await this.DB.getItem<string[]>('names') ?? [];
    return dbs.length > 0 ? dbs : ['DB1'];
  }

  async deleteDB(dbName: string): Promise<string[]> {
    await localforage.createInstance({ name: dbName }).dropInstance();
    const dbs = await this.getDB();
    await this.DB.setItem<string[]>('names', dbs.filter(db => db !== dbName));
    if (this.selectedDB === dbName) this.changeDB(dbs?.[0] ?? 'DB1');
    return await this.getDB();
  }

  changeDB(dbName: string) {
    this.selectedDB = dbName;
    this.instance = localforage.createInstance({ name: dbName });
  }

  async get<T>(key: string): Promise<T | null> {
    return await this.instance.getItem<T>(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.instance.setItem<T>(key, value)
  }

  async exportDB(): Promise<boolean> {
    const data: Record<string, any> = {};
    const keys = await this.instance.keys();
    if (keys.length === 0) return false;
    for (let key of keys) data[key] = await this.instance.getItem(key);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.selectedDB + '.json';
    a.click();
    URL.revokeObjectURL(url);
    return true;
  }

  async importDB(data: Record<string, any>): Promise<string[]> {
    const keys = Object.keys(data);
    await this.newDB();
    for (let key of keys) await this.instance.setItem(key, data[key]);
    return await this.getDB();
  }

}
