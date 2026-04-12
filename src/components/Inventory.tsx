import { useGame } from "@/context/GameContext";
import { applyEquipmentEffect } from "@/utils/equipmentEffects";

export const Inventory = () => {
  const { state, dispatch } = useGame();

  return (
    <div className="inventory">
      <h2 className="inventory__title unifrakturcook-bold">Inventory</h2>
      <p>Tap to equip/use</p>
      <div className="inventory__grid">
        {state.player.weapons.map((weapon) => (
          <div
            className={`inventory__cell ${weapon.uuid === state.player.equippedWeapon ? "inventory__cell--equipped" : ""}`}
            key={weapon.uuid}
          >
            <button
              className="special-elite-regular"
              disabled={weapon.ammo <= 0}
              onClick={() => {
                dispatch({
                  type: "equipped_weapon_add",
                  payload: { weaponId: weapon.uuid },
                });
              }}
            >
              <div className="inventory__cell-title">
                {weapon.name}
                {` `}
                {weapon.uuid === state.player.equippedWeapon
                  ? "[Equipped]"
                  : ""}
              </div>
              <div className="inventory__cell-grid">
                <div className="inventory__cell-grid-cell--1">
                  Ammo:{" "}
                  {weapon.limited
                    ? weapon.ammo === 1
                      ? `[x1]`
                      : `[x${weapon.ammo}]`
                    : "∞"}
                </div>
                <div className="inventory__cell-grid-cell--2">
                  Strength: {weapon.strength}
                </div>
                <div className="inventory__cell-grid-cell--3">
                  Damage: D{weapon.damage}{" "}
                  {weapon.damageModifier ? `+${weapon.damageModifier}` : ""}
                </div>
              </div>
            </button>
          </div>
        ))}

        {state.player.equipment.map((equipment, index) => (
          <div className="inventory__cell" key={equipment.uuid}>
            <button
              className="special-elite-regular"
              disabled={!state.activeStep}
              onClick={() => {
                applyEquipmentEffect(
                  equipment,
                  {
                    wounds: state.player.wounds,
                    toughness: state.player.toughness,
                    damageModifier: state.player.damageModifier,
                  },
                  dispatch,
                );

                dispatch({
                  type: "equipment_remove",
                  payload: {
                    equipment: state.player.equipment.filter(
                      (item) => item.uuid !== equipment.uuid,
                    ),
                    messages: [
                      {
                        id: crypto.randomUUID(),
                        text: `${equipment.name} was used`,
                      },
                    ],
                  },
                });
              }}
            >
              <div className="inventory__cell-title">{equipment.name}</div>
              {equipment.description}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
