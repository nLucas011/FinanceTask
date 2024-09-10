import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { convertToReal } from "@/functions";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/service/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarCheck, PackagePlus, Pencil, Plus, Trash } from "lucide-react";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";

interface GoalProps {
  id: string;
  title: string;
  targetAmount: number;
  MaxAmount: number;
  venciment: string;
}

export function Goals({
  id,
  MaxAmount,
  targetAmount,
  title,
  venciment,
}: GoalProps) {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      return api
        .delete(`/api/user/goals/${id}`, {
          headers: {
            Authorization: `${getCookie("token")}`,
          },
        })
        .then((res) => res.data);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description: `${error}`,
      });
    },
    onSuccess: (data) => {
      toast({
        variant: "default",
        title: `${data.message}`,
      });
      queryClient.invalidateQueries("user:summary");
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="border border-zinc-500/40 rounded-xl p-4 max-w-[20rem] mb-2">
          <div className="flex items-center gap-3">
            <Plus className="h-7 w-7 p-1 bg-zinc-500/80 rounded-md  text-white" />
            <p className="font-medium">{title}</p>
          </div>
          <div className="mt-4">
            <Progress value={targetAmount} max={MaxAmount} />
            <div className="flex items-center justify-between mt-1">
              <p>{convertToReal(targetAmount)}</p>
              <p>{convertToReal(MaxAmount)}</p>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-black w-auto">
        <div className="grid gap-2">
          <GoalsForm
            id={id}
            title="Editar"
            type="updated"
            title_goal={title}
            MaxAmount={MaxAmount}
            targetAmount={targetAmount}
            venciment={venciment}
            icon={<Pencil className="h-4 w-4" />}
          />
          <Button
            variant="outline"
            onClick={() => mutate()}
            className="gap-4 items-center justify-start"
          >
            <Trash className="h-4 w-4" />
            {isLoading ? "Deletando" : "Deletar"}
          </Button>
          <GoalsForm
            id={id}
            title="Aportar"
            type="contribute"
            icon={<PackagePlus className="h-4 w-4" />}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

const FormSchema = z.object({
  title: z.string().optional(),
  MaxAmount: z.coerce.number().min(1).optional(),
  targetAmount: z.coerce.number().min(1).optional(),
  venciment: z.date(),
});

interface FormProps {
  id: string;
  type: string;
  title: string;
  icon?: ReactNode;
  title_goal?: string;
  targetAmount?: number;
  MaxAmount?: number;
  venciment?: string;
}

export function GoalsForm({
  id,
  type,
  icon,
  title,
  title_goal,
  MaxAmount,
  targetAmount,
  venciment,
}: FormProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: title_goal,
      venciment: venciment ? new Date(venciment) : new Date(),
      targetAmount,
      MaxAmount,
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ data }: any) => {
      return api
        .put(`/api/user/goals/${id}`, data, {
          headers: {
            Authorization: `${getCookie("token")}`,
          },
        })
        .then((res) => res.data);
    },
    onError: (error: any) => {
      console.log("error", error);
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description: `${error.error}`,
      });
    },
    onSuccess(data) {
      toast({
        variant: "default",
        title: data.message,
      });

      form.reset();
      queryClient.invalidateQueries("user:summary");
    },
  });

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    mutate({
      data: {
        ...data,
        type,
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-4 items-center justify-start">
          {icon !== undefined && icon}
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4 py-4"
          >
            {type == "contribute" ? (
              <>
                <FormField
                  control={form.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="amount">Valor</FormLabel>
                      <FormControl>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="R$ 0,00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="venciment"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline">
                              {field.value
                                ? format(field.value, "PPP", { locale: ptBR })
                                : "Escolha uma data"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            locale={ptBR}
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="title"
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
                    name="MaxAmount"
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
                    name="targetAmount"
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
                    name="venciment"
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
                                !form.getValues().venciment &&
                                  "text-muted-foreground"
                              )}
                            >
                              {form.getValues().venciment ? (
                                <span>
                                  {format(
                                    form.getValues().venciment,
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
                                disabled={(date) =>
                                  date < subDays(new Date(), 1)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

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
