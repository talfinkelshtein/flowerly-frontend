import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Register from "./registration/Register";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Register></Register>
  </StrictMode>
);
