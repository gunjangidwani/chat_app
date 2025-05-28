import React, { useEffect, useState, createContext, useContext } from "react";
import { io } from "socket.io-client";
import { ChatState } from "./ChatProvider";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const { user } = ChatState();
  const [socket, setSocket] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const ENDPOINT = "http://localhost:5173";
  useEffect(() => {
    if (user?._id) {
      const socket = io(ENDPOINT);

      setSocket(socket);
      socket.emit("setup", user);
      socket.on("connected", () => {
        setSocketConnected(true);
      });
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export default SocketProvider;
