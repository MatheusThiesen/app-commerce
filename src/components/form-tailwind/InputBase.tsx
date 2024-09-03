import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

export const InputBase = ({ name, label, ...props }: Props) => {
  return (
    <div className="grid flex-1 items-center gap-1">
      {label && (
        <Label htmlFor={name} className="text-sm font-normal">
          {label}
        </Label>
      )}

      <Input name={name} {...props} />
    </div>
  );
};
