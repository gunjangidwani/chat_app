import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <Router> */}
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    {/* </Router> */}
  </StrictMode>
);
