export type Installment = {
  id: string;
  current: number;
  total: number;
}

export type Item = {
  input?: boolean;
  date: number;
  category: string;
  description: string;
  value: number;
  installment?: Installment;
  done: boolean;
}

export type Month = Item[];
