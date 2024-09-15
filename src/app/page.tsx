"use client";

import { TransactionColumn } from "@/components/columns";
import { AddAction } from "@/components/dashboard/add-action";
import { Cards } from "@/components/dashboard/cards";
import { Overview } from "@/components/dashboard/charts/overview";
import { CreateGoal } from "@/components/dashboard/create-goal";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { Goals } from "@/components/dashboard/Goals";
import { UserNav } from "@/components/dashboard/user-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/datatable";
import { convertToReal } from "@/functions";
import { api } from "@/service/api";
import { Users } from "@/types";
import { getCookie } from "cookies-next";
import { DollarSign, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data, isLoading } = useQuery<Users>({
    queryKey: ["user:summary", selectedMonth, selectedYear],
    queryFn: async () => {
      return api
        .get(`/api/users/me?mes=${selectedMonth}&ano=${selectedYear}`, {
          headers: {
            Authorization: `${getCookie("token")}`,
          },
        })
        .then((res) => res.data);
    },
    retry: 1,
    refetchOnWindowFocus: false,
    onError: (err) => {
      alert("erro ao tentar fazer a requisição");
    },
  });

  if (isLoading) {
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden flex flex-col items-center justify-center">
      <Loader2 className="mr-2 h-6 w-6 animate-spin text-center" />
    </div>;
  }

  const handleDateChange = (date: Date) => {
    setSelectedMonth(date.getMonth() + 1);
    setSelectedYear(date.getFullYear());
  };

  return (
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Inicio</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker Change={handleDateChange} />
            <AddAction />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Cards
            title="Saldo Atual"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            data={convertToReal(data?.Balance ?? 0)}
          />
          <Cards
            title="Receita total"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            data={convertToReal(data?.totalIncome || 0)}
          />
          <Cards
            title="Despesas"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            data={convertToReal(data?.Expenses || 0)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-11 ">
          <Card className="col-span-2 md:h-[30rem]">
            <CardHeader className="flex items-center flex-row justify-between">
              <CardTitle>Objetivos</CardTitle>
              <CreateGoal />
            </CardHeader>
            <CardContent className="pl-2">
              {data
                ? data.goals?.map((g) => {
                    return (
                      <Goals
                        id={g.id}
                        title={g.title}
                        MaxAmount={g.MaxAmount}
                        targetAmount={g.targetAmount}
                        venciment={g.createdAt}
                        key={Math.random()}
                      />
                    );
                  })
                : null}
            </CardContent>
          </Card>

          <Card className="col-span-4 md:h-[30rem]">
            <CardHeader>
              <CardTitle>Balanço mensal</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview
                revenue={data?.totalIncome || 0}
                expenses={data?.Expenses || 0}
                balance={(data?.totalIncome || 0) - (data?.Expenses || 0)}
              />
            </CardContent>
          </Card>

          <Card className="col-span-5 md:h-[30rem]">
            <CardHeader>
              <CardTitle>Ultimas Transações</CardTitle>
              <CardDescription>Cheque as ultimas transações</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                navigation={false}
                columns={TransactionColumn}
                data={data?.transactions ?? []}
                row={4}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
