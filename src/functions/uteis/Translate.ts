export type State = {
  revenue: string;
  expenses: string;
  transfer: string;
  investment: string;
  present: string;
  payment_wage: string;
  others: string;
  utilities: string;
  food: string;
  transport: string;
  health: string;
  entertainment: string;
  education: string;
};

export const translate: State = {
  revenue: "Receita",
  expenses: "Despesa",
  transfer: "Transferência",
  investment: "Investimento",
  present: "Presente",
  others: "Outros",
  payment_wage: "Salário",
  utilities: "Utilidades",
  food: "Alimentação",
  transport: "Transporte",
  health: "Saúde",
  entertainment: "Entretenimento",
  education: "Educação",
};

export function Translate(state: keyof State): string {
  return translate[state];
}
