"use client";

import { Card, CardContent } from "@/components/ui/card";
import { convertToReal } from "@/functions";

interface OverviewProps {
  revenue: number;
  expenses: number;
  balance: number;
}

export function Overview({ revenue, balance, expenses }: OverviewProps) {
  return (
    <Card className="w-full max-w-3xl">
      <CardContent className="p-6 grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-500 border border-white/10 bg-opacity-10 rounded-lg p-4 flex flex-col items-start gap-2">
            <div className="text-green-500 font-medium">Receitas</div>
            <div className="text-2xl font-bold">{convertToReal(revenue)}</div>
          </div>
          <div className="bg-red-500 bg-opacity-10 border border-white/10 rounded-lg p-4 flex flex-col items-start gap-2">
            <div className="text-red-500 font-medium">Despesas</div>
            <div className="text-2xl font-bold">{convertToReal(expenses)}</div>
          </div>
        </div>
        <div className="border border-muted rounded-lg p-6 flex flex-col items-center gap-4">
          <div className="text-muted-foreground font-medium">Balanço</div>
          <div className="text-4xl font-bold text-primary">
            {convertToReal(balance)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
