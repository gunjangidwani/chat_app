import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import ChatProvider from "./Context/ChatProvider";
import { BrowserRouter as Router } from "react-router-dom";
import SocketProvider from "./Context/SocketProvider";
import { Toaster } from "./Components/ui/toaster";

createRoot(document.getElementById("root")).render(
  // <StrictMode>

  <Router
    future={{
      v7_startTransition: true,
    }}
  >
    <ChatProvider>
      <SocketProvider>
        <ChakraProvider value={defaultSystem}>
          <App />
          <Toaster />
        </ChakraProvider>
      </SocketProvider>
    </ChatProvider>
  </Router>
  // </StrictMode>
);
