/**
 * Moroccan Baccalaureate Average Calculator - React Entry Point
 * Copyright (c) 2024 Mohamed Driou
 * @license MIT
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./i18n"; // <-- ADD THIS LINE (right after App import)

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);