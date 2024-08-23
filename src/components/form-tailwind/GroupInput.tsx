import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { ClassNameValue } from "tailwind-merge";

type Props = {
  children: ReactNode;
  className?: ClassNameValue;
};

export const GroupInput = ({ children, className }: Props) => {
  return (
    <div className={cn(className, "flex flex-wrap gap-3")}>{children}</div>
  );
};
