import { createContext, ReactNode, useContext, useState } from "react";
import { BottomNavigation } from "../components/BottomNavigation";
import { useAuth } from "../contexts/AuthContext";

type BottomNavigationContextData = {
  isActive: boolean;
  setIsActive: (v: boolean) => void;
  // widthNavigationY: string;
};

type BottomNavigationProviderProps = {
  children: ReactNode;
};

const BottomNavigationContext = createContext(
  {} as BottomNavigationContextData
);

export function BottomNavigationProvider({
  children,
}: BottomNavigationProviderProps) {
  const [isActive, setIsActive] = useState(true);
  const [widthNavigationY, setWidthNavigationY] = useState<string>("3.5rem");
  const { isAuthenticated } = useAuth();

  return (
    <BottomNavigationContext.Provider
      value={{
        isActive,
        setIsActive,
      }}
    >
      {children}
      {isAuthenticated && isActive && (
        <BottomNavigation bottomNavigationY={widthNavigationY} />
      )}
    </BottomNavigationContext.Provider>
  );
}

export const useBottomNavigation = () => useContext(BottomNavigationContext);
