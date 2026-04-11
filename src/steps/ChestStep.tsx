import { useState } from "react";
import type { Chest } from "@/datasheets/chests";
import type { Equipment } from "@/datasheets/equipment";
import type { Weapon } from "@/datasheets/weapons";
import { player } from "@/datasheets/player";
import { useGame } from "@/context/GameContext";
import { rollOnChestTable } from "@/utils/chest";
import { Message } from "../components/Message";
import { useAdvanceStep } from "../hooks/useAdvanceStep";

export const ChestStep = ({ chest }: { chest: Chest }) => {
  const { dispatch } = useGame();
  const advanceStep = useAdvanceStep();
  const rollForEquipment = (): Equipment[] | Weapon[] | [] =>
    rollOnChestTable(chest, dispatch);

  const [foundEqupment, setFoundEquipment] = useState<
    Equipment[] | Weapon[] | []
  >([]);

  const [chestOpened, setChestOpened] = useState(false);

  return (
    <div>
      <h1>{chest.name}</h1>
      <p>{chest.description}</p>
      <div>
        <button
          disabled={chestOpened}
          onClick={() => {
            setChestOpened(true);
            const equipment = rollForEquipment();

            if (equipment && equipment.length > 0) {
              setFoundEquipment(equipment);
            }
          }}
        >
          Search
        </button>
      </div>

      {foundEqupment.length > 0 && (
        <ul>
          {foundEqupment
            .filter((equipment) => equipment._type === "equipment")
            .map((equipment) => {
              return (
                <li key={equipment.id}>
                  {equipment.name} - {equipment.description}
                  <button
                    disabled={player.equipment.length >= player.totalEquipment}
                    onClick={() => {
                      dispatch({
                        type: "equipment_add",
                        payload: {
                          equipment: equipment,
                          messages: [
                            {
                              id: crypto.randomUUID(),
                              text: `Added ${equipment.name}`,
                            },
                          ],
                        },
                      });
                    }}
                  >
                    Take
                  </button>
                </li>
              );
            })}
        </ul>
      )}

      <button
        onClick={() => {
          advanceStep();
        }}
      >
        Continue
      </button>
      <Message />
    </div>
  );
};
