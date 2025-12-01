import localforage from "localforage";

export type Input = {
  id: string;
  day: number;
  category: number;
  description: string;
  value: number;
  installment: `${number}-${number}`;
  done: boolean;
}

export type UpdateMode = 'ALL' | 'ONE' | 'BACKWARD' | 'FORWARD'

export type Month = Input[];

export type ErrorString = string;

export class Database {

  private instance: LocalForage;

  constructor(dbName: string) {
    this.instance = localforage.createInstance({ name: dbName });
  }

  async getCategories(): Promise<string[]> {
    return (await this.instance.getItem<string[]>('categories')) ?? [];
  }

  async setCategories(categories: string[]): Promise<void> {
    await this.instance.setItem('categories', categories);
  }

  async getMonth(month: number, year: number, category?: number): Promise<Month> {
    const data = (await this.instance.getItem<Month>(`${month}-${year}`)) ?? [];
    return (category ? data.filter(input => input.category === category) : data).sort((a, b) => a.day - b.day);
  }

  async getMonthTotal(month: number, year: number, category?: number): Promise<number> {
    return (await this.getMonth(month, year, category)).reduce((total, input) => total + input.value, 0);
  }

  async getMonthTotalByCategory(month: number, year: number): Promise<Record<string, number>> {
    const data = await this.getMonth(month, year);
    const categories = await this.getCategories();
    return data.reduce((total, input) => {
      total[categories?.[input.category] ?? 'Sem Categoria'] = (total[categories?.[input.category] ?? 'Sem Categoria'] || 0) + input.value;
      return total;
    }, {} as Record<string, number>);
  }

  async setInput(month: number, year: number, input: Input): Promise<null | ErrorString> {

    const [current, total] = input.installment.split('-').map(Number);

    if (
      !current || !total ||
      current > total ||
      current < 1 ||
      total > 99
    ) return 'Recorrência Inválida';

    switch (month) {
      case 0: case 2: case 4: case 6: case 7: case 9: case 11:
        if (input.day > 31) return 'Dia Inválido';
        break;
      case 3: case 5: case 8: case 10:
        if (input.day > 30) return 'Dia Inválido';
        break;
      case 1:
        if (input.day > 29) return 'Dia Inválido';
        break;
    }

    for (let c = current; c <= total; c++) {
      await this.instance.setItem<Month>(`${month}-${year}`, [...(await this.getMonth(month, year)), input]);
      month >= 11 ? (month = 0, year++) : month++;
      input.installment = `${c + 1}-${total}`;
    }

    return null;

  }

  async updateInput(month: number, year: number, id: string, mode: UpdateMode, input: Partial<Input>): Promise<null | ErrorString> {
    throw new Error('Not implemented');
  }

  async deleteInput(month: number, year: number, id: string, mode: UpdateMode): Promise<null | ErrorString> {
    throw new Error('Not implemented');
  }

}
