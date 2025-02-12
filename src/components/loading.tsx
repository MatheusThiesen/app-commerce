import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import { ClassNameValue } from "tailwind-merge";

interface Props {
  className?: ClassNameValue;
}

export function Loading({ className }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <LoaderCircle
        className={cn("text-primary animate-spin size-10", className)}
      />
    </div>
  );
}
