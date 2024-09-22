export interface Users {
  id: string;
  name: string;
  email: string;
  avatar: string;
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
  id: string;
  title: string;
  targetAmount: number;
  MaxAmount: number;
  createdAt: string;
}
