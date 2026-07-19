// Moteur de correction du francais TakaCode : elisions, accents, bigrammes.
// Partage entre fix-french-content.mjs (BDD) et fix-french-ui.mjs (composants).
// ---------------------------------------------------------------------------
// 1. Elisions : consonne + espace + voyelle => apostrophe. Regle deterministe
//    du francais ("d un" n'existe pas, c'est toujours "d'un").
// ---------------------------------------------------------------------------
// Frontieres de mots conscientes des accents : le \b de JS est ASCII, donc
// "affiliés et" voyait une frontiere apres le é et corrompait en "affiliés'et".
const B_START = "(?<![A-Za-zÀ-ÿŒœ])";
// B_END refuse aussi ".lettre" : protege les noms de domaines et de produits
// ("systeme.io" ne doit jamais devenir "système.io").
const B_END = "(?![A-Za-zÀ-ÿŒœ]|\\.[a-z])";
const ELISION_RE = new RegExp(`${B_START}(d|l|n|j|c|s|m|t|qu|jusqu|lorsqu|puisqu|quelqu)\\s+(?=[aeiouyhAEIOUYH][a-zA-Z]|[EAI][a-zA-Z]|IA${B_END}|API${B_END}|IDE${B_END}|URL${B_END})`, "g");

function fixElisions(text) {
  return text
    .replace(ELISION_RE, (match, prefix) => `${prefix}'`)
    .replace(/\bJai\b/g, "J'ai")
    .replace(/\bjai\b/g, "j'ai")
    .replace(/\bCest\b/g, "C'est")
    .replace(/\bcest\b/g, "c'est");
}

// "a" + infinitif => "à" (liste blanche : un infinitif exact ne peut pas etre
// un participe sans accent, contrairement a une regle generique sur -er/-re).
const A_INFINITIFS = [
  "ecrire", "lire", "faire", "mettre", "prendre", "comprendre", "apprendre",
  "suivre", "construire", "connaitre", "utiliser", "creer", "configurer",
  "expliquer", "deployer", "publier", "modifier", "installer", "tester",
  "verifier", "gerer", "coder", "structurer", "rediger", "formuler", "definir",
  "choisir", "reussir", "eviter", "ajouter", "donner", "stocker", "observer",
  "monetiser", "demarrer", "distinguer", "selectionner", "retenir", "savoir",
  "etre", "avoir", "jouer", "copier", "coller", "envoyer", "resoudre", "chercher"
];
const A_INF_RE = new RegExp(`${B_START}a (?=(?:${A_INFINITIFS.join("|")})${B_END})`, "g");

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
  ["acces a", "accès à"],
  // Participes passes : le contexte leve l'ambiguite present/participe
  ["assiste par", "assisté par"], ["guide par", "guidé par"], ["propulse par", "propulsé par"],
  ["a cree", "a créé"], ["as cree", "as créé"], ["cree par", "créé par"], ["cree avec", "créé avec"],
  ["a genere", "a généré"], ["as genere", "as généré"],
  ["est utilise", "est utilisé"], ["sont utilises", "sont utilisés"],
  ["complet et publie", "complet et publié"], ["est publie", "est publié"],
  ["publies par", "publiés par"], ["projets publies", "projets publiés"],
  ["lecons validees", "leçons validées"],
  ["a la mise en ligne", "à la mise en ligne"],
  ["tu apprend ", "tu apprends "],
  ["n y a", "n'y a"], ["s y ", "s'y "], ["n y ", "n'y "]
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
  numerique: "numérique", numeriques: "numériques", securite: "sécurité", securise: "sécurise",
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
  publiee: "publiée", validee: "validée", verifiees: "vérifiées", utilisee: "utilisée",
  connectee: "connectée", connecter: "connecter",
  heberge_: "hébergé", partage: "partage", partagee: "partagée",
  personnalisee: "personnalisée", personnaliser: "personnaliser",
  automatisee: "automatisée", automatiser: "automatiser",
  structure: "structure", structuree: "structurée", structurer: "structurer",
  optimisee: "optimisée", optimiser: "optimiser",
  organisee: "organisée", organiser: "organiser",
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
  destinee: "destinée", detecte: "détecte", detecter: "détecter",
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
  severite: "sévérité",
  // Completions issues de l'analyse de frequence du corpus
  depot: "dépôt", depots: "dépôts", reel: "réel", reelle: "réelle", reels: "réels",
  reellement: "réellement", zero: "zéro", numero: "numéro",
  semantique: "sémantique", semantiques: "sémantiques",
  selecteur: "sélecteur", selecteurs: "sélecteurs",
  selectionne: "sélectionne", selectionner: "sélectionner",
  connaitre: "connaître", apparaitre: "apparaître", parait: "paraît",
  accelerateur: "accélérateur", accelerateurs: "accélérateurs",
  accelere: "accélère", accelerer: "accélérer", acceleration: "accélération",
  interieur: "intérieur", exterieur: "extérieur", superieur: "supérieur",
  superieure: "supérieure", inferieur: "inférieur", inferieure: "inférieure",
  monetisation: "monétisation", monetiser: "monétiser", monetise: "monétise",
  efficacite: "efficacité", complexite: "complexité", simplicite: "simplicité",
  rentabilite: "rentabilité", accessibilite: "accessibilité",
  compatibilite: "compatibilité", flexibilite: "flexibilité",
  lisibilite: "lisibilité", maintenabilite: "maintenabilité",
  parametre: "paramètre", parametres: "paramètres",
  iteration: "itération", iterations: "itérations", itere: "itère", iterer: "itérer",
  evenement: "événement", evenements: "événements",
  predefini: "prédéfini", predefinie: "prédéfinie", predefinis: "prédéfinis", predefinies: "prédéfinies",
  immediat: "immédiat", immediate: "immédiate", immediatement: "immédiatement",
  generalement: "généralement", preferences: "préférences", preference: "préférence",
  recuperation: "récupération", conois: "conçois", concois: "conçois",
  experimente: "expérimenté", experimentee: "expérimentée",
  independant: "indépendant", independante: "indépendante",
  ingenieur: "ingénieur", ingenieurs: "ingénieurs",
  execute: "exécute", executer: "exécuter", execution: "exécution",
  hesite: "hésite", hesiter: "hésiter", nhesite: "n'hésite",
  succede: "succède", precede: "précède", precedent: "précédent", precedente: "précédente",
  suivante: "suivante", frequent: "fréquent", frequente: "fréquente", frequemment: "fréquemment",
  redemarre: "redémarre", redemarrer: "redémarrer",
  maitrise: "maîtrise", maitriser: "maîtriser", maitrises: "maîtrises",
  boite: "boîte", chaine: "chaîne", chaines: "chaînes",
  coherent: "cohérent", coherente: "cohérente", coherence: "cohérence",
  deroule: "déroule", derouler: "dérouler", prevoir: "prévoir",
  facon: "façon", facons: "façons", exposee: "exposée", exposees: "exposées",
  protegees: "protégées", proteges: "protégés",
  validees: "validées", terminees: "terminées", editer: "éditer", edite: "édite",
  payee: "payée", payees: "payées", ciblee: "ciblée", ciblees: "ciblées",
  metrique: "métrique", metriques: "métriques", irresistible: "irrésistible",
  edition: "édition", deconnexion: "déconnexion", deconnecter: "déconnecter",
  reglage: "réglage", reglages: "réglages"
};

// Nettoyage des cles bidon introduites pour lisibilite (suffixe _)
for (const k of Object.keys(WORDS)) {
  if (k.endsWith("_") || !WORDS[k]) delete WORDS[k];
}

const WORD_RES = Object.entries(WORDS).flatMap(([from, to]) => {
  const cap = from.charAt(0).toUpperCase() + from.slice(1);
  const capTo = to.charAt(0).toUpperCase() + to.slice(1);
  return [
    [new RegExp(`${B_START}${from}${B_END}`, "g"), to],
    [new RegExp(`${B_START}${cap}${B_END}`, "g"), capTo]
  ];
});

const BIGRAM_RES = BIGRAMS.flatMap(([from, to]) => {
  const cap = from.charAt(0).toUpperCase() + from.slice(1);
  const capTo = to.charAt(0).toUpperCase() + to.slice(1);
  return [
    [new RegExp(`${B_START}${from}${B_END}`, "g"), to],
    [new RegExp(`${B_START}${cap}${B_END}`, "g"), capTo]
  ];
});

// Marques et noms propres anglais contenant des mots francais corrigeables
// ("Think Media" ne doit jamais devenir "Think Média").
const PROTECTED = [
  "Think Media", "Social Media", "Media Query", "media query", "media queries",
  "Media Buyer", "media buyer", "Media Buying", "media buying", "media buyers"
];

export function fixText(text) {
  if (typeof text !== "string" || !text) return text;
  // Jamais les URLs / chemins
  if (/^https?:\/\//.test(text) || /^\//.test(text) || /^lucide:/.test(text)) return text;
  // Met de cote les phrases protegees avant le pipeline, restaure apres.
  let out = text;
  PROTECTED.forEach((phrase, i) => {
    out = out.split(phrase).join(`${i}`);
  });
  out = fixElisions(out);
  for (const [re, to] of BIGRAM_RES) out = out.replace(re, to);
  out = out.replace(A_INF_RE, "à ");
  for (const [re, to] of WORD_RES) out = out.replace(re, to);
  PROTECTED.forEach((phrase, i) => {
    out = out.split(`${i}`).join(phrase);
  });
  return out;
}
