import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface Props extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
}

export const TextareaBase = ({ name, label, ...props }: Props) => {
  return (
    <div className="grid w-full items-center gap-1">
      {label && (
        <Label htmlFor={name} className=" text-sm font-normal">
          {label}
        </Label>
      )}

      <Textarea name={name} {...props} />
    </div>
  );
};
