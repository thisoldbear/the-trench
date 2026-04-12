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
    <div className="chest">
      <h1 className="unifrakturcook-bold">{chest.name}</h1>
      <p>{chest.description}</p>
      {chestOpened && foundEqupment.length === 0 && (
        <ul className="chest__list">
          <li>Nothing found</li>
        </ul>
      )}
      {foundEqupment.filter((equipment) => equipment._type === "equipment")
        .length > 0 && (
        <>
          <h2>Equipment</h2>
          <ul className="chest__list">
            {foundEqupment
              .filter((equipment) => equipment._type === "equipment")
              .map((equipment) => {
                return (
                  <li key={equipment.id}>
                    <div>
                      <strong>{equipment.name}</strong> <br />{" "}
                      {equipment.description}
                    </div>
                    <div>
                      <button
                        className="btn btn--cta unifrakturcook-bold"
                        disabled={
                          player.equipment.length >= player.totalEquipment
                        }
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
                    </div>
                  </li>
                );
              })}
          </ul>
        </>
      )}
      {foundEqupment.filter((equipment) => equipment._type !== "equipment")
        .length > 0 && (
        <>
          <h2>Equipment</h2>
          <ul className="chest__list">
            {foundEqupment
              .filter((weapon) => weapon._type !== "equipment")
              .map((weapon) => {
                return (
                  <li key={weapon.id}>
                    {weapon.name} - {weapon.description}
                    <button
                      disabled={
                        player.equipment.length >= player.totalEquipment
                      }
                      onClick={() => {
                        dispatch({
                          type: "weapon_add",
                          payload: {
                            weapon: weapon,
                            messages: [
                              {
                                id: crypto.randomUUID(),
                                text: `Added ${weapon.name}`,
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
        </>
      )}
      <div className="btn-group">
        <button
          className="btn btn--cta unifrakturcook-bold"
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
        <button
          className="btn btn--cta unifrakturcook-bold"
          onClick={() => {
            advanceStep();
          }}
        >
          Continue
        </button>
      </div>
      <Message />
    </div>
  );
};
