import localforage from "localforage";
import type { IDatabase } from "./finance.type";

export type DatabaseName = (
  | 'DB01' | 'DB02' | 'DB03' | 'DB04'
  | 'DB05' | 'DB06' | 'DB07' | 'DB08'
  | 'DB09' | 'DB10' | 'DB11' | 'DB12'
);

export class Database implements IDatabase {

  static optionsDB: DatabaseName[] = [
    'DB01', 'DB02', 'DB03', 'DB04',
    'DB05', 'DB06', 'DB07', 'DB08',
    'DB09', 'DB10', 'DB11', 'DB12'
  ];

  private instance: LocalForage;
  private db: DatabaseName;

  constructor() {
    this.db = localStorage.getItem('DB') as DatabaseName ?? 'DB0';
    this.instance = localforage.createInstance({ name: this.db });
  }

  currentDB(): DatabaseName {
    return this.db;
  }

  changeDB(db: DatabaseName) {
    this.db = db;
    localStorage.setItem('DB', db);
    this.instance = localforage.createInstance({ name: db });
  }

  async truncateDB(db: DatabaseName) {
    await localforage.createInstance({ name: db }).dropInstance();
  }

  async emptyDB(): Promise<Record<DatabaseName, boolean>> {
    const dbs = {} as Record<DatabaseName, boolean>;
    for (let db of Database.optionsDB) dbs[db] = await localforage.createInstance({ name: db }).keys().then(keys => keys.length === 0);
    return dbs;
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
    a.download = this.db + '.json';
    a.click();
    URL.revokeObjectURL(url);
    return true;
  }

  async importDB(data: Record<string, any>): Promise<boolean> {
    const keys = await this.instance.keys();
    if (keys.length !== 0) return false;
    const items = Object.keys(data);
    for (let item of items) await this.instance.setItem(item, data[item]);
    return true;
  }

}
