// Corrige le francais du contenu parcours/quiz en base :
//  1. apostrophes manquantes ("d un" -> "d'un", "qu elle" -> "qu'elle"...)
//  2. accents manquants via un dictionnaire adapte au corpus TakaCode
//
// Usage :
//   node scripts/fix-french-content.mjs           # dry-run : rapport sans ecrire
//   node scripts/fix-french-content.mjs --apply   # applique les corrections
//
// Rejouable a volonte (idempotent). A relancer apres un re-seed des parcours.
// Les champs techniques (slug, url, icon...) ne sont jamais touches.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

function loadEnv(file) {
  try {
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
    }
  } catch {}
}
loadEnv(".env.local");
loadEnv(".env");

const APPLY = process.argv.includes("--apply");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants (.env.local)");
  process.exit(1);
}
const supabase = createClient(url, key);

// ---------------------------------------------------------------------------
// 1. Elisions : consonne + espace + voyelle => apostrophe. Regle deterministe
//    du francais ("d un" n'existe pas, c'est toujours "d'un").
// ---------------------------------------------------------------------------
const ELISION_RE = /\b(d|l|n|j|c|s|m|t|qu|jusqu|lorsqu|puisqu|quelqu)\s+(?=[aeiouyhAEIOUYH][a-zA-Z]|[EAI][a-zA-Z]|IA\b|API\b|IDE\b|URL\b)/g;

function fixElisions(text) {
  return text.replace(ELISION_RE, (match, prefix) => `${prefix}'`);
}

// ---------------------------------------------------------------------------
// 2. Accents : dictionnaire mot-a-mot (uniquement des mots non ambigus dans
//    ce corpus). Les bigrammes traitent les cas contextuels surs.
// ---------------------------------------------------------------------------
const BIGRAMS = [
  ["a partir", "à partir"], ["grace a", "grâce à"], ["face a", "face à"],
  ["jusqu'a", "jusqu'à"], ["par rapport a", "par rapport à"],
  ["a travers", "à travers"], ["a nouveau", "à nouveau"], ["a jour", "à jour"],
  ["a chaque", "à chaque"], ["a ton rythme", "à ton rythme"],
  ["a la fois", "à la fois"], ["a l'aide", "à l'aide"], ["pas a pas", "pas à pas"],
  ["etape par etape", "étape par étape"], ["des que", "dès que"], ["des le", "dès le"],
  ["des la", "dès la"], ["bien sur", "bien sûr"], ["a cote", "à côté"],
  ["du cote", "du côté"], ["a ete", "a été"], ["ont ete", "ont été"],
  ["est ete", "est été"], ["genere par", "généré par"], ["generee par", "générée par"],
  ["generes par", "générés par"], ["code genere", "code généré"],
  ["html genere", "HTML généré"], ["texte genere", "texte généré"],
  ["contenu genere", "contenu généré"], ["deja", "déjà"], ["voila", "voilà"],
  ["au dela", "au-delà"], ["au-dela", "au-delà"], ["la ou", "là où"],
  ["a quoi", "à quoi"], ["a ne pas", "à ne pas"], ["a eviter", "à éviter"],
  ["pret a", "prêt à"], ["prete a", "prête à"], ["prets a", "prêts à"],
  ["acces a", "accès à"], ["face aux", "face aux"]
];

const WORDS = {
  // e -> é / è / ê selon le mot (formes du corpus TakaCode uniquement)
  probleme: "problème", problemes: "problèmes", systeme: "système", systemes: "systèmes",
  modele: "modèle", modeles: "modèles", regle: "règle", regles: "règles",
  critere: "critère", criteres: "critères", caractere: "caractère", caracteres: "caractères",
  bibliotheque: "bibliothèque", bibliotheques: "bibliothèques", requete: "requête", requetes: "requêtes",
  premiere: "première", premieres: "premières", derniere: "dernière", dernieres: "dernières",
  maniere: "manière", manieres: "manières", particuliere: "particulière",
  entiere: "entière", carriere: "carrière", lumiere: "lumière", frontiere: "frontière",
  etape: "étape", etapes: "étapes", etat: "état", etats: "états", ete: "été",
  etude: "étude", etudes: "études", etudiant: "étudiant", etudiants: "étudiants",
  equipe: "équipe", equipes: "équipes", ecran: "écran", ecrans: "écrans",
  ecrit: "écrit", ecrite: "écrite", ecrits: "écrits", ecrire: "écrire", ecris: "écris",
  echange: "échange", echanges: "échanges", echoue: "échoue", echouer: "échouer", echec: "échec", echecs: "échecs",
  economise: "économise", economiser: "économiser", ecoute: "écoute", ecouter: "écouter",
  editeur: "éditeur", editeurs: "éditeurs", egalement: "également", element: "élément", elements: "éléments",
  eleve: "élevé", elevee: "élevée", email: "email", energie: "énergie",
  enonce: "énoncé", enonces: "énoncés", equivalent: "équivalent",
  etre: "être", evite: "évite", eviter: "éviter", evolue: "évolue", evoluer: "évoluer",
  evolution: "évolution", exemple: "exemple", experience: "expérience", experiences: "expériences",
  ecosysteme: "écosystème", emission: "émission",
  developpe: "développe", developper: "développer", developpee: "développée",
  developpement: "développement", developpeur: "développeur", developpeurs: "développeurs",
  generer: "générer", generee: "générée", generees: "générées",
  generation: "génération", general: "général", generale: "générale", generique: "générique",
  genere: "génère",
  cree: "crée", creer: "créer", creee: "créée", creees: "créées", crees: "créés",
  creation: "création", createur: "créateur", createurs: "créateurs", creatif: "créatif", creative: "créative",
  creativite: "créativité",
  numerique: "numérique", numeriques: "numériques", securite: "sécurité", securise: "sécurisé",
  securisee: "sécurisée", securiser: "sécuriser",
  donnee: "donnée", donnees: "données", reponse: "réponse", reponses: "réponses",
  repond: "répond", repondre: "répondre", reponds: "réponds", repondu: "répondu",
  verifie: "vérifie", verifier: "vérifier", verifiee: "vérifiée", verification: "vérification",
  ameliore: "améliore", ameliorer: "améliorer", amelioree: "améliorée", amelioration: "amélioration",
  ameliorations: "améliorations",
  integre: "intègre", integrer: "intégrer", integree: "intégrée", integration: "intégration",
  deploie: "déploie", deployer: "déployer", deploye: "déployé", deployee: "déployée",
  deploiement: "déploiement", heberge: "héberge", heberger: "héberger", hebergement: "hébergement",
  hebergeur: "hébergeur", hebergeurs: "hébergeurs",
  telecharge: "télécharge", telecharger: "télécharger", telechargement: "téléchargement",
  precis: "précis", precise: "précise", precisement: "précisément", precision: "précision",
  necessaire: "nécessaire", necessaires: "nécessaires", necessite: "nécessite",
  specifique: "spécifique", specifiques: "spécifiques", different: "différent",
  differente: "différente", differents: "différents", differentes: "différentes",
  difference: "différence", differences: "différences",
  realise: "réalise", realiser: "réaliser", realisee: "réalisée", realisation: "réalisation",
  reussir: "réussir", reussite: "réussite", reussi: "réussi", reussie: "réussie",
  resultat: "résultat", resultats: "résultats", reseau: "réseau", reseaux: "réseaux",
  reference: "référence", references: "références", prefere: "préfère", preferee: "préférée",
  definit: "définit", definir: "définir", defini: "défini", definie: "définie", definition: "définition",
  decris: "décris", decrire: "décrire", decrit: "décrit", description: "description",
  decouvre: "découvre", decouvrir: "découvrir", decouverte: "découverte",
  demarre: "démarre", demarrer: "démarrer", demarrage: "démarrage",
  detail: "détail", details: "détails", detaille: "détaillé", detaillee: "détaillée",
  separe: "sépare", separee: "séparée", separer: "séparer",
  cle: "clé", cles: "clés", role: "rôle", roles: "rôles", controle: "contrôle",
  controler: "contrôler", bientot: "bientôt", plutot: "plutôt", cote: "côté", cotes: "côtés",
  hote: "hôte", methode: "méthode", methodes: "méthodes", media: "média", medias: "médias",
  video: "vidéo", videos: "vidéos", memoire: "mémoire", memorise: "mémorise", memoriser: "mémoriser",
  meme: "même", memes: "mêmes", tres: "très", apres: "après", pres: "près",
  succes: "succès", acces: "accès", proces: "procès", progres: "progrès", interet: "intérêt",
  interets: "intérêts", arret: "arrêt", arrete: "arrête", arreter: "arrêter",
  peut_etre: "peut-être", fenetre: "fenêtre", fenetres: "fenêtres", tete: "tête",
  enquete: "enquête", complete: "complète", completer: "compléter", completee: "complétée",
  competence: "compétence", competences: "compétences", lecon: "leçon", lecons: "leçons",
  francais: "français", francaise: "française", recu: "reçu", recois: "reçois", recoit: "reçoit",
  ca: "ça", tache: "tâche", taches: "tâches", grace: "grâce", theatre: "théâtre",
  repere: "repère", reperer: "repérer", reperes: "repères",
  achete: "achète", acheter: "acheter", achat: "achat",
  possede: "possède", posseder: "posséder", suggere: "suggère", suggerer: "suggérer",
  gere: "gère", gerer: "gérer", geree: "gérée", considere: "considère",
  recupere: "récupère", recuperer: "récupérer", opere: "opère",
  protege: "protège", proteger: "protéger", protegee: "protégée",
  strategie: "stratégie", strategies: "stratégies", categorie: "catégorie", categories: "catégories",
  theorie: "théorie", periode: "période", periodes: "périodes",
  benefice: "bénéfice", benefices: "bénéfices", beneficie: "bénéficie",
  scenario: "scénario", scenarios: "scénarios", schema: "schéma", schemas: "schémas",
  telephone: "téléphone", camera: "caméra", cinema: "cinéma",
  represente: "représente", representer: "représenter", representation: "représentation",
  reutilise: "réutilise", reutiliser: "réutiliser", reutilisable: "réutilisable",
  reduis: "réduis", reduire: "réduire", reduit: "réduit", reduction: "réduction",
  regulierement: "régulièrement", regulier: "régulier", reguliere: "régulière",
  vraiment: "vraiment", legerement: "légèrement", leger: "léger", legere: "légère",
  facilite: "facilité", qualite: "qualité", quantite: "quantité", rapidite: "rapidité",
  communaute: "communauté", visibilite: "visibilité", possibilite: "possibilité",
  possibilites: "possibilités", fonctionnalite: "fonctionnalité", fonctionnalites: "fonctionnalités",
  responsabilite: "responsabilité", priorite: "priorité", priorites: "priorités",
  identite: "identité", capacite: "capacité", capacites: "capacités",
  activite: "activité", activites: "activités", utilite: "utilité", unite: "unité",
  variete: "variété", proximite: "proximité", credibilite: "crédibilité",
  propriete: "propriété", proprietes: "propriétés", societe: "société",
  moitie: "moitié", pitie: "pitié", specialite: "spécialité",
  publie: "publié", publiee: "publiée", publier: "publier", publies: "publiés",
  valide: "valide", validee: "validée", verifiees: "vérifiées",
  utilise: "utilise", utilisee: "utilisée", prefere_: "préféré",
  connecte: "connecté", connectee: "connectée", connecter: "connecter",
  heberge_: "hébergé", partage: "partage", partagee: "partagée",
  personnalise: "personnalisé", personnalisee: "personnalisée", personnaliser: "personnaliser",
  automatise: "automatisé", automatisee: "automatisée", automatiser: "automatiser",
  structure: "structure", structuree: "structurée", structurer: "structurer",
  optimise: "optimisé", optimisee: "optimisée", optimiser: "optimiser",
  organise: "organisé", organisee: "organisée", organiser: "organiser",
  resume: "résumé", resumer: "résumer", enonce_: "énoncé",
  idee: "idée", idees: "idées", journee: "journée", annee: "année", annees: "années",
  duree: "durée", pensee: "pensée", portee: "portée", visee: "visée",
  employe: "employé", cree_: "créé",
  debut: "début", debutant: "débutant", debutants: "débutants",
  debute: "débute", debuter: "débuter",
  decide: "décide", decider: "décider", decision: "décision", decisions: "décisions",
  declare: "déclare", declarer: "déclarer", declaration: "déclaration",
  decrit_: "décrit", dedie: "dédié", dediee: "dédiée",
  defaut: "défaut", defauts: "défauts", defi: "défi", defis: "défis",
  degre: "degré", delai: "délai", delais: "délais",
  demande: "demande", demarche: "démarche", demarches: "démarches",
  depend: "dépend", dependance: "dépendance", dependances: "dépendances",
  depasse: "dépasse", depasser: "dépasser", depense: "dépense", depenses: "dépenses",
  deplace: "déplace", deplacer: "déplacer", derriere: "derrière",
  desactive: "désactive", designe: "désigne", desormais: "désormais",
  destine: "destiné", destinee: "destinée", detecte: "détecte", detecter: "détecter",
  determine: "détermine", determiner: "déterminer",
  medaille: "médaille", metier: "métier", metiers: "métiers",
  ministere: "ministère", mystere: "mystère",
  operation: "opération", operations: "opérations",
  penalise: "pénalise", phenomene: "phénomène",
  prepare: "prépare", preparer: "préparer", preparation: "préparation",
  presente: "présente", presenter: "présenter", presentation: "présentation",
  prete: "prête", preter: "prêter",
  previent: "prévient", previsible: "prévisible", prevu: "prévu", prevue: "prévue",
  procede: "procède", procedure: "procédure", procedures: "procédures",
  recemment: "récemment", recent: "récent", recente: "récente", recentes: "récentes",
  recompense: "récompense", recompenses: "récompenses",
  redige: "rédige", rediger: "rédiger", redaction: "rédaction",
  reflechis: "réfléchis", reflechir: "réfléchir", reflexion: "réflexion",
  remunere: "rémunère", remuneration: "rémunération",
  repete: "répète", repeter: "répéter", repetition: "répétition",
  residu: "résidu", resout: "résout", resoudre: "résoudre", resolu: "résolu",
  reviser: "réviser", revision: "révision", revisions: "révisions",
  themes: "thèmes", theme: "thème",
  severite: "sévérité"
};

// Nettoyage des cles bidon introduites pour lisibilite (suffixe _)
for (const k of Object.keys(WORDS)) {
  if (k.endsWith("_") || !WORDS[k]) delete WORDS[k];
}

const WORD_RES = Object.entries(WORDS).flatMap(([from, to]) => {
  const cap = from.charAt(0).toUpperCase() + from.slice(1);
  const capTo = to.charAt(0).toUpperCase() + to.slice(1);
  return [
    [new RegExp(`\\b${from}\\b`, "g"), to],
    [new RegExp(`\\b${cap}\\b`, "g"), capTo]
  ];
});

const BIGRAM_RES = BIGRAMS.flatMap(([from, to]) => {
  const cap = from.charAt(0).toUpperCase() + from.slice(1);
  const capTo = to.charAt(0).toUpperCase() + to.slice(1);
  return [
    [new RegExp(`\\b${from.replace(/'/g, "'")}\\b`, "g"), to],
    [new RegExp(`\\b${cap.replace(/'/g, "'")}\\b`, "g"), capTo]
  ];
});

function fixText(text) {
  if (typeof text !== "string" || !text) return text;
  // Jamais les URLs / chemins
  if (/^https?:\/\//.test(text) || /^\//.test(text) || /^lucide:/.test(text)) return text;
  let out = fixElisions(text);
  for (const [re, to] of BIGRAM_RES) out = out.replace(re, to);
  for (const [re, to] of WORD_RES) out = out.replace(re, to);
  return out;
}

// Champs techniques a ne jamais toucher dans les jsonb
const SKIP_KEYS = new Set(["slug", "url", "icon", "kind", "id", "key", "state", "status", "level", "answer", "validation", "difficulty", "source", "requires_link", "resource_url"]);

function fixValue(value, parentKey = "") {
  if (SKIP_KEYS.has(parentKey)) return value;
  if (typeof value === "string") return fixText(value);
  if (Array.isArray(value)) return value.map((v) => fixValue(v, parentKey));
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = fixValue(v, k);
    return out;
  }
  return value;
}

// ---------------------------------------------------------------------------
// Application table par table
// ---------------------------------------------------------------------------
let totalChanged = 0;
const samples = [];

async function processTable(table, idCol, fields) {
  const { data, error } = await supabase.from(table).select([idCol, ...fields].join(", "));
  if (error) {
    console.log(`${table}: ERREUR ${error.message}`);
    return;
  }
  let changed = 0;
  for (const row of data || []) {
    const patch = {};
    for (const f of fields) {
      const fixed = fixValue(row[f], f);
      if (JSON.stringify(fixed) !== JSON.stringify(row[f])) {
        patch[f] = fixed;
        if (samples.length < 12 && typeof row[f] === "string") {
          samples.push({ table, before: row[f].slice(0, 80), after: fixed.slice(0, 80) });
        }
      }
    }
    if (Object.keys(patch).length) {
      changed++;
      if (APPLY) {
        const { error: upErr } = await supabase.from(table).update(patch).eq(idCol, row[idCol]);
        if (upErr) console.log(`  update ${table}/${row[idCol]}: ${upErr.message}`);
      }
    }
  }
  totalChanged += changed;
  console.log(`${table}: ${changed}/${(data || []).length} lignes a corriger${APPLY ? " -> corrigees" : ""}`);
}

console.log(APPLY ? "=== MODE APPLY ===" : "=== DRY-RUN (ajoute --apply pour ecrire) ===");
await processTable("learning_tracks", "id", ["title", "summary", "description", "objective", "resources", "next_steps"]);
await processTable("track_modules", "id", ["title", "summary"]);
await processTable("track_lessons", "id", ["title", "intro", "why_important", "how_to_use", "objectives", "resources", "quiz", "micro_project"]);
await processTable("lesson_quiz_questions", "id", ["prompt", "choices", "explanation", "objective"]);

console.log(`\nTotal: ${totalChanged} lignes${APPLY ? " corrigees" : " a corriger"}`);
console.log("\n=== Echantillons avant/apres ===");
for (const s of samples) {
  console.log(`- [${s.table}]\n  AVANT: ${s.before}\n  APRES: ${s.after}`);
}
