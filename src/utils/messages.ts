/**
 * Creates a message object with a unique ID.
 * Used throughout the game for consistent message formatting.
 */
export function createMessage(text: string) {
  return {
    id: crypto.randomUUID(),
    text,
  };
}

/**
 * Creates multiple message objects at once.
 */
export function createMessages(...texts: string[]) {
  return texts.map((text) => createMessage(text));
}
