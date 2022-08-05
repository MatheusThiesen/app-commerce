import { createContext, ReactNode, useContext, useState } from "react";
import { BottonNavigation } from "../components/BottonNavigation";
import { useAuth } from "../contexts/AuthContext";

type BottonNavigationContextData = {
  isActive: boolean;
  setIsActive: (v: boolean) => void;
  widthNavigationY: string;
};

type BottonNavigationProviderProps = {
  children: ReactNode;
};

const BottonNavigationContenxt = createContext(
  {} as BottonNavigationContextData
);

export function BottonNavigationProvider({
  children,
}: BottonNavigationProviderProps) {
  const [isActive, setIsActive] = useState(true);
  const [widthNavigationY, setWidthNavigationY] = useState<string>("3.5rem");
  const { isAuthenticated } = useAuth();

  return (
    <BottonNavigationContenxt.Provider
      value={{
        isActive,
        setIsActive,
        widthNavigationY,
      }}
    >
      {children}
      {isAuthenticated && isActive && (
        <BottonNavigation bottonNavigationY={widthNavigationY} />
      )}
    </BottonNavigationContenxt.Provider>
  );
}

export const useBottonNavigation = () => useContext(BottonNavigationContenxt);
