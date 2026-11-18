import { describe, expect, test } from "vitest";
import { gameReducer, generateInitialState, type GameState, type GameAction } from "@/context/GameContext";
import { resolveDecisionTable } from "./resolveDice";
import { fightLoop } from "./fight";
import { rollOnChestTable } from "./chest";
import { applyEquipmentEffect } from "./equipmentEffects";
import { removeTemporaryModifiers } from "./modifiers";
import { createPauseStep } from "@/datasheets/pause";
import { createMessage } from "./messages";
import { perks } from "@/datasheets/perks";
import { equipment } from "@/datasheets/equipment";
import type { Enemy } from "@/datasheets/enemies";
import type { Chest } from "@/datasheets/chests";
import type { Room } from "@/datasheets/rooms";
import type { Trap } from "@/datasheets/traps";
import { rollDice } from "./rollDice";

describe("Full Game Playthrough Simulations & Log Accuracy", () => {
  function validateAllMessages(messages: { id: string; text: string }[]) {
    for (const msg of messages) {
      expect(msg.text).toBeTruthy();
      expect(msg.text).not.toContain("undefined");
      expect(msg.text).not.toContain("null");
      expect(msg.text).not.toContain("NaN");
      expect(msg.text).not.toContain("[object Object]");
      expect(msg.text).not.toContain("  "); // No double spaces
      expect(msg.text).not.toMatch(/\s\./); // No trailing whitespace before period

      // Combat damage math validation: "took X damage (Y + Z modifier)"
      const modMatch = msg.text.match(/took (\d+) damage \((\d+) \+ (\d+) modifier\)/);
      if (modMatch) {
        const total = parseInt(modMatch[1]!, 10);
        const base = parseInt(modMatch[2]!, 10);
        const mod = parseInt(modMatch[3]!, 10);
        expect(total).toBe(base + mod);
      }

      // Trap damage math validation: "dealt X wounds (Y + Z Night ... hazard - 1 Trench Armor)"
      const trapModMatch = msg.text.match(/dealt (\d+) wounds \((\d+) \+ (\d+) Night [IV]+ hazard - 1 Trench Armor\)/);
      if (trapModMatch) {
        const total = parseInt(trapModMatch[1]!, 10);
        const base = parseInt(trapModMatch[2]!, 10);
        const hazard = parseInt(trapModMatch[3]!, 10);
        expect(total).toBe(Math.max(1, base + hazard - 1));
      }
    }
  }

  test("runs a full 5-night campaign simulation and verifies log messages across all encounters", () => {
    let state: GameState = generateInitialState(12345);
    const recordedMessages: { id: string; text: string }[] = [];

    const dispatch = (action: GameAction) => {
      state = gameReducer(state, action);
      if ("payload" in action && action.payload && "messages" in action.payload && action.payload.messages) {
        recordedMessages.push(...action.payload.messages);
      }
    };

    // Simulate 5 nights
    for (let night = 1; night <= 5; night++) {
      expect(state.night).toBe(night);

      // Light 13 lamps
      while (state.rooms < 13 && !state.gameOver) {
        // Resolve a step
        const { step, rolls, tables } = resolveDecisionTable({
          rooms: state.rooms,
          night: state.night,
        });

        const rollDesc =
          rolls.length === 1
            ? `You rolled ${rolls[0]} on ${tables[0]}`
            : `You rolled ${rolls[0]} on ${tables[0]} then ${rolls[1]} on ${tables[1]}`;

        if (step._type === "room") {
          const room = step as Room;
          dispatch({
            type: "active_step",
            payload: {
              activeStep: room,
              messages: [createMessage(`${rollDesc}. Entered: ${room.name}`)],
            },
          });

          if (room.name === "Dark Trench") {
            const nextRooms = state.rooms + 1;
            removeTemporaryModifiers(state.player, dispatch);
            if (nextRooms >= 13) {
              dispatch({
                type: "rooms_increment",
                payload: {
                  rooms: nextRooms,
                  messages: [createMessage("Lit the 13th lamp! The night passes.")],
                },
              });
            } else {
              // Pause step
              const pause = createPauseStep(nextRooms);
              dispatch({
                type: "active_step",
                payload: {
                  activeStep: pause,
                  rooms: nextRooms,
                  messages: [createMessage("Lit the lamp")],
                },
              });
            }
          } else if (room.name === "Chapel") {
            const isNight5 = state.night >= 5;
            const rollAmount = isNight5 ? rollDice(3) : 0;
            const restoredWounds = isNight5
              ? Math.min(state.player.wounds + rollAmount, state.player.totalWounds)
              : state.player.totalWounds;
            dispatch({
              type: "player_restored",
              payload: {
                wounds: restoredWounds,
                messages: [
                  createMessage(
                    isNight5
                      ? `You prayed in the desecrated chapel. Health restored by ${rollAmount} (diminished sanctuary).`
                      : "You prayed. Health restored.",
                  ),
                ],
              },
            });
          }
        } else if (step._type === "chest") {
          const chest = step as Chest;
          dispatch({
            type: "active_step",
            payload: {
              activeStep: chest,
              messages: [createMessage(`${rollDesc}. Found: ${chest.name}`)],
            },
          });

          // Search chest
          const loot = rollOnChestTable(chest, dispatch, state.player, {
            night: state.night,
            perks: state.perks,
            lastStandUsed: state.lastStandUsedThisNight,
          });

          for (const item of loot) {
            if (item._type === "equipment") {
              dispatch({
                type: "equipment_add",
                payload: {
                  equipment: item,
                  messages: [createMessage(`Added ${item.name} to inventory`)],
                },
              });
            } else {
              dispatch({
                type: "weapon_add",
                payload: {
                  weapon: item,
                  messages: [createMessage(`Added ${item.name} to inventory`)],
                },
              });
            }
          }
        } else if (step._type === "trap") {
          const trap = step as Trap;
          const trapBonus = state.night >= 4 ? 2 : state.night >= 2 ? 1 : 0;
          const hasTrenchArmor = state.perks.includes("trench-armor");
          const baseDamage = rollDice(trap.damage);
          const romanNumerals = ["", "I", "II", "III", "IV", "V"];
          const nightRoman = romanNumerals[state.night] || `${state.night}`;
          const trapDamage = Math.max(1, baseDamage + trapBonus - (hasTrenchArmor ? 1 : 0));

          let damageMessage = `${trap.name} dealt ${trapDamage} wounds.`;
          if (trapBonus > 0 && hasTrenchArmor) {
            damageMessage = `${trap.name} dealt ${trapDamage} wounds (${baseDamage} + ${trapBonus} Night ${nightRoman} hazard - 1 Trench Armor). (Trench Armor reduced damage by 1)`;
          } else if (trapBonus > 0) {
            damageMessage = `${trap.name} dealt ${trapDamage} wounds (${baseDamage} + ${trapBonus} Night ${nightRoman} hazard).`;
          }

          dispatch({
            type: "active_step",
            payload: {
              activeStep: trap,
              messages: [createMessage(`${rollDesc}. Trap: ${trap.name}`)],
            },
          });

          // Keep player alive for campaign exploration
          const nextWounds = Math.max(5, state.player.wounds - trapDamage);
          dispatch({
            type: "player_wounded",
            payload: {
              wounds: nextWounds,
              messages: [createMessage(damageMessage)],
            },
          });
        } else if (step._type === "enemy") {
          const enemy = { ...(step as Enemy) };
          dispatch({
            type: "active_step",
            payload: {
              activeStep: enemy,
              messages: [createMessage(`${rollDesc}. Encountered: ${enemy.name}`)],
            },
          });

          // Heal up before combat if wounded
          if (state.player.wounds < 10) {
            dispatch({
              type: "player_restored",
              payload: {
                wounds: state.player.totalWounds,
                messages: [createMessage("Restored health")],
              },
            });
          }

          // Fight rounds until enemy dead
          let rounds = 0;
          while (enemy.wounds > 0 && rounds < 15) {
            rounds++;
            fightLoop(state.player, enemy, dispatch, {
              perks: state.perks,
              lastStandUsed: state.lastStandUsedThisNight,
            });
            if (state.activeStep?._type === "enemy") {
              enemy.wounds = (state.activeStep as Enemy).wounds;
            }
            if (state.player.wounds <= 5) {
              dispatch({
                type: "player_restored",
                payload: {
                  wounds: state.player.totalWounds,
                  messages: [createMessage("Combat triage restored health")],
                },
              });
            }
          }
        }
      }

      // Check Dawn / perk selection
      if (night < 5) {
        const availablePerks = perks.filter((p) => !state.perks.includes(p.id));
        if (availablePerks.length > 0) {
          const chosenPerk = availablePerks[0]!;
          dispatch({
            type: "perk_select",
            payload: {
              perkId: chosenPerk.id,
              messages: [
                createMessage(
                  `Acquired Dawn Perk: [${chosenPerk.code}] ${chosenPerk.name} - ${chosenPerk.description}`,
                ),
              ],
            },
          });
        }

        // Advance to next night
        dispatch({
          type: "fight_on_another_night",
          payload: {
            messages: [
              createMessage(
                `You steel your nerves to fight on for Night ${night + 1}${
                  night === 1 ? " (+1 Toughness, Max HP increased to 20)" : ""
                }.`,
              ),
            ],
          },
        });
      }
    }

    expect(state.night).toBe(5);
    expect(state.rooms).toBe(13);
    expect(state.perks.length).toBe(4);
    expect(recordedMessages.length).toBeGreaterThan(50);
    validateAllMessages(recordedMessages);
  });

  test("fleeing mechanics and messages at 0 lamps vs >0 lamps", () => {
    let state = generateInitialState();
    const recordedMessages: { id: string; text: string }[] = [];
    const dispatch = (action: GameAction) => {
      state = gameReducer(state, action);
      if ("payload" in action && action.payload && "messages" in action.payload && action.payload.messages) {
        recordedMessages.push(...action.payload.messages);
      }
    };

    // Set 3 lamps and flee
    state.rooms = 3;
    dispatch({
      type: "active_step",
      payload: {
        rooms: 2,
        messages: [createMessage("Fled from combat. A lamp went out.")],
      },
    });
    expect(state.rooms).toBe(2);
    expect(recordedMessages.at(-1)?.text).toBe("Fled from combat. A lamp went out.");

    // Flee at 0 lamps
    state.rooms = 0;
    const fleeDamage = 2;
    dispatch({
      type: "player_wounded",
      payload: {
        wounds: state.player.wounds - fleeDamage,
        messages: [createMessage(`Rolled D3: Fleeing dealt ${fleeDamage} damage`)],
      },
    });
    expect(state.player.wounds).toBe(13); // 15 - 2
    expect(recordedMessages.at(-1)?.text).toBe("Rolled D3: Fleeing dealt 2 damage");

    validateAllMessages(recordedMessages);
  });

  test("equipment effects messaging across Bandage, Morphine, Cigarettes, Hip Flask, First Aid Kit, and Adrenaline Shot", () => {
    let state = generateInitialState();
    const recordedMessages: { id: string; text: string }[] = [];
    const dispatch = (action: GameAction) => {
      state = gameReducer(state, action);
      if ("payload" in action && action.payload && "messages" in action.payload && action.payload.messages) {
        recordedMessages.push(...action.payload.messages);
      }
    };

    // Morphine
    applyEquipmentEffect(equipment[1]!, state.player, dispatch);
    expect(recordedMessages.at(-1)?.text).toBe("Toughness increased for a short while");

    // Bandage
    state.player.wounds = 10;
    applyEquipmentEffect(equipment[0]!, state.player, dispatch);
    expect(recordedMessages.at(-1)?.text).toBe("Bandage restored 3 health.");

    // Cigarettes
    applyEquipmentEffect(equipment[2]!, state.player, dispatch);
    expect(recordedMessages.at(-1)?.text).toBe("Cigarettes added +1 to hit rolls for a short while");

    // Hip Flask
    applyEquipmentEffect(equipment[3]!, state.player, dispatch);
    expect(recordedMessages.some((m) => m.text.includes("Damage results increased by 2"))).toBe(true);

    // First Aid Kit
    state.player.wounds = 5;
    applyEquipmentEffect(equipment[4]!, state.player, dispatch);
    expect(recordedMessages.at(-1)?.text).toBe("First Aid Kit restored 6 health.");

    // Adrenaline Shot
    applyEquipmentEffect(equipment[5]!, state.player, dispatch);
    expect(recordedMessages.some((m) => m.text.includes("Adrenaline Shot added +2 to hit rolls"))).toBe(true);
    expect(recordedMessages.some((m) => m.text.includes("Adrenaline Shot added +2 to damage results"))).toBe(true);

    validateAllMessages(recordedMessages);
  });
});
