import { useGame } from "@/context/GameContext";
import { memo, useMemo } from "react";

export const Message = memo(() => {
  const { state } = useGame();

  const reversedMessages = useMemo(
    () => [...state.messages].reverse(),
    [state.messages]
  );

  if (reversedMessages.length > 0) {
    return (
      <ul className="messages">
        {reversedMessages.map((message) => (
          <li key={message.id}>
            <p>{message.text}</p>
          </li>
        ))}
      </ul>
    );
  }
});
