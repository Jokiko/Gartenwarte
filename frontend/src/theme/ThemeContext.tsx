import { createContext, useContext } from "react";

export type ColorMode = "light" | "dark";

interface ThemeContextType {
  mode: ColorMode;
  toggleColorMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProviderWrapper");
  }
  return context;
};