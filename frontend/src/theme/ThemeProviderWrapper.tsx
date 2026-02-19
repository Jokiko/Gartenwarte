import React, { useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { ThemeContext, type ColorMode } from "./ThemeContext";

interface Props {
  children: React.ReactNode;
}

export default function ThemeProviderWrapper({ children }: Props) {

  const getInitialMode = (): ColorMode => {
    const stored = localStorage.getItem("GartenwarteTheme");
    return stored === "dark" ? "dark" : "light";
  };

  const [mode, setMode] = useState<ColorMode>(getInitialMode);

  const toggleColorMode = () => {
    localStorage.setItem("GartenwarteTheme", mode === "light" ? "dark" : "light");
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
              ? {
                  primary: {
                    main: "#2e7d32",
                  },
                }
              : {
                  primary: {
                    main: "#2e7d32",
                  },
                }),
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}