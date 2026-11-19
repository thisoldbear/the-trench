import { LAMP_TARGET } from "@/context/GameContext";
import { enemies, enemiesNight2, enemiesNight3 } from "@/datasheets/enemies";
import { traps } from "@/datasheets/traps";
import { weapons, bloodiedFists } from "@/datasheets/weapons";
import { equipment } from "@/datasheets/equipment";
import { perks } from "@/datasheets/perks";

export const PrintVersion = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="print-page">
      {/* Interactive Toolbar (hidden when physically printing) */}
      <div className="print-page__toolbar no-print">
        <button
          className="btn btn--cta unifrakturcook-bold"
          onClick={onBack}
        >
          ← Back to Game
        </button>
        <button
          className="btn btn--cta btn--print unifrakturcook-bold"
          onClick={() => window.print()}
        >
          Print Page
        </button>
      </div>

      {/* Document Header */}
      <header className="print-header">
        <h1 className="unifrakturcook-bold print-title">The Trench</h1>
        <p className="print-subtitle unifrakturcook-bold">
          Tabletop Edition & Physical Play Manual
        </p>
        <p className="print-tagline">
          After the horrors of the day, darkness falls once more upon The
          Trench. To ward off the terror, prayers are made and lamps are lit.
          Light <strong>{LAMP_TARGET} lamps</strong> to see out the night and survive.
        </p>
      </header>

      {/* Required Supplies */}
      <section className="print-section">
        <h2 className="unifrakturcook-bold section-title">What You Need</h2>
        <ul className="print-list">
          <li>
            <strong>1x d20 (twenty-sided die):</strong> Used for all exploration,
            encounter, and booty tables.
          </li>
          <li>
            <strong>1x d6 (six-sided die):</strong> Used for combat hit rolls,
            weapon charts, and damage.
            <br />
            <em>Note:</em> For <strong>d3 damage</strong>, roll 1d6 and halve
            rounded up (1–2 = 1, 3–4 = 2, 5–6 = 3). For <strong>d2 traps</strong>,
            roll 1d6 (1–3 = 1, 4–6 = 2).
          </li>
          <li>
            <strong>Pencil &amp; Eraser:</strong> To track wounds, ammo, and lamps
            on the score sheet below.
          </li>
        </ul>
      </section>

      {/* Rules of Play */}
      <section className="print-section">
        <h2 className="unifrakturcook-bold section-title">How To Play</h2>

        <h3 className="sub-title">1. Starting Loadout</h3>
        <p>
          You begin with <strong>15 Wounds</strong> (Health), a base{" "}
          <strong>Toughness of 3</strong>, and the following supplies:
        </p>
        <ul className="print-list">
          <li>
            <strong>Bloodied Fists:</strong> Strength 2, Damage 1d3, Infinite
            Ammo (Innate base weapon; always equipped when out of ammo).
          </li>
          <li>
            <strong>Pistol:</strong> Strength 3, Damage 1d6+0, 20 Rounds of
            Ammo (Standard Issue).
          </li>
          <li>
            <strong>Random Secondary Weapon:</strong> Roll 1d6 on Table V
            (Weapons 1–6) to determine your second starting weapon.
          </li>
          <li>
            <strong>Starting Equipment:</strong> 1x <strong>Bandage</strong>{" "}
            (Restores 3 health [1 use]).
          </li>
          <li>
            <strong>Inventory:</strong> You can carry all weapons and equipment
            recovered from chests and corpses without an inventory cap.
          </li>
        </ul>

        <h3 className="sub-title">2. Turn Sequence (Exploration)</h3>
        <p>
          Each turn, roll <strong>1d20</strong> on the{" "}
          <strong>Exploration & Encounter Table</strong>:
        </p>
        <ul className="print-list">
          <li>
            <strong>Chapel (1–2):</strong> Rest a while and pray. Immediately
            restore your Wounds to their maximum (15 in Night 1, 20 in Nights 2–4).
            In Night 5, desecrated Chapels only restore <strong>1d3 health</strong>.
          </li>
          <li>
            <strong>Dark Trench (3–8, 20):</strong> A narrow passage stretched
            into the blackness. Light 1 lamp on your scorecard and clear any
            temporary combat modifiers. <em>The Trench Twists Onward:</em> You cannot encounter two Dark Trenches in a row—if you roll Dark Trench immediately after lighting a lamp, reroll on Table I until a non-lamp encounter is rolled. Once <strong>{LAMP_TARGET} lamps</strong> are
            lit, the night passes! You may end your run in victory or <strong>Fight on for another night</strong> (lighting {LAMP_TARGET} lamps each night) across a 5-Night campaign culminating at Night 5 (The End).
          </li>
          <li>
            <strong>Booty (9–12):</strong> You discover supplies! Roll 1d20 on
            the <em>Booty Table</em> to see whether you find a Medic Bag or
            Fallen Corpse, but beware of traps.
          </li>
          <li>
            <strong>Enemy (13–18):</strong> A horror lurks in the trench. Roll
            1d20 on the <em>Monsters Table</em> and resolve combat.
          </li>
          <li>
            <strong>Trap (19):</strong> A trench hazard triggers. Roll 1d20 on
            the <em>Traps Table</em> and deduct damage from your Wounds.
          </li>
        </ul>

        <h3 className="sub-title">3. Combat Rules</h3>
        <p>
          Combat consists of alternating combat rounds until either the enemy or
          the player is slain (reaches 0 Wounds).
        </p>
        <div className="hit-matrix-box">
          <strong>Hit Roll Matrix (Roll 1d6):</strong>
          <table className="print-table hit-matrix-table">
            <thead>
              <tr>
                <th>Attacker vs Defender</th>
                <th>Target Number to Hit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Attacker Strength &gt; Defender Toughness</td>
                <td>
                  <strong>3+</strong> (Roll 3, 4, 5, or 6)
                </td>
              </tr>
              <tr>
                <td>Attacker Strength == Defender Toughness</td>
                <td>
                  <strong>4+</strong> (Roll 4, 5, or 6)
                </td>
              </tr>
              <tr>
                <td>Attacker Strength &lt; Defender Toughness</td>
                <td>
                  <strong>5+</strong> (Roll 5 or 6)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          <strong>Step A (Player Strikes First):</strong>
        </p>
        <ul className="print-list">
          <li>
            Choose your equipped weapon (you may freely switch between any carried
            weapons with available ammo). If the weapon has limited ammo, deduct{" "}
            <strong>1 ammo</strong> whether you hit or miss.
          </li>
          <li>
            Roll 1d6 (+ any active Hit Modifier from Cigarettes). If the roll
            meets or beats the target number based on your weapon&apos;s Strength vs
            the enemy&apos;s Toughness, you score a hit!
          </li>
          <li>
            <strong>Damage:</strong> Roll weapon damage die (1d3 or 1d6) + weapon
            damage modifier + active player damage modifier. Subtract total damage
            from the enemy&apos;s Wounds.
          </li>
          <li>
            If you possessed a temporary damage bonus (from Hip Flask), decrement it
            by 1 after each successful hit. (Hit bonuses from Cigarettes stay active
            for the whole encounter).
          </li>
          <li>
            If the enemy reaches 0 Wounds, they are defeated immediately! Discard
            all remaining temporary damage and hit modifiers. The enemy does not
            counter-attack.
          </li>
        </ul>

        <p>
          <strong>Step B (Enemy Counter-Attacks, if alive):</strong>
        </p>
        <ul className="print-list">
          <li>
            The enemy rolls 1d6 against your current Toughness using the Hit Matrix.
          </li>
          <li>
            On a hit, roll the enemy&apos;s damage die (1d3 or 1d6) + enemy damage
            modifier and subtract from your Wounds.
          </li>
          <li>
            If your Toughness was temporarily boosted above 3 (e.g. via Morphine
            or Hip Flask), each successful enemy hit reduces your current Toughness
            by 1 until it returns to 3.
          </li>
          <li>
            If your Wounds reach 0, you die in the trench. Game over.
          </li>
        </ul>

        <p>
          <strong>Step C (Fleeing Combat):</strong>
        </p>
        <ul className="print-list">
          <li>
            At any time on your turn instead of fighting, you may choose to{" "}
            <strong>Flee</strong>:
          </li>
          <li>
            <strong>If you have 1 or more lamps lit:</strong> You escape into the
            trench, but <strong>1 lamp goes out</strong> (deduct 1 lamp from your
            scorecard).
          </li>
          <li>
            <strong>If you have 0 lamps lit:</strong> You stumble blind in the dark
            and suffer <strong>1d3 damage</strong> immediately.
          </li>
          <li>
            All temporary combat modifiers are lost when fleeing. You then proceed
            to your next exploration roll.
          </li>
        </ul>

        <h3 className="sub-title">4. Surviving The Night &amp; The 5-Night Campaign</h3>
        <p>
          Once you light <strong>{LAMP_TARGET} lamps</strong>, the night passes! You have survived the terrors of The Trench and may conclude your run in victory, or <strong>Fight on for another night</strong>. The complete campaign spans <strong>5 Nights</strong> culminating at Night 5 (<strong>The End</strong>).
        </p>
        <ul className="print-list">
          <li>
            <strong>13 Lamps Per Night:</strong> Check off the completed night on your <strong>Nights Counter</strong> and reset your lit lamps to <strong>0</strong>. Each night requires 13 lamps.
          </li>
          <li>
            <strong>Dawn Roguelike Perks:</strong> At each dawn (surviving Nights 1, 2, 3, and 4), choose or roll 1d8 on <strong>Table VII (Dawn Perks)</strong>. Record its 3-letter code on your scorecard. Each perk provides powerful permanent benefits.
          </li>
          <li>
            <strong>Veteran Resilience (Dawn 1):</strong> Upon entering Night 2, your base Toughness permanently increases from <strong>3 to 4</strong>, and your maximum health increases to <strong>20 Wounds</strong> (fully restored to 20 at each dawn).
          </li>
          <li>
            <strong>Escalating Perils:</strong>
            <br />
            • <em>Nights 2–3:</em> Hazards/traps deal <strong>+1 extra damage</strong>. Monsters use <strong>Table III B</strong>. Booty uses <strong>Table II B</strong>.
            <br />
            • <em>Nights 4–5:</em> Hazards/traps deal <strong>+2 extra damage</strong>. Monsters use <strong>Table III C (Apex Horrors)</strong>.
            <br />
            • <em>Night 5 (The End):</em> Chapels are desecrated and restore only <strong>1d3 health</strong>. Lighting the 13th lamp of Night 5 wins the war!
          </li>
        </ul>
      </section>

      {/* Tables Section */}
      <section className="print-section">
        <h2 className="unifrakturcook-bold section-title">Encounter & Game Tables</h2>

        {/* Exploration Table */}
        <h3 className="sub-title">Table I: Exploration & Encounters (1d20)</h3>
        <p style={{ margin: "4px 0 10px 0", fontSize: "13px" }}>
          <strong>The Trench Twists Onward:</strong> If you roll Dark Trench (3–8, 20) immediately after lighting a lamp, reroll on Table I until a non-lamp encounter is rolled. You cannot encounter two Dark Trenches in a row.
        </p>
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "15%" }}>1d20 Roll</th>
              <th style={{ width: "25%" }}>Encounter</th>
              <th>Outcome / Next Step</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 – 2</td>
              <td><strong>Chapel</strong></td>
              <td>Safe sanctuary. Restore to full health (15 in Night 1, 20 in Nights 2–4). In Night 5, restores 1d3 health.</td>
            </tr>
            <tr>
              <td>3 – 8</td>
              <td><strong>Dark Trench</strong></td>
              <td>Light a lamp! Check off 1 lamp on the scorecard. (Reroll if rolled immediately after lighting a lamp).</td>
            </tr>
            <tr>
              <td>9 – 12</td>
              <td><strong>Booty</strong></td>
              <td>Supplies discovered! Roll 1d20 on Table II A (Night 1) or Table II B (Night 2+).</td>
            </tr>
            <tr>
              <td>13 – 18</td>
              <td><strong>Enemy Encounter</strong></td>
              <td>Danger lurks. Roll 1d20 on Table III A (Night 1), Table III B (Nights 2–3), or Table III C (Nights 4–5).</td>
            </tr>
            <tr>
              <td>19</td>
              <td><strong>Trench Trap</strong></td>
              <td>A hazard strikes! Roll 1d20 on Table IV (+1 damage in Nights 2–3, +2 damage in Nights 4–5).</td>
            </tr>
            <tr>
              <td>20</td>
              <td><strong>Dark Trench</strong></td>
              <td>Light a lamp! Check off 1 lamp on the scorecard. (Reroll if rolled immediately after lighting a lamp).</td>
            </tr>
          </tbody>
        </table>

        {/* Booty Table Night 1 */}
        <h3 className="sub-title">Table II A: Booty & Loot — Night 1 (1d20)</h3>
        <p>
          When Booty is encountered, roll <strong>1d20</strong> to determine the
          container:
          <br />
          <strong>1 – 10: Medic Bag</strong> | <strong>11 – 20: Corpse</strong>
        </p>
        <p>
          <em>Booby-Trap Check:</em> Before searching, roll 1d20. On a roll of{" "}
          <strong>1</strong>, the cache is rigged with explosives! Suffer{" "}
          <strong>1d3 damage</strong> immediately (reduced by Trench Armor, minimum 1) and find nothing. Otherwise,
          check your roll result below:
        </p>
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "15%" }}>1d20 Roll</th>
              <th style={{ width: "42%" }}>Medic Bag (Roll 1–10 Container)</th>
              <th style={{ width: "43%" }}>Corpse (Roll 11–20 Container)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td colSpan={2} style={{ textAlign: "center" }}>
                <strong>BOOBY TRAP!</strong> Take 1d3 wounds immediately.
              </td>
            </tr>
            <tr>
              <td>2 – 8</td>
              <td>
                <strong>Bandage:</strong> Restores 3 health [1 use].
              </td>
              <td>
                <strong>Fallen Weapon:</strong> Roll 1d6 on Table V (Weapons
                1–6) to determine which weapon is recovered!
              </td>
            </tr>
            <tr>
              <td>9 – 11</td>
              <td>
                <strong>Bandage:</strong> Restores 3 health [1 use].
              </td>
              <td>
                <strong>Pistol Ammo:</strong> Replenishes up to 10 rounds for Pistol (max 20) [1 use].
              </td>
            </tr>
            <tr>
              <td>12 – 14</td>
              <td>
                <strong>Bandage:</strong> Restores 3 health [1 use].
              </td>
              <td>
                <strong>Shotgun Ammo:</strong> Replenishes up to 5 shells for Shotgun (max 11) [1 use].
              </td>
            </tr>
            <tr>
              <td>15 – 16</td>
              <td>
                <strong>Morphine:</strong> +2 Toughness; reduced on enemy hits [1
                use].
              </td>
              <td>
                <strong>Cigarettes:</strong> +1 to Hit rolls for a short while
                [1 use].
              </td>
            </tr>
            <tr>
              <td>17 – 19</td>
              <td>
                <strong>Morphine:</strong> +2 Toughness; reduced on enemy hits [1
                use].
              </td>
              <td>
                <strong>Hip Flask:</strong> +1 Toughness &amp; +2 Damage [1
                use].
              </td>
            </tr>
            <tr>
              <td>20</td>
              <td>
                <em>Empty bag:</em> The supplies were already looted.
              </td>
              <td>
                <strong>Hip Flask:</strong> +1 Toughness &amp; +2 Damage [1
                use].
              </td>
            </tr>
          </tbody>
        </table>

        {/* Booty Table Night 2+ */}
        <h3 className="sub-title">Table II B: Booty & Loot — Night 2+ (1d20)</h3>
        <p>
          In Night 2 onwards, fallen officers and advanced medical supplies can be recovered. Booby traps deal <strong>1d3+1 damage</strong> (reduced by Trench Armor, minimum 1):
        </p>
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "15%" }}>1d20 Roll</th>
              <th style={{ width: "42%" }}>Medic Bag (Roll 1–10 Container)</th>
              <th style={{ width: "43%" }}>Corpse (Roll 11–20 Container)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td colSpan={2} style={{ textAlign: "center" }}>
                <strong>BOOBY TRAP!</strong> Take 1d3+1 wounds immediately.
              </td>
            </tr>
            <tr>
              <td>2 – 7</td>
              <td>
                <strong>Bandage:</strong> Restores 3 health [1 use].
              </td>
              <td>
                <strong>Fallen Weapon:</strong> Roll 1d6 on Table V (Weapons 1–6).
              </td>
            </tr>
            <tr>
              <td>8</td>
              <td>
                <strong>Bandage:</strong> Restores 3 health [1 use].
              </td>
              <td>
                <strong>Pistol Ammo:</strong> Replenishes up to 10 rounds for Pistol (max 20) [1 use].
              </td>
            </tr>
            <tr>
              <td>9 – 10</td>
              <td>
                <strong>Morphine:</strong> +2 Toughness; reduced on enemy hits [1 use].
              </td>
              <td>
                <strong>Pistol Ammo:</strong> Replenishes up to 10 rounds for Pistol (max 20) [1 use].
              </td>
            </tr>
            <tr>
              <td>11 – 12</td>
              <td>
                <strong>Morphine:</strong> +2 Toughness; reduced on enemy hits [1 use].
              </td>
              <td>
                <strong>Shotgun Ammo:</strong> Replenishes up to 5 shells for Shotgun (max 11) [1 use].
              </td>
            </tr>
            <tr>
              <td>13</td>
              <td>
                <strong>Morphine:</strong> +2 Toughness; reduced on enemy hits [1 use].
              </td>
              <td>
                <strong>Hip Flask:</strong> +1 Toughness &amp; +2 Damage [1 use].
              </td>
            </tr>
            <tr>
              <td>14</td>
              <td>
                <strong>First Aid Kit:</strong> Restores 6 health [1 use].
              </td>
              <td>
                <strong>Hip Flask:</strong> +1 Toughness &amp; +2 Damage [1 use].
              </td>
            </tr>
            <tr>
              <td>15 – 17</td>
              <td>
                <strong>First Aid Kit:</strong> Restores 6 health [1 use].
              </td>
              <td>
                <strong>Adrenaline Shot:</strong> +2 to Hit &amp; +2 Damage [1 use].
              </td>
            </tr>
            <tr>
              <td>18 – 20</td>
              <td>
                <strong>Adrenaline Shot:</strong> +2 to Hit &amp; +2 Damage [1 use].
              </td>
              <td>
                <strong>First Aid Kit:</strong> Restores 6 health [1 use].
              </td>
            </tr>
          </tbody>
        </table>

        {/* Monster Table */}
        <h3 className="sub-title">Table III A: Monsters &amp; Enemies — Night 1 (1d20)</h3>
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "12%" }}>1d20 Roll</th>
              <th style={{ width: "24%" }}>Monster Name</th>
              <th style={{ width: "10%" }}>Str</th>
              <th style={{ width: "10%" }}>Tgh</th>
              <th style={{ width: "12%" }}>Wounds</th>
              <th style={{ width: "14%" }}>Damage</th>
              <th>Combat Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 – 14</td>
              <td><strong>{enemies[0].name}</strong></td>
              <td>{enemies[0].strength}</td>
              <td>{enemies[0].toughness}</td>
              <td>{enemies[0].wounds}</td>
              <td>1d{enemies[0].damage}</td>
              <td>Rotting reanimated soldier. Common trench fodder.</td>
            </tr>
            <tr>
              <td>15</td>
              <td><strong>{enemies[1].name}</strong></td>
              <td>{enemies[1].strength}</td>
              <td>{enemies[1].toughness}</td>
              <td>{enemies[1].wounds}</td>
              <td>1d{enemies[1].damage}</td>
              <td>Starving trench vermin. Quick and skittering.</td>
            </tr>
            <tr>
              <td>16</td>
              <td><strong>{enemies[2].name}</strong></td>
              <td>{enemies[2].strength}</td>
              <td>{enemies[2].toughness}</td>
              <td>{enemies[2].wounds}</td>
              <td>1d{enemies[2].damage}</td>
              <td>Aggressive carrier hound roaming no man&apos;s land.</td>
            </tr>
            <tr>
              <td>17 – 19</td>
              <td><strong>{enemies[3].name}</strong></td>
              <td>{enemies[3].strength}</td>
              <td>{enemies[3].toughness}</td>
              <td>{enemies[3].wounds}</td>
              <td>1d{enemies[3].damage}+{enemies[3].damageModifier}</td>
              <td>Demonic possession. Highly dangerous melee brute.</td>
            </tr>
            <tr>
              <td>20</td>
              <td><strong>{enemies[4].name}</strong></td>
              <td>{enemies[4].strength}</td>
              <td>{enemies[4].toughness}</td>
              <td>{enemies[4].wounds}</td>
              <td>1d{enemies[4].damage}+{enemies[4].damageModifier}</td>
              <td>Trench Tyrant. Armored colossus of dread and death.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="sub-title">Table III B: Monsters &amp; Enemies — Nights 2–3 (1d20)</h3>
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "12%" }}>1d20 Roll</th>
              <th style={{ width: "24%" }}>Monster Name</th>
              <th style={{ width: "10%" }}>Str</th>
              <th style={{ width: "10%" }}>Tgh</th>
              <th style={{ width: "12%" }}>Wounds</th>
              <th style={{ width: "14%" }}>Damage</th>
              <th>Combat Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 – 14</td>
              <td><strong>{enemiesNight2[0].name}</strong></td>
              <td>{enemiesNight2[0].strength}</td>
              <td>{enemiesNight2[0].toughness}</td>
              <td>{enemiesNight2[0].wounds}</td>
              <td>1d{enemiesNight2[0].damage}+{enemiesNight2[0].damageModifier}</td>
              <td>{enemiesNight2[0].notes}</td>
            </tr>
            <tr>
              <td>15</td>
              <td><strong>{enemiesNight2[1].name}</strong></td>
              <td>{enemiesNight2[1].strength}</td>
              <td>{enemiesNight2[1].toughness}</td>
              <td>{enemiesNight2[1].wounds}</td>
              <td>1d{enemiesNight2[1].damage}+{enemiesNight2[1].damageModifier}</td>
              <td>{enemiesNight2[1].notes}</td>
            </tr>
            <tr>
              <td>16</td>
              <td><strong>{enemiesNight2[2].name}</strong></td>
              <td>{enemiesNight2[2].strength}</td>
              <td>{enemiesNight2[2].toughness}</td>
              <td>{enemiesNight2[2].wounds}</td>
              <td>1d{enemiesNight2[2].damage}</td>
              <td>{enemiesNight2[2].notes}</td>
            </tr>
            <tr>
              <td>17 – 19</td>
              <td><strong>{enemiesNight2[3].name}</strong></td>
              <td>{enemiesNight2[3].strength}</td>
              <td>{enemiesNight2[3].toughness}</td>
              <td>{enemiesNight2[3].wounds}</td>
              <td>1d{enemiesNight2[3].damage}+{enemiesNight2[3].damageModifier}</td>
              <td>{enemiesNight2[3].notes}</td>
            </tr>
            <tr>
              <td>20</td>
              <td><strong>{enemiesNight2[4].name}</strong></td>
              <td>{enemiesNight2[4].strength}</td>
              <td>{enemiesNight2[4].toughness}</td>
              <td>{enemiesNight2[4].wounds}</td>
              <td>1d{enemiesNight2[4].damage}+{enemiesNight2[4].damageModifier}</td>
              <td>{enemiesNight2[4].notes}</td>
            </tr>
          </tbody>
        </table>

        {/* Monster Table Nights 4-5 */}
        <h3 className="sub-title">Table III C: Monsters &amp; Enemies — Nights 4–5 (1d20)</h3>
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "12%" }}>1d20 Roll</th>
              <th style={{ width: "24%" }}>Monster Name</th>
              <th style={{ width: "10%" }}>Str</th>
              <th style={{ width: "10%" }}>Tgh</th>
              <th style={{ width: "12%" }}>Wounds</th>
              <th style={{ width: "14%" }}>Damage</th>
              <th>Combat Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 – 14</td>
              <td><strong>{enemiesNight3[0].name}</strong></td>
              <td>{enemiesNight3[0].strength}</td>
              <td>{enemiesNight3[0].toughness}</td>
              <td>{enemiesNight3[0].wounds}</td>
              <td>1d{enemiesNight3[0].damage}+{enemiesNight3[0].damageModifier}</td>
              <td>{enemiesNight3[0].notes}</td>
            </tr>
            <tr>
              <td>15</td>
              <td><strong>{enemiesNight3[1].name}</strong></td>
              <td>{enemiesNight3[1].strength}</td>
              <td>{enemiesNight3[1].toughness}</td>
              <td>{enemiesNight3[1].wounds}</td>
              <td>1d{enemiesNight3[1].damage}+{enemiesNight3[1].damageModifier}</td>
              <td>{enemiesNight3[1].notes}</td>
            </tr>
            <tr>
              <td>16</td>
              <td><strong>{enemiesNight3[2].name}</strong></td>
              <td>{enemiesNight3[2].strength}</td>
              <td>{enemiesNight3[2].toughness}</td>
              <td>{enemiesNight3[2].wounds}</td>
              <td>1d{enemiesNight3[2].damage}+{enemiesNight3[2].damageModifier}</td>
              <td>{enemiesNight3[2].notes}</td>
            </tr>
            <tr>
              <td>17 – 19</td>
              <td><strong>{enemiesNight3[3].name}</strong></td>
              <td>{enemiesNight3[3].strength}</td>
              <td>{enemiesNight3[3].toughness}</td>
              <td>{enemiesNight3[3].wounds}</td>
              <td>1d{enemiesNight3[3].damage}+{enemiesNight3[3].damageModifier}</td>
              <td>{enemiesNight3[3].notes}</td>
            </tr>
            <tr>
              <td>20</td>
              <td><strong>{enemiesNight3[4].name}</strong></td>
              <td>{enemiesNight3[4].strength}</td>
              <td>{enemiesNight3[4].toughness}</td>
              <td>{enemiesNight3[4].wounds}</td>
              <td>1d{enemiesNight3[4].damage}+{enemiesNight3[4].damageModifier}</td>
              <td>{enemiesNight3[4].notes}</td>
            </tr>
          </tbody>
        </table>

        {/* Traps Table */}
        <h3 className="sub-title">Table IV: Hazards &amp; Traps (1d20)</h3>
        <p>
          <em>Escalating Hazards:</em> In Nights 2–3, trench hazards inflict <strong>+1 extra damage</strong> (Barbed Wire &amp; Collapsed Wall: 1d2+1, Gas Cloud: 1d3+1, Unexploded Bomb: 1d6+1). In Nights 4–5, hazards inflict <strong>+2 extra damage</strong> (Barbed Wire &amp; Collapsed Wall: 1d2+2, Gas Cloud: 1d3+2, Unexploded Bomb: 1d6+2).
        </p>
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "15%" }}>1d20 Roll</th>
              <th style={{ width: "25%" }}>Hazard</th>
              <th style={{ width: "15%" }}>Damage</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 – 10</td>
              <td><strong>{traps[0].name}</strong></td>
              <td>1d{traps[0].damage}</td>
              <td>{traps[0].description}</td>
            </tr>
            <tr>
              <td>11 – 15</td>
              <td><strong>{traps[1].name}</strong></td>
              <td>1d{traps[1].damage}</td>
              <td>{traps[1].description}</td>
            </tr>
            <tr>
              <td>16 – 18</td>
              <td><strong>{traps[2].name}</strong></td>
              <td>1d{traps[2].damage}</td>
              <td>{traps[2].description}</td>
            </tr>
            <tr>
              <td>19 – 20</td>
              <td><strong>{traps[3].name}</strong></td>
              <td>1d{traps[3].damage}</td>
              <td>{traps[3].description}</td>
            </tr>
          </tbody>
        </table>

        {/* Weapons Reference Table */}
        <h3 className="sub-title">Table V: Weapons Reference</h3>
        <p style={{ margin: "4px 0 10px 0", fontSize: "13px" }}>
          Bloodied Fists is your innate base weapon (always equipped when out of ammo).
          Pistol is standard starting issue. Roll <strong>1d6</strong> on numbers 1–6
          for starting secondary weapon and corpse weapon loot.
        </p>
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>1d6 / #</th>
              <th>Weapon</th>
              <th>Type</th>
              <th>Str</th>
              <th>Damage</th>
              <th>Ammo</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><em>Base</em></td>
              <td><strong>{bloodiedFists.name}</strong></td>
              <td>{bloodiedFists._type}</td>
              <td>{bloodiedFists.strength}</td>
              <td>1d{bloodiedFists.damage}</td>
              <td>Infinite</td>
              <td>{bloodiedFists.description}</td>
            </tr>
            {weapons.map((w, idx) => (
              <tr key={w.name}>
                <td>{idx === 0 ? <em>Start</em> : <strong>{idx}</strong>}</td>
                <td><strong>{w.name}</strong></td>
                <td>{w._type}</td>
                <td>{w.strength}</td>
                <td>
                  1d{w.damage}
                  {w.damageModifier ? `+${w.damageModifier}` : ""}
                </td>
                <td>{w.limited ? `${w.ammo} rds` : "Infinite"}</td>
                <td>{w.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Equipment Reference Table */}
        <h3 className="sub-title">Table VI: Equipment Reference</h3>
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "25%" }}>Item</th>
              <th style={{ width: "15%" }}>Uses</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((eq) => (
              <tr key={eq.id}>
                <td><strong>{eq.name}</strong></td>
                <td>1 Use</td>
                <td>{eq.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Roguelike Perks Reference Table */}
        <h3 className="sub-title">Table VII: Dawn Roguelike Perks (1d8 or Choice)</h3>
        <p style={{ margin: "4px 0 10px 0", fontSize: "13px" }}>
          At each Dawn (after surviving Nights 1, 2, 3, and 4), choose or roll <strong>1d8</strong> for a permanent perk and write its 3-letter code on your scorecard.
        </p>
        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: "8%" }}>1d8</th>
              <th style={{ width: "12%" }}>Code</th>
              <th style={{ width: "22%" }}>Perk Name</th>
              <th>Effect &amp; Rules</th>
            </tr>
          </thead>
          <tbody>
            {perks.map((p, idx) => (
              <tr key={p.id}>
                <td><strong>{idx + 1}</strong></td>
                <td><strong style={{ letterSpacing: "1px" }}>[{p.code}]</strong></td>
                <td><strong>{p.name}</strong></td>
                <td>{p.description} <em>({p.flavor})</em></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Printable Scorecard / Character Sheet */}
      <section className="print-section scorecard-section">
        <h2 className="unifrakturcook-bold section-title scorecard-title">
          Trench Log &amp; Scorecard
        </h2>
        <p style={{ margin: "4px 0 12px 0", fontSize: "13px" }}>
          Tear or print this section to record your physical solo playthrough.
        </p>

        {/* Nights & Lamps Tracker */}
        <div className="tracker-block">
          <div className="tracker-block__label">
            <strong>Nights Counter:</strong>
          </div>
          <div className="lamp-boxes" style={{ marginBottom: "10px" }}>
            {[
              { num: 1, label: "Night 1" },
              { num: 2, label: "Night 2" },
              { num: 3, label: "Night 3" },
              { num: 4, label: "Night 4" },
              { num: 5, label: "Night 5 (THE END)" },
            ].map((n) => (
              <div key={n.num} className="lamp-box">
                <span className="lamp-box__num">{n.label}</span>
                <span className="box-square" />
              </div>
            ))}
          </div>
          <div className="tracker-block__label">
            <strong>Dawn Perks Ledger (Record 3-letter code from Table VII):</strong>
          </div>
          <div className="perk-boxes" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
            <div style={{ flex: "1 1 180px", border: "1px dashed #444", padding: "4px 8px", fontSize: "12px" }}>
              <strong>Dawn 1:</strong> [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] ____________
            </div>
            <div style={{ flex: "1 1 180px", border: "1px dashed #444", padding: "4px 8px", fontSize: "12px" }}>
              <strong>Dawn 2:</strong> [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] ____________
            </div>
            <div style={{ flex: "1 1 180px", border: "1px dashed #444", padding: "4px 8px", fontSize: "12px" }}>
              <strong>Dawn 3:</strong> [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] ____________
            </div>
            <div style={{ flex: "1 1 180px", border: "1px dashed #444", padding: "4px 8px", fontSize: "12px" }}>
              <strong>Dawn 4:</strong> [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] ____________
            </div>
          </div>
          <div className="tracker-block__label">
            <strong>Lamps Lit ({LAMP_TARGET} lamps per night):</strong>
          </div>
          <div className="lamp-boxes">
            {Array.from({ length: LAMP_TARGET }, (_, i) => i + 1).map((lamp) => (
              <div key={lamp} className="lamp-box">
                <span className="lamp-box__num">Lamp {lamp}</span>
                <span className="box-square" />
              </div>
            ))}
          </div>
        </div>

        {/* Wounds Tracker */}
        <div className="tracker-block">
          <div className="tracker-block__label">
            <strong>Wounds / Health (Start: 15 | Night 2+: 20 | Dead at 0):</strong>
          </div>
          <div className="wound-boxes">
            {Array.from({ length: 20 }, (_, i) => 20 - i).map((num) => (
              <div key={num} className="wound-cell">
                <span className="wound-cell__num">{num}</span>
                <span className="box-square" />
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="tracker-grid">
          <div className="tracker-grid__cell">
            <strong>Toughness</strong>
            <p style={{ fontSize: "12px", margin: "4px 0" }}>Base: 3 (Night 2+: 4)</p>
            <div className="stat-fill-box">Current: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</div>
          </div>
          <div className="tracker-grid__cell">
            <strong>Hit Modifier</strong>
            <p style={{ fontSize: "12px", margin: "4px 0" }}>Cigarettes / Adrenaline</p>
            <div className="stat-fill-box">[ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</div>
          </div>
          <div className="tracker-grid__cell">
            <strong>Damage Modifier</strong>
            <p style={{ fontSize: "12px", margin: "4px 0" }}>Hip Flask / Adrenaline</p>
            <div className="stat-fill-box">[ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</div>
          </div>
          <div className="tracker-grid__cell">
            <strong>Run Seed / Date</strong>
            <p style={{ fontSize: "12px", margin: "4px 0" }}>Optional</p>
            <div className="stat-fill-box">Seed: ____________</div>
          </div>
        </div>

        {/* Weapon Ammo Trackers */}
        <div className="tracker-block">
          <div className="tracker-block__label">
            <strong>Weapons &amp; Ammunition:</strong>
          </div>
          <div className="ammo-row">
            <span className="ammo-name">
              <strong>Pistol (20 Ammo):</strong>
            </span>
            <div className="ammo-boxes">
              {Array.from({ length: 20 }, (_, i) => (
                <span key={i} className="box-square" title={`Round ${i + 1}`} />
              ))}
            </div>
          </div>
          <div className="ammo-row">
            <span className="ammo-name">
              <strong>Secondary Weapon:</strong> __________________
            </span>
            <div className="ammo-boxes">
              {Array.from({ length: 15 }, (_, i) => (
                <span key={i} className="box-square" />
              ))}
            </div>
          </div>
          <div className="ammo-row">
            <span className="ammo-name">
              <strong>Looted Weapon 1:</strong> ___________________
            </span>
            <div className="ammo-boxes">
              {Array.from({ length: 15 }, (_, i) => (
                <span key={i} className="box-square" />
              ))}
            </div>
          </div>
          <div className="ammo-row">
            <span className="ammo-name">
              <strong>Looted Weapon 2:</strong> ___________________
            </span>
            <div className="ammo-boxes">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className="box-square" />
              ))}
            </div>
          </div>
        </div>

        {/* Equipment & Supplies */}
        <div className="tracker-block">
          <div className="tracker-block__label">
            <strong>Carried Equipment &amp; Supplies:</strong>
          </div>
          <div className="equipment-slots">
            <div className="equipment-slot">
              [Starting] <strong>Bandage:</strong> Restores 3 health &nbsp; [ &nbsp; ] Used
            </div>
            <div className="equipment-slot">
              Item 2: _________________________________________________ [ &nbsp; ] Used
            </div>
            <div className="equipment-slot">
              Item 3: _________________________________________________ [ &nbsp; ] Used
            </div>
            <div className="equipment-slot">
              Item 4: _________________________________________________ [ &nbsp; ] Used
            </div>
          </div>
        </div>

        {/* Log / Notes */}
        <div className="tracker-block">
          <div className="tracker-block__label">
            <strong>Trench Campaign Notes:</strong>
          </div>
          <div className="notes-box">
            <div className="notes-line" />
            <div className="notes-line" />
            <div className="notes-line" />
          </div>
        </div>
      </section>

      {/* Bottom Back Button (hidden when printed) */}
      <div className="print-page__footer no-print">
        <button
          className="btn btn--cta unifrakturcook-bold"
          onClick={onBack}
        >
          ← Return to Game
        </button>
      </div>
    </div>
  );
};
