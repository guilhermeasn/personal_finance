export type Installment = {
  id: string;
  current: number;
  total: number;
}

export type Input = {
  date: number;
  category: string;
  description: string;
  value: number;
  installment: Installment | null;
  done: boolean;
}

export type Month = Input[];
