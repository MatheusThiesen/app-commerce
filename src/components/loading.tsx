import { LoaderCircle } from "lucide-react";

export function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <LoaderCircle className="text-primary animate-spin size-10" />
    </div>
  );
}
