import { useState } from "react";
import type { Chest } from "@/datasheets/chests";
import type { Equipment } from "@/datasheets/equipment";
import type { Weapon } from "@/datasheets/weapons";
import { useGame } from "@/context/GameContext";
import { rollOnChestTable } from "@/utils/chest";
import { Message } from "../components/Message";
import { useAdvanceStep } from "../hooks/useAdvanceStep";
import { StepCounter } from "../components/StepCounter";

const ChestItem = ({ item }: { item: Equipment | Weapon }) => {
  const { dispatch } = useGame();

  const [taken, setTaken] = useState(false);

  return (
    <li className="chest-item">
      <div>
        <div className="inventory__cell-title">{item.name}</div>
        {item._type === "equipment" && <p>{item.description}</p>}
        {item._type !== "equipment" && (
          <div className="inventory__cell-grid">
            <div className="inventory__cell-grid-cell--1">
              Ammo: {item.limited ? `[x${item.ammo}]` : `∞`}
            </div>
            <div className="inventory__cell-grid-cell--2">
              Strength: {item.strength}
            </div>
            <div className="inventory__cell-grid-cell--3">
              Damage: D{item.damage}{" "}
              {item.damageModifier ? `+${item.damageModifier}` : ""}
            </div>
          </div>
        )}
      </div>
      <div>
        <button
          className="btn btn--cta unifrakturcook-bold"
          disabled={taken}
          onClick={() => {
            setTaken(true);

            if (item._type !== "equipment") {
              dispatch({
                type: "weapon_add",
                payload: {
                  weapon: item,
                  messages: [
                    {
                      id: crypto.randomUUID(),
                      text: `Added ${item.name} to inventory`,
                    },
                  ],
                },
              });
            } else {
              dispatch({
                type: "equipment_add",
                payload: {
                  equipment: item,
                  messages: [
                    {
                      id: crypto.randomUUID(),
                      text: `Added ${item.name} to inventory`,
                    },
                  ],
                },
              });
            }
          }}
        >
          {taken ? "Added" : "Add"}
        </button>
      </div>
    </li>
  );
};

export const ChestStep = ({ chest }: { chest: Chest }) => {
  const { state, dispatch } = useGame();
  const advanceStep = useAdvanceStep();
  const rollForEquipment = (): Equipment[] | Weapon[] | [] =>
    rollOnChestTable(chest, dispatch, state.player);

  const [foundEquipment, setFoundEquipment] = useState<
    Equipment[] | Weapon[] | []
  >([]);

  const [chestOpened, setChestOpened] = useState(false);

  return (
    <div className="chest">
      <h2 className="chest__title unifrakturcook-bold step-title">
        {chest.name} <StepCounter stepId={chest.id} />
      </h2>
      <p>{chest.description}</p>
      {chestOpened && foundEquipment.length === 0 && (
        <ul className="chest__list">
          <li>Nothing found</li>
        </ul>
      )}
      {/* Equipment */}
      {foundEquipment.filter((equipment) => equipment._type === "equipment")
        .length > 0 && (
        <>
          <ul className="chest__list">
            {foundEquipment
              .filter((equipment) => equipment._type === "equipment")
              .map((equipment, index) => {
                return (
                  <ChestItem
                    key={equipment.id ?? index}
                    item={equipment}
                  />
                );
              })}
          </ul>
        </>
      )}
      {/* Weapons */}
      {foundEquipment.filter((equipment) => equipment._type !== "equipment")
        .length > 0 && (
        <>
          <ul className="chest__list">
            {foundEquipment
              .filter((weapon) => weapon._type !== "equipment")
              .map((weapon, index) => {
                return <ChestItem key={weapon.id ?? index} item={weapon} />;
              })}
          </ul>
        </>
      )}

      <Message />

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
    </div>
  );
};
