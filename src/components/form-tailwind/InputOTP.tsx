import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import * as React from "react";

import {
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  InputOTP as InputOTPUi,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputOTP = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <InputOTPUi
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
          "text-black"
        )}
        ref={ref}
        maxLength={8}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        {...(props as any)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} className="text-slate-900" />
          <InputOTPSlot index={1} className="text-slate-900" />
          <InputOTPSlot index={2} className="text-slate-900" />
          <InputOTPSlot index={3} className="text-slate-900" />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} className="text-slate-900" />
          <InputOTPSlot index={5} className="text-slate-900" />
          <InputOTPSlot index={6} className="text-slate-900" />
          <InputOTPSlot index={7} className="text-slate-900" />
        </InputOTPGroup>
      </InputOTPUi>
    );
  }
);
InputOTP.displayName = "Input";

export { InputOTP };
