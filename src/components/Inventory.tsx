import { useGame } from "@/context/GameContext";
import { applyEquipmentEffect } from "@/utils/equipmentEffects";

export const Inventory = () => {
  const { state, dispatch } = useGame();

  return (
    <div>
      <ul>
        {state.player.weapons.map((weapon) => (
          <li key={weapon.name}>
            <button
              disabled={weapon.ammo <= 0}
              onClick={() => {
                dispatch({
                  type: "equipped_weapon_add",
                  payload: { weaponId: weapon.id },
                });
              }}
            >
              {weapon.id === state.player.equippedWeapon ? "👉🏻 " : ""}
              {weapon.name}
              {` `}
              S:{weapon.strength}
              {` `}
              D:D{weapon.damage}
              {` `}
              {weapon.damageModifier ? `+ ${weapon.damageModifier}` : ""}
              {` `}
              {weapon.limited && weapon.ammo === 1 && `[x1]`}
              {weapon.limited && weapon.ammo > 1 && `[x${weapon.ammo}]`}
            </button>
          </li>
        ))}
      </ul>

      <ul>
        {state.player.equipment.map((equipment, index) => (
          <li key={equipment.id}>
            <p>
              {equipment.name} {equipment.description}
            </p>
            <button
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
                      (_, i) => i !== index,
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
              Use
            </button>
            <button disabled={!state.activeStep}>Discard</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
