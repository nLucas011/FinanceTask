"use client";

import {
  NegotiationColumn,
  NegotiationTypes,
} from "@/components/columns/uteis/negotiation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/datatable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/hooks/auth";
import { api } from "@/service/api";
import { getCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "react-query";

export default function Transaction() {
  const { user } = useUser();
  if (!user) redirect("/auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const getqueryparams = searchParams.get("query") ?? "transfer";

  function handleSearch(search: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("query", search);

    router.push(`?${params.toString()}`);
  }

  const { data, isLoading } = useQuery<{
    success: string;
    data: NegotiationTypes[];
  }>({
    queryKey: [`transaction:${getqueryparams}`],
    queryFn: () => {
      console.log("query", getqueryparams);
      return api
        .get(`/api/user/transactions?query=${getqueryparams}`, {
          headers: {
            Authorization: `${getCookie("token")}`,
          },
        })
        .then((res) => res.data);
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-[8rem] pt-[6rem]">
        <Card className="col-span-5">
          <CardHeader>
            <Select
              onValueChange={(e) => handleSearch(e)}
              defaultValue={getqueryparams ?? "transfer"}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transfer">Transações</SelectItem>
                <SelectItem value="expenses">Despesas</SelectItem>
                <SelectItem value="revenue">Receita</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden flex flex-col items-center justify-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-center" />
              </div>
            ) : (
              <DataTable
                columns={NegotiationColumn}
                data={data?.data ?? []}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
