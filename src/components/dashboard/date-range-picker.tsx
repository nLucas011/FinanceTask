"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

interface CalendarDateRangePickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  Change: (date: Date) => void;
}

export function CalendarDateRangePicker({
  className,
  Change,
}: CalendarDateRangePickerProps) {
  const [date, setDate] = useState(new Date());

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const changeMonth = (increment: number) => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      Change(newDate);
      return newDate;
    });
  };

  const changeYear = (increment: number) => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setFullYear(newDate.getFullYear() + increment);
      Change(newDate);
      return newDate;
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[200px] justify-between text-left font-normal"
        >
          <span>
            {months[date.getMonth()]} - {date.getFullYear()}
          </span>
          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 flex flex-col items-center">
          <div className="flex justify-between items-center w-full mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeYear(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold">{date.getFullYear()}</span>
            <Button variant="outline" size="icon" onClick={() => changeYear(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center w-full">
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeMonth(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold">
              {months[date.getMonth()]}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeMonth(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
