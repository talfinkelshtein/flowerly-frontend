import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme/theme";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="971005664793-temc8560umpfanormjketp91k35sbj6g.apps.googleusercontent.com">
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
