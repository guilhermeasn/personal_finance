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

export type CreateInput = Omit<Input, 'id'>;

export type UpdateInput = Partial<Omit<Input, 'id' | 'installment'>>;

export type UpdateMode = 'ALL' | 'ONE' | 'BACKWARD' | 'FORWARD'

export type Month = Input[];


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

  async setInput(month: number, year: number, input: CreateInput): Promise<void> {

    const [current, total] = input.installment.split('-').map(Number);

    if (
      !current || !total ||
      current > total ||
      current < 1 ||
      total > 99
    ) throw new Error('Recorrência Inválida');

    const id = crypto.randomUUID();

    for (let c = current; c <= total; c++) {
      await this.insertInput(month, year, { ...input, id, installment: `${c}-${total}` });
      [month, year] = this.nextMonth(month, year);
    }

  }

  async updateInput(month: number, year: number, id: string, mode: UpdateMode, update: UpdateInput): Promise<void> {

    const data = await this.getMonth(month, year);
    const index = data.findIndex(input => input.id === id);
    if (index === -1) return;

    const input = data[index];
    const [current, total] = input.installment.split('-').map(Number);

    switch (mode) {
      case 'BACKWARD':
        for (let c = 0; c < current; c++) {
          await this.updateInput(month, year, id, 'ONE', update);
          [month, year] = this.prevMonth(month, year);
        }
        break;
      case 'FORWARD':
        for (let c = current; c <= total; c++) {
          await this.updateInput(month, year, id, 'ONE', update);
          [month, year] = this.nextMonth(month, year);
        }
        break;
      case 'ALL':
        let monthforward = month;
        let monthbackward = month;
        let yearforward = year;
        let yearbackward = year;
        for (let c = 0; c < current; c++) {
          await this.updateInput(monthbackward, yearbackward, id, 'ONE', update);
          [monthbackward, yearbackward] = this.prevMonth(monthbackward, yearbackward);
        }
        for (let c = current; c <= total; c++) {
          [monthforward, yearforward] = this.nextMonth(monthforward, yearforward);
          await this.updateInput(monthforward, yearforward, id, 'ONE', update);
        }
        break;
      case 'ONE':
      default:
        await this.insertInput(month, year, { ...input, ...update });
        break;
    }

  }

  async deleteInput(month: number, year: number, id: string, mode: UpdateMode): Promise<void> {

    const data = await this.getMonth(month, year);
    const index = data.findIndex(input => input.id === id);
    if (index === -1) throw new Error('Entrada não encontrada');

    // switch (mode) {
    //   case 'ALL':
    //     data.splice(index, 1);
    //     break;
    //   case 'ONE':
    //     data[index].done = true;
    //     break;
    //   case 'BACKWARD':
    //     data[index].done = true;
    //     break;
    //   case 'FORWARD':
    //     data[index].done = true;
    //     break;
    // }

  }

  private lastDay(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  private async insertInput(month: number, year: number, input: Input): Promise<void> {

    if (month < 0 || month > 11) throw new Error('Mês Inválido');
    if (year < 1000 || year > 2999) throw new Error('Ano Inválido');

    if (input.day < 1) input = { ...input, day: 1 };
    if (input.day > this.lastDay(month, year)) input = { ...input, day: this.lastDay(month, year) };

    const data = await this.getMonth(month, year);
    const index = data.findIndex(i => i.id === input.id);

    if (index === -1) data.push(input);
    else data[index] = input;

    await this.instance.setItem(`${month}-${year}`, data);

  }

  private nextMonth(month: number, year: number): [number, number] {
    return month >= 11 ? [0, year + 1] : [month + 1, year];
  }

  private prevMonth(month: number, year: number): [number, number] {
    return month <= 0 ? [11, year - 1] : [month - 1, year];
  }

}
