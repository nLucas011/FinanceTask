"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface CardsProps {
  title: string;
  icon?: ReactNode;
  data: any;
}

export function Cards(item: CardsProps) {
  return (
    <Card className="bg-transparent">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
        {item.icon != undefined && item.icon}
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold tracking-tight">{item.data}</span>
      </CardContent>
    </Card>
  );
}
