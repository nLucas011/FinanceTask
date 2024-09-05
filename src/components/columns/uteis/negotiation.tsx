"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { convertToReal, State, Translate } from "@/functions";
import { toast } from "@/hooks/use-toast";
import { api } from "@/service/api";
import { ColumnDef } from "@tanstack/react-table";
import { getCookie } from "cookies-next";
import { format } from "date-fns";
import { Check, Loader2, MoreHorizontal, Undo, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "react-query";

export interface NegotiationTypes {
  id: string;
  type: string;
  status: "refunded" | "pedding" | "approved" | "canceled";
  note: string;
  category: string;
  amount: number;
  createdAt: string;
}

export const NegotiationColumn: ColumnDef<NegotiationTypes>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const retirement = row.original;

      return (
        <div>
          {retirement.status == "canceled" && (
            <Badge variant="canceled">
              <X className="w-4 h-4" />
            </Badge>
          )}
          {retirement.status == "approved" && (
            <Badge variant="approved">
              <Check className="w-4 h-4" />
            </Badge>
          )}
          {retirement.status == "pedding" && (
            <Badge variant="pedding">
              <Loader2 className="animate-spin w-4 h-4" />
            </Badge>
          )}
          {retirement.status == "refunded" && (
            <Badge variant="refunded">
              <Undo className="w-4 h-4" />
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "createdAt",
    header: "Data",
    cell: ({ row }) => {
      const transaction = row.original;

      return <p>{format(transaction.createdAt, "dd/MM/yyyy HH:mm")}</p>;
    },
  },
  {
    accessorKey: "note",
    header: "Descrição",
    cell: ({ row }) => {
      const { note, category } = row.original;

      return <p>{note ? note : Translate(category as keyof State)}</p>;
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => {
      const { category } = row.original;

      return <p> {Translate(category as keyof State)}</p>;
    },
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      const { amount, type } = row.original;

      const classMap = {
        expenses: "text-red-500",
        revenue: "text-green-500",
        transfer: "text-blue-500",
      };
      const getClassName = (type: "expenses" | "revenue" | "transfer") =>
        classMap[type] || "";

      return (
        <p className={getClassName(type as any)}>{convertToReal(amount)}</p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      const queryClient = useQueryClient();
      const searchParams = useSearchParams();
      const getqueryparams = searchParams.get("query") ?? "transfer";

      const { mutate, isLoading } = useMutation({
        mutationFn: async ({ id }: { id: string }) => {
          return api.delete(`/api/user/transactions/${id}`, {
            headers: {
              Authorization: `${getCookie("token")}`,
            },
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Ocorreu um erro ao deletar",
            description: `${error}`,
          });
        },
        onSuccess() {
          toast({
            variant: "default",
            title: `Deletado com sucesso`,
          });
          queryClient.invalidateQueries(`transaction:${getqueryparams}`);
        },
      });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-950">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>

            <DropdownMenuItem asChild>
              {/* <EditTransaction /> */}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isLoading}
              onClick={() => mutate({ id })}
              className="text-red-500 hover:text-red-400"
            >
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
