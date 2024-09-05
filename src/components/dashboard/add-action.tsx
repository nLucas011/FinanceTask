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
import { toast } from "@/hooks/use-toast";
import { api } from "@/service/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Repeat, TrendingDown, TrendingUp } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const FormSchema = z.object({
  amount: z.coerce.number().min(1),
  category: z.string().optional(),
  date: z.date(),
  note: z.string().optional(),
  transferFrom: z.string().optional(),
  transferTo: z.string().optional(),
});

export function AddAction() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 items-center">
          Adicionar
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52">
        <div className="grid gap-2">
          <TransactionForm
            type="revenue"
            icon={<TrendingUp color="green" className="h-4 w-4" />}
            title="Receita"
            categoryOptions={[
              { value: "investment", label: "Investimento" },
              { value: "others", label: "Outros" },
              { value: "present", label: "Presente" },
              { value: "payment_wage", label: "Salário" },
            ]}
          />
          <TransactionForm
            type="expenses"
            icon={<TrendingDown color="red" className="h-4 w-4" />}
            title="Despesa"
            categoryOptions={[
              { value: "investment", label: "Investimento" },
              { value: "others", label: "Outros" },
              { value: "present", label: "Presente" },
              { value: "payment_wage", label: "Salário" },
              { value: "utilities", label: "Utilidades" },
              { value: "food", label: "Alimentação" },
              { value: "transport", label: "Transporte" },
              { value: "health", label: "Saúde" },
              { value: "entertainment", label: "Entretenimento" },
              { value: "education", label: "Educação" },
            ]}
          />

          <TransactionForm
            type="transfer"
            icon={<Repeat color="blue" className="h-4 w-4" />}
            title="Transferência"
            categoryOptions={[]}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
  
interface TransactionFormProps {
  type: string;
  title: string;
  categoryOptions: { value: string; label: string }[];
  icon?: ReactNode;
}

export function TransactionForm({
  type,
  icon,
  title,
  categoryOptions,
}: TransactionFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ data }: any) => {
      console.log("data", data);
      return api.post("/api/user/transaction", data, {
        headers: {
          Authorization: `${getCookie("token")}`,
        },
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description: `${error}`,
      });
    },
    onSuccess() {
      toast({
        variant: "default",
        title: `Criada com sucesso`,
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
        status: "approved",
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
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

              {type == "transfer" ? (
                <FormField
                  control={form.control}
                  name="transferFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="transferFrom">
                        Conta de Origem
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="transferFrom"
                          placeholder="Banco de Origem"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="category">Categoria</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
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
              {type == "transfer" && (
                <FormField
                  control={form.control}
                  name="transferTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Banco de Destino" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="notes">Observação</FormLabel>
                  <FormControl>
                    <Textarea
                      id="notes"
                      placeholder="Adicione uma observação..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
