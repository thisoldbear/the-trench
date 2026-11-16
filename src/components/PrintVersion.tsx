import { LAMP_TARGET } from "@/context/GameContext";
import { enemies } from "@/datasheets/enemies";
import { traps } from "@/datasheets/traps";
import { weapons } from "@/datasheets/weapons";
import { equipment } from "@/datasheets/equipment";

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
            <strong>Pistol:</strong> Strength 3, Damage 1d6+0, 15 Rounds of
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
            restore your Wounds to their maximum (15).
          </li>
          <li>
            <strong>Dark Trench (3–8, 20):</strong> A narrow passage stretched
            into the blackness. Light 1 lamp on your scorecard and clear any
            temporary combat modifiers. Once <strong>{LAMP_TARGET} lamps</strong> are
            lit, the night passes and you win!
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
      </section>

      {/* Tables Section */}
      <section className="print-section">
        <h2 className="unifrakturcook-bold section-title">Encounter & Game Tables</h2>

        {/* Exploration Table */}
        <h3 className="sub-title">Table I: Exploration & Encounters (1d20)</h3>
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
              <td>Safe sanctuary. Fully restore health to 15 Wounds.</td>
            </tr>
            <tr>
              <td>3 – 8</td>
              <td><strong>Dark Trench</strong></td>
              <td>Light a lamp! Check off 1 lamp on the scorecard.</td>
            </tr>
            <tr>
              <td>9 – 12</td>
              <td><strong>Booty</strong></td>
              <td>Supplies discovered! Roll 1d20 on Table II: Booty & Loot.</td>
            </tr>
            <tr>
              <td>13 – 18</td>
              <td><strong>Enemy Encounter</strong></td>
              <td>Danger lurks. Roll 1d20 on Table III: Monsters & Enemies.</td>
            </tr>
            <tr>
              <td>19</td>
              <td><strong>Trench Trap</strong></td>
              <td>A hazard strikes! Roll 1d20 on Table IV: Hazards & Traps.</td>
            </tr>
            <tr>
              <td>20</td>
              <td><strong>Dark Trench</strong></td>
              <td>Light a lamp! Check off 1 lamp on the scorecard.</td>
            </tr>
          </tbody>
        </table>

        {/* Booty Table */}
        <h3 className="sub-title">Table II: Booty & Loot (1d20)</h3>
        <p>
          When Booty is encountered, roll <strong>1d20</strong> to determine the
          container:
          <br />
          <strong>1 – 10: Medic Bag</strong> | <strong>11 – 20: Corpse</strong>
        </p>
        <p>
          <em>Booby-Trap Check:</em> Before searching, roll 1d20. On a roll of{" "}
          <strong>1</strong>, the cache is rigged with explosives! Suffer{" "}
          <strong>1d3 damage</strong> immediately and find nothing. Otherwise,
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
              <td>2 – 14</td>
              <td>
                <strong>Bandage:</strong> Restores 3 health [1 use].
              </td>
              <td>
                <strong>Fallen Weapon:</strong> Roll 1d6 on Table V (Weapons
                1–6) to determine which weapon is recovered!
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

        {/* Monster Table */}
        <h3 className="sub-title">Table III: Monsters & Enemies (1d20)</h3>
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

        {/* Traps Table */}
        <h3 className="sub-title">Table IV: Hazards & Traps (1d20)</h3>
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
      </section>

      {/* Printable Scorecard / Character Sheet */}
      <section className="print-section scorecard-section">
        <h2 className="unifrakturcook-bold section-title scorecard-title">
          Trench Log &amp; Scorecard
        </h2>
        <p style={{ margin: "4px 0 12px 0", fontSize: "13px" }}>
          Tear or print this section to record your physical solo playthrough.
        </p>

        {/* Lamps Tracker */}
        <div className="tracker-block">
          <div className="tracker-block__label">
            <strong>Lamps Lit (Goal: {LAMP_TARGET} to win):</strong>
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
            <strong>Wounds / Health (Start: 15 | Dead at 0):</strong>
          </div>
          <div className="wound-boxes">
            {Array.from({ length: 15 }, (_, i) => 15 - i).map((num) => (
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
            <p style={{ fontSize: "12px", margin: "4px 0" }}>Base: 3</p>
            <div className="stat-fill-box">Current: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</div>
          </div>
          <div className="tracker-grid__cell">
            <strong>Hit Modifier</strong>
            <p style={{ fontSize: "12px", margin: "4px 0" }}>Cigarettes</p>
            <div className="stat-fill-box">[ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</div>
          </div>
          <div className="tracker-grid__cell">
            <strong>Damage Modifier</strong>
            <p style={{ fontSize: "12px", margin: "4px 0" }}>Hip Flask</p>
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
              <strong>Pistol (15 Ammo):</strong>
            </span>
            <div className="ammo-boxes">
              {Array.from({ length: 15 }, (_, i) => (
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
