import type {
  CreateInput,
  IDatabase,
  Input,
  Moment,
  MonthData,
  MonthIndex,
  Step,
  StepMoment,
  UpdateInput,
  UpdateMode
} from "./finance.type";

export class Finance {

  static formatMonth(month: MonthIndex, year: number): string {
    return `${year}Y${month}M`;
  }

  static getMonths(month: MonthIndex, year: number, step: Step = [1, 1]): StepMoment[] {

    const [current, total] = step;
    let m = month;
    let y = year;

    if (m < 0 || m > 11) throw new Error('Mês Inválido');
    if (y < 0 || y > 9999) throw new Error('Ano Inválido');

    if (
      !current || !total ||
      current > total ||
      current < 1 ||
      total > 99
    ) throw new Error('Recorrência Inválida');

    const months: StepMoment[] = [];

    for (let c = current; c > 1; c--) {
      m <= 0 ? (m = 11, y--) : m--;
    }

    for (let c = 1; c <= total; c++) {
      const moment: Moment = c < current ? '<' : c > current ? '>' : '=';
      months.push({ month: m, year: y, moment, step: [c, total] });
      m >= 11 ? (m = 0, y++) : m++;
    }

    return months;

  }

  private db: IDatabase;

  constructor(db: IDatabase) {
    this.db = db;
  }

  async getCategories(): Promise<string[]> {
    return (await this.db.get<string[]>('categories')) ?? [];
  }

  async setCategories(categories: string[]): Promise<void> {
    await this.db.set<string[]>('categories', categories);
  }

  async getInputs(month: MonthIndex, year: number): Promise<Input[]> {
    return await this.db.get<Input[]>(Finance.formatMonth(month, year)) ?? []
  }

  async getMonth(month: MonthIndex, year: number, category?: number): Promise<MonthData> {
    const data = await this.getInputs(month, year);
    const inputs = (category ? data.filter(input => input.category === category) : data).sort((a, b) => a.day - b.day);
    const total = inputs.reduce((total, input) => total + input.value, 0);
    return { inputs, total };
  }

  async getMonthByCategory(month: MonthIndex, year: number): Promise<Record<number | 'total', number>> {
    const { inputs, total } = await this.getMonth(month, year);
    return {
      ...inputs.reduce((total, input) => {
        total[input.category] = (total?.[input.category] || 0) + input.value;
        return total;
      }, {} as Record<number | 'total', number>), total
    };
  }

  async setInput(month: MonthIndex, year: number, newInput: CreateInput): Promise<void> {
    const id = crypto.randomUUID();
    const months = Finance.getMonths(month, year, newInput.step);
    for (let m of months) {
      const input: Input = { id, ...newInput, step: m.step };
      await this.insertInput(m.month, m.year, input);
    }
  }

  async updateInput(month: MonthIndex, year: number, id: string, mode: UpdateMode, update: UpdateInput): Promise<void> {

    const inputs = await this.getInputs(month, year);
    const index = inputs.findIndex(input => input.id === id);
    if (index === -1) throw new Error('Entrada não encontrada');

    const input = inputs[index];
    const months = Finance.getMonths(month, year, input.step);

    loop: for (let m of months) {
      if (m.moment === '<' && (mode === 'ONE' || mode === 'FORWARD')) continue loop;
      if (m.moment === '>' && (mode === 'ONE' || mode === 'BACKWARD')) continue loop;
      await this.insertInput(m.month, m.year, { ...input, ...update })
    }

  }

  async removeInput(month: MonthIndex, year: number, id: string, mode: UpdateMode): Promise<void> {

    const inputs = await this.getInputs(month, year);
    const index = inputs.findIndex(input => input.id === id);
    if (index === -1) throw new Error('Entrada não encontrada');

    const input = inputs[index];
    const months = Finance.getMonths(month, year, input.step);

    loop: for (let m of months) {
      if (m.moment === '<' && (mode === 'ONE' || mode === 'FORWARD')) continue loop;
      if (m.moment === '>' && (mode === 'ONE' || mode === 'BACKWARD')) continue loop;
      const inputs = await this.getInputs(m.month, m.year);
      const newInputs = inputs.filter(input => input.id !== id);
      await this.db.set<Input[]>(`${m.year}-${m.month}`, newInputs);
    }

  }

  private async insertInput(month: MonthIndex, year: number, input: Input): Promise<void> {

    const lastDay: number = new Date(year, month + 1, 0).getDate();

    if (input.day < 1) input = { ...input, day: 1 };
    if (input.day > lastDay) input = { ...input, day: lastDay };

    const inputs = await this.getInputs(month, year);
    const index = inputs.findIndex(i => i.id === input.id);

    if (index === -1) inputs.push(input);
    else inputs[index] = input;

    await this.db.set<Input[]>(Finance.formatMonth(month, year), inputs);

  }

}
