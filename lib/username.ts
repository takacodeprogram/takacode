const ADJECTIVES = [
  "Rapide", "Curieux", "Cosmic", "Malin", "Zen", "Turbo", "Pixel", "Neo", "Astro", "Cyber",
  "Vif", "Solaire", "Nocturne", "Electrik", "Quantum", "Nova", "Alpha", "Mega", "Ultra", "Hyper"
];

const NOUNS = [
  "Codeur", "Builder", "Panda", "Renard", "Faucon", "Loup", "Dragon", "Robot", "Ninja", "Pilote",
  "Explorer", "Hacker", "Maker", "Wizard", "Phoenix", "Tigre", "Comete", "Pixel", "Circuit", "Byte"
];

export function generateUsername(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${adj}${noun}${num}`;
}
