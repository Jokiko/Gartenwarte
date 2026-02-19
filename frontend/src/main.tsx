import React from "react";
import ReactDOM from "react-dom/client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import App from "./App";
import './index.css'
import ThemeProviderWrapper from "./theme/ThemeProviderWrapper";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="de"
    >
      <ThemeProviderWrapper>
        <App />
      </ThemeProviderWrapper>
    </LocalizationProvider>
  </React.StrictMode>
);