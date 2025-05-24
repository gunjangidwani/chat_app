import { useState } from "react";
import { Button, HStack } from "@chakra-ui/react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";



function App() {


  return (
    <div className="App">
      <Routes
        future={{
          v7_startTransition: true,
        }}
      >
        <Route path="/" element={<Homepage />} exact />
        <Route path="/chats" element={<Chatpage />} />
      </Routes>
    </div>
  );
}

export default App;
