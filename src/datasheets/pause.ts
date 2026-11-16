export const pauseSentences = [
  "The distant guns fall silent for a fleeting heartbeat.",
  "You lean against the muddy trench wall and catch your breath.",
  "The bitter cold bites deep, but the stillness brings quiet comfort.",
  "A rare silence settles over the wire and shattered mud.",
  "You close your eyes and listen to the slow drip of muddy water.",
  "You check your gear in the quiet gloom, steadying trembling hands.",
  "The air hangs heavy with sulfur, but for now, nothing stirs.",
  "You take a quiet breath of freezing mist, resting weary limbs.",
  "Shadows flicker against the trench boards as you steady your nerve.",
  "A heavy, fragile calm hangs over the sodden earth.",
] as const;

export type Pause = {
  _type: "pause";
  name: "A moment of respite";
  description: string;
};

export function createPauseStep(sentenceIndex?: number): Pause {
  const index =
    typeof sentenceIndex === "number"
      ? ((sentenceIndex % pauseSentences.length) + pauseSentences.length) %
        pauseSentences.length
      : Math.floor(Math.random() * pauseSentences.length);

  return {
    _type: "pause",
    name: "A moment of respite",
    description: pauseSentences[index]!,
  };
}
