import { createContext, ReactNode, useContext, useState } from "react";
import { HeaderNavigation as Header } from "../components/HeaderNavigation";

import { useAuth } from "../contexts/AuthContext";

type HeaderNavigationContextData = {
  isActive: boolean;
};

type HeaderNavigationProviderProps = {
  children: ReactNode;
};

const HeaderNavigationContenxt = createContext(
  {} as HeaderNavigationContextData
);

export function HeaderNavigationProvider({
  children,
}: HeaderNavigationProviderProps) {
  const [isActive, setIsActive] = useState(true);

  const { isAuthenticated } = useAuth();

  return (
    <HeaderNavigationContenxt.Provider
      value={{
        isActive,
      }}
    >
      {isAuthenticated && isActive && <Header />}
      {children}
    </HeaderNavigationContenxt.Provider>
  );
}

export const HeaderNavigation = () => useContext(HeaderNavigationContenxt);
