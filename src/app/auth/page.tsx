"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/auth";
import { toast } from "@/hooks/use-toast";
import { api } from "@/service/api";
import { setCookie } from "cookies-next";
import { redirect, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useMutation } from "react-query";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { push } = useRouter();
  const { user } = useUser();
  if (user) redirect("/");

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      return api
        .post("/api/auth/login", {
          email,
          password,
        })
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      setCookie("token", data.token, {
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
      });
      toast({
        title: "Autentificado com sucesso!!",
      });
      push("/");
    },
    onError: (error: any) => {
      setError(`${error.response.data.message}`);
      if (error.response.data.message == "Usuário não encontrado") {
        toast({
          title: "❌ Usuario não existe",
          description: "Deseja se registrar?",
          action: (
            <Button
              onClick={() => {
                return api
                  .post("/api/auth/register", {
                    email,
                    password,
                  })
                  .then((res) => {
                    if (res.data) {
                      toast({
                        title: res.data.message,
                        description:
                          "Faça o Login com seu email e senha novamente!!",
                      });
                    }
                  });
              }}
            >
              Registrar
            </Button>
          ),
        });
      }
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    mutate();
  };

  return (
    <div className="flex flex-1 flex-col h-screen">
      <div className="flex items-center justify-between space-y-2 pb-8 pt-4 m-auto">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Entre</CardTitle>
            <CardDescription>
              Bem-vindo de volta! Faça login para continuar
            </CardDescription>
            <div className="flex justify-center">
              <Button variant="outline" className="w-full">
                Google
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <pre className="text-red-500">{error}</pre>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Autentificando" : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
