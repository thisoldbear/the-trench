import { useGame } from "@/context/GameContext";

export const Message = () => {
  const { state } = useGame();

  if (state.messages.length > 0) {
    return (
      <ul className="messages">
        {[...state.messages].reverse().map((message) => (
          <li key={message.id}>
            <p>{message.text}</p>
          </li>
        ))}
      </ul>
    );
  }
};
