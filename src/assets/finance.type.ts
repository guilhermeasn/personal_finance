export interface IDatabase {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T) => Promise<void>;
}

export type Category = {
  id: string;
  position: number;
  name: string;
};

export type Input = {
  id: string;
  day: number;
  category: string;
  description: string;
  value: number;
  step: Step;
  done: boolean;
}

export type CreateInput = Omit<Input, 'id'>;
export type UpdateInput = Partial<Omit<Input, 'id' | 'step'>>;
export type UpdateMode = 'ALL' | 'ONE' | 'BACKWARD' | 'FORWARD'

export type MonthData = { inputs: Input[]; done: number; total: number; };
export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type Month = { month: MonthIndex; year: number; }
export type Moment = '<' | '=' | '>';

export type GroupData = Record<string, {
  name: string;
  done: number;
  total: number;
}>

export type Step = [number, number];
export type StepMoment = {
  month: MonthIndex;
  year: number;
  moment: Moment;
  step: Step;
}
