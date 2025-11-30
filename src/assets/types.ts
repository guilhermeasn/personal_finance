export type Installment = {
  id: string;
  current: number;
  total: number;
}

export type Input = {
  day: number;
  category: number;
  description: string;
  value: number;
  installment: Installment | null;
  done: boolean;
}

export type Month = Input[];
