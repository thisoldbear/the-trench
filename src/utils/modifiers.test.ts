import { expect, test, mock, describe, beforeEach } from "bun:test";
import {
  removeTemporaryModifiers,
  decrementDamageModifier,
} from "./modifiers";

describe("removeTemporaryModifiers", () => {
  let dispatch: ReturnType<typeof mock>;

  beforeEach(() => {
    dispatch = mock(() => {});
  });

  test("removes damage modifier when greater than 0", () => {
    const player = { damageModifier: 2, hitModifier: 0 };
    removeTemporaryModifiers(player, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0]![0]!.type).toBe("player_damage_remove");
    expect(dispatch.mock.calls[0]![0]!.payload.damageModifier).toBe(0);
    expect(dispatch.mock.calls[0]![0]!.payload.messages).toHaveLength(1);
    expect(dispatch.mock.calls[0]![0]!.payload.messages[0]!.text).toContain(
      "Damage modifier removed",
    );
  });

  test("removes hit modifier when greater than 0", () => {
    const player = { damageModifier: 0, hitModifier: 1 };
    removeTemporaryModifiers(player, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0]![0]!.type).toBe(
      "player_hit_modifier_remove",
    );
    expect(dispatch.mock.calls[0]![0]!.payload.messages).toHaveLength(1);
    expect(dispatch.mock.calls[0]![0]!.payload.messages[0]!.text).toContain(
      "Cigarettes +1 to hit rolls wore off",
    );
  });

  test("removes both modifiers when both are greater than 0", () => {
    const player = { damageModifier: 3, hitModifier: 2 };
    removeTemporaryModifiers(player, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0]![0]!.type).toBe("player_damage_remove");
    expect(dispatch.mock.calls[1]![0]!.type).toBe(
      "player_hit_modifier_remove",
    );
  });

  test("does not dispatch when damage modifier is 0", () => {
    const player = { damageModifier: 0, hitModifier: 0 };
    removeTemporaryModifiers(player, dispatch);

    expect(dispatch).not.toHaveBeenCalled();
  });

  test("does not dispatch when hit modifier is 0", () => {
    const player = { damageModifier: 0, hitModifier: 0 };
    removeTemporaryModifiers(player, dispatch);

    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe("decrementDamageModifier", () => {
  let dispatch: ReturnType<typeof mock>;

  beforeEach(() => {
    dispatch = mock(() => {});
  });

  test("decrements modifier from 3 to 2", () => {
    decrementDamageModifier(3, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0]![0]!.type).toBe("player_damage_remove");
    expect(dispatch.mock.calls[0]![0]!.payload.damageModifier).toBe(2);
    expect(dispatch.mock.calls[0]![0]!.payload.messages).toHaveLength(1);
    expect(dispatch.mock.calls[0]![0]!.payload.messages[0]!.text).toContain(
      "Damage bonus dropped to 2",
    );
  });

  test("decrements modifier from 1 to 0", () => {
    decrementDamageModifier(1, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0]![0]!.payload.damageModifier).toBe(0);
    expect(dispatch.mock.calls[0]![0]!.payload.messages[0]!.text).toContain(
      "Damage bonus dropped to 0",
    );
  });

  test("does not dispatch when modifier is already 0", () => {
    decrementDamageModifier(0, dispatch);

    expect(dispatch).not.toHaveBeenCalled();
  });

  test("does not dispatch when modifier is negative", () => {
    decrementDamageModifier(-1, dispatch);

    expect(dispatch).not.toHaveBeenCalled();
  });
});
