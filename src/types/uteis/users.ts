export interface Users {
  id: string;
  name: string;
  email: string;
  Balance: number;
  totalIncome: number;
  Expenses: number;
  transactions: Transaction[];
  goals: Goals[];
}

export interface Transaction {
  id: string;
  name: string;
  type: string;
  category: string;
  description?: string;
  amount: number;
  status: "refunded" | "pedding" | "approved" | "canceled";
  getaway: string;
  createdAt: string;
}

export interface Goals {
  title: string;
  targetAmount: number;
  MaxAmount: number;
}
