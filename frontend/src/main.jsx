import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import ChatProvider from "./Context/ChatProvider";
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  // <StrictMode>

  <Router
    future={{
      v7_startTransition: true,
    }}
  >
    <ChatProvider>
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </Router>
  // </StrictMode>
);
