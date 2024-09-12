"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Transaction } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { getCookie } from "cookies-next";
import { format } from "date-fns";
import { Check, Loader2, MoreHorizontal, Undo, X } from "lucide-react";
import { useMutation, useQueryClient } from "react-query";

export const TransactionColumn: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    header: "Identificador",
    cell: ({ row }) => {
      const { name, type, category } = row.original;

      return (
        <div>
          <h1 className="font-semibold text-base">
            {Translate(type as keyof State)}
          </h1>
          <p> {Translate(category as keyof State)}</p>
        </div>
      );
    },
  },
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
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      const transaction = row.original;

      return <p>{convertToReal(transaction.amount)}</p>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Horario",
    cell: ({ row }) => {
      const transaction = row.original;

      return <p>{format(transaction.createdAt, "dd/MM/yyyy HH:mm")}</p>;
    },
  },
  {
    id: "actions",
    cell({ row }) {
      const { id } = row.original;

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
              <EditTransaction />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteTransaction id={id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function EditTransaction() {
  return (
    <Dialog>
      <DialogTrigger className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
        Editar
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteTransaction({ id }: { id: string }) {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries("user:summary");
    },
  });

  return (
    <Button
      disabled={isLoading}
      onClick={() => mutate({ id })}
      variant="outline"
      className="relative flex cursor-pointer text-red-500 hover:text-red-400 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    >
      Deletar
    </Button>
  );
}
