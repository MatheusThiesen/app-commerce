"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronDown, LucideProps } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { ClassNameValue } from "tailwind-merge";
import { Button, ButtonProps } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DetailPageProps {
  children: ReactNode;
}
export const DetailPage = ({ children }: DetailPageProps) => {
  return (
    <div className="flex flex-col items-center w-full px-8 py-6">
      <div className="flex flex-col w-full max-w-[var(--container-max-width)] pb-10">
        {children}
      </div>
    </div>
  );
};

interface DetailHeaderProps {
  children: ReactNode;
  className?: ClassNameValue;
}
export const DetailHeader = ({ children, className }: DetailHeaderProps) => {
  return (
    <div className={cn("text-start mb-8 flex items-center w-full", className)}>
      {children}
    </div>
  );
};

interface DetailTitle {
  children?: ReactNode;
  className?: ClassNameValue;
}
export const DetailTitle = ({ children, className }: DetailTitle) => {
  return <h2 className={cn("text-2xl font-bold", className)}>{children}</h2>;
};

interface DetailSubtitle {
  children?: ReactNode;
  className?: ClassNameValue;
}
export const DetailSubtitle = ({ children, className }: DetailTitle) => {
  return <h3 className={cn("text-xl", className)}>{children}</h3>;
};

export const DetailGoBack = () => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="mr-4 p-2"
      type="button"
      onClick={() => {
        router.back();
      }}
    >
      <ArrowLeft />
    </Button>
  );
};

interface DetailMainProps {
  children?: ReactNode;
}
export const DetailMain = ({ children }: DetailMainProps) => {
  return <div className="bg-box rounded-lg">{children}</div>;
};

interface DetailContentProps {
  secondaryColumn?: ReactNode;
  children?: ReactNode;
  className?: ClassNameValue;
}
export const DetailContent = ({
  secondaryColumn,
  children,
  className,
}: DetailContentProps) => {
  return (
    <div
      className={cn("flex w-full justify-between flex-wrap gap-5", className)}
    >
      {!secondaryColumn ? (
        children
      ) : (
        <>
          <div className="w-full max-w-full lg:max-w-[65.5%] flex flex-col gap-y-6">
            {children}
          </div>
          <div className="w-full  max-w-full lg:max-w-[32%] flex flex-col gap-y-6">
            {secondaryColumn}
          </div>
        </>
      )}
    </div>
  );
};

interface DetailBoxProps {
  children?: ReactNode;
  className?: ClassNameValue;
}
export const DetailBox = ({ children, className }: DetailBoxProps) => {
  return (
    <div
      className={cn(
        "w-full bg-background rounded-md flex flex-col justify-between p-5 gap-y-3",
        className
      )}
    >
      {children}
    </div>
  );
};

interface DetailBoxTitleProps {
  children: ReactNode;
  className?: ClassNameValue;
}
export const DetailBoxTitle = ({
  children,
  className,
}: DetailBoxTitleProps) => {
  return <h3 className={cn("font-bold text-lg", className)}>{children}</h3>;
};

interface DetailBoxSubtitleProps {
  children: ReactNode;
  className?: ClassNameValue;
}
export const DetailBoxSubtitle = ({
  children,
  className,
}: DetailBoxSubtitleProps) => {
  return (
    <p className={cn("font-light text-md text-foreground", className)}>
      <span>{children}</span>
    </p>
  );
};

type DetailActionButtonProps = ButtonProps & {
  className?: ClassNameValue;
};
export const DetailActionButton = ({
  children,
  className,
  ...rest
}: DetailActionButtonProps) => {
  return (
    <Button
      className={cn(
        "bg-red-600 hover:bg-red-500 font-normal text-white border-2 border-red-700 ml-auto",
        className
      )}
      {...rest}
    >
      {children}
    </Button>
  );
};

type DetailOptionsActionsProps = {
  detailOptionsActionsTrigger?: ReactNode;

  data: {
    description: string;
    handle: () => void;
    icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  }[];
};
export const DetailOptionsActions = ({
  data,
  detailOptionsActionsTrigger,
}: DetailOptionsActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {detailOptionsActionsTrigger ? (
          detailOptionsActionsTrigger
        ) : (
          <Button variant="outline" className="p-5">
            Mais ações <ChevronDown className="ml-2 size-4 " />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 mr-8">
        {data.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.description}
            className="text-start p-2 flex justify-start items-center"
            onClick={() => item.handle()}
          >
            {item.icon && <item.icon className="w-[1.2rem] h-[1.2rem] mr-2" />}{" "}
            {item.description}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
