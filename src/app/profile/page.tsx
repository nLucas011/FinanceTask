"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/auth";
import { toast } from "@/hooks/use-toast";
import { api } from "@/service/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Nome deve ter pelo menos 2 caracteres.",
    })
    .max(50),
  avatar_url: z.any().optional(),
  email: z.string().min(10),
});

export default function ProfileSettings() {
  const [file, setFile] = useState<File | null>(null);
  const { user } = useUser();
  if (!user) redirect("/auth");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      avatar_url: user.avatar,
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData: FormData) => {
      return api
        .post("/api/users/me/profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${getCookie("token")}`,
          },
        })
        .then((res) => res.data);
    },
    onError: (error: any) => {
      console.log("error", error)
      toast({
        title: "❌ Erro ao atualizar perfil",
        description: error.response?.data?.message || "Erro desconhecido.",
      });
    },
    onSuccess: (data) => {
      console.log("data", data)
      toast({
        title: "✅" + data.message,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    if (file) {
      formData.append("avatar", file);
    }

    mutate(formData);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-[8rem] pt-[6rem]">
        <main className="flex flex-1 flex-col gap-4 p-4 ">
          <div className="grid w-full max-w-6xl gap-2">
            <h1 className="mr-4 text-3xl font-semibold">Configurações</h1>
          </div>
          <Tabs
            defaultValue="account"
            className="grid w-full max-w-6xl items-start md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
          >
            <TabsList className="grid text-sm text-muted-foreground bg-black">
              <TabsTrigger value="account">
                <Button variant="outline">Meu Cadastro</Button>
              </TabsTrigger>
              <TabsTrigger value="password">
                <Button variant="outline">Privacidade</Button>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className="grid gap-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="avatar_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Avatar</FormLabel>
                          <FormDescription className="relative cursor-pointer"></FormDescription>
                          <FormControl>
                            <>
                              <Label
                                htmlFor="imagefile"
                                className="relative flex flex-col cursor-pointer"
                              >
                                <Image
                                  src={
                                    file != null
                                      ? URL.createObjectURL(file)
                                      : field.value
                                  }
                                  alt="Avatar Preview"
                                  width={100}
                                  height={100}
                                  className="rounded-full pointer-events-none"
                                />
                              </Label>
                              <Input
                                type="file"
                                id="imagefile"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={(e) => {
                                  setFile(e.target.files?.[0] || null);
                                }}
                                className="hidden"
                              />
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
