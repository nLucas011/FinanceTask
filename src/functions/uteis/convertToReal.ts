export const convertToReal = (number: number, options = {} as any) => {
  const { moneySign = true } = options;

  if (Number.isNaN(number) || !number) return Number(0).toLocaleString("pt-BR");

  if (typeof number === "string") {
    // n1
    number = Number(number);
  }

  let res;

  const config: any = moneySign
    ? { style: "currency", currency: "BRL" }
    : { minimumFractionDigits: 2 };

  moneySign
    ? (res = number.toLocaleString("pt-BR", config))
    : (res = number.toLocaleString("pt-BR", config));

  const needComma = (number: number) => number <= 1000;
  if (needComma(number)) {
    res = res.toString().replace(".", ",");
  }

  return res; // n2
};
