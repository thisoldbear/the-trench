# THE TRENCH — Lite Printed Edition (3-Night Campaign)

> *A solo tabletop survival game of mud, iron, and dying light. All you need is this ruleset, a pencil, **1× d20**, and **1× d6**.*

---

## 1. What You Need

- **1× d20** (20-sided die) for exploration, loot, enemies, traps, and random perks.
- **1× d6** (6-sided die) for combat, damage, and starting gear.
  - **Rolling 1d3:** Roll 1d6 and divide by 2, rounding up (`1–2 = 1`, `3–4 = 2`, `5–6 = 3`).
  - **Rolling 1d2:** Roll 1d6 (`1–3 = 1`, `4–6 = 2`).
- **A pencil & the Trench Log** (see Section 8 at the end of this document).

---

## 2. Setup & Starting Loadout

At the start of **Night 1**, record the following on your Trench Log:

- **Night:** `1` of `3`
- **Lamps Lit:** `0 / 8`
- **Wounds (HP):** `15 / 15`
- **Base Toughness:** `3` (Current Toughness: `3`)
- **Permanent Hit Modifier:** `+0`
- **Starting Equipment:** `1× Bandage`
- **Starting Weapons:**
  1. **Pistol** (Str `3`, Dmg `1d6`, `20 / 20` Ammo) — *Equipped*
  2. **Bloodied Fists** (Str `2`, Dmg `1d3`, Infinite uses) — *Always available*
  3. **1× Random Secondary Weapon:** Roll **1d6** on **Table V** (`1` = Knife, `2` = Sword, `3` = Rifle, `4` = Shotgun, `5` = Grenade, `6` = Barbed Wire Bat).

---

## 3. Turn Sequence (Exploration Loop)

Each night, you must light **8 Lamps** in the Dark Trench to survive until Dawn. Repeat the following steps until you light your 8th Lamp of the night (or die):

1. **Prepare (Optional):** Out of combat, you may use any number of single-use **Equipment** items from your pack or switch your **Equipped Weapon**.
2. **Explore:** Roll **1d20** on **Table I: Exploration & Encounters**.
   - **The Trench Twists Onward (No Consecutive Lamps):** If your *previous* encounter in this Night was lighting a **Dark Trench** lamp, you **cannot** roll Dark Trench (`3–8` or `20`) on this turn. Reroll the d20 until you get another result. *(This restriction resets at Dawn.)*
3. **Resolve the Encounter:**
   - **Chapel:**
     - *Nights 1–2:* Restore your Wounds to your **Max Wounds** (`15` on Night 1, `20` on Night 2).
     - *Night 3 (Desecrated Sanctuary):* Restore **1d3 Wounds** (cannot exceed Max Wounds).
   - **Dark Trench:** Light 1 lamp (`Lamps + 1`). Clear any temporary `+Hit` and `+Dmg` modifiers.
     - If you reach **8 Lamps**, the night ends immediately! Proceed to **Section 5: Dawn & Campaign Progression**.
   - **Booty / Chest:** Roll **1d20** on **Table II A (Night 1)** or **Table II B (Nights 2–3)** for the container type indicated, then add any found item to your inventory (no inventory size limit).
     - *Duplicate Weapons:* If you roll a **Rifle**, **Shotgun**, or **Barbed Wire Bat** you already own, refill it to Max Ammo/Uses instead. If you roll a **Grenade**, add `+1` Grenade. If you roll a **Knife** or **Sword** you already own, reroll `1d6` on Table V once (if still a duplicate, gain `+1 Bandage` instead).
     - *Unowned Ammo:* You may store **Shotgun Ammo** in your pack even if you don't own a Shotgun yet.
   - **Enemy:** Roll **1d20** on **Table III** for the current Night (`III A` Night 1, `III B` Night 2, `III C` Night 3), then enter **Combat (Section 4)**.
   - **Trap:** Roll **1d20** on **Table IV: Hazards & Traps** and apply damage immediately:
     - `Trap Damage = Base Trap Roll + Night Hazard Bonus - Trench Armor (1 if owned)` (minimum `1` damage).
     - *Night Hazard Bonus:* `+0` on Night 1, `+1` on Night 2, `+2` on Night 3.
     - If this reduces your Wounds to `0` or less, check **Last Stand** (if owned and unused this night, survive at `1` Wound; otherwise you die).

---

## 4. Combat Rules

Combat is fought in rounds. **You always act first.**

### Before You Act
- You may **switch your Equipped Weapon** for free before attacking.
- You may **use any number of Equipment items** (e.g., Bandage + Morphine) before attacking, or **Flee** instead of attacking.

### Hit Roll Matrix (Used by Both Player & Enemy)
Compare the **Attacker's Strength (S)** to the **Defender's Toughness (T)**:
- **S > T:** Hit on **3+** (`3, 4, 5, 6`)
- **S = T:** Hit on **4+** (`4, 5, 6`)
- **S < T:** Hit on **5+** (`5, 6`)

### Step A: Player Attack
1. If your equipped weapon uses **Ammo / Uses**, spend **1** (whether you hit or miss). You cannot attack with a `0` Ammo weapon.
   - *Depletion:* **Pistol** and **Shotgun** stay in your pack at `0` Ammo (and can be reloaded). **Rifle**, **Barbed Wire Bat**, and **Grenade** are discarded when they reach `0`.
2. Roll **1d6 + Permanent Hit Modifier + Temporary +Hit**.
3. If the total meets or beats the Hit Roll Matrix (`Weapon Strength` vs `Enemy Toughness`), you **Hit**!
   - **Damage:** Roll `Weapon Damage (from Table V) + Temporary +Dmg + Perk Bonuses` (e.g., `+2` from *Bayonet Vigor* on melee, `+2` from *Adrenaline Surge* on your first hit against an enemy at full Wounds).
   - Subtract Damage from the enemy's Wounds.
   - **If Enemy Wounds ≤ 0:** The enemy is defeated! Clear all temporary `+Hit` and `+Dmg` modifiers and end combat.
   - **If Enemy Wounds > 0:** Reduce your temporary `+Dmg` modifier by `1` (minimum `0`). The enemy now counterattacks.

### Step B: Enemy Counterattack
1. Roll **1d6** (unmodified) against the Hit Roll Matrix (`Enemy Strength` vs `Your Current Toughness`).
2. If the enemy hits, roll `Enemy Damage (from Table III)` and subtract it from your Wounds.
   - **Toughness Decay:** If your Current Toughness is higher than your Base Toughness (from Morphine or Hip Flask), reduce your Current Toughness by `1` each time an enemy hits you.
3. **If Your Wounds ≤ 0:**
   - If you have the **Last Stand** perk and haven't used it this night, you survive with **1 Wound** instead (mark *Last Stand* used for this night).
   - Otherwise, **you die**. Your campaign ends here.

### Step C: Fleeing
At the start of any combat round (before rolling your attack), you may **Flee**:
- Clear all temporary `+Hit` and `+Dmg` modifiers.
- **If Lamps Lit > 0:** Extinguish **1 Lamp** (`Lamps - 1`) and escape.
- **If Lamps Lit = 0:** Suffer **1d3 Wounds** as you scramble away in the dark (checks *Last Stand* if lethal), then escape.

---

## 5. Dawn & Campaign Progression

When you light your **8th Lamp** of a night:

- **End of Night 1 (Dawn 1):**
  1. Increase **Base Toughness** by `+1` (`3 → 4`).
  2. Reset **Current Toughness** to your new Base Toughness, and reset **Temp +Hit** and **Temp +Dmg** to `0`.
  3. Increase **Max Wounds** from `15` to `20` and **heal to 20 Wounds**.
  4. Reset **Lamps Lit** to `0`, clear the **No Consecutive Lamps** check, and reset **Last Stand** (if owned).
  5. Choose **1 Dawn Perk** from **Table VII** (or roll **1d20** using the Table VII column, rerolling `17–20`).
  6. Advance to **Night 2** (uses Table II B loot, Table III B enemies, `+1` Trap damage).

- **End of Night 2 (Dawn 2):**
  1. **Heal to Max Wounds** (`20 Wounds`).
  2. Reset **Current Toughness** to your Base Toughness, and reset **Temp +Hit** and **Temp +Dmg** to `0`.
  3. Reset **Lamps Lit** to `0`, clear the **No Consecutive Lamps** check, and reset **Last Stand** (if owned).
  4. Choose **1 Dawn Perk** from **Table VII** (cannot pick a perk you already have).
  5. Advance to **Night 3** (uses Table II B loot, Table III C enemies, `+2` Trap damage, Chapel heals only `1d3`).

- **End of Night 3 (Victory):**
  - **Dawn Breaks: The War Is Over.** You have survived the Lite 3-Night Campaign!

---

## 6. Reference Tables

### Table I: Exploration & Encounters (`1d20`)
*(Reroll `3–8` and `20` if you just lit a Dark Trench lamp on the previous turn.)*

| d20 | Encounter | Resolution |
|---|---|---|
| **1–2** | **Chapel** | Nights 1–2: Full Heal. Night 3: Heal `1d3` Wounds. |
| **3–8** | **Dark Trench** | Light 1 Lamp (`Lamps + 1`). Clear temp `+Hit`/`+Dmg`. |
| **9–12** | **Booty / Chest** | Roll 1d20 on Table II: `1–10` = Medic Bag, `11–20` = Corpse. |
| **13–18** | **Enemy** | Roll 1d20 on Table III (A = Night 1, B = Night 2, C = Night 3). |
| **19** | **Trap** | Roll 1d20 on Table IV (+0 Night 1, +1 Night 2, +2 Night 3). |
| **20** | **Dark Trench** | Light 1 Lamp (`Lamps + 1`). Clear temp `+Hit`/`+Dmg`. |

---

### Table II: Booty & Chests (`1d20`)
*On a roll of **`1`** on ANY chest, it is **Booby-Trapped**! Take `1d3` Wounds (`+1` on Nights 2–3, `-1` if you have Trench Armor, min `1`; checks Last Stand if lethal) and gain **no loot**.*

#### Table II A: Night 1 Loot
| d20 | Medic Bag (`1–10` on Chest roll) | Corpse (`11–20` on Chest roll) |
|---|---|---|
| **1** | **Booby Trap!** (`1d3` dmg, no loot) | **Booby Trap!** (`1d3` dmg, no loot) |
| **2–8** | **Bandage** | **Random Weapon** (roll 1d6 on Table V) |
| **9–11** | **Bandage** | **Pistol Ammo** (+10 rounds, max 20) |
| **12–14** | **Bandage** | **Shotgun Ammo** (+5 shells, max 11) |
| **15–16** | **Morphine** | **Cigarettes** |
| **17–19** | **Morphine** | **Hip Flask** |
| **20** | *Empty* (nothing inside) | **Hip Flask** |

#### Table II B: Nights 2–3 Loot
| d20 | Medic Bag (`1–10` on Chest roll) | Corpse (`11–20` on Chest roll) |
|---|---|---|
| **1** | **Booby Trap!** (`1d3+1` dmg, no loot) | **Booby Trap!** (`1d3+1` dmg, no loot) |
| **2–7** | **Bandage** | **Random Weapon** (roll 1d6 on Table V) |
| **8** | **Bandage** | **Pistol Ammo** (+10 rounds, max 20) |
| **9–10** | **Morphine** | **Pistol Ammo** (+10 rounds, max 20) |
| **11–12** | **Morphine** | **Shotgun Ammo** (+5 shells, max 11) |
| **13** | **Morphine** | **Hip Flask** |
| **14** | **First Aid Kit** | **Hip Flask** |
| **15–17** | **First Aid Kit** | **Adrenaline Shot** |
| **18–20** | **Adrenaline Shot** | **First Aid Kit** |

---

### Table III: Enemies (`1d20`)

#### Table III A: Night 1 (Outer Trenches)
| d20 | Enemy | Str | Tgh | HP | Damage |
|---|---|---|---|---|---|
| **1–14** | **Zombie Soldier** | 3 | 3 | 5 | `1d3` |
| **15** | **Swarm of Rats** | 2 | 2 | 4 | `1d3` |
| **16** | **Rabid Dog** | 3 | 2 | 4 | `1d3` |
| **17–19** | **Possessed Soldier** | 5 | 5 | 7 | `1d3 + 2` |
| **20** | **Trench Tyrant** | 4 | 5 | 10 | `1d6 + 1` |

#### Table III B: Night 2 (No Man's Land)
| d20 | Enemy | Str | Tgh | HP | Damage |
|---|---|---|---|---|---|
| **1–14** | **Gas Ghoul** | 4 | 4 | 6 | `1d3 + 1` |
| **15** | **War Hound** | 4 | 3 | 5 | `1d3 + 1` |
| **16** | **Corrupted Stormtrooper** | 4 | 4 | 7 | `1d6` |
| **17–19** | **Possessed Officer** | 5 | 5 | 8 | `1d6 + 1` |
| **20** | **Golgotha Behemoth** | 6 | 6 | 13 | `1d6 + 2` |

#### Table III C: Night 3 (The Desecrated Heart)
| d20 | Enemy | Str | Tgh | HP | Damage |
|---|---|---|---|---|---|
| **1–14** | **Ironclad Abomination** | 5 | 5 | 7 | `1d3 + 2` |
| **15** | **Dreadstalker Hound** | 5 | 4 | 6 | `1d3 + 2` |
| **16** | **Flamethrower Fiend** | 5 | 5 | 8 | `1d6 + 1` |
| **17–19** | **Trench Archon** | 6 | 6 | 11 | `1d6 + 2` |
| **20** | **The Trench Sovereign** | 7 | 7 | 15 | `1d6 + 3` |

---

### Table IV: Hazards & Traps (`1d20`)
*Add `+0` (Night 1), `+1` (Night 2), or `+2` (Night 3) to damage. Subtract `1` if you have **Trench Armor** (minimum `1` damage).*

| d20 | Trap | Base Damage |
|---|---|---|
| **1–10** | **Barbed Wire** | `1d2` |
| **11–15** | **Collapsed Wall** | `1d2` |
| **16–18** | **Gas Cloud** | `1d3` |
| **19–20** | **Unexploded Bomb** | `1d6` |

---

### Table V: Weapons (`1d6` for Secondary / Looted)
| 1d6 | Weapon | Type | Str | Damage | Ammo / Uses | Notes |
|---|---|---|---|---|---|---|
| *Base* | **Bloodied Fists** | Melee | 2 | `1d3` | Infinite | Always available fallback |
| *Start* | **Pistol** | Gun | 3 | `1d6` | 20 (Max 20) | Kept at 0 ammo; reloadable |
| **1** | **Knife** | Melee | 3 | `1d3` | Infinite | — |
| **2** | **Sword** | Melee | 3 | `1d3 + 2` | Infinite | — |
| **3** | **Rifle** | Gun | 4 | `1d6 + 2` | 15 | Discarded at 0 ammo |
| **4** | **Shotgun** | Gun | 4 | `1d6 + 3` | 11 (Max 11) | Kept at 0 ammo; reloadable |
| **5** | **Grenade** | Explosive | 5 | `1d6 + 4` | 1 use | Discarded after 1 use |
| **6** | **Barbed Wire Bat** | Melee | 4 | `1d6 + 2` | 6 uses | Discarded after 6 uses |

---

### Table VI: Equipment (Single-Use Consumables)
| Item | Effect | Notes |
|---|---|---|
| **Bandage** | Heal `3` Wounds (`+3` with *Combat Medic*) | Capped at Max Wounds |
| **First Aid Kit** | Heal `6` Wounds (`+3` with *Combat Medic*) | Capped at Max Wounds |
| **Morphine** | `+2` Current Toughness (up to `Base Tgh + 2`) | Cannot use if Current Tgh ≥ `Base Tgh + 2`. Decays `1` per enemy hit. |
| **Hip Flask** | `+1` Current Toughness (up to `Base Tgh + 1`) & `+2` Temp Damage | Still grants `+2` Temp Damage even if Current Tgh ≥ `Base Tgh + 1`. |
| **Cigarettes** | `+1` Temp Hit | Cleared when combat ends, fleeing, or lighting a lamp |
| **Adrenaline Shot** | `+2` Temp Hit & `+2` Temp Damage | Cleared when combat ends, fleeing, or lighting a lamp |
| **Pistol Ammo** | `+10` Pistol Ammo (Max `20`) | Requires Pistol |
| **Shotgun Ammo** | `+5` Shotgun Ammo (Max `11`) | Requires Shotgun (can be held in pack until found) |

---

### Table VII: Dawn Perks (Choose 1 or Roll `1d20`, Reroll `17–20`)
| 1d20 | Code | Perk | Effect |
|---|---|---|---|
| **1–2** | `[TGH]` | **Ironclad** | `+1` Base Toughness permanently (applied immediately). |
| **3–4** | `[HIT]` | **Sharpshooter** | `+1` Permanent Hit Modifier on all attacks. |
| **5–6** | `[MED]` | **Combat Medic** | Bandages & First Aid Kits restore `+3` extra Wounds. |
| **7–8** | `[VIG]` | **Bayonet Vigor** | `+2` Damage with all Melee weapons (`Bloodied Fists`, `Knife`, `Sword`, `Barbed Wire Bat`). |
| **9–10** | `[AMM]` | **Munitions Crate** | Gain `+15` Pistol Ammo immediately (capped at Max `20`), and reload Pistol to at least `15` at each Dawn. |
| **11–12** | `[ARM]` | **Trench Armor** | `-1` Damage from all Traps & Booby-Trapped Chests (minimum `1`). |
| **13–14** | `[SUR]` | **Adrenaline Surge** | `+2` Damage on your first hit against any enemy at full Wounds. |
| **15–16** | `[LST]` | **Last Stand** | Once per night, any lethal damage leaves you at `1` Wound instead. |

---

## 7. Quick Combat Cheat Sheet

- **To Hit:** `1d6 + Hit Mod` vs:
  - `3+` if Your Weapon Str > Enemy Tgh
  - `4+` if Your Weapon Str = Enemy Tgh
  - `5+` if Your Weapon Str < Enemy Tgh
- **Enemy To Hit:** `1d6` vs `3+` (E.Str > Your Tgh) / `4+` (Equal) / `5+` (E.Str < Your Tgh)
- **Order:** **You** → (if alive) **Enemy**.
- **After Combat:** Clear Temp `+Hit` and Temp `+Dmg`. (Temp `+Tgh` only drops when hit, or at Dawn.)

---

## 8. Printable Trench Log (Scorecard)

```text
======================================================================
                    THE TRENCH — LITE EDITION LOG
======================================================================
NIGHT:  [ 1 ]  [ 2 ]  [ 3 ]
LAMPS:  [ ][ ][ ][ ][ ][ ][ ][ ]   (8 Lamps = Dawn!)
[ ] Last turn was Dark Trench (if checked, reroll 3-8 & 20 on Table I)

WOUNDS:  _____ / [15 (N1) | 20 (N2-3)]
  (Tick track: 1 2 3 4 5 | 6 7 8 9 10 | 11 12 13 14 15 | 16 17 18 19 20)

BASE TOUGHNESS: ____ (+1 at Dawn 1)   CURRENT TOUGHNESS: ____
PERM HIT MOD:   ____                  TEMP HIT: ____   TEMP DMG: ____

DAWN PERKS (1 at Dawn 1, 1 at Dawn 2):
  Dawn 1: ________________________    Dawn 2: ________________________
  Last Stand Used This Night? [ ]

WEAPONS & AMMO / USES:
  * Bloodied Fists (Melee, Str 2, 1d3, Infinite)
  * Pistol         (Gun,   Str 3, 1d6, Max 20): ____________________
  * Secondary: ___________________ (Str __, Dmg ____, Ammo/Uses: _____)
  * Looted 1:  ___________________ (Str __, Dmg ____, Ammo/Uses: _____)
  * Looted 2:  ___________________ (Str __, Dmg ____, Ammo/Uses: _____)
  * Looted 3:  ___________________ (Str __, Dmg ____, Ammo/Uses: _____)

EQUIPMENT PACK (Cross off when used; unlimited capacity):
  [ ] Bandage       [ ] ____________   [ ] ____________   [ ] ____________
  [ ] ____________  [ ] ____________   [ ] ____________   [ ] ____________
  [ ] ____________  [ ] ____________
======================================================================
```
