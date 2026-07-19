// Seed de 3 parcours avancés :
//  - automatisation-ia  : Automatisations et chatbots IA (remplit la coquille existante)
//  - web3-blockchain    : Web3, créer et déployer un smart contract (remplit la coquille)
//  - bot-trading-ia     : Bot de trading assisté par IA (nouveau)
//
// Usage : node scripts/seed-parcours-avances.mjs
// Idempotent (upsert par slug). Contenu accentué (skill francais-accents).
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
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const TRACKS = [
  // =========================================================================
  // AUTOMATISATIONS & CHATBOTS IA
  // =========================================================================
  {
    track: {
      slug: "automatisation-ia",
      goal_key: "automation_ai",
      title: "Automatisations et chatbots IA",
      summary: "Automatise les tâches répétitives et construis un chatbot IA déployé sur WhatsApp ou ton site — puis vends-le comme service.",
      description: "Tu apprends à penser en automatisations (déclencheur, actions, résultat), à construire tes premiers workflows avec n8n, puis à créer un chatbot IA nourri de tes propres contenus et déployé là où vivent tes clients : WhatsApp et ton site. Le dernier module fiabilise tout ça (erreurs, logs, hébergement VPS) et transforme la compétence en revenu : l'automatisation que tu construis pour toi devient un service que tu vends.",
      level_label: "Intermédiaire",
      duration_weeks: 4,
      accent_color: "#22D3EE",
      icon: "lucide:bot",
      objective: "Déployer un chatbot IA sur un canal réel et vendre ta première automatisation.",
      resources: ["n8n", "Botpress", "WhatsApp Business", "Hostinger VPS"],
      next_session: "Mercredi 19h00",
      next_steps: [
        { label: "Penser en automatisations", state: "current" },
        { label: "Construire son chatbot", state: "locked" },
        { label: "Fiabiliser et vendre", state: "locked" }
      ],
      sort_order: 7,
      is_published: true,
      is_active: true
    },
    modules: [
      {
        slug: "penser-en-automatisations",
        title: "Penser en automatisations",
        summary: "Repérer les tâches répétitives et construire ses premiers workflows n8n.",
        sort_order: 10,
        lessons: [
          {
            slug: "reperer-les-taches-a-automatiser",
            title: "Repérer les tâches à automatiser",
            intro: "Toute automatisation se décrit en trois blocs : un déclencheur (un email arrive, un formulaire est rempli), des actions (copier, transformer, envoyer), un résultat. Avant d'ouvrir un outil, on apprend à voir le monde avec cette grille.",
            why_important: "L'erreur classique est d'automatiser ce qui est amusant plutôt que ce qui coûte du temps. Une heure de cartographie honnête vaut dix workflows gadgets : tu automatises d'abord ce qui se répète, se décrit en règles, et fait mal chaque semaine.",
            how_to_use: "Liste une semaine de tâches répétitives (les tiennes ou celles d'un client type : relances, saisies, tris d'emails, publications). Pour chacune, écris le triplet déclencheur, actions, résultat, et estime le temps hebdomadaire perdu. Classe par douleur décroissante.",
            objectives: [
              "Décrire une tâche en déclencheur, actions, résultat",
              "Estimer le temps gagné par automatisation",
              "Choisir sa première automatisation à forte valeur"
            ],
            resources: [
              { label: "n8n (automatisation open source)", url: "https://n8n.io/", kind: "tool", why: "L'outil du parcours : visuel, puissant, auto-hébergeable — sans limite d'abonnement.", how: "Crée un compte cloud gratuit et parcours la galerie de workflows pour voir ce qui existe." },
              { label: "Make", url: "https://www.make.com/", kind: "tool", why: "Alternative visuelle très utilisée : bien pour comparer les approches.", how: "Regarde 2-3 scénarios types de la galerie pour nourrir tes idées." },
              { label: "Zapier", url: "https://zapier.com/", kind: "tool", why: "Le pionnier du secteur : sa galerie d'exemples est une mine d'idées d'automatisations.", how: "Explore les automatisations les plus populaires par métier." }
            ],
            quiz: [
              { q: "Quels sont les trois blocs d'une automatisation ?", choices: ["Déclencheur, actions, résultat", "Code, base de données, serveur", "Idée, budget, client"], answer: 0, explanation: "Cette grille décrit n'importe quelle automatisation, du tri d'emails au chatbot." },
              { q: "Quelle tâche automatiser en premier ?", choices: ["La plus amusante techniquement", "Celle qui se répète, se décrit en règles et coûte le plus de temps", "La plus difficile"], answer: 1, explanation: "On automatise la douleur récurrente, pas le gadget : c'est là que le temps gagné est réel." },
              { q: "Une tâche qui demande un jugement humain complexe à chaque fois est...", choices: ["Parfaite pour l'automatisation", "Mauvaise candidate : on automatise ce qui suit des règles", "Impossible à faire manuellement"], answer: 1, explanation: "Les règles s'automatisent ; le jugement se garde (ou s'assiste avec l'IA, mais avec un humain dans la boucle)." }
            ],
            micro_project: {
              title: "Ta carte des automatisations",
              brief: "Cartographie tes tâches répétitives et choisis ta première automatisation.",
              steps: [
                "Liste 5 tâches répétitives (les tiennes ou celles d'un client type)",
                "Décris chacune en déclencheur, actions, résultat",
                "Estime le temps hebdomadaire perdu par tâche",
                "Choisis ta première automatisation et justifie"
              ],
              deliverable: "Ta liste des 5 tâches cartographiées avec les temps estimés, et l'automatisation choisie avec ta justification.",
              validation: "ai"
            },
            xp_reward: 50,
            duration_minutes: 40,
            sort_order: 10
          },
          {
            slug: "premier-workflow-n8n",
            title: "Ton premier workflow n8n",
            intro: "n8n assemble des noeuds : un déclencheur (webhook, planning, formulaire) suivi d'actions (envoyer un email, écrire dans un tableau, appeler une API). En une heure, ta première automatisation tourne toute seule.",
            why_important: "Le premier workflow qui fonctionne change ta perception : tu passes de « je subis les tâches » à « je délègue aux machines ». Et n8n étant auto-hébergeable, tes automatisations ne dépendront jamais d'un abonnement qui explose.",
            how_to_use: "Dans n8n : crée un workflow avec un déclencheur formulaire (ou webhook), ajoute un noeud qui enregistre la soumission dans un Google Sheet, puis un noeud qui t'envoie une notification. Teste chaque noeud individuellement avant d'activer l'ensemble.",
            objectives: [
              "Créer un workflow déclencheur + 2 actions dans n8n",
              "Tester noeud par noeud avant d'activer",
              "Comprendre webhooks et exécutions"
            ],
            resources: [
              { label: "Documentation n8n", url: "https://docs.n8n.io/", kind: "doc", why: "La référence officielle : quickstart, noeuds, webhooks.", how: "Suis le quickstart officiel puis reviens construire TON workflow." },
              { label: "Galerie de workflows n8n", url: "https://n8n.io/workflows/", kind: "doc", why: "Des centaines de workflows prêts à importer et à décortiquer.", how: "Importe un workflow proche de ton besoin et étudie chaque noeud." },
              { label: "Claude (aide au debug)", url: "https://claude.ai/", kind: "tool", why: "Colle une erreur de noeud ou un JSON : il t'explique et propose la correction.", how: "Décris ton workflow et l'erreur rencontrée pour un diagnostic rapide." }
            ],
            quiz: [
              { q: "Qu'est-ce qu'un webhook ?", choices: ["Une URL qui déclenche ton workflow quand un service l'appelle", "Un type de virus", "Un noeud d'envoi d'email"], answer: 0, explanation: "Le webhook est la porte d'entrée : un service externe envoie des données, ton workflow démarre." },
              { q: "Pourquoi tester noeud par noeud ?", choices: ["Pour perdre du temps", "Pour isoler les erreurs : un workflow entier qui échoue ne dit pas où est le problème", "C'est obligatoire dans n8n"], answer: 1, explanation: "Chaque noeud validé isolément rend le debug de l'ensemble trivial." },
              { q: "Quel avantage n8n a-t-il sur les alternatives payantes ?", choices: ["Il est plus joli", "Il est open source et auto-hébergeable : pas de limite d'opérations imposée", "Il n'a aucun avantage"], answer: 1, explanation: "Auto-hébergé sur ton VPS, n8n exécute autant d'opérations que ta machine le permet." }
            ],
            micro_project: {
              title: "Ton premier workflow en production",
              brief: "Construis et active l'automatisation choisie à la leçon précédente (ou le formulaire-vers-tableau type).",
              steps: [
                "Crée le workflow : déclencheur + 2 actions minimum",
                "Teste chaque noeud individuellement",
                "Active le workflow et déclenche-le en conditions réelles",
                "Vérifie le résultat et note le temps gagné estimé"
              ],
              deliverable: "La description de ton workflow (noeuds, déclencheur), une preuve d'exécution réussie, et le temps que ça t'économise.",
              validation: "ai"
            },
            xp_reward: 60,
            duration_minutes: 55,
            sort_order: 20
          },
          {
            slug: "connecter-ses-outils",
            title: "Connecter ses outils entre eux",
            intro: "La vraie puissance arrive quand tes outils se parlent : un formulaire Tally alimente un Google Sheet, qui déclenche un email, qui notifie WhatsApp. Les APIs et les webhooks sont la colle entre les services.",
            why_important: "Un client ne paie pas pour « un workflow n8n » : il paie pour que SES outils (son CRM, ses formulaires, sa messagerie) travaillent ensemble sans lui. Savoir connecter n'importe quoi à n'importe quoi est LA compétence vendable de ce parcours.",
            how_to_use: "Choisis deux outils que tu utilises vraiment et connecte-les via n8n : Tally vers Google Sheets, un flux RSS vers un canal, un Sheet vers un email récapitulatif hebdomadaire. Quand un service n'a pas de noeud dédié, utilise le noeud HTTP Request avec sa documentation d'API.",
            objectives: [
              "Connecter deux services réels via n8n",
              "Utiliser le noeud HTTP Request avec une API documentée",
              "Structurer les données entre les noeuds (JSON)"
            ],
            resources: [
              { label: "Tally (formulaires)", url: "https://tally.so/", kind: "tool", why: "Formulaires gratuits avec webhooks natifs : la source de données idéale pour s'entraîner.", how: "Crée un formulaire test et branche son webhook sur ton workflow." },
              { label: "Google Sheets", url: "https://docs.google.com/spreadsheets/", kind: "tool", why: "La base de données du pauvre — et le format préféré des clients non techniques.", how: "Utilise le noeud Google Sheets de n8n pour écrire les soumissions." },
              { label: "Documentation n8n : HTTP Request", url: "https://docs.n8n.io/", kind: "doc", why: "Le noeud passe-partout qui connecte tout service ayant une API.", how: "Cherche « HTTP Request » et apprends à passer méthode, URL, en-têtes et corps." }
            ],
            quiz: [
              { q: "À quoi sert le noeud HTTP Request ?", choices: ["À naviguer sur le web", "À appeler n'importe quelle API, même sans noeud dédié dans n8n", "À héberger un site"], answer: 1, explanation: "Avec lui, tout service documenté devient connectable : c'est le couteau suisse." },
              { q: "Quel format de données circule entre les noeuds n8n ?", choices: ["Du texte brut uniquement", "Du JSON", "Des fichiers Word"], answer: 1, explanation: "Comprendre la structure JSON qui circule est la clé pour transformer les données entre services." },
              { q: "Pourquoi cette compétence est-elle vendable ?", choices: ["Elle ne l'est pas", "Les clients paient pour que LEURS outils travaillent ensemble sans eux", "Uniquement pour les grandes entreprises"], answer: 1, explanation: "Chaque heure de saisie manuelle supprimée chez un client a un prix — récurrent." }
            ],
            micro_project: {
              title: "Deux outils qui se parlent",
              brief: "Connecte deux services réels dans un workflow utile.",
              steps: [
                "Choisis deux outils que toi (ou un client type) utilisez vraiment",
                "Construis le workflow qui les relie dans n8n",
                "Utilise au moins une transformation de données (filtre, format)",
                "Exécute en réel et documente le résultat"
              ],
              deliverable: "La description du workflow (outils, noeuds, transformation) et la preuve d'une exécution réussie.",
              validation: "ai"
            },
            xp_reward: 60,
            duration_minutes: 50,
            sort_order: 30
          }
        ]
      },
      {
        slug: "construire-son-chatbot",
        title: "Construire son chatbot IA",
        summary: "Concevoir, nourrir de ses contenus et déployer un chatbot sur WhatsApp ou son site.",
        sort_order: 20,
        lessons: [
          {
            slug: "concevoir-son-chatbot",
            title: "Concevoir son chatbot avant de le construire",
            intro: "Un bon chatbot commence sur papier : quel est son rôle exact (répondre aux questions ? qualifier des prospects ? prendre des commandes ?), quel ton, quelles limites, et surtout quand passer la main à un humain.",
            why_important: "90 % des chatbots ratés ont un périmètre flou : ils promettent tout et déçoivent partout. Un chatbot cadré sur 5 missions claires avec une escalade humaine propre satisfait, convertit et se vend.",
            how_to_use: "Rédige la fiche de conception : mission principale, 5 questions types avec leurs réponses idéales, ton et personnalité (cohérents avec la marque), sujets interdits, et règle d'escalade (« si le client demande X ou s'énerve, transférer à un humain »). C'est ce document qui deviendra ton prompt système.",
            objectives: [
              "Définir mission, périmètre et limites du chatbot",
              "Écrire 5 scénarios de conversation types",
              "Prévoir l'escalade vers un humain"
            ],
            resources: [
              { label: "Botpress", url: "https://botpress.com/", kind: "tool", why: "Constructeur de chatbots IA avec un plan gratuit solide et un déploiement multi-canaux.", how: "Crée un compte et explore l'interface de construction avant la prochaine leçon." },
              { label: "Voiceflow", url: "https://www.voiceflow.com/", kind: "tool", why: "L'alternative orientée design de conversation : parfaite pour maquetter les dialogues.", how: "Compare son approche visuelle avec Botpress et choisis ton outil." },
              { label: "Claude (rédaction de la fiche)", url: "https://claude.ai/", kind: "tool", why: "Pour générer les questions types et stress-tester ton périmètre.", how: "Décris ton chatbot et demande les 10 questions que les utilisateurs poseront vraiment." }
            ],
            quiz: [
              { q: "Quelle est la première cause d'échec d'un chatbot ?", choices: ["La technologie", "Un périmètre flou qui promet tout et déçoit partout", "Le prix"], answer: 1, explanation: "Un chatbot cadré sur des missions précises avec des limites claires satisfait ; un chatbot fourre-tout frustre." },
              { q: "Que doit prévoir toute conception de chatbot ?", choices: ["Un logo animé", "L'escalade vers un humain quand le bot atteint ses limites", "Des réponses à absolument tout"], answer: 1, explanation: "L'escalade humaine est le filet de sécurité qui évite les conversations catastrophiques." },
              { q: "La fiche de conception devient ensuite...", choices: ["Un document oublié", "La base du prompt système du chatbot", "Le contrat de vente"], answer: 1, explanation: "Mission, ton, limites, escalade : tout ce travail se traduit directement en prompt système." }
            ],
            micro_project: {
              title: "La fiche de conception de ton chatbot",
              brief: "Conçois entièrement ton chatbot sur papier avant de le construire.",
              steps: [
                "Définis la mission principale et les 5 missions secondaires maximum",
                "Écris 5 scénarios de conversation (question, réponse idéale)",
                "Fixe le ton, les sujets interdits et la règle d'escalade humaine",
                "Fais stress-tester le périmètre par l'IA"
              ],
              deliverable: "Ta fiche complète : mission, scénarios, ton, limites, escalade — prête à devenir un prompt système.",
              validation: "ai"
            },
            xp_reward: 55,
            duration_minutes: 45,
            sort_order: 10
          },
          {
            slug: "chatbot-nourri-de-tes-contenus",
            title: "Un chatbot nourri de TES contenus",
            intro: "Un chatbot générique répond des généralités. Le tien doit répondre avec TES informations : ta FAQ, tes tarifs, tes procédures. On transforme la fiche de conception en prompt système et on branche une base de connaissances.",
            why_important: "C'est la différence entre un gadget et un employé virtuel : le chatbot qui connaît les horaires, les prix et les procédures de l'entreprise répond juste — et c'est pour ça qu'un client paie.",
            how_to_use: "Dans Botpress (ou l'outil choisi) : colle ton prompt système issu de la fiche, puis ajoute ta base de connaissances (documents, FAQ, pages du site). Teste avec tes 5 scénarios ET avec des questions pièges hors périmètre : le bot doit refuser proprement et escalader.",
            objectives: [
              "Transformer la fiche de conception en prompt système",
              "Brancher une base de connaissances (FAQ, documents)",
              "Tester les dérives et les questions hors périmètre"
            ],
            resources: [
              { label: "Documentation Botpress", url: "https://botpress.com/docs", kind: "doc", why: "Le guide officiel des bases de connaissances et des instructions.", how: "Suis la section sur les knowledge bases pour importer tes contenus." },
              { label: "Chatbase", url: "https://www.chatbase.co/", kind: "tool", why: "Alternative ultra-rapide : colle une URL, obtiens un chatbot sur tes contenus.", how: "Teste avec ton site pour comparer la qualité des réponses." },
              { label: "Claude (jeu de test)", url: "https://claude.ai/", kind: "tool", why: "Générer les questions pièges que tes utilisateurs finiront par poser.", how: "Demande 10 questions hors périmètre et vérifie que ton bot les gère avec élégance." }
            ],
            quiz: [
              { q: "Qu'est-ce qui différencie un chatbot utile d'un gadget ?", choices: ["Sa couleur", "Il répond avec les informations réelles de l'entreprise", "Il parle plusieurs langues"], answer: 1, explanation: "La valeur vient de la base de connaissances : horaires, tarifs, procédures — pas des généralités." },
              { q: "Que doit faire le bot face à une question hors périmètre ?", choices: ["Inventer une réponse plausible", "Refuser proprement et proposer l'escalade humaine", "Ignorer la question"], answer: 1, explanation: "Une invention polie est pire qu'un refus honnête : elle détruit la confiance (et parfois plus)." },
              { q: "Pourquoi tester avec des questions pièges ?", choices: ["Pour s'amuser", "Parce que les utilisateurs réels sortiront du script dès la première minute", "C'est inutile"], answer: 1, explanation: "Le comportement hors script EST le produit : c'est là que se joue la fiabilité perçue." }
            ],
            micro_project: {
              title: "Ton chatbot qui connaît son sujet",
              brief: "Construis le chatbot avec prompt système et base de connaissances, et fais-le passer au crash-test.",
              steps: [
                "Installe ton prompt système issu de la fiche de conception",
                "Importe ta base de connaissances (FAQ, documents, pages)",
                "Déroule tes 5 scénarios et vérifie les réponses",
                "Lance 5 questions pièges et corrige les dérives"
              ],
              deliverable: "Le lien ou les captures de ton chatbot, les résultats des 5 scénarios et des 5 pièges, et ce que tu as corrigé.",
              validation: "ai"
            },
            xp_reward: 65,
            duration_minutes: 60,
            sort_order: 20
          },
          {
            slug: "deployer-sur-whatsapp-et-site",
            title: "Déployer sur WhatsApp et sur ton site",
            intro: "Un chatbot n'existe que là où sont les clients. En Afrique francophone comme ailleurs, ça veut dire d'abord WhatsApp — puis le widget sur ton site. On branche les canaux et on passe en production.",
            why_important: "WhatsApp est le canal où tes clients écrivent déjà : un bot qui y répond en secondes, 24h/24, transforme des conversations en ventes. Le déploiement multi-canaux est aussi l'argument qui vend la prestation.",
            how_to_use: "Dans Botpress/Voiceflow, active le canal WhatsApp (via l'API WhatsApp Business de Meta — il faut un numéro dédié et un compte Meta Business) et le widget web (un script à coller sur le site). Commence par le widget web si la configuration WhatsApp Business prend du temps : il se déploie en 5 minutes.",
            objectives: [
              "Déployer le widget web sur une page réelle",
              "Comprendre le circuit WhatsApp Business API (numéro, Meta Business)",
              "Passer le chatbot en production avec un vrai trafic"
            ],
            resources: [
              { label: "WhatsApp Business", url: "https://business.whatsapp.com/", kind: "doc", why: "Le point d'entrée officiel pour comprendre l'API et la plateforme business.", how: "Lis les prérequis de l'API Cloud : numéro, compte Meta Business, vérification." },
              { label: "Meta for Developers", url: "https://developers.facebook.com/", kind: "doc", why: "La configuration technique de l'API WhatsApp Cloud passe par ici.", how: "Crée ton app Meta et suis le guide WhatsApp Cloud API." },
              { label: "Documentation Botpress (canaux)", url: "https://botpress.com/docs", kind: "doc", why: "Le branchement concret des canaux WhatsApp et webchat.", how: "Suis le guide d'intégration du canal choisi pas à pas." }
            ],
            quiz: [
              { q: "Pourquoi WhatsApp d'abord pour un marché africain francophone ?", choices: ["C'est le canal où les clients écrivent déjà au quotidien", "C'est le seul canal gratuit", "Par tradition"], answer: 0, explanation: "On déploie le bot là où la conversation existe déjà — pas là où c'est techniquement élégant." },
              { q: "Que faut-il pour brancher l'API WhatsApp Business ?", choices: ["Rien du tout", "Un numéro dédié et un compte Meta Business vérifié", "Un serveur surpuissant"], answer: 1, explanation: "L'API Cloud de Meta demande un numéro et un compte business : anticipe ces prérequis chez tes clients." },
              { q: "Quel canal se déploie le plus vite pour tester en réel ?", choices: ["Le widget web (un script à coller)", "WhatsApp", "Une application mobile native"], answer: 0, explanation: "Le widget web valide le bot en conditions réelles pendant que la config WhatsApp suit son cours." }
            ],
            micro_project: {
              title: "Ton chatbot en production",
              brief: "Mets ton chatbot en ligne sur au moins un canal réel.",
              steps: [
                "Déploie le widget web sur une page réelle (ton site, ton projet TakaCode)",
                "Prépare le circuit WhatsApp (numéro, Meta Business) ou branche-le si possible",
                "Fais tester par 3 personnes réelles et collecte leurs retours",
                "Corrige les 3 problèmes les plus fréquents"
              ],
              deliverable: "Le lien vers ton chatbot en ligne, les retours des 3 testeurs et tes corrections.",
              validation: "ai",
              requires_link: true
            },
            xp_reward: 70,
            duration_minutes: 60,
            sort_order: 30
          }
        ]
      },
      {
        slug: "fiabiliser-et-vendre",
        title: "Fiabiliser, héberger et vendre",
        summary: "Gestion d'erreurs, hébergement VPS et transformation de la compétence en revenu.",
        sort_order: 30,
        lessons: [
          {
            slug: "fiabiliser-ses-automatisations",
            title: "Fiabiliser ses automatisations",
            intro: "Une automatisation qui échoue en silence est pire que pas d'automatisation : tu crois que c'est fait, et rien n'est fait. Gestion d'erreurs, notifications d'échec et journaux d'exécution transforment ton bricolage en système de confiance.",
            why_important: "C'est LA différence entre l'amateur et le professionnel payé : le pro sait quand ça casse, est prévenu avant le client, et peut prouver ce qui a tourné. Sans ça, impossible de facturer de la maintenance.",
            how_to_use: "Dans n8n : ajoute un workflow d'erreur (Error Trigger) qui t'envoie une notification à chaque échec, avec le nom du workflow et le message. Consulte les journaux d'exécution pour diagnostiquer. Ajoute un test de bout en bout hebdomadaire (le workflow s'auto-vérifie et te confirme qu'il tourne).",
            objectives: [
              "Créer un workflow d'erreur avec notification",
              "Lire et exploiter les journaux d'exécution",
              "Mettre en place une auto-vérification périodique"
            ],
            resources: [
              { label: "Documentation n8n (gestion d'erreurs)", url: "https://docs.n8n.io/", kind: "doc", why: "Error Trigger, retries et journaux : tout y est.", how: "Cherche « error handling » et implémente l'Error Trigger global." },
              { label: "UptimeRobot", url: "https://uptimerobot.com/", kind: "tool", why: "Surveillance gratuite : sait si ton n8n auto-hébergé est vivant.", how: "Ajoute un moniteur sur l'URL de ton instance ou de ton webhook de santé." },
              { label: "Claude (post-mortem)", url: "https://claude.ai/", kind: "tool", why: "Analyser un échec et durcir le workflow.", how: "Colle le message d'erreur et le contexte, demande les protections à ajouter." }
            ],
            quiz: [
              { q: "Quel est le pire mode d'échec d'une automatisation ?", choices: ["Un échec bruyant avec notification", "Un échec silencieux : tu crois que c'est fait, rien n'est fait", "Un échec pendant les tests"], answer: 1, explanation: "L'échec silencieux détruit la confiance — la tienne et celle du client." },
              { q: "Que fait un workflow d'erreur (Error Trigger) ?", choices: ["Il empêche toute erreur", "Il se déclenche à chaque échec pour te notifier avec le contexte", "Il supprime les journaux"], answer: 1, explanation: "Être prévenu avant le client, avec le contexte : c'est le minimum professionnel." },
              { q: "Pourquoi la fiabilité permet-elle de facturer de la maintenance ?", choices: ["Elle ne le permet pas", "Parce que tu peux garantir la surveillance et prouver ce qui a tourné", "Parce que c'est plus cher à construire"], answer: 1, explanation: "La maintenance se vend sur une promesse tenable : « je sais quand ça casse et je répare »." }
            ],
            micro_project: {
              title: "Ton système ne meurt plus en silence",
              brief: "Ajoute la couche de fiabilité à tes workflows existants.",
              steps: [
                "Crée le workflow d'erreur global avec notification",
                "Provoque volontairement un échec et vérifie la notification",
                "Ajoute une auto-vérification périodique",
                "Documente la procédure de diagnostic en 5 lignes"
              ],
              deliverable: "La preuve de la notification d'échec (capture), ton auto-vérification et ta procédure de diagnostic.",
              validation: "ai"
            },
            xp_reward: 60,
            duration_minutes: 50,
            sort_order: 10
          },
          {
            slug: "heberger-sur-un-vps",
            title: "Héberger ses automatisations sur un VPS",
            intro: "Le cloud gratuit a des limites (exécutions, durée, données). Un VPS à quelques euros par mois fait tourner ton n8n, tes bots et tes scripts 24h/24, sans plafond et sous ton contrôle total.",
            why_important: "L'auto-hébergement change ton économie : coût fixe minuscule, capacité illimitée, données chez toi — et un argument de vente (« vos données restent sur votre serveur »). C'est aussi la compétence qui débloque les bots de trading et tout ce qui doit tourner en continu.",
            how_to_use: "Loue un VPS (Hostinger propose des VPS avec n8n préinstallé en un clic — le lien d'affiliation TakaCode est sur la page Outils du dashboard). Connecte-toi en SSH, déploie n8n via Docker (ou l'image préconfigurée), sécurise (pare-feu, HTTPS, mot de passe fort) et migre tes workflows.",
            objectives: [
              "Comprendre VPS, SSH et Docker en pratique",
              "Déployer n8n auto-hébergé et sécurisé",
              "Chiffrer le coût mensuel réel de son infrastructure"
            ],
            resources: [
              { label: "Hostinger VPS", url: "https://www.hostinger.com/vps", kind: "tool", why: "VPS abordables avec modèles préconfigurés (dont n8n) — pense au lien d'affiliation TakaCode sur la page Outils.", how: "Compare les plans : pour démarrer, le plus petit VPS suffit largement à n8n." },
              { label: "Documentation n8n (auto-hébergement)", url: "https://docs.n8n.io/hosting/", kind: "doc", why: "Le guide officiel du self-hosting : Docker, mises à jour, sécurité.", how: "Suis le guide Docker et la checklist de sécurité." },
              { label: "Docker", url: "https://www.docker.com/", kind: "doc", why: "Le standard de déploiement : une commande, un conteneur qui tourne.", how: "Comprends juste image, conteneur, volume — le reste viendra à l'usage." }
            ],
            quiz: [
              { q: "Pourquoi passer du cloud gratuit à un VPS ?", choices: ["Pour le plaisir de la ligne de commande", "Plafonds levés, coût fixe minuscule, contrôle total des données", "C'est obligatoire"], answer: 1, explanation: "Le VPS transforme des limites d'abonnement en capacité fixe quasi gratuite." },
              { q: "Que permet Docker dans ce contexte ?", choices: ["De dessiner des maquettes", "De déployer n8n en une commande, isolé et facile à mettre à jour", "De remplacer le VPS"], answer: 1, explanation: "Le conteneur emballe l'application et ses dépendances : déploiement et mises à jour deviennent triviaux." },
              { q: "Quel est le minimum de sécurisation d'un VPS ?", choices: ["Aucun, personne ne le trouvera", "Pare-feu, HTTPS et mots de passe forts (ou clés SSH)", "Un antivirus Windows"], answer: 1, explanation: "Un serveur exposé sans ces bases se fait scanner et attaquer en quelques heures." }
            ],
            micro_project: {
              title: "Ton infrastructure d'automatisation",
              brief: "Déploie (ou planifie précisément) ton n8n auto-hébergé.",
              steps: [
                "Choisis ton VPS et chiffre le coût mensuel total",
                "Déploie n8n (Docker ou modèle préconfiguré) et sécurise",
                "Migre au moins un workflow du cloud vers ton instance",
                "Branche la surveillance UptimeRobot"
              ],
              deliverable: "Ton plan chiffré + la preuve du déploiement (URL de l'instance ou captures) et le workflow migré. Si le déploiement attend, le plan détaillé suffit.",
              validation: "ai"
            },
            xp_reward: 70,
            duration_minutes: 60,
            sort_order: 20
          },
          {
            slug: "vendre-ses-automatisations",
            title: "Vendre ses automatisations comme service",
            intro: "Tu sais maintenant cartographier, construire, fiabiliser et héberger. La dernière brique : l'offre. Une automatisation se vend en trois temps — l'audit (payant ou offert), la mise en place (forfait), la maintenance (récurrent).",
            why_important: "Le récurrent est la clé : une automatisation maintenue à 30-100 euros par mois par client, multipliée par quelques clients, devient un revenu stable. Et chaque chatbot déployé est une démo vivante pour le suivant.",
            how_to_use: "Construis ton offre en t'appuyant sur ce que tu as VRAIMENT construit dans ce parcours : ta démo est ton chatbot en production. Structure : audit express offert (la carte des automatisations de la leçon 1, appliquée au client), forfait de mise en place, mensualité de maintenance (surveillance + évolutions). Vends la transformation (« plus aucune relance manuelle »), pas la technologie. Le parcours Produits digitaux détaille pages de vente et tarification.",
            objectives: [
              "Structurer l'offre audit / mise en place / maintenance",
              "Utiliser ses réalisations du parcours comme démos",
              "Fixer des prix fondés sur le temps client économisé"
            ],
            resources: [
              { label: "Parcours Produits digitaux (TakaCode)", url: "https://takacode.vercel.app/parcours/produits-digitaux", kind: "doc", why: "Pages de vente, prix, lancement : tout le module boutique s'applique à ton service.", how: "Suis au minimum le module « Construire sa boutique » pour ton offre de service." },
              { label: "Loom (démos)", url: "https://www.loom.com/", kind: "tool", why: "Une démo vidéo de 3 minutes de ton chatbot vaut mille arguments.", how: "Filme ton chatbot en action : question client, réponse, escalade." },
              { label: "systeme.io", url: "https://systeme.io/", kind: "tool", why: "Page de vente + prise de rendez-vous + encaissement, plan gratuit.", how: "Monte la page de ton offre de service avec un bouton de prise de contact." }
            ],
            quiz: [
              { q: "Quelle est la structure d'offre recommandée ?", choices: ["Un prix unique à vie", "Audit, mise en place (forfait), maintenance (récurrent)", "Gratuit en espérant un pourboire"], answer: 1, explanation: "L'audit ouvre la porte, le forfait paie la construction, le récurrent construit ton revenu stable." },
              { q: "Pourquoi la maintenance récurrente est-elle la clé ?", choices: ["Elle ne l'est pas", "Quelques clients à 30-100 euros par mois créent un revenu prévisible", "Parce qu'elle est gratuite à fournir"], answer: 1, explanation: "Le forfait est un pic ; le récurrent est une base — et ta couche de fiabilité le rend tenable." },
              { q: "Que vend-on à un client non technique ?", choices: ["La stack technique (n8n, Docker, VPS)", "La transformation : le temps retrouvé et les erreurs disparues", "Des mots compliqués"], answer: 1, explanation: "« Plus aucune relance manuelle » parle ; « workflow auto-hébergé conteneurisé » fait fuir." }
            ],
            micro_project: {
              title: "Ton offre de service en ligne",
              brief: "Construis et publie ton offre d'automatisation avec ta démo.",
              steps: [
                "Structure ton offre : audit, forfait, maintenance (avec les prix)",
                "Enregistre la démo vidéo de ton chatbot ou workflow",
                "Publie la page de ton offre (systeme.io, Ko-fi ou ton site)",
                "Mets à jour ton projet TakaCode (modèle de revenu freelance ou abonnement)"
              ],
              deliverable: "Le lien de ta page d'offre avec les prix, la démo, et ta première cible de prospection.",
              validation: "ai",
              requires_link: true
            },
            xp_reward: 70,
            duration_minutes: 55,
            sort_order: 30
          }
        ]
      }
    ]
  },
  // =========================================================================
  // WEB3 : SMART CONTRACTS
  // =========================================================================
  {
    track: {
      slug: "web3-blockchain",
      goal_key: "web3",
      title: "Web3 : créer et déployer un smart contract",
      summary: "Du wallet au smart contract vérifié sur testnet : Solidity, Remix, Hardhat, OpenZeppelin — et les compétences web3 qui se vendent.",
      description: "Tu pars de zéro : blockchain, wallets et testnets d'abord (sans risquer un centime), puis tu écris tes premiers smart contracts en Solidity dans Remix, tu adoptes les standards OpenZeppelin et les réflexes de sécurité, tu testes avec Hardhat, et tu déploies un contrat vérifié sur le testnet Sepolia. Le parcours se termine côté valeur : construire un frontend de dApp et transformer ces compétences rares en revenus — en évitant les pièges et arnaques de l'écosystème.",
      level_label: "Avancé",
      duration_weeks: 5,
      accent_color: "#38BDF8",
      icon: "lucide:wallet",
      objective: "Déployer un smart contract vérifié sur testnet et savoir le montrer.",
      resources: ["Remix", "Hardhat", "OpenZeppelin", "Etherscan"],
      next_session: "Vendredi 19h00",
      next_steps: [
        { label: "Comprendre le web3", state: "current" },
        { label: "Écrire son smart contract", state: "locked" },
        { label: "Déployer et valoriser", state: "locked" }
      ],
      sort_order: 8,
      is_published: true,
      is_active: true
    },
    modules: [
      {
        slug: "comprendre-le-web3",
        title: "Comprendre le web3 sans se ruiner",
        summary: "Blockchain, wallets, testnets : manipuler en vrai, sans argent réel.",
        sort_order: 10,
        lessons: [
          {
            slug: "blockchain-et-wallets",
            title: "Blockchain, wallets et sécurité de base",
            intro: "Une blockchain est un registre public que personne ne peut réécrire ; un wallet est ta paire de clés pour y agir. Tout le web3 tient dans ces deux idées — et dans une règle de survie : ta phrase de récupération ne se partage JAMAIS.",
            why_important: "L'écosystème web3 pardonne peu : une phrase de récupération divulguée, ce sont des fonds définitivement perdus. Comprendre clés, transactions et gas AVANT de manipuler t'évite les erreurs qui coûtent — et les testnets permettent d'apprendre sans risque.",
            how_to_use: "Installe MetaMask, note ta phrase de récupération HORS LIGNE (papier, jamais en photo ni dans un fichier), ajoute le réseau de test Sepolia, récupère des ETH de test via un faucet et fais ta première transaction. Observe : hash, gas, confirmations.",
            objectives: [
              "Créer un wallet et sécuriser sa phrase de récupération",
              "Comprendre transaction, gas et confirmations",
              "Faire sa première transaction sur le testnet Sepolia"
            ],
            resources: [
              { label: "Qu'est-ce qu'Ethereum ? (ethereum.org)", url: "https://ethereum.org/fr/what-is-ethereum/", kind: "doc", why: "L'explication officielle, en français, sans jargon inutile.", how: "Lis cette page puis la section wallets du même site." },
              { label: "MetaMask", url: "https://metamask.io/", kind: "tool", why: "Le wallet de référence pour développer et tester.", how: "Installe l'extension, crée ton wallet, sécurise la phrase HORS LIGNE." },
              { label: "Faucets et testnets (ethereum.org)", url: "https://ethereum.org/fr/developers/", kind: "doc", why: "Le portail développeur liste les faucets Sepolia actifs pour obtenir des ETH de test.", how: "Trouve un faucet Sepolia, réclame des ETH de test et envoie ta première transaction." }
            ],
            quiz: [
              { q: "Que ne faut-il JAMAIS faire avec sa phrase de récupération ?", choices: ["L'écrire sur papier hors ligne", "La partager, la photographier ou la stocker en ligne", "La mémoriser"], answer: 1, explanation: "Quiconque a la phrase a les fonds, définitivement. Aucun support « officiel » ne la demande jamais." },
              { q: "À quoi sert un testnet comme Sepolia ?", choices: ["À miner de la vraie crypto", "À apprendre et tester avec des jetons sans valeur réelle", "À contourner les impôts"], answer: 1, explanation: "Tout ce parcours se fait sur testnet : mêmes outils, même code, zéro risque financier." },
              { q: "Qu'est-ce que le gas ?", choices: ["Le carburant des voitures", "Le coût d'exécution d'une transaction sur le réseau", "Un jeton gratuit"], answer: 1, explanation: "Chaque opération a un coût de calcul payé en gas : c'est l'anti-spam économique du réseau." }
            ],
            micro_project: {
              title: "Ton wallet opérationnel sur testnet",
              brief: "Crée ton environnement web3 sécurisé et fais ta première transaction de test.",
              steps: [
                "Installe MetaMask et sécurise ta phrase hors ligne",
                "Ajoute le réseau Sepolia et obtiens des ETH de test via un faucet",
                "Envoie une transaction de test et retrouve-la sur l'explorateur",
                "Explique le hash, le gas payé et les confirmations observées"
              ],
              deliverable: "Le hash de ta transaction Sepolia, ton explication du gas payé, et ta règle personnelle de sécurité du wallet.",
              validation: "ai"
            },
            xp_reward: 55,
            duration_minutes: 45,
            sort_order: 10
          },
          {
            slug: "explorer-la-blockchain",
            title: "Explorer la blockchain comme un pro",
            intro: "Tout est public : chaque transaction, chaque contrat, chaque token. Etherscan est ton microscope — savoir lire un explorateur, c'est savoir vérifier par soi-même au lieu de croire sur parole.",
            why_important: "« Don't trust, verify » est LE réflexe web3 : vérifier un contrat avant d'interagir, lire les transferts d'un token, repérer un contrat non vérifié (drapeau rouge). C'est aussi ta première protection contre les arnaques.",
            how_to_use: "Sur Etherscan (et sa version Sepolia) : analyse ta propre transaction de la leçon 1 champ par champ, puis explore un contrat vérifié connu — lis son code source, ses transactions, ses événements. Compare avec un contrat non vérifié : voilà ce qu'on ne touche pas.",
            objectives: [
              "Lire une transaction complète sur Etherscan",
              "Distinguer contrat vérifié et non vérifié",
              "Explorer le code source et les événements d'un contrat"
            ],
            resources: [
              { label: "Etherscan", url: "https://etherscan.io/", kind: "tool", why: "L'explorateur de référence : tout ce qui se passe sur Ethereum s'y lit.", how: "Explore un token connu : transactions, détenteurs, code du contrat." },
              { label: "Etherscan Sepolia", url: "https://sepolia.etherscan.io/", kind: "tool", why: "La même chose pour ton testnet : c'est là que tu vérifieras TES contrats.", how: "Retrouve ta transaction de la leçon précédente et décortique chaque champ." },
              { label: "ethereum.org (comprendre les transactions)", url: "https://ethereum.org/fr/developers/docs/transactions/", kind: "doc", why: "La documentation officielle des champs d'une transaction.", how: "Lis en parallèle de ton exploration pour nommer ce que tu vois." }
            ],
            quiz: [
              { q: "Que signifie « Don't trust, verify » ?", choices: ["Ne jamais rien utiliser", "Vérifier soi-même sur la chaîne au lieu de croire sur parole", "Faire confiance aux influenceurs"], answer: 1, explanation: "Tout étant public, la vérification directe remplace la confiance aveugle — c'est la culture web3." },
              { q: "Un contrat NON vérifié sur Etherscan, c'est...", choices: ["Normal et sans importance", "Un drapeau rouge : on ne peut pas lire ce que fait son code", "Un contrat gratuit"], answer: 1, explanation: "Sans code source vérifié, impossible de savoir ce que le contrat fait vraiment de tes fonds." },
              { q: "Que trouve-t-on sur la page d'un contrat vérifié ?", choices: ["Uniquement son solde", "Code source, transactions, événements, lecture/écriture des fonctions", "Rien de public"], answer: 1, explanation: "La page contrat est une radiographie complète : code lisible et interactions possibles." }
            ],
            micro_project: {
              title: "Autopsie d'un contrat",
              brief: "Choisis un contrat vérifié connu et fais-en la radiographie complète.",
              steps: [
                "Choisis un token ou contrat connu sur Etherscan",
                "Analyse : code vérifié ? transactions récentes ? événements ?",
                "Note 3 choses que tu comprends et 3 que tu ne comprends pas encore",
                "Compare avec un contrat non vérifié et explique le risque"
              ],
              deliverable: "Ton analyse du contrat (adresse, observations, les 3 compris / 3 à creuser) et ta comparaison vérifié vs non vérifié.",
              validation: "ai"
            },
            xp_reward: 55,
            duration_minutes: 45,
            sort_order: 20
          },
          {
            slug: "lire-du-solidity",
            title: "Lire du Solidity avant d'en écrire",
            intro: "Un smart contract est un programme qui vit sur la blockchain : son code est sa loi, sans bouton annuler. Avant d'écrire, on apprend à LIRE : variables d'état, fonctions, modificateurs, événements.",
            why_important: "En web3, déployer du code qu'on ne comprend pas coûte de l'argent réel (le tien ou celui des utilisateurs). Lire du Solidity te donne aussi accès à l'immense bibliothèque de contrats existants : on compose, on ne réinvente pas.",
            how_to_use: "Sur Solidity by Example : lis les exemples fondamentaux (variables, fonctions, mapping, events) en les annotant. Puis ouvre un contrat simple vérifié sur Etherscan et traduis-le en français, ligne par ligne, avec l'aide de l'IA quand tu bloques — en lui demandant d'expliquer, pas de résumer.",
            objectives: [
              "Identifier variables d'état, fonctions et événements",
              "Comprendre mapping, require et modificateurs",
              "Traduire un contrat simple en langage naturel"
            ],
            resources: [
              { label: "Solidity by Example", url: "https://solidity-by-example.org/", kind: "doc", why: "Des exemples minimalistes et progressifs : la meilleure porte d'entrée en lecture.", how: "Lis les 8 premiers exemples en annotant chaque ligne nouvelle." },
              { label: "Documentation Solidity", url: "https://docs.soliditylang.org/", kind: "doc", why: "La référence officielle du langage, pour vérifier ce que tu crois comprendre.", how: "Utilise-la en dictionnaire quand un mot-clé résiste." },
              { label: "Claude (traducteur de contrats)", url: "https://claude.ai/", kind: "tool", why: "Excellent professeur de lecture : demande l'explication ligne par ligne.", how: "Colle un contrat court et demande « explique chaque ligne à un débutant »." }
            ],
            quiz: [
              { q: "Pourquoi lire du Solidity avant d'en écrire ?", choices: ["C'est une tradition", "Parce que déployer du code incompris coûte de l'argent réel et qu'on compose avec l'existant", "Pour perdre du temps"], answer: 1, explanation: "Le code déployé est immuable et manipule de la valeur : la lecture précède l'écriture." },
              { q: "À quoi sert `require` dans un contrat ?", choices: ["À importer une bibliothèque", "À vérifier une condition et annuler la transaction si elle échoue", "À payer le gas"], answer: 1, explanation: "`require` est le garde-fou : condition fausse, transaction annulée, état intact." },
              { q: "Qu'est-ce qu'un événement (event) ?", choices: ["Une fête de la communauté", "Un journal émis par le contrat, lisible de l'extérieur", "Une erreur"], answer: 1, explanation: "Les événements sont la façon dont un contrat raconte ce qu'il fait aux applications qui l'écoutent." }
            ],
            micro_project: {
              title: "Un contrat traduit en français",
              brief: "Choisis un contrat simple et traduis-le intégralement en langage naturel.",
              steps: [
                "Choisis un contrat court (Solidity by Example ou un contrat vérifié simple)",
                "Traduis chaque ligne en français dans un document",
                "Marque les lignes où l'IA t'a aidé et reformule-les avec tes mots",
                "Explique en 3 phrases ce que fait le contrat globalement"
              ],
              deliverable: "Ta traduction annotée complète et ton résumé en 3 phrases.",
              validation: "ai"
            },
            xp_reward: 60,
            duration_minutes: 50,
            sort_order: 30
          }
        ]
      },
      {
        slug: "ecrire-son-smart-contract",
        title: "Écrire son smart contract",
        summary: "Remix, standards OpenZeppelin, sécurité et tests Hardhat.",
        sort_order: 20,
        lessons: [
          {
            slug: "premiers-contrats-dans-remix",
            title: "Tes premiers contrats dans Remix",
            intro: "Remix est l'atelier du débutant Solidity : un IDE dans le navigateur qui compile, déploie sur une blockchain simulée et te laisse appeler tes fonctions en un clic. Aujourd'hui tu écris et déploies tes deux premiers contrats.",
            why_important: "Écrire un contrat qui compile, se déploie et répond change ta relation au web3 : tu passes de spectateur à bâtisseur. Remix élimine toute la configuration : ton énergie va à la logique.",
            how_to_use: "Dans Remix : écris un contrat compteur (une variable, une fonction increment, une fonction de lecture), compile, déploie dans l'environnement simulé et teste. Puis un registre de messages (mapping adresse vers texte, événement à chaque écriture). Utilise l'IA pour comprendre chaque erreur de compilation, pas pour écrire à ta place.",
            objectives: [
              "Compiler et déployer dans l'environnement simulé de Remix",
              "Manipuler variables d'état, fonctions et événements",
              "Diagnostiquer les erreurs de compilation"
            ],
            resources: [
              { label: "Remix IDE", url: "https://remix.ethereum.org/", kind: "tool", why: "Zéro installation : tout le cycle écrire-compiler-déployer-tester dans le navigateur.", how: "Crée un fichier .sol, colle ton premier contrat, compile et déploie en JS VM." },
              { label: "Solidity by Example", url: "https://solidity-by-example.org/", kind: "doc", why: "Les modèles minimalistes à adapter pour tes premiers contrats.", how: "Pars de l'exemple compteur et modifie-le au lieu de partir de zéro." },
              { label: "Claude (professeur d'erreurs)", url: "https://claude.ai/", kind: "tool", why: "Chaque erreur de compilation est une leçon si on se la fait expliquer.", how: "Colle l'erreur ET ton code, demande l'explication avant la correction." }
            ],
            quiz: [
              { q: "Quel est l'avantage de l'environnement simulé (JS VM) de Remix ?", choices: ["Il paie du vrai gas", "Déploiements et tests instantanés, sans réseau ni fonds", "Il est plus lent"], answer: 1, explanation: "La blockchain simulée donne le cycle complet en local : idéal pour itérer vite." },
              { q: "Que se passe-t-il quand une transaction viole un `require` ?", choices: ["Le contrat est supprimé", "La transaction est annulée et l'état reste intact", "Le wallet est bloqué"], answer: 1, explanation: "C'est le comportement vu en lecture — maintenant tu l'observes sur TON contrat." },
              { q: "Quel est le bon usage de l'IA en écrivant ses premiers contrats ?", choices: ["Générer tout le contrat sans le lire", "Se faire expliquer chaque erreur et chaque concept rencontré", "L'ignorer complètement"], answer: 1, explanation: "L'objectif est d'apprendre Solidity : l'IA est ton professeur particulier, pas ton remplaçant." }
            ],
            micro_project: {
              title: "Deux contrats qui répondent",
              brief: "Écris, déploie et teste tes deux premiers contrats dans Remix.",
              steps: [
                "Écris et déploie le contrat compteur, teste ses fonctions",
                "Écris le registre de messages (mapping + événement)",
                "Provoque une erreur volontaire et explique-la",
                "Colle ton code et tes observations"
              ],
              deliverable: "Le code de tes deux contrats, la preuve de leurs appels réussis et l'explication de l'erreur provoquée.",
              validation: "ai"
            },
            xp_reward: 65,
            duration_minutes: 60,
            sort_order: 10
          },
          {
            slug: "standards-et-securite",
            title: "Standards OpenZeppelin et réflexes de sécurité",
            intro: "En web3, on ne réinvente jamais un token : les standards (ERC-20 pour les jetons, ERC-721 pour les NFT) et les bibliothèques auditées d'OpenZeppelin existent pour ça. La créativité va dans ta logique métier, pas dans la roue.",
            why_important: "L'histoire du web3 est jalonnée de contrats maison piratés pour des millions : reentrancy, débordements, contrôle d'accès oublié. Utiliser OpenZeppelin, c'est hériter d'années d'audits — et connaître les failles classiques te sert même en lecture.",
            how_to_use: "Dans Remix : importe OpenZeppelin et crée ton token ERC-20 en héritant du standard (quelques lignes). Ajoute Ownable pour le contrôle d'accès. Puis étudie les 3 failles classiques (reentrancy, contrôle d'accès manquant, dépendance à l'ordre des transactions) sur Solidity by Example — comprendre l'attaque immunise le bâtisseur.",
            objectives: [
              "Créer un token ERC-20 avec OpenZeppelin",
              "Appliquer le contrôle d'accès (Ownable)",
              "Reconnaître les 3 failles classiques des contrats"
            ],
            resources: [
              { label: "OpenZeppelin Contracts", url: "https://docs.openzeppelin.com/contracts/", kind: "doc", why: "LA bibliothèque de contrats audités : ERC-20, ERC-721, accès, sécurité.", how: "Utilise le Contracts Wizard pour générer ton ERC-20 et lis chaque ligne produite." },
              { label: "Solidity by Example (sécurité)", url: "https://solidity-by-example.org/", kind: "doc", why: "Les attaques classiques expliquées avec code vulnérable et code corrigé.", how: "Étudie les exemples de la section hacks : comprendre l'attaque, puis la parade." },
              { label: "ethereum.org (standards de tokens)", url: "https://ethereum.org/fr/developers/docs/standards/tokens/", kind: "doc", why: "Comprendre pourquoi les standards existent et ce qu'ils garantissent.", how: "Lis les pages ERC-20 et ERC-721 avant de créer ton token." }
            ],
            quiz: [
              { q: "Pourquoi utiliser OpenZeppelin plutôt que son propre code de token ?", choices: ["C'est plus cher", "Des années d'audits héritées en une ligne d'import", "C'est obligatoire légalement"], answer: 1, explanation: "Le code maison non audité est la première cause de piratage : on compose avec l'éprouvé." },
              { q: "Que garantit le standard ERC-20 ?", choices: ["Que le token prendra de la valeur", "Une interface commune que tous les wallets et plateformes savent manipuler", "L'absence totale de bug"], answer: 1, explanation: "Le standard rend ton token compatible avec tout l'écosystème existant." },
              { q: "Qu'est-ce qu'une attaque par reentrancy ?", choices: ["Un mot de passe volé", "Un contrat rappelé avant la fin de sa fonction pour vider des fonds", "Un bug d'affichage"], answer: 1, explanation: "L'attaque emblématique du web3 : d'où les gardes et l'ordre vérifier-modifier-interagir." }
            ],
            micro_project: {
              title: "Ton token ERC-20 sécurisé",
              brief: "Crée ton token avec OpenZeppelin et montre que tu comprends ce que tu déploies.",
              steps: [
                "Génère ton ERC-20 avec le Contracts Wizard (nom, symbole, offre)",
                "Ajoute Ownable et une fonction réservée au propriétaire",
                "Déploie dans Remix et teste transfert + fonction protégée",
                "Explique une faille classique et comment ton contrat y échappe"
              ],
              deliverable: "Le code de ton token, la preuve des tests dans Remix, et ton explication de la faille évitée.",
              validation: "ai"
            },
            xp_reward: 70,
            duration_minutes: 60,
            sort_order: 20
          },
          {
            slug: "tester-avec-hardhat",
            title: "Tester ses contrats avec Hardhat",
            intro: "Remix suffit pour apprendre ; un vrai projet exige des tests automatisés. Hardhat installe un environnement professionnel : projet local, compilation, tests en JavaScript qui prouvent que ton contrat fait ce qu'il promet.",
            why_important: "Un contrat déployé est immuable : le bug part en production pour toujours. Les tests sont ton unique filet — et le réflexe qui distingue le bâtisseur crédible du bricoleur, notamment aux yeux des clients et employeurs web3.",
            how_to_use: "Installe Node.js puis crée un projet Hardhat (npx hardhat init). Importe ton token de la leçon précédente, écris 3 tests : le déploiement donne la bonne offre initiale, un transfert fonctionne, la fonction protégée rejette un non-propriétaire. Lance npx hardhat test et itère jusqu'au vert.",
            objectives: [
              "Initialiser un projet Hardhat",
              "Écrire 3 tests significatifs pour son contrat",
              "Comprendre le cycle rouge-vert des tests"
            ],
            resources: [
              { label: "Hardhat", url: "https://hardhat.org/", kind: "doc", why: "L'environnement de développement Ethereum le plus utilisé : tout le cycle pro.", how: "Suis le tutoriel officiel de la création de projet aux premiers tests." },
              { label: "Ethers.js", url: "https://docs.ethers.org/", kind: "doc", why: "La bibliothèque JavaScript qui parle aux contrats — dans les tests et plus tard dans la dApp.", how: "Repère les patterns de base : déployer, appeler, attendre une transaction." },
              { label: "Claude (co-écriture de tests)", url: "https://claude.ai/", kind: "tool", why: "Il propose des cas de test auxquels tu ne penses pas.", how: "Colle ton contrat et demande la liste des comportements à tester, puis écris-les." }
            ],
            quiz: [
              { q: "Pourquoi les tests sont-ils critiques en web3 ?", choices: ["Pour la beauté du code", "Parce qu'un contrat déployé est immuable : le bug est éternel", "Ils ne le sont pas"], answer: 1, explanation: "Pas de patch discret possible : ce qui est déployé est gravé. On teste AVANT." },
              { q: "Que doit vérifier un bon test de fonction protégée ?", choices: ["Qu'elle marche pour le propriétaire ET qu'elle rejette les autres", "Uniquement le cas qui marche", "La couleur du bouton"], answer: 0, explanation: "Le cas de rejet est le plus important : c'est lui qui protège les fonds." },
              { q: "Quel est le cycle de travail avec les tests ?", choices: ["Déployer d'abord, tester ensuite", "Écrire le test, le voir échouer, corriger jusqu'au vert", "Ne jamais lancer les tests"], answer: 1, explanation: "Rouge puis vert : chaque test qui passe est une promesse vérifiée de ton contrat." }
            ],
            micro_project: {
              title: "Ton contrat sous surveillance",
              brief: "Monte le projet Hardhat de ton token et prouve son comportement par les tests.",
              steps: [
                "Initialise le projet Hardhat et importe ton token",
                "Écris les 3 tests (offre initiale, transfert, rejet non-propriétaire)",
                "Lance les tests et itère jusqu'au vert complet",
                "Ajoute un 4e test proposé par l'IA que tu juges pertinent"
              ],
              deliverable: "Ton code de tests, la sortie de npx hardhat test au vert, et pourquoi tu as retenu le 4e test.",
              validation: "ai"
            },
            xp_reward: 70,
            duration_minutes: 65,
            sort_order: 30
          }
        ]
      },
      {
        slug: "deployer-et-valoriser",
        title: "Déployer et valoriser",
        summary: "Déploiement testnet vérifié, frontend de dApp et monétisation prudente.",
        sort_order: 30,
        lessons: [
          {
            slug: "deployer-sur-testnet",
            title: "Déployer et vérifier sur Sepolia",
            intro: "Le grand jour : ton contrat quitte la simulation pour une vraie blockchain publique (de test). Déploiement via Hardhat, clé privée protégée dans un fichier d'environnement, et vérification du code source sur Etherscan — la carte de visite du bâtisseur web3.",
            why_important: "Un contrat déployé ET vérifié sur un réseau public est une preuve de compétence consultable par n'importe qui : recruteur, client, communauté. Et la discipline de la clé privée (jamais dans le code, jamais commitée) est LE réflexe de survie du développeur web3.",
            how_to_use: "Crée un compte RPC gratuit (Alchemy), configure Hardhat pour Sepolia avec ta clé privée dans un fichier .env (jamais dans le code, .env dans le .gitignore), déploie avec un script, puis vérifie le contrat sur Etherscan Sepolia pour rendre son code public et lisible.",
            objectives: [
              "Configurer un RPC et protéger sa clé privée (.env)",
              "Déployer sur Sepolia via un script Hardhat",
              "Vérifier le code source sur Etherscan"
            ],
            resources: [
              { label: "Alchemy", url: "https://www.alchemy.com/", kind: "tool", why: "RPC gratuit et fiable vers Sepolia : le pont entre ton code et le réseau.", how: "Crée une app Sepolia et récupère l'URL RPC pour la config Hardhat." },
              { label: "Hardhat (déploiement)", url: "https://hardhat.org/", kind: "doc", why: "Les guides officiels de déploiement et de vérification.", how: "Suis la section deploying puis verifying pour Etherscan." },
              { label: "Etherscan Sepolia", url: "https://sepolia.etherscan.io/", kind: "tool", why: "C'est ici que ton contrat vérifié devient publiquement lisible.", how: "Après vérification, teste la lecture et l'écriture directement depuis l'onglet contrat." }
            ],
            quiz: [
              { q: "Où va la clé privée du déployeur ?", choices: ["Dans le code source, c'est pratique", "Dans un fichier .env exclu du dépôt git", "Dans un message WhatsApp"], answer: 1, explanation: "Une clé commitée est une clé volée : .env + .gitignore, toujours." },
              { q: "Que change la vérification du contrat sur Etherscan ?", choices: ["Rien", "Le code source devient public et lisible : confiance et carte de visite", "Le contrat devient gratuit"], answer: 1, explanation: "Vérifié = lisible = digne de confiance. C'est aussi ta preuve de compétence publique." },
              { q: "Pourquoi passer par un RPC comme Alchemy ?", choices: ["Pour payer plus", "C'est la connexion fiable entre ton script et le réseau", "Pour miner"], answer: 1, explanation: "Le RPC transmet tes transactions au réseau : un fournisseur fiable évite les déploiements ratés." }
            ],
            micro_project: {
              title: "Ton contrat public et vérifié",
              brief: "Déploie ton token sur Sepolia et vérifie-le : ta première réalisation web3 publique.",
              steps: [
                "Configure Hardhat pour Sepolia (RPC Alchemy, clé en .env)",
                "Déploie via ton script et note l'adresse du contrat",
                "Vérifie le code source sur Etherscan Sepolia",
                "Interagis avec le contrat depuis Etherscan (lecture + écriture)"
              ],
              deliverable: "Le lien Etherscan de ton contrat vérifié et le récit de ton déploiement (ce qui a marché, ce qui a résisté).",
              validation: "ai",
              requires_link: true
            },
            xp_reward: 80,
            duration_minutes: 60,
            sort_order: 10
          },
          {
            slug: "frontend-de-dapp",
            title: "Un frontend pour ta dApp",
            intro: "Un contrat sans interface ne sert qu'aux développeurs. Une page web qui connecte le wallet, lit l'état du contrat et envoie des transactions : voilà une dApp complète — et la jonction avec tes compétences web du parcours dev.",
            why_important: "C'est l'assemblage final qui rend ton travail montrable à des non-développeurs : « connecte ton wallet et essaie ». Pour un client ou un recruteur, la démo interactive vaut tous les dépôts GitHub.",
            how_to_use: "Utilise thirdweb (SDK qui simplifie connexion wallet et appels de contrat) ou ethers.js en direct : une page qui affiche une valeur du contrat (offre totale, ton solde) et un bouton qui déclenche une transaction. Déploie la page sur Vercel comme dans le parcours dev web.",
            objectives: [
              "Connecter un wallet depuis une page web",
              "Lire l'état du contrat et afficher les données",
              "Envoyer une transaction depuis l'interface"
            ],
            resources: [
              { label: "thirdweb", url: "https://thirdweb.com/", kind: "tool", why: "SDK qui réduit la plomberie wallet + contrat à quelques lignes.", how: "Suis le quickstart React : connexion wallet et lecture de contrat." },
              { label: "Ethers.js", url: "https://docs.ethers.org/", kind: "doc", why: "La voie « à la main » pour comprendre ce que le SDK simplifie.", how: "Lis les guides provider, signer et contract." },
              { label: "Vercel", url: "https://vercel.com/", kind: "tool", why: "Déploie ta dApp en ligne comme n'importe quelle app Next.js.", how: "Pousse sur GitHub et connecte le dépôt à Vercel — comme dans le parcours dev web." }
            ],
            quiz: [
              { q: "De quoi une dApp a-t-elle besoin pour parler à un contrat ?", choices: ["D'un mot de passe", "D'un provider (lecture) et d'un signer via le wallet (écriture)", "D'un serveur SQL"], answer: 1, explanation: "Lecture via le RPC, écriture signée par le wallet de l'utilisateur : c'est l'architecture dApp." },
              { q: "Pourquoi la lecture est-elle gratuite mais pas l'écriture ?", choices: ["C'est arbitraire", "Lire n'exécute rien sur la chaîne ; écrire est une transaction qui coûte du gas", "Tout est payant"], answer: 1, explanation: "Consulter l'état est libre ; le modifier mobilise le réseau, donc du gas." },
              { q: "Quel est l'intérêt d'une démo interactive en ligne ?", choices: ["Aucun", "Rendre ton travail testable par des non-développeurs en un clic", "Cacher ton code"], answer: 1, explanation: "« Connecte ton wallet et essaie » convainc plus qu'un dépôt de code." }
            ],
            micro_project: {
              title: "Ta dApp en ligne",
              brief: "Construis et déploie l'interface de ton contrat Sepolia.",
              steps: [
                "Crée la page : connexion wallet + affichage d'une valeur du contrat",
                "Ajoute une action d'écriture (transfert, écriture de message...)",
                "Teste le parcours complet avec MetaMask sur Sepolia",
                "Déploie sur Vercel et relie la dApp à ton projet TakaCode"
              ],
              deliverable: "Le lien de ta dApp en ligne et le contrat qu'elle pilote.",
              validation: "ai",
              requires_link: true
            },
            xp_reward: 80,
            duration_minutes: 70,
            sort_order: 20
          },
          {
            slug: "valoriser-ses-competences-web3",
            title: "Valoriser ses compétences web3 (sans se brûler)",
            intro: "Le web3 paie bien les compétences rares — et brûle les imprudents. Dernière leçon : transformer contrat vérifié et dApp en opportunités réelles (freelance, produits, contributions) tout en gardant les réflexes anti-arnaque.",
            why_important: "La demande en développeurs web3 sérieux dépasse l'offre, surtout francophone. Mais l'écosystème regorge de projets douteux : savoir dire non à un projet louche protège ta réputation — ton actif le plus précieux.",
            how_to_use: "Monte ton portfolio web3 : contrat vérifié + dApp + dépôt GitHub propre, le tout relié à ton projet TakaCode et ton profil public. Côté revenus : freelance (intégrations, tokens utilitaires, audits légers), templates de contrats (parcours Produits digitaux), contributions rémunérées. Côté prudence : jamais de promesse de gains, fuis les projets qui recrutent pour pomper des fonds, et ne gère JAMAIS l'argent d'autrui sans cadre légal.",
            objectives: [
              "Assembler un portfolio web3 vérifiable",
              "Identifier les sources de revenus réalistes du web3",
              "Reconnaître et refuser les projets douteux"
            ],
            resources: [
              { label: "ethereum.org (communauté et opportunités)", url: "https://ethereum.org/fr/community/", kind: "doc", why: "Grants, hackathons et communautés : les portes d'entrée légitimes de l'écosystème.", how: "Repère un hackathon ou un programme de grants accessible et note ses critères." },
              { label: "Parcours Produits digitaux (TakaCode)", url: "https://takacode.vercel.app/parcours/produits-digitaux", kind: "doc", why: "Vendre des templates de contrats ou tes services suit exactement ce parcours.", how: "Applique le module boutique à une offre « smart contract + dApp clé en main »." },
              { label: "GitHub", url: "https://github.com/", kind: "tool", why: "Ton portfolio technique : dépôts propres, README clairs, contrats testés.", how: "Publie ton projet Hardhat complet avec tests et lien vers le contrat vérifié." }
            ],
            quiz: [
              { q: "Quel est le portfolio minimal crédible en web3 ?", choices: ["Un CV en PDF", "Contrat vérifié + dApp en ligne + dépôt GitHub testé", "Des captures d'écran"], answer: 1, explanation: "Tout est vérifiable publiquement : c'est la force du bâtisseur web3 face aux beaux parleurs." },
              { q: "Quel signal doit te faire refuser un projet ?", choices: ["Un code review exigeant", "Promesses de gains garantis et pression pour collecter vite des fonds", "Des tests unitaires obligatoires"], answer: 1, explanation: "Ta réputation vaut plus qu'un contrat : les projets « pompe à fonds » brûlent tous ceux qu'ils touchent." },
              { q: "Peut-on gérer les fonds d'autrui « pour rendre service » ?", choices: ["Oui, entre amis", "Non : jamais sans cadre légal — c'est réglementé et risqué pour tous", "Oui si c'est rentable"], answer: 1, explanation: "La gestion de fonds est une activité réglementée : reste sur la construction et le conseil technique." }
            ],
            micro_project: {
              title: "Ton portfolio web3 assemblé",
              brief: "Rends tes compétences web3 visibles, vérifiables et monétisables.",
              steps: [
                "Publie ton projet complet sur GitHub (contrat, tests, README)",
                "Relie contrat vérifié + dApp + dépôt à ton projet TakaCode",
                "Rédige ton offre (freelance ou produit) en une page",
                "Liste 3 signaux d'alerte qui te feront refuser un projet"
              ],
              deliverable: "Les liens (GitHub, contrat, dApp), ton offre en une page et ta liste de signaux d'alerte.",
              validation: "ai",
              requires_link: true
            },
            xp_reward: 75,
            duration_minutes: 55,
            sort_order: 30
          }
        ]
      }
    ]
  },
  // =========================================================================
  // BOT DE TRADING ASSISTE PAR IA
  // =========================================================================
  {
    track: {
      slug: "bot-trading-ia",
      goal_key: "custom_projects",
      title: "Bot de trading assisté par IA",
      summary: "Formalise TA stratégie, fais-la coder par l'IA (zones, signaux, alertes), backteste sérieusement, tiens ton journal — puis monétise l'automatisation, pas des promesses.",
      description: "Parcours éducatif et lucide : le trading comporte un risque réel de perte et rien ici n'est un conseil financier. Tu apprends à lire le marché (zones, structure, timeframes), à formaliser ta stratégie en règles testables, puis à la confier à l'IA pour générer indicateurs Pine Script et bot Python (ccxt) qui tracent tes zones et détectent tes configurations. Backtest, paper trading et journal de trading imposent la discipline avant tout argent réel — engagé petit, avec des garde-fous. La monétisation vient en dernier et reste honnête : vendre l'outil et la méthode, jamais des promesses de gains.",
      level_label: "Avancé",
      duration_weeks: 5,
      accent_color: "#10B981",
      icon: "lucide:candlestick-chart",
      objective: "Automatiser TA stratégie avec des garde-fous, et monétiser l'outil sans vendre du rêve.",
      resources: ["TradingView", "Pine Script", "ccxt", "Binance Testnet"],
      next_session: "Samedi 10h00",
      next_steps: [
        { label: "Lire le marché", state: "current" },
        { label: "Automatiser avec l'IA", state: "locked" },
        { label: "Discipline et monétisation", state: "locked" }
      ],
      sort_order: 9,
      is_published: true,
      is_active: true
    },
    modules: [
      {
        slug: "lire-le-marche",
        title: "Lire le marché",
        summary: "Risque d'abord, zones et structure ensuite, stratégie formalisée enfin.",
        sort_order: 10,
        lessons: [
          {
            slug: "trading-algo-verites-et-risques",
            title: "Le trading algorithmique : vérités et risques",
            intro: "Commençons par la vérité : la majorité des traders particuliers perdent de l'argent, et aucun bot ne change ça par magie. Un bot exécute TA stratégie sans émotion et sans fatigue — si la stratégie est mauvaise, il perdra juste plus vite que toi. Rien dans ce parcours n'est un conseil financier.",
            why_important: "Le mythe du « bot magique qui gagne pendant que tu dors » est le piège numéro un — et le fonds de commerce des vendeurs de rêve. Comprendre ce qu'un bot fait vraiment (exécuter des règles) et poser tes limites de risque AVANT tout le reste est la seule fondation saine.",
            how_to_use: "Écris ta charte de risque avant toute technique : capital d'apprentissage que tu peux perdre à 100 % sans dommage (et pas un franc de plus), perte maximale par position et par mois, et engagement de rester en paper trading tant que la stratégie n'a pas fait ses preuves sur les données. Cette charte est ton contrat avec toi-même.",
            objectives: [
              "Énoncer ce qu'un bot fait vraiment (et ne fera jamais)",
              "Écrire sa charte de risque personnelle",
              "S'engager sur la séquence : backtest, paper, réel minuscule"
            ],
            resources: [
              { label: "Binance Academy", url: "https://academy.binance.com/", kind: "doc", why: "Des explications accessibles sur le trading, les ordres et la gestion du risque.", how: "Lis les articles sur la gestion du risque et le position sizing." },
              { label: "Investopedia", url: "https://www.investopedia.com/", kind: "doc", why: "La référence pour vérifier chaque concept de trading sans marketing.", how: "Utilise-la en dictionnaire à chaque terme nouveau du parcours." },
              { label: "TradingView", url: "https://www.tradingview.com/", kind: "tool", why: "La plateforme de graphiques du parcours — compte gratuit suffisant.", how: "Crée ton compte et explore un graphique : bougies, unités de temps, indicateurs." }
            ],
            quiz: [
              { q: "Que fait réellement un bot de trading ?", choices: ["Il gagne de l'argent automatiquement", "Il exécute TES règles sans émotion — bonnes ou mauvaises", "Il prédit l'avenir"], answer: 1, explanation: "Le bot amplifie la qualité de ta stratégie : discipline en plus, magie en moins." },
              { q: "Quel capital dédier à l'apprentissage du trading ?", choices: ["Ses économies de sécurité", "Uniquement une somme qu'on peut perdre à 100 % sans dommage", "Un crédit à la consommation"], answer: 1, explanation: "La règle est absolue : le capital d'apprentissage est un budget de formation, pas un investissement." },
              { q: "Quelle est la bonne séquence avant l'argent réel ?", choices: ["Réel tout de suite pour apprendre vite", "Backtest, puis paper trading, puis réel minuscule avec garde-fous", "Copier les signaux d'un influenceur"], answer: 1, explanation: "Chaque étape filtre les stratégies perdantes avant qu'elles coûtent — la patience est le premier garde-fou." }
            ],
            micro_project: {
              title: "Ta charte de risque signée",
              brief: "Pose le cadre qui protégera ton capital pendant tout le parcours.",
              steps: [
                "Fixe ton capital d'apprentissage (perdable à 100 % sans dommage)",
                "Définis ta perte maximale par position et par mois",
                "Écris ton engagement de séquence (backtest, paper, réel minuscule)",
                "Liste 3 signaux qui te feraient tout arrêter pour réévaluer"
              ],
              deliverable: "Ta charte complète : capital, limites, séquence, signaux d'arrêt — et pourquoi ces chiffres sont les tiens.",
              validation: "ai"
            },
            xp_reward: 55,
            duration_minutes: 40,
            sort_order: 10
          },
          {
            slug: "zones-et-structure-de-marche",
            title: "Zones et structure de marché",
            intro: "Avant d'automatiser la détection de zones, il faut savoir les tracer à la main : supports et résistances, zones d'offre et de demande, tendance et unités de temps. Le graphique raconte une histoire — apprends à la lire avant de la faire lire à une machine.",
            why_important: "Ton futur bot tracera les zones que TU lui auras appris à voir. Si tes zones manuelles sont floues, ses zones automatiques le seront aussi : la qualité de l'automatisation plafonne à la qualité de ta lecture.",
            how_to_use: "Sur TradingView : choisis un actif et une unité de temps de référence. Trace les niveaux touchés plusieurs fois (supports, résistances), les zones de départ de mouvements forts, et note la tendance sur l'unité supérieure. Refais l'exercice sur 3 actifs : la répétition forge l'oeil.",
            objectives: [
              "Tracer supports, résistances et zones proprement",
              "Lire la tendance sur plusieurs unités de temps",
              "Justifier chaque zone tracée (pas de trait au hasard)"
            ],
            resources: [
              { label: "TradingView (outils de tracé)", url: "https://www.tradingview.com/", kind: "tool", why: "Les outils rectangle et ligne pour matérialiser tes zones.", how: "Utilise les rectangles pour les zones, les lignes pour les niveaux — et sauvegarde ta mise en page." },
              { label: "Binance Academy (analyse technique)", url: "https://academy.binance.com/", kind: "doc", why: "Supports, résistances et tendances expliqués simplement.", how: "Lis les articles d'analyse technique de base avant de tracer." },
              { label: "Claude (critique de tracés)", url: "https://claude.ai/", kind: "tool", why: "Décris tes zones et leurs justifications : il challenge ta logique.", how: "Explique pourquoi tu as tracé chaque zone et demande ce qui manque." }
            ],
            quiz: [
              { q: "Qu'est-ce qui fait une zone digne d'être tracée ?", choices: ["L'intuition du moment", "Des réactions répétées du prix ou le départ d'un mouvement fort", "La couleur du graphique"], answer: 1, explanation: "Une zone se justifie par le comportement passé du prix — sinon c'est un trait décoratif." },
              { q: "Pourquoi regarder plusieurs unités de temps ?", choices: ["Pour compliquer", "Parce que la tendance de fond (unité supérieure) donne le contexte des zones locales", "C'est inutile"], answer: 1, explanation: "Une zone contre la tendance de fond n'a pas le même poids qu'une zone alignée avec elle." },
              { q: "Pourquoi maîtriser le tracé manuel avant l'automatisation ?", choices: ["Par tradition", "Parce que le bot reproduira ta lecture : floue en entrée, floue en sortie", "Pour user la souris"], answer: 1, explanation: "L'automatisation amplifie ta méthode — elle ne la crée pas." }
            ],
            micro_project: {
              title: "Trois graphiques annotés",
              brief: "Trace et justifie tes zones sur trois actifs différents.",
              steps: [
                "Choisis 3 actifs et une unité de temps de référence",
                "Trace zones et niveaux avec les outils TradingView",
                "Justifie chaque zone en une phrase (pourquoi elle existe)",
                "Note la tendance de l'unité supérieure pour chaque actif"
              ],
              deliverable: "Tes 3 graphiques annotés (liens ou captures TradingView) avec la justification de chaque zone.",
              validation: "ai"
            },
            xp_reward: 60,
            duration_minutes: 55,
            sort_order: 20
          },
          {
            slug: "formaliser-sa-strategie",
            title: "Formaliser SA stratégie en règles testables",
            intro: "« J'achète quand ça a l'air bas » n'est pas une stratégie : c'est une humeur. Une stratégie est un ensemble de règles si/alors si précises qu'une machine — ou l'IA — peut les exécuter sans te demander ton avis. Ce document est la pièce maîtresse du parcours.",
            why_important: "C'est exactement ce document que tu enverras à l'IA au module suivant pour générer ton indicateur et ton bot. Chaque ambiguïté dans tes règles deviendra un bug ou un faux signal : la rigueur ici économise des semaines là-bas.",
            how_to_use: "Rédige ta fiche stratégie : contexte requis (tendance, unité de temps), condition d'entrée exacte (quelle configuration sur quelle zone), invalidation (où et pourquoi tu as tort), sortie (objectif et stop), taille de position (en % du capital, cohérente avec ta charte). Teste la clarté : donne la fiche à l'IA et demande-lui de simuler des décisions sur des scénarios — si elle hésite, précise.",
            objectives: [
              "Écrire des règles d'entrée, sortie et invalidation sans ambiguïté",
              "Lier la taille de position à sa charte de risque",
              "Valider la clarté des règles en les faisant simuler par l'IA"
            ],
            resources: [
              { label: "Claude (test de clarté)", url: "https://claude.ai/", kind: "tool", why: "Le juge de paix : si l'IA ne peut pas appliquer tes règles, elles sont floues.", how: "Colle ta fiche et demande des décisions sur 5 scénarios de marché — chaque hésitation signale une règle à préciser." },
              { label: "Investopedia (concepts de stratégie)", url: "https://www.investopedia.com/", kind: "doc", why: "Vérifier chaque brique (stop, ratio risque/rendement, position sizing).", how: "Cherche « risk reward ratio » et « position sizing » pour cadrer tes règles." },
              { label: "Notion", url: "https://www.notion.com/", kind: "tool", why: "Ta fiche stratégie doit vivre quelque part de propre et versionnable.", how: "Crée la page « Stratégie v1 » — elle évoluera avec les backtests." }
            ],
            quiz: [
              { q: "Qu'est-ce qui distingue une stratégie d'une humeur ?", choices: ["Le montant investi", "Des règles si/alors si précises qu'une machine peut les exécuter", "La confiance en soi"], answer: 1, explanation: "Si deux personnes appliquant tes règles prennent des décisions différentes, ce ne sont pas des règles." },
              { q: "Qu'est-ce que l'invalidation d'une position ?", choices: ["Un bug du bot", "Le niveau où ta thèse est fausse : tu sors, point", "Une annulation d'ordre par la plateforme"], answer: 1, explanation: "Définir où tu as tort AVANT d'entrer est ce qui transforme une perte en coût maîtrisé." },
              { q: "Comment tester la clarté de ses règles ?", choices: ["En les relisant soi-même", "En les faisant appliquer par l'IA sur des scénarios : ses hésitations révèlent le flou", "En les gardant secrètes"], answer: 1, explanation: "L'IA est le lecteur littéral parfait : elle bute exactement où ton bot buterait." }
            ],
            micro_project: {
              title: "Ta fiche stratégie v1",
              brief: "Le document fondateur : ta stratégie en règles exécutables par une machine.",
              steps: [
                "Rédige contexte, entrée, invalidation, sortie et taille de position",
                "Vérifie la cohérence avec ta charte de risque",
                "Fais simuler 5 scénarios par l'IA et note chaque hésitation",
                "Précise les règles floues et produis la v1 finale"
              ],
              deliverable: "Ta fiche stratégie v1 complète et le compte-rendu du test de clarté (hésitations corrigées).",
              validation: "ai"
            },
            xp_reward: 70,
            duration_minutes: 60,
            sort_order: 30
          }
        ]
      },
      {
        slug: "automatiser-avec-l-ia",
        title: "Automatiser avec l'IA",
        summary: "De la fiche stratégie à l'indicateur Pine Script, au bot Python et au backtest.",
        sort_order: 20,
        lessons: [
          {
            slug: "strategie-vers-pine-script",
            title: "De ta stratégie à un indicateur Pine Script",
            intro: "Première automatisation : donner ta fiche stratégie à l'IA pour générer un indicateur Pine Script qui trace TES zones et signale TES configurations directement sur TradingView — avec des alertes qui te préviennent au lieu de scruter l'écran.",
            why_important: "L'indicateur est l'étape idéale avant le bot : visuel, sans risque, il te montre sur le graphique ce que tes règles détectent vraiment. Tu vérifies d'un coup d'oeil si l'automatisation voit ce que ton oeil voit — et tu corriges la stratégie, pas du code obscur.",
            how_to_use: "Envoie ta fiche stratégie à l'IA avec la consigne : « traduis en Pine Script v5 : trace les zones selon ces règles et affiche un signal quand les conditions d'entrée sont réunies ». Colle le script dans l'éditeur Pine de TradingView, applique-le, compare ses tracés à tes tracés manuels de la leçon zones, itère (l'IA corrige à partir de tes retours), puis crée les alertes.",
            objectives: [
              "Faire générer un indicateur Pine Script depuis sa fiche stratégie",
              "Comparer les détections automatiques à sa lecture manuelle",
              "Créer des alertes TradingView sur ses signaux"
            ],
            resources: [
              { label: "Documentation Pine Script", url: "https://www.tradingview.com/pine-script-docs/", kind: "doc", why: "La référence officielle : utile pour comprendre et retoucher ce que l'IA génère.", how: "Lis l'introduction et garde la doc ouverte pour vérifier les fonctions utilisées." },
              { label: "Claude (génération et itération)", url: "https://claude.ai/", kind: "tool", why: "Traduit ta fiche en Pine et corrige à partir de tes retours visuels.", how: "Donne la fiche, puis itère : « la zone X ne devrait pas apparaître ici, car... »." },
              { label: "TradingView (éditeur Pine et alertes)", url: "https://www.tradingview.com/", kind: "tool", why: "L'éditeur intégré et le système d'alertes transforment le script en assistant permanent.", how: "Ouvre l'éditeur Pine, colle le script, ajoute au graphique et crée une alerte sur le signal." }
            ],
            quiz: [
              { q: "Pourquoi commencer par un indicateur plutôt qu'un bot ?", choices: ["C'est plus impressionnant", "Visuel et sans risque : tu vérifies que l'automatisation voit ce que ton oeil voit", "Les bots sont interdits"], answer: 1, explanation: "L'indicateur est le banc d'essai de tes règles : chaque écart visible est une règle à préciser." },
              { q: "Que fais-tu si l'indicateur trace des zones absurdes ?", choices: ["Tu abandonnes", "Tu affines les règles avec l'IA : l'écart révèle une ambiguïté de TA stratégie", "Tu caches l'indicateur"], answer: 1, explanation: "Le code exécute la fiche : si le résultat surprend, c'est la fiche qu'on précise d'abord." },
              { q: "À quoi servent les alertes TradingView ?", choices: ["À faire du bruit", "À être prévenu quand TES conditions se réalisent, sans scruter l'écran", "À trader automatiquement"], answer: 1, explanation: "L'alerte est la première automatisation utile : la surveillance déléguée, la décision encore humaine." }
            ],
            micro_project: {
              title: "Ton indicateur sur ton graphique",
              brief: "Génère, applique et calibre l'indicateur Pine Script de TA stratégie.",
              steps: [
                "Fais générer le script par l'IA depuis ta fiche v1",
                "Applique-le et compare ses zones à tes tracés manuels",
                "Itère avec l'IA jusqu'à un accord visuel satisfaisant",
                "Crée une alerte sur ton signal d'entrée"
              ],
              deliverable: "Ton script Pine final, les captures avant/après calibrage et l'alerte configurée.",
              validation: "ai"
            },
            xp_reward: 75,
            duration_minutes: 65,
            sort_order: 10
          },
          {
            slug: "bot-python-ccxt",
            title: "Ton bot Python avec ccxt (en lecture d'abord)",
            intro: "Le bot Python franchit le pas : il lit les données du marché en continu et détecte tes configurations tout seul. Architecture simple — données, signal, (plus tard) ordre — et règle absolue du module : AUCUN ordre réel, on construit sur le testnet et en lecture seule.",
            why_important: "Séparer détection et exécution est la meilleure protection du débutant : un bot qui NOTIFIE ses signaux (sans trader) te laisse vérifier sa fiabilité pendant des semaines sans risquer un centime. La partie exécution n'arrivera qu'avec les garde-fous du module 3.",
            how_to_use: "Avec l'aide de l'IA et ta fiche stratégie : script Python qui récupère les bougies via ccxt (données publiques, pas besoin de clés), calcule tes conditions, et envoie une notification (email, Telegram ou fichier journal) quand une configuration apparaît. Si tu utilises des clés API, testnet uniquement et JAMAIS de droits de retrait.",
            objectives: [
              "Structurer un bot en données, signal, notification",
              "Récupérer les données de marché avec ccxt",
              "Appliquer les règles de sécurité des clés API (testnet, lecture seule)"
            ],
            resources: [
              { label: "ccxt", url: "https://github.com/ccxt/ccxt", kind: "repo", why: "La bibliothèque standard : une interface unique pour des dizaines de plateformes.", how: "Installe ccxt et récupère les bougies d'un actif — les données publiques suffisent." },
              { label: "Binance Testnet", url: "https://testnet.binance.vision/", kind: "tool", why: "L'environnement de test officiel : clés API sans argent réel.", how: "Crée tes clés testnet pour les essais qui exigent une authentification." },
              { label: "Python", url: "https://www.python.org/", kind: "doc", why: "Le langage du bot — l'IA écrit, tu dois pouvoir relire.", how: "Assure-toi de comprendre chaque bloc généré : demande des commentaires ligne à ligne." }
            ],
            quiz: [
              { q: "Pourquoi un bot qui notifie SANS trader d'abord ?", choices: ["Par lenteur", "Pour vérifier sa fiabilité pendant des semaines sans risquer un centime", "Parce que trader est illégal"], answer: 1, explanation: "La détection se valide gratuitement ; l'exécution attendra les preuves et les garde-fous." },
              { q: "Quelle règle absolue pour les clés API d'un débutant ?", choices: ["Tous les droits pour aller vite", "Testnet d'abord, jamais de droits de retrait, secrets hors du code", "Les partager avec le support"], answer: 1, explanation: "Une clé avec retrait qui fuite, c'est un compte vidé : le principe du moindre privilège n'est pas négociable." },
              { q: "Quelle est l'architecture minimale du bot ?", choices: ["Interface graphique, base de données, serveur web", "Données, calcul du signal, notification", "Un seul fichier de mille lignes"], answer: 1, explanation: "Trois blocs clairs : faciles à tester séparément, faciles à faire évoluer." }
            ],
            micro_project: {
              title: "Ton détecteur de configurations",
              brief: "Le bot lit le marché et te signale TES configurations — sans passer d'ordre.",
              steps: [
                "Récupère les bougies de ton actif via ccxt",
                "Implémente tes conditions d'entrée (avec l'IA, en relisant tout)",
                "Ajoute la notification (Telegram, email ou journal)",
                "Laisse tourner et compare ses détections à ton indicateur Pine"
              ],
              deliverable: "Ton script commenté, une détection réelle notifiée et la comparaison avec l'indicateur TradingView.",
              validation: "ai"
            },
            xp_reward: 80,
            duration_minutes: 70,
            sort_order: 20
          },
          {
            slug: "backtest-et-paper-trading",
            title: "Backtester sans se mentir, puis paper trading",
            intro: "Le backtest répond à la question qui fâche : ta stratégie aurait-elle gagné sur les données passées ? À condition de ne pas tricher — l'overfitting (sur-ajuster jusqu'à ce que le passé soit parfait) produit des stratégies magnifiques hier et ruineuses demain.",
            why_important: "C'est le moment de vérité budgété dans ta charte : la plupart des stratégies échouent ici, et c'est une EXCELLENTE nouvelle — chaque échec en backtest est de l'argent réel non perdu. Les métriques (drawdown, ratio gain/perte, nombre de trades) disent la vérité que l'enthousiasme masque.",
            how_to_use: "Avec backtesting.py et l'IA : implémente ta stratégie, lance sur un historique significatif, lis les métriques au-delà du rendement (drawdown maximal — le creux que tes nerfs devront supporter —, taux de réussite, ratio moyen gain/perte, nombre de trades). Garde des données de test jamais vues pour la validation. Si les résultats tiennent, passe en paper trading (TradingView) : la stratégie en direct, l'argent en papier.",
            objectives: [
              "Backtester sa stratégie avec backtesting.py",
              "Lire drawdown, taux de réussite et ratio gain/perte",
              "Éviter l'overfitting et valider sur données non vues"
            ],
            resources: [
              { label: "backtesting.py", url: "https://kernc.github.io/backtesting.py/", kind: "doc", why: "Bibliothèque Python simple et sérieuse pour backtester avec métriques et graphiques.", how: "Suis le quickstart puis adapte l'exemple à TA stratégie avec l'IA." },
              { label: "TradingView (paper trading)", url: "https://www.tradingview.com/", kind: "tool", why: "Le compte papier intégré : exécuter sa stratégie en direct sans argent réel.", how: "Active le paper trading et traite chaque signal comme s'il était réel." },
              { label: "Claude (lecture critique)", url: "https://claude.ai/", kind: "tool", why: "Colle tes métriques : il t'aide à voir l'overfitting et les angles morts.", how: "Demande « qu'est-ce qui pourrait rendre ces résultats trompeurs ? »." }
            ],
            quiz: [
              { q: "Qu'est-ce que l'overfitting en backtest ?", choices: ["Un bug de la bibliothèque", "Sur-ajuster la stratégie au passé : parfaite hier, ruineuse demain", "Trop de trades"], answer: 1, explanation: "Plus tu tords les paramètres pour embellir le passé, moins la stratégie survivra au futur." },
              { q: "Que mesure le drawdown maximal ?", choices: ["Le gain total", "La pire baisse depuis un sommet : le creux que tes nerfs devront encaisser", "Le nombre de trades"], answer: 1, explanation: "Une stratégie rentable avec un drawdown insoutenable sera abandonnée au pire moment — c'est une métrique de survie." },
              { q: "Une stratégie échoue au backtest. C'est...", choices: ["Une catastrophe", "Une excellente nouvelle : de l'argent réel non perdu, retour à la fiche stratégie", "La faute de l'outil"], answer: 1, explanation: "Le backtest est un filtre : chaque stratégie éliminée gratuitement est une perte évitée." }
            ],
            micro_project: {
              title: "Le verdict des données",
              brief: "Backteste ta stratégie honnêtement et lance le paper trading si elle tient.",
              steps: [
                "Implémente ta stratégie dans backtesting.py (avec l'IA, en relisant)",
                "Lance sur un historique significatif et relève les métriques complètes",
                "Fais l'analyse critique (overfitting, données non vues) avec l'IA",
                "Décide : paper trading, ajustement de la fiche, ou abandon de la stratégie"
              ],
              deliverable: "Tes métriques complètes, ton analyse critique et ta décision argumentée (avec la fiche v2 si ajustement).",
              validation: "ai"
            },
            xp_reward: 80,
            duration_minutes: 70,
            sort_order: 30
          }
        ]
      },
      {
        slug: "discipline-et-monetisation",
        title: "Discipline et monétisation",
        summary: "Journal de trading, passage en réel minuscule et monétisation honnête de l'outil.",
        sort_order: 30,
        lessons: [
          {
            slug: "journal-de-trading",
            title: "Le journal de trading : ta vraie machine à progresser",
            intro: "Le journal bat le talent : chaque trade consigné (contexte, raison d'entrée, émotion, résultat, leçon) transforme l'expérience en données. Et ton bot peut remplir une partie du journal automatiquement — l'automatisation au service de la discipline.",
            why_important: "Sans journal, tu répètes les mêmes erreurs en croyant progresser ; avec journal, tes patterns perdants sautent aux yeux en quelques semaines (« je perds toujours quand j'entre contre la tendance de fond »). C'est l'outil qui sépare durablement ceux qui apprennent de ceux qui rejouent.",
            how_to_use: "Monte ton journal dans Notion ou Google Sheets : date, actif, contexte (tendance, zone), raison d'entrée (quelle règle), taille, résultat, émotion ressentie, leçon. Branche ton bot dessus : chaque signal détecté s'enregistre automatiquement (n8n ou script direct — tes compétences du parcours automatisation servent ici). Revue hebdomadaire obligatoire : 30 minutes, patterns et décisions.",
            objectives: [
              "Construire son journal (structure complète)",
              "Auto-alimenter le journal depuis le bot",
              "Installer la revue hebdomadaire de 30 minutes"
            ],
            resources: [
              { label: "Notion", url: "https://www.notion.com/", kind: "tool", why: "Base de données filtrable : parfaite pour repérer les patterns par contexte.", how: "Crée la base avec les champs listés et 2 vues : chronologique et par résultat." },
              { label: "Google Sheets", url: "https://docs.google.com/spreadsheets/", kind: "tool", why: "L'alternative simple, facile à alimenter automatiquement depuis un script.", how: "Une ligne par trade, des stats automatiques en haut de feuille." },
              { label: "Parcours Automatisations (TakaCode)", url: "https://takacode.vercel.app/parcours/automatisation-ia", kind: "doc", why: "Brancher le bot sur le journal est exactement un workflow n8n.", how: "Réutilise le module workflows pour l'auto-enregistrement des signaux." }
            ],
            quiz: [
              { q: "Pourquoi le journal bat-il le talent ?", choices: ["Il ne le bat pas", "Il transforme l'expérience en données : les patterns perdants deviennent visibles et corrigeables", "Parce qu'il est joli"], answer: 1, explanation: "La mémoire embellit, les données non : le journal est ton miroir honnête." },
              { q: "Que consigne-t-on d'essentiel en plus des chiffres ?", choices: ["La météo", "La raison d'entrée (quelle règle) et l'émotion ressentie", "Rien d'autre"], answer: 1, explanation: "La règle invoquée révèle les entorses à la stratégie ; l'émotion révèle quand tu trades l'humeur." },
              { q: "À quoi sert la revue hebdomadaire ?", choices: ["À se féliciter", "À détecter les patterns et décider des ajustements de la fiche stratégie", "À tout effacer"], answer: 1, explanation: "30 minutes par semaine sur les données valent plus que 30 heures d'écran en plus." }
            ],
            micro_project: {
              title: "Ton journal opérationnel",
              brief: "Journal structuré, auto-alimenté, avec tes premiers trades papier consignés.",
              steps: [
                "Crée le journal (Notion ou Sheets) avec tous les champs",
                "Branche l'auto-enregistrement des signaux du bot",
                "Consigne 5 trades papier complets (dont émotion et leçon)",
                "Fais ta première revue : un pattern observé, une décision prise"
              ],
              deliverable: "Le lien ou les captures du journal alimenté, tes 5 trades consignés et la conclusion de ta première revue.",
              validation: "ai"
            },
            xp_reward: 65,
            duration_minutes: 55,
            sort_order: 10
          },
          {
            slug: "passer-en-reel-petit",
            title: "Passer en réel — minuscule et sous garde-fous",
            intro: "Si (et seulement si) backtest et paper trading tiennent leurs promesses sur la durée, vient le réel — minuscule. Le réel teste la seule chose que le papier ne peut pas simuler : tes émotions quand l'argent est vrai. Rien ici n'est un conseil financier.",
            why_important: "L'erreur fatale est de passer en réel trop tôt ou trop gros. La taille minuscule (celle de ta charte) rend les émotions observables sans être destructrices — et ton infrastructure (bot sur VPS, garde-fous codés) doit être irréprochable AVANT le premier ordre réel.",
            how_to_use: "Checklist avant le premier ordre réel : paper trading positif sur une durée significative, garde-fous codés dans le bot (taille maximale, perte quotidienne maximale, arrêt automatique), bot hébergé sur VPS avec surveillance (tes acquis des parcours automatisation), et clés API SANS droits de retrait. Commence à la taille minimale de ta charte et compare chaque semaine réel vs papier : l'écart mesure l'impact de tes émotions.",
            objectives: [
              "Valider la checklist complète avant tout ordre réel",
              "Coder les garde-fous (tailles et pertes maximales, arrêt d'urgence)",
              "Mesurer l'écart réel vs papier pour objectiver ses émotions"
            ],
            resources: [
              { label: "Hostinger VPS", url: "https://www.hostinger.com/vps", kind: "tool", why: "Un bot de trading tourne 24h/24 : le VPS est son habitat naturel (lien d'affiliation TakaCode sur la page Outils).", how: "Déploie ton bot comme tu as déployé n8n : mêmes réflexes, même surveillance." },
              { label: "UptimeRobot", url: "https://uptimerobot.com/", kind: "tool", why: "Un bot mort qui rate une sortie est un vrai risque : surveille-le.", how: "Ajoute un battement de coeur du bot et une alerte si silence." },
              { label: "Binance Academy (gestion du risque)", url: "https://academy.binance.com/", kind: "doc", why: "Réviser le position sizing avant de passer en réel n'est jamais du luxe.", how: "Relis les articles risque et vérifie que tes garde-fous les appliquent." }
            ],
            quiz: [
              { q: "Que teste le réel que le papier ne peut pas tester ?", choices: ["La vitesse du serveur", "Tes émotions quand l'argent est vrai", "Les frais de la plateforme"], answer: 1, explanation: "Le papier valide la stratégie ; le réel minuscule révèle le trader — c'est l'écart des deux qui t'instruit." },
              { q: "Quels garde-fous coder AVANT le premier ordre réel ?", choices: ["Aucun, on verra bien", "Taille maximale, perte quotidienne maximale, arrêt automatique", "Un simple mot de passe"], answer: 1, explanation: "Les limites codées ne discutent pas avec tes émotions : c'est leur force." },
              { q: "Pourquoi des clés API sans droits de retrait ?", choices: ["Pour la vitesse", "Parce qu'une clé qui fuite ne peut alors pas vider le compte", "C'est obligatoire partout"], answer: 1, explanation: "Le pire scénario d'une fuite passe de « compte vidé » à « ordres indésirables » : toujours le moindre privilège." }
            ],
            micro_project: {
              title: "Ton plan de passage en réel",
              brief: "La checklist complète, les garde-fous codés et le protocole de comparaison — que tu passes en réel ou pas.",
              steps: [
                "Établis ta checklist et vérifie honnêtement chaque point",
                "Code les garde-fous dans le bot (tailles, pertes, arrêt)",
                "Prépare l'hébergement VPS avec surveillance",
                "Définis ton protocole hebdomadaire réel vs papier"
              ],
              deliverable: "Ta checklist remplie, le code des garde-fous, ton plan d'hébergement et le protocole de comparaison. Si tu choisis de rester en papier : ta justification, tout aussi valable.",
              validation: "ai"
            },
            xp_reward: 75,
            duration_minutes: 60,
            sort_order: 20
          },
          {
            slug: "monetiser-son-automatisation-trading",
            title: "Monétiser l'outil, jamais les promesses",
            intro: "Dernière leçon, et la plus importante côté éthique : on monétise l'OUTIL et la MÉTHODE (indicateurs, bots à personnaliser, formation au processus), jamais des promesses de gains. Les vendeurs de rêve finissent sans réputation — et parfois devant la loi.",
            why_important: "Ton avantage est réel : tu sais formaliser une stratégie, la faire coder, la backtester, l'héberger. Ces compétences se vendent à d'autres traders qui veulent automatiser LEUR stratégie. La ligne rouge est claire : pas de promesses de rendement, pas de signaux « garantis », pas de gestion de fonds d'autrui sans licence.",
            how_to_use: "Trois offres honnêtes : (1) tes indicateurs Pine en accès payant (TradingView permet les scripts sur invitation) avec description factuelle ; (2) le service « j'automatise TA stratégie » — exactement le processus de ce parcours appliqué au client, forfait plus maintenance comme au parcours automatisations ; (3) le pack journal + méthode (template et processus, parcours Produits digitaux). Dans toute communication : résultats réels seulement, risques énoncés, aucune promesse.",
            objectives: [
              "Distinguer monétisation de l'outil et vente de promesses",
              "Structurer une offre d'automatisation de stratégie pour clients",
              "Connaître les lignes rouges légales et éthiques"
            ],
            resources: [
              { label: "TradingView (scripts publiés)", url: "https://www.tradingview.com/scripts/", kind: "doc", why: "Voir comment les auteurs sérieux décrivent leurs indicateurs (factuel, sans promesses).", how: "Étudie 3 scripts populaires : structure de la description, avertissements, accès." },
              { label: "Parcours Produits digitaux (TakaCode)", url: "https://takacode.vercel.app/parcours/produits-digitaux", kind: "doc", why: "Page de vente, prix et lancement pour tes outils de trading.", how: "Applique le module boutique à ton pack indicateur ou journal." },
              { label: "Ton cockpit projet TakaCode", url: "https://takacode.vercel.app/dashboard", kind: "tool", why: "Ton bot est un projet : lien en ligne, modèle de revenu, premier euro à déclarer.", how: "Mets à jour ton projet et déclare ton premier euro quand l'outil se vend." }
            ],
            quiz: [
              { q: "Que peut-on monétiser honnêtement en trading ?", choices: ["Des promesses de rendement", "L'outil et la méthode : indicateurs, service d'automatisation, templates de journal", "Des signaux garantis"], answer: 1, explanation: "L'outil a une valeur vérifiable ; la promesse de gains est un mensonge structurel." },
              { q: "Un client te demande de trader son compte « au pourcentage ». Tu...", choices: ["Acceptes, c'est de l'argent", "Refuses : gérer les fonds d'autrui sans licence est illégal et hors de ton offre", "Négocies le pourcentage"], answer: 1, explanation: "La gestion pour compte de tiers est réglementée : ton offre s'arrête à l'outil et à la formation." },
              { q: "Que contient une communication honnête sur ton indicateur ?", choices: ["« Gains garantis, résultats exceptionnels »", "Ce qu'il fait factuellement, ses limites et l'avertissement sur les risques", "Des captures de gains inventées"], answer: 1, explanation: "La description factuelle construit la réputation qui, elle, vend durablement." }
            ],
            micro_project: {
              title: "Ton offre trading honnête",
              brief: "Monte l'offre de monétisation de ton outil, irréprochable sur le fond et la forme.",
              steps: [
                "Choisis ton offre (indicateur, service d'automatisation, pack journal)",
                "Rédige la description factuelle avec avertissement sur les risques",
                "Fixe le prix et le canal (TradingView, boutique produits digitaux)",
                "Mets à jour ton projet TakaCode et publie l'offre"
              ],
              deliverable: "Le lien de ton offre publiée, sa description factuelle complète et ta liste personnelle de lignes rouges.",
              validation: "ai",
              requires_link: true
            },
            xp_reward: 75,
            duration_minutes: 55,
            sort_order: 30
          }
        ]
      }
    ]
  }
];

async function main() {
  for (const { track, modules } of TRACKS) {
    const { data: trackData, error: trackError } = await supabase
      .from("learning_tracks")
      .upsert(track, { onConflict: "slug" })
      .select("id, slug")
      .single();
    if (trackError) {
      console.error(`learning_tracks ${track.slug}:`, trackError.message);
      process.exit(1);
    }
    console.log(`Parcours "${trackData.slug}" OK (${trackData.id})`);

    for (const mod of modules) {
      const { lessons, ...moduleRow } = mod;
      const { data: moduleData, error: moduleError } = await supabase
        .from("track_modules")
        .upsert({ ...moduleRow, track_id: trackData.id, is_published: true }, { onConflict: "track_id,slug" })
        .select("id, slug")
        .single();
      if (moduleError) {
        console.error(`module ${mod.slug}:`, moduleError.message);
        process.exit(1);
      }
      for (const lesson of lessons) {
        const { error: lessonError } = await supabase
          .from("track_lessons")
          .upsert({ ...lesson, module_id: moduleData.id, is_published: true }, { onConflict: "module_id,slug" });
        if (lessonError) {
          console.error(`  lecon ${lesson.slug}:`, lessonError.message);
          process.exit(1);
        }
      }
      console.log(`  Module "${moduleData.slug}" OK (${lessons.length} lecons)`);
    }
  }
  console.log("\nSeed terminé : automatisation-ia, web3-blockchain et bot-trading-ia sont publiés.");
}

await main();
