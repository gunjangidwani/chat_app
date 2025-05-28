import React, { useRef, useEffect } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/helper";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const scrollMsg = useRef();
  const { user } = ChatState();

  useEffect(() => {
    setTimeout(() => {
      scrollMsg.current?.scrollIntoView({ behaviour: "smooth" });
    });
  }, [messages]);
  return (
    <>
      {messages &&
        messages.map((msg, i) => (
          <div ref={scrollMsg} style={{ display: "flex" }} key={msg._id}>
            {(isSameSender(messages, msg, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <span
                // showArrow
                title={msg.sender.name}
                // contentProps={{ css: { "--tooltip-bg": "tomato" } }}
              >
                <Avatar.Root size="sm" mt={7} mr={1} cursor="pointer">
                  <Avatar.Fallback name={msg.sender.name} />
                  <Avatar.Image src={msg.sender.pic} />
                </Avatar.Root>
              </span>
            )}
            <span
              style={{
                backgroundColor: `${
                  msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, msg, i, user._id),
                marginTop: isSameUser(messages, msg, i, user._id) ? 3 : 10,
              }}
            >
              {" "}
              {msg.content}{" "}
            </span>
          </div>
        ))}
    </>
  );
};

export default ScrollableChat;
