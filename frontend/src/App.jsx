import { useState } from "react";
import { Button, HStack } from "@chakra-ui/react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";



function App() {


  return (
    <div className="App">
      <Router
        future={{
          v7_startTransition: true,
        }}
      >
        <Routes
          future={{
            v7_startTransition: true,
          }}
        >
          <Route path="/" element={<Homepage />} exact />
          <Route path="/chats" element={<Chatpage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
