import type { Room } from "@/datasheets/rooms";
import { Message } from "../components/Message";
import { useAdvanceStep } from "../hooks/useAdvanceStep";

export const RoomStep = ({ room }: { room: Room }) => {
  const advanceStep = useAdvanceStep();

  return (
    <div>
      <h1>{room.name}</h1>
      <p>{room.description}</p>
      <Message />
      <button onClick={() => advanceStep({ rooms: 1 })}>Light the lamp</button>
    </div>
  );
};
