import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const REPLACEMENTS = [
  ["Decouvr", "Découvr"],
  ["decouvr", "découvr"],
  ["Ecran", "Écran"],
  ["ecran", "écran"],
  ["Etape", "Étape"],
  ["etape", "étape"],
  ["Etapes", "Étapes"],
  ["etapes", "étapes"],
  ["Creer", "Créer"],
  ["creer", "créer"],
  ["Decouvrir", "Découvrir"],
  ["decouvrir", "découvrir"],
  ["Deroule", "Déroule"],
  ["deroule", "déroule"],
  ["Deroulement", "Déroulement"],
  ["deroulement", "déroulement"],
  ["Developp", "Développ"],
  ["developp", "développ"],
  ["Demarre", "Démarre"],
  ["demarre", "démarre"],
  ["Demarrer", "Démarrer"],
  ["demarrer", "démarrer"],
  ["Numerique", "Numérique"],
  ["numerique", "numérique"],
  ["Securite", "Sécurité"],
  ["securite", "sécurité"],
  ["Pedagogique", "Pédagogique"],
  ["pedagogique", "pédagogique"],
  ["Thematique", "Thématique"],
  ["thematique", "thématique"],
  ["Concu", "Conçu"],
  ["concu", "conçu"],
  ["Maitris", "Maîtris"],
  ["maitris", "maîtris"],
  ["Reuss", "Réuss"],
  ["reuss", "réuss"],
  ["Debloqu", "Débloqu"],
  ["debloqu", "débloqu"],
  ["Echou", "Échou"],
  ["echou", "échou"],
  ["Liees", "Liées"],
  ["liees", "liées"],
  ["Apres", "Après"],
  ["apres", "après"],
  ["Privees", "Privées"],
  ["privees", "privées"],
  ["Resultat", "Résultat"],
  ["resultat", "résultat"],
  ["Necessaire", "Nécessaire"],
  ["necessaire", "nécessaire"],
  ["Amelior", "Amélior"],
  ["amelior", "amélior"],
  ["Tres", "Très"],
  ["tres", "très"],
  ["Pres", "Près"],
  ["pres", "près"],
  ["Voila", "Voilà"],
  ["voila", "voilà"],
  ["Donnees", "Données"],
  ["donnees", "données"],
  ["Acces", "Accès"],
  ["acces", "accès"],
  ["Probleme", "Problème"],
  ["probleme", "problème"],
  ["Methode", "Méthode"],
  ["methode", "méthode"],
  ["Modifie", "Modifié"],
  ["modifie", "modifié"],
  ["Communaute", "Communauté"],
  ["communaute", "communauté"],
  ["Competences", "Compétences"],
  ["competences", "compétences"],
  ["Confidentialite", "Confidentialité"],
  ["confidentialite", "confidentialité"],
  ["Francais", "Français"],
  ["francais", "français"],
  ["Meme", "Même"],
  ["meme", "même"],
  ["Evalu", "Évalu"],
  ["evalu", "évalu"],
  ["Selectionn", "Sélectionn"],
  ["selectionn", "sélectionn"],
  ["Associe", "Associé"],
  ["associe", "associé"],
  ["Publie", "Publié"],
  ["publie", "publié"],
  ["Termine", "Terminé"],
  ["termine", "terminé"],
  ["Ordonn", "Ordonn"],
  ["ordonn", "ordonn"],
  ["Rearrang", "Réarrang"],
  ["rearrang", "réarrang"],
  ["Approuve", "Approuvé"],
  ["approuve", "approuvé"],
  ["Immediatement", "Immédiatement"],
  ["immediatement", "immédiatement"],
  ["Different", "Différent"],
  ["different", "différent"],
  ["Interet", "Intérêt"],
  ["interet", "intérêt"],
  ["Complet", "Complèt"],
  ["complet", "complèt"],
];

function applyReplacements(text) {
  for (const [pattern, replacement] of REPLACEMENTS) {
    const regex = new RegExp(`(?<![a-zA-Z])${pattern}(?![a-zA-Z])`, "g");
    text = text.replace(regex, replacement);
  }
  return text;
}

function fixLine(line) {
  if (line.includes("font-valorax") || line.includes("font-venite")) {
    return line;
  }
  // Save href, id, and placeholder attribute values from being modified
  const saved = [];
  let counter = 0;
  const guard = line.replace(/(href|id|placeholder)=("(?:[^"\\]|\\.)*")/g, (match) => {
    const key = `__ATTR${counter}__`;
    saved.push({ key, value: match });
    counter++;
    return key;
  });
  const fixed = applyReplacements(guard);
  let result = fixed;
  for (const { key, value } of saved) {
    result = result.replace(key, value);
  }
  return result;
}

function collectFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectFiles(full));
    } else if (entry.endsWith(".tsx")) {
      results.push(full);
    }
  }
  return results;
}

const files = [
  ...collectFiles("app/(app)/dashboard/documentation"),
  "components/FooterSection.tsx",
];

for (const file of files) {
  const content = readFileSync(file, "utf-8");
  const lines = content.split("\n");
  const newLines = lines.map(fixLine);
  const changed = lines.some((l, i) => l !== newLines[i]);

  if (changed) {
    writeFileSync(file, newLines.join("\n"), "utf-8");
    console.log(`Fixed: ${file}`);
  }
}

console.log("Done.");
