"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/service/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next";
import { format, subDays } from "date-fns";
import { CalendarCheck, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const FormSchema = z.object({
  name: z.string(),
  value: z.string().min(1),
  value_start: z.string().min(1),
  dueDate: z.date({
    required_error: "A data de vencimento é obrigatória.",
  }),
});

export function CreateGoal() {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ data }: any) => {
      return api.post("/api/user/goals", data, {
        headers: {
          Authorization: `${getCookie("token")}`,
        },
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Ocorreu um erro ao criar uma meta",
        description: `${error}`,
      });
    },
    onSuccess() {
      toast({
        variant: "default",
        title: `Meta Criada com sucesso`,
      });
      form.reset();

      queryClient.invalidateQueries("user:summary");
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    mutate({
      data: {
        title: data.name,
        targetAmount: data.value_start,
        MaxAmount: data.value,
        venciment: data.dueDate,
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/80 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Meta Financeira</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4 py-4"
          >
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="name" className="text-right">
                      Nome da Meta
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="Digite o nome da meta"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="value" className="text-right">
                      Valor da Meta
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="value"
                        type="number"
                        placeholder="Digite o valor da meta"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="value_start"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="value" className="text-right">
                      Valor Inicial da Meta
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="value"
                        type="number"
                        placeholder="Digite o valor da meta"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="id" className="text-left flex">
                      <CalendarCheck className="h-4 w-4 mr-1" />
                      Vencimento
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild className="bg-zinc-950">
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[160px] text-center font-normal",
                            !form.getValues().dueDate && "text-muted-foreground"
                          )}
                        >
                          {form.getValues().dueDate ? (
                            <span>
                              {format(
                                form.getValues().dueDate,
                                "dd/MM/yyyy HH:MM"
                              )}
                            </span>
                          ) : (
                            <span>Selecione o vencimento</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="bg-zinc-950">
                        <FormControl>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="rounded-md border]"
                            disabled={(date) => date < subDays(new Date(), 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
