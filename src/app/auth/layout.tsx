import "@/style/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finance Task - Auth",
  description: "Autentificar ",
};

export default function LayoutAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
