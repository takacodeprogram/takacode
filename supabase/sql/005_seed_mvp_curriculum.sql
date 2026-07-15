-- TakaCode - Seed des 3 parcours MVP avec modules, lecons, quiz et micro projets
-- Run this after 004_track_curriculum.sql
-- Parcours: IA commun, Full Vibe Coding, Developpement Web assiste par IA

do $seed$
declare
  seed jsonb := $json$
[
  {
    "track": {
      "slug": "ia-fondamentaux",
      "goal_key": "ai_foundations",
      "title": "Parcours IA : comprendre et utiliser efficacement l'IA",
      "summary": "Le parcours commun a tous les membres : LLM, prompts, agents, MCP et RAG.",
      "description": "Tu comprends comment fonctionnent les LLM, tu apprends à écrire des prompts efficaces et tu découvres les agents, MCP et RAG. Chaque leçon s'appuie sur les meilleures ressources du web, avec un quiz et un micro projet pour appliquer immédiatement.",
      "level_label": "Debutant",
      "duration_weeks": 4,
      "accent_color": "#9B6DFF",
      "icon": "lucide:brain",
      "objective": "Maîtriser les fondamentaux de l'IA pour accélérer tous tes projets.",
      "resources": ["Documentation Anthropic", "Prompting Guide", "Model Context Protocol"],
      "next_session": "Mercredi 20h00",
      "next_steps": [
        {"label": "Comprendre les LLM", "state": "current"},
        {"label": "Maitriser l'art du prompt", "state": "locked"},
        {"label": "Explorer agents, MCP et RAG", "state": "locked"}
      ],
      "sort_order": 1
    },
    "modules": [
      {
        "slug": "comprendre-les-llm",
        "title": "Comprendre les LLM",
        "summary": "Comment fonctionne un modele de langage, les tokens et la context window.",
        "sort_order": 10,
        "lessons": [
          {
            "slug": "fonctionnement-des-llm",
            "title": "Comment fonctionne un LLM",
            "intro": "Un LLM (Large Language Model) est un modèle entraîné sur d'immenses corpus de texte. Il ne recherche pas dans une base de données : il prédit le prochain token le plus probable, encore et encore, jusqu'à produire une réponse complète. Un token est un fragment de texte (un mot, une partie de mot ou un signe de ponctuation) : c'est l'unité de base que le modèle manipule à chaque étape.",
            "why_important": "Comprendre ce mécanisme t'évite les deux pièges classiques : croire que l'IA sait tout, ou croire qu'elle ne sert à rien. Tu sauras quand lui faire confiance et quand vérifier.",
            "how_to_use": "Regarde d'abord la vidéo, puis lis l'article pour fixer le vocabulaire. Teste ensuite les mêmes questions dans un chat IA pour observer les variations.",
            "objectives": [
              "Expliquer ce qu'est un LLM en une phrase simple",
              "Comprendre ce qu'est un token et le mécanisme de prédiction",
              "Identifier les limites d'un LLM (hallucinations, connaissances datées)"
            ],
            "resources": [
              {"label": "Large Language Models explained briefly (3Blue1Brown)", "url": "https://www.youtube.com/watch?v=LPZh9BOjkQs", "kind": "video", "why": "La meilleure explication visuelle du fonctionnement interne d'un LLM.", "how": "Regarde la vidéo en entier, note les 3 idées clés."},
              {"label": "What is a large language model (Cloudflare Learning)", "url": "https://www.cloudflare.com/learning/ai/what-is-large-language-model/", "kind": "article", "why": "Un article court qui fixe le vocabulaire de base.", "how": "Lis-le après la vidéo pour consolider les notions."}
            ],
            "quiz": [
              {"q": "Que fait fondamentalement un LLM quand il répond ?", "choices": ["Il cherche la réponse dans une base de données", "Il prédit le prochain token le plus probable", "Il exécute un programme écrit par un humain"], "answer": 1, "explanation": "Un LLM génère sa réponse token par token (un token = un fragment de texte comme un mot ou un morceau de mot), en prédissant à chaque fois le plus probable."},
              {"q": "Sur quoi un LLM est-il entraîné ?", "choices": ["Uniquement des encyclopédies", "D'immenses corpus de textes variés", "Des conversations en direct"], "answer": 1, "explanation": "L'entraînement se fait sur des corpus massifs de textes issus du web, de livres et de code."},
              {"q": "Qu'est-ce qu'une hallucination ?", "choices": ["Une réponse plausible mais fausse", "Un bug qui fait planter le modèle", "Une réponse trop longue"], "answer": 0, "explanation": "Le modèle peut générer une information fausse avec un ton très assuré : il faut vérifier les faits critiques."}
            ],
            "micro_project": {
              "title": "Teste les limites d'un LLM",
              "brief": "Pose 3 questions à une IA de ton choix : une question factuelle simple, une question sur un événement très récent, et une question inventée (personne ou lieu fictif).",
              "steps": [
                "Pose les 3 questions et copie les réponses",
                "Identifie où le modèle est fiable et où il invente",
                "Rédige 5 à 10 lignes sur ce que tu en conclus"
              ],
              "deliverable": "Colle tes 3 questions, un résumé des réponses et ta conclusion."
            },
            "xp_reward": 50,
            "duration_minutes": 40,
            "sort_order": 10
          },
          {
            "slug": "tokens-et-context-window",
            "title": "Tokens et context window",
            "intro": "Les LLM ne lisent pas des mots mais des tokens : des fragments de texte. La context window est la quantité maximale de tokens que le modèle peut traiter en une fois : c'est sa mémoire de travail.",
            "why_important": "Quand une conversation devient longue, le modèle oublie le début ou perd en précision. Savoir gérer la context window change radicalement la qualité de tes sessions IA.",
            "how_to_use": "Utilise le tokenizer en ligne pour visualiser comment ton texte est découpé, puis lis la documentation sur les context windows.",
            "objectives": [
              "Expliquer ce qu'est un token",
              "Comprendre le role de la context window",
              "Adapter tes conversations pour rester efficace"
            ],
            "resources": [
              {"label": "Tokenizer interactif (OpenAI)", "url": "https://platform.openai.com/tokenizer", "kind": "tool", "why": "Visualiser concrètement le découpage en tokens.", "how": "Colle plusieurs phrases en français et en anglais, compare le nombre de tokens."},
              {"label": "Context windows (Anthropic Docs)", "url": "https://docs.anthropic.com/en/docs/build-with-claude/context-windows", "kind": "doc", "why": "La référence officielle sur la mémoire de travail des modèles.", "how": "Lis la section d'introduction et retiens les ordres de grandeur."}
            ],
            "quiz": [
              {"q": "Qu'est-ce qu'un token ?", "choices": ["Toujours un mot entier", "Un fragment de texte (mot, morceau de mot ou ponctuation)", "Une phrase complète"], "answer": 1, "explanation": "Un token est une unité de découpage : un mot peut compter plusieurs tokens."},
              {"q": "Que se passe-t-il quand une conversation dépasse la context window ?", "choices": ["Le modèle plante", "Le modèle perd ou compresse le début de la conversation", "Rien, la mémoire est infinie"], "answer": 1, "explanation": "Au-delà de la limite, les informations les plus anciennes sont perdues ou résumées."},
              {"q": "Quelle bonne pratique découle de la context window ?", "choices": ["Écrire des prompts les plus longs possibles", "Redémarrer une conversation propre avec un résumé quand elle devient trop longue", "Ne jamais dépasser 3 messages"], "answer": 1, "explanation": "Repartir d'un résumé clair garde le modèle précis et concentré."}
            ],
            "micro_project": {
              "title": "Mesure tes tokens",
              "brief": "Prends un texte de ton projet (ou un paragraphe de ton choix) et analyse son coût en tokens.",
              "steps": [
                "Colle le texte dans le tokenizer et note le nombre de tokens",
                "Réécris le texte en 2 fois plus court en gardant le sens",
                "Compare les deux versions et leur nombre de tokens"
              ],
              "deliverable": "Colle les deux versions avec leurs comptes de tokens et une phrase de conclusion."
            },
            "xp_reward": 50,
            "duration_minutes": 30,
            "sort_order": 20
          },
          {
            "slug": "system-prompt-et-user-prompt",
            "title": "System prompt et user prompt",
            "intro": "Le system prompt définit le rôle, le ton et les règles de l'IA. Le user prompt porte ta demande. Bien séparer les deux te donne un contrôle beaucoup plus fin sur les réponses.",
            "why_important": "C'est la base de toute utilisation sérieuse de l'IA : un bon system prompt transforme un chatbot générique en assistant spécialisé pour ton projet.",
            "how_to_use": "Lis la documentation officielle, puis observe comment un même user prompt donne des résultats différents selon le system prompt.",
            "objectives": [
              "Distinguer system prompt et user prompt",
              "Rediger un system prompt de role clair",
              "Structurer une demande efficace"
            ],
            "resources": [
              {"label": "Giving Claude a role with a system prompt (Anthropic Docs)", "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts", "kind": "doc", "why": "La référence officielle avec des exemples avant/après.", "how": "Lis les exemples et repère ce qui change dans les réponses."},
              {"label": "Prompting Guide : introduction", "url": "https://www.promptingguide.ai/introduction", "kind": "doc", "why": "Une base solide et gratuite sur la structure des prompts.", "how": "Parcours la section introduction avant de faire le micro projet."}
            ],
            "quiz": [
              {"q": "À quoi sert le system prompt ?", "choices": ["À poser ta question", "À définir le rôle, le ton et les règles de l'IA", "À corriger les erreurs du modèle"], "answer": 1, "explanation": "Le system prompt cadre le comportement global du modèle pour toute la conversation."},
              {"q": "Où places-tu ta demande concrète ?", "choices": ["Dans le system prompt", "Dans le user prompt", "Dans les deux systématiquement"], "answer": 1, "explanation": "La demande ponctuelle vit dans le user prompt ; le cadre vit dans le system prompt."},
              {"q": "Quel system prompt est le plus efficace ?", "choices": ["Sois gentil", "Tu es un coach sportif : réponds en français, avec un plan d'entraînement structuré et des conseils sécurité", "Réponds bien"], "answer": 1, "explanation": "Un rôle précis, une langue, un format et des contraintes donnent des réponses exploitables."}
            ],
            "micro_project": {
              "title": "Cree l'assistant de ton projet",
              "brief": "Rédige un system prompt qui transforme une IA généraliste en assistant dédié à ton projet TakaCode.",
              "steps": [
                "Définis le rôle, le ton et les règles de ton assistant",
                "Teste-le avec 3 user prompts différents",
                "Ajuste le system prompt selon les résultats"
              ],
              "deliverable": "Colle ton system prompt final et un exemple de réponse obtenue."
            },
            "xp_reward": 60,
            "duration_minutes": 45,
            "sort_order": 30
          }
        ]
      },
      {
        "slug": "art-du-prompt",
        "title": "L'art du prompt",
        "summary": "Prompt engineering, zero-shot, few-shot, chain of thought et loop engineering.",
        "sort_order": 20,
        "lessons": [
          {
            "slug": "bases-prompt-engineering",
            "title": "Les bases du prompt engineering",
            "intro": "Le prompt engineering est l'art de formuler des demandes claires, structurées et contextualisées pour obtenir des réponses de qualité. Contexte, tâche, format, contraintes : les 4 piliers d'un bon prompt.",
            "why_important": "La différence entre un prompt vague et un prompt structuré, c'est la différence entre une réponse inutilisable et un livrable prêt à l'emploi.",
            "how_to_use": "Lis la documentation Anthropic, puis entraîne-toi à réécrire des prompts flous en prompts structurés.",
            "objectives": [
              "Connaître les 4 piliers d'un bon prompt",
              "Transformer une demande floue en prompt structuré",
              "Spécifier un format de sortie"
            ],
            "resources": [
              {"label": "Prompt engineering overview (Anthropic Docs)", "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", "kind": "doc", "why": "Le guide officiel des techniques qui marchent vraiment.", "how": "Lis l'overview puis la page sur la clarté et la directivité."},
              {"label": "Prompting Guide : techniques", "url": "https://www.promptingguide.ai/techniques", "kind": "doc", "why": "Un catalogue des techniques avec exemples.", "how": "Parcours la liste pour connaître le vocabulaire, sans tout mémoriser."}
            ],
            "quiz": [
              {"q": "Quels sont les 4 piliers d'un bon prompt ?", "choices": ["Contexte, tâche, format, contraintes", "Longueur, vitesse, langue, emojis", "Question, réponse, correction, validation"], "answer": 0, "explanation": "Donner du contexte, définir la tâche, imposer un format et des contraintes cadre la réponse."},
              {"q": "Pourquoi spécifier le format de sortie ?", "choices": ["Pour faire joli", "Pour obtenir une réponse directement exploitable (liste, tableau, JSON...)", "Ce n'est jamais utile"], "answer": 1, "explanation": "Un format explicite rend la réponse utilisable sans retravail."},
              {"q": "Quel prompt est le mieux structuré ?", "choices": ["Parle-moi de sites web", "Je lance un site vitrine pour un photographe. Liste 5 sections indispensables, avec pour chacune son objectif en une phrase.", "Fais-moi un site"], "answer": 1, "explanation": "Contexte (photographe), tâche (5 sections), format (liste avec objectif) : tout y est."}
            ],
            "micro_project": {
              "title": "Reecris 3 prompts",
              "brief": "Prends 3 demandes floues liées à ton projet et transforme-les en prompts structurés.",
              "steps": [
                "Écris 3 demandes courtes et vagues",
                "Réécris chacune avec contexte, tâche, format et contraintes",
                "Teste les deux versions et compare les réponses"
              ],
              "deliverable": "Colle les versions avant/après et indique laquelle a donné la meilleure réponse."
            },
            "xp_reward": 60,
            "duration_minutes": 45,
            "sort_order": 10
          },
          {
            "slug": "zero-shot-few-shot-cot",
            "title": "Zero-shot, few-shot et chain of thought",
            "intro": "Zero-shot : demander sans exemple. Few-shot : montrer 2-3 exemples du résultat attendu. Chain of thought : demander au modèle de raisonner étape par étape. Trois techniques, trois usages.",
            "why_important": "Ces trois techniques couvrent 90% des situations : le few-shot fiabilise les formats, le chain of thought fiabilise les raisonnements.",
            "how_to_use": "Lis les deux pages du Prompting Guide, puis applique chaque technique sur une même tâche pour sentir la différence.",
            "objectives": [
              "Savoir quand utiliser zero-shot, few-shot ou chain of thought",
              "Construire un prompt few-shot avec de bons exemples",
              "Déclencher un raisonnement étape par étape"
            ],
            "resources": [
              {"label": "Few-shot prompting (Prompting Guide)", "url": "https://www.promptingguide.ai/techniques/fewshot", "kind": "doc", "why": "Comprendre comment des exemples guident le modèle.", "how": "Lis la page et repère la structure exemple -> résultat."},
              {"label": "Chain-of-thought prompting (Prompting Guide)", "url": "https://www.promptingguide.ai/techniques/cot", "kind": "doc", "why": "La technique de référence pour les tâches de raisonnement.", "how": "Lis la page et note la formule magique : réfléchis étape par étape."}
            ],
            "quiz": [
              {"q": "Qu'est-ce que le few-shot prompting ?", "choices": ["Poser plusieurs questions d'un coup", "Fournir quelques exemples du résultat attendu dans le prompt", "Limiter la longueur de la réponse"], "answer": 1, "explanation": "Montrer 2-3 exemples calibre le format et le style de la réponse."},
              {"q": "Quand le chain of thought est-il le plus utile ?", "choices": ["Pour des tâches de raisonnement ou de calcul en plusieurs étapes", "Pour traduire un mot", "Pour générer un emoji"], "answer": 0, "explanation": "Décomposer le raisonnement réduit les erreurs sur les problèmes complexes."},
              {"q": "Tu veux des titres de produits toujours au même format. Quelle technique choisis-tu ?", "choices": ["Zero-shot", "Few-shot avec 3 exemples de titres", "Chain of thought"], "answer": 1, "explanation": "Les exemples imposent le format bien mieux qu'une longue description."}
            ],
            "micro_project": {
              "title": "Le meme probleme, 3 techniques",
              "brief": "Choisis une tâche liée à ton projet (ex : écrire des descriptions produits, planifier une fonctionnalité) et traite-la avec les 3 techniques.",
              "steps": [
                "Formule la tâche en zero-shot et note le résultat",
                "Ajoute 2-3 exemples (few-shot) et compare",
                "Demande un raisonnement étape par étape et compare"
              ],
              "deliverable": "Colle tes 3 prompts et indique quelle technique a gagné et pourquoi."
            },
            "xp_reward": 60,
            "duration_minutes": 45,
            "sort_order": 20
          },
          {
            "slug": "loop-engineering",
            "title": "Loop engineering : iterer avec l'IA",
            "intro": "Le loop engineering consiste à ne jamais accepter la première réponse : tu analyses, tu critiques, tu redemandes une version améliorée, en boucle, jusqu'au niveau de qualité visé.",
            "why_important": "C'est la méthode de travail des meilleurs utilisateurs d'IA : la première réponse est un brouillon, la valeur se crée dans les itérations.",
            "how_to_use": "Lis l'article sur les bonnes pratiques, puis applique une boucle de 3 itérations sur un livrable concret.",
            "objectives": [
              "Adopter le réflexe d'itération systématique",
              "Formuler des critiques exploitables par l'IA",
              "Savoir quand arrêter la boucle"
            ],
            "resources": [
              {"label": "Claude Code best practices (Anthropic Engineering)", "url": "https://www.anthropic.com/engineering/claude-code-best-practices", "kind": "article", "why": "Des patterns d'itération issus d'usages réels en production.", "how": "Lis les sections sur l'itération et la vérification des résultats."},
              {"label": "Prompting Guide : general tips", "url": "https://www.promptingguide.ai/introduction/tips", "kind": "doc", "why": "Des conseils simples pour améliorer chaque itération.", "how": "Garde cette page ouverte pendant le micro projet."}
            ],
            "quiz": [
              {"q": "Quel est le principe du loop engineering ?", "choices": ["Accepter la première réponse pour aller vite", "Analyser, critiquer et redemander une version améliorée en boucle", "Poser la même question plusieurs fois telle quelle"], "answer": 1, "explanation": "Chaque itération doit contenir une critique précise pour améliorer la suivante."},
              {"q": "Quelle critique fait progresser l'IA ?", "choices": ["C'est nul, recommence", "Le ton est trop formel et il manque un appel à l'action : réécris en tutoyant avec un CTA final", "Fais mieux"], "answer": 1, "explanation": "Une critique actionnable nomme le problème et la direction attendue."},
              {"q": "Quand arrêter la boucle ?", "choices": ["Jamais", "Quand le livrable atteint le niveau de qualité défini au départ", "Après exactement 10 itérations"], "answer": 1, "explanation": "Définir le critère de done avant de commencer évite d'itérer dans le vide."}
            ],
            "micro_project": {
              "title": "3 iterations vers l'excellence",
              "brief": "Fais générer un texte important pour ton projet (page d'accueil, pitch, description) et améliore-le en 3 itérations.",
              "steps": [
                "Génère une première version et liste 3 défauts précis",
                "Redemande avec tes critiques, puis recommence une fois",
                "Compare la version 1 et la version 3"
              ],
              "deliverable": "Colle la version 1, la version 3 et les critiques qui ont servi entre les deux."
            },
            "xp_reward": 70,
            "duration_minutes": 50,
            "sort_order": 30
          }
        ]
      },
      {
        "slug": "agents-mcp-rag",
        "title": "Agents, MCP et RAG",
        "summary": "Les agents IA, le Model Context Protocol et la generation augmentee par recherche.",
        "sort_order": 30,
        "lessons": [
          {
            "slug": "agents-ia",
            "title": "Les agents IA",
            "intro": "Un agent IA est un LLM équipé d'outils (fichiers, terminal, web...) qui travaille en boucle : il planifie, agit, observe le résultat et recommence jusqu'à terminer la tâche.",
            "why_important": "Les agents sont la brique qui transforme l'IA de simple assistant conversationnel en véritable collaborateur capable d'exécuter des projets.",
            "how_to_use": "Lis l'article de référence d'Anthropic, puis identifie dans ta vie ou ton projet une tâche qui gagnerait à être confiée à un agent.",
            "objectives": [
              "Définir ce qu'est un agent IA",
              "Comprendre la boucle planifier-agir-observer",
              "Identifier une tâche adaptée à un agent"
            ],
            "resources": [
              {"label": "Building effective agents (Anthropic)", "url": "https://www.anthropic.com/research/building-effective-agents", "kind": "article", "why": "L'article de référence sur les architectures d'agents qui fonctionnent.", "how": "Lis l'introduction et la section sur les workflows vs agents."}
            ],
            "quiz": [
              {"q": "Qu'est-ce qui distingue un agent d'un simple chatbot ?", "choices": ["Il répond plus vite", "Il utilise des outils et boucle jusqu'à terminer la tâche", "Il ne fait jamais d'erreur"], "answer": 1, "explanation": "L'accès aux outils et la boucle d'action font toute la différence."},
              {"q": "Quelle est la boucle de base d'un agent ?", "choices": ["Planifier, agir, observer, recommencer", "Copier, coller, envoyer", "Question, réponse, fin"], "answer": 0, "explanation": "L'agent ajuste son plan à chaque observation du résultat de ses actions."},
              {"q": "Quelle tâche est la plus adaptée à un agent ?", "choices": ["Traduire un mot", "Corriger un bug dans un projet : chercher, modifier, tester", "Donner la capitale de la France"], "answer": 1, "explanation": "Les tâches en plusieurs étapes avec vérification sont le terrain de jeu des agents."}
            ],
            "micro_project": {
              "title": "Concois ton agent sur papier",
              "brief": "Conçois un agent utile pour ton projet : sa mission, ses outils, sa boucle de travail.",
              "steps": [
                "Choisis une tâche répétitive ou complexe de ton projet",
                "Liste les outils dont l'agent aurait besoin",
                "Décris sa boucle de travail en 4-5 étapes"
              ],
              "deliverable": "Colle la fiche de ton agent : mission, outils, boucle de travail."
            },
            "xp_reward": 60,
            "duration_minutes": 40,
            "sort_order": 10
          },
          {
            "slug": "mcp-connecter-ia",
            "title": "MCP : connecter l'IA a tes outils",
            "intro": "Le Model Context Protocol (MCP) est un standard ouvert qui permet de brancher une IA sur tes outils : bases de données, navigateur, APIs, fichiers. C'est le port USB-C de l'IA.",
            "why_important": "MCP devient le standard de l'écosystème : comprendre ce qu'il permet t'ouvre des automatisations impossibles avec un simple chat.",
            "how_to_use": "Parcours le site officiel pour comprendre le concept, puis explore la liste des serveurs MCP existants.",
            "objectives": [
              "Expliquer ce qu'est MCP et son role",
              "Distinguer client MCP et serveur MCP",
              "Reperer des serveurs MCP utiles pour ton projet"
            ],
            "resources": [
              {"label": "Model Context Protocol (site officiel)", "url": "https://modelcontextprotocol.io", "kind": "doc", "why": "La source officielle du standard.", "how": "Lis la page d'introduction et le schéma d'architecture."},
              {"label": "Serveurs MCP (GitHub)", "url": "https://github.com/modelcontextprotocol/servers", "kind": "repo", "why": "Le catalogue officiel des serveurs MCP prêts à l'emploi.", "how": "Parcours la liste et note ceux qui serviraient ton projet."}
            ],
            "quiz": [
              {"q": "À quoi sert MCP ?", "choices": ["À remplacer les LLM", "À connecter une IA à des outils et sources de données externes", "À compresser les tokens"], "answer": 1, "explanation": "MCP standardise la connexion entre les modèles et le monde extérieur."},
              {"q": "Qu'est-ce qu'un serveur MCP ?", "choices": ["Un ordinateur puissant", "Un programme qui expose des outils (BDD, API, fichiers...) à l'IA", "Un site web"], "answer": 1, "explanation": "Le serveur expose des capacités ; le client (l'app IA) les consomme."},
              {"q": "Pourquoi compare-t-on MCP à un port USB-C ?", "choices": ["Parce qu'il charge plus vite", "Parce qu'un standard unique remplace des intégrations sur mesure", "Parce qu'il est fabriqué par Apple"], "answer": 1, "explanation": "Un protocole commun évite de re-développer chaque connexion outil par outil."}
            ],
            "micro_project": {
              "title": "Ta stack MCP ideale",
              "brief": "Identifie 3 serveurs MCP qui accéléreraient ton projet et explique l'usage de chacun.",
              "steps": [
                "Parcours le catalogue de serveurs MCP",
                "Choisis-en 3 pertinents pour ton projet",
                "Décris pour chacun un cas d'usage concret"
              ],
              "deliverable": "Liste tes 3 serveurs MCP avec leur cas d'usage pour ton projet."
            },
            "xp_reward": 60,
            "duration_minutes": 40,
            "sort_order": 20
          },
          {
            "slug": "rag-et-bonnes-pratiques",
            "title": "RAG et bonnes pratiques finales",
            "intro": "Le RAG (Retrieval-Augmented Generation) consiste à donner au modèle des documents pertinents récupérés au moment de la question, au lieu de compter sur sa mémoire d'entraînement. C'est ce qui permet à une IA de répondre sur TES données.",
            "why_important": "Le RAG est l'architecture derrière la plupart des assistants d'entreprise et chatbots documentaires : comprendre le principe te permet d'imaginer des produits IA crédibles.",
            "how_to_use": "Lis la page du Prompting Guide, puis synthétise tout le parcours dans le micro projet final.",
            "objectives": [
              "Expliquer le principe du RAG",
              "Savoir quand le RAG est préférable au fine-tuning",
              "Consolider les bonnes pratiques du parcours"
            ],
            "resources": [
              {"label": "RAG (Prompting Guide)", "url": "https://www.promptingguide.ai/techniques/rag", "kind": "doc", "why": "Une explication claire du principe et des cas d'usage.", "how": "Lis la page et retiens le schéma recherche -> injection -> génération."},
              {"label": "AI and vectors (Supabase Docs)", "url": "https://supabase.com/docs/guides/ai", "kind": "doc", "why": "Voir comment le RAG s'implémente concrètement avec une base de données.", "how": "Parcours l'introduction pour relier théorie et pratique."}
            ],
            "quiz": [
              {"q": "Que fait un système RAG avant de générer la réponse ?", "choices": ["Il récupère des documents pertinents et les injecte dans le prompt", "Il ré-entraîne le modèle", "Il traduit la question en anglais"], "answer": 0, "explanation": "Recherche puis injection dans le contexte : le modèle répond avec les bonnes sources."},
              {"q": "Quel problème le RAG résout-il ?", "choices": ["La lenteur des modèles", "Répondre avec des données privées ou récentes que le modèle ne connaît pas", "Le coût de l'électricité"], "answer": 1, "explanation": "Les connaissances du modèle sont figées à son entraînement ; le RAG apporte le reste."},
              {"q": "Quelle est la meilleure synthèse de ce parcours ?", "choices": ["L'IA remplace toute réflexion", "Comprendre les LLM, structurer ses prompts et itérer : l'IA devient un multiplicateur", "Il faut coder pour utiliser l'IA"], "answer": 1, "explanation": "La méthode compte plus que l'outil : comprendre, structurer, itérer."}
            ],
            "micro_project": {
              "title": "Ton systeme IA personnel",
              "brief": "Rédige la synthèse de ta méthode de travail avec l'IA pour ton projet : prompts types, boucles d'itération, outils envisagés.",
              "steps": [
                "Rédige ton system prompt de référence pour ton projet",
                "Liste 3 prompts types que tu réutiliseras",
                "Décris où un agent, un MCP ou un RAG pourrait servir ton projet"
              ],
              "deliverable": "Colle ta fiche méthode complète : system prompt, prompts types, pistes agents/MCP/RAG."
            },
            "xp_reward": 80,
            "duration_minutes": 50,
            "sort_order": 30
          }
        ]
      }
    ]
  },
  {
    "track": {
      "slug": "full-vibe-coding",
      "goal_key": "vibe_coding",
      "title": "Parcours Full Vibe Coding",
      "summary": "Construire et publier ton projet avec l'IA, sans apprendre a coder.",
      "description": "Tu choisis tes outils IA (Claude Code, Cursor, Codex, Gemini...), tu apprends à cadrer ton projet, à itérer efficacement et à publier une vraie version en ligne. Le code est écrit par l'IA : toi, tu pilotes.",
      "level_label": "Debutant",
      "duration_weeks": 6,
      "accent_color": "#4F8EF7",
      "icon": "lucide:sparkles",
      "objective": "Publier ton premier projet construit avec l'IA, de l'idée à la mise en ligne.",
      "resources": ["Docs Claude Code", "Docs Cursor", "Docs Vercel", "Docs GitHub"],
      "next_session": "Jeudi 20h00",
      "next_steps": [
        {"label": "Choisir tes outils IA", "state": "current"},
        {"label": "Construire ton projet avec l'IA", "state": "locked"},
        {"label": "Livrer et publier", "state": "locked"}
      ],
      "sort_order": 2
    },
    "modules": [
      {
        "slug": "choisir-tes-outils",
        "title": "Choisir tes outils IA",
        "summary": "Panorama des outils de vibe coding et prise en main du principal.",
        "sort_order": 10,
        "lessons": [
          {
            "slug": "panorama-outils-vibe-coding",
            "title": "Panorama des outils de vibe coding",
            "intro": "Claude Code, Cursor, Codex, Gemini CLI, OpenRouter... chaque outil a ses forces : agent terminal, éditeur augmenté, accès multi-modèles. Choisir le bon outil pour ton profil est ta première décision de projet.",
            "why_important": "Le vibe coding, c'est développer en pilotant une IA plutôt qu'en écrivant le code toi-même. Le bon outil bien maîtrisé vaut mieux que cinq outils survolés.",
            "how_to_use": "Parcours les pages d'accueil des docs de chaque outil, note leurs forces et limites, puis choisis-en un comme outil principal.",
            "objectives": [
              "Connaitre les principaux outils de vibe coding",
              "Comprendre les forces et limites de chaque famille d'outils",
              "Choisir ton outil principal en connaissance de cause"
            ],
            "resources": [
              {"label": "Claude Code (documentation)", "url": "https://docs.anthropic.com/en/docs/claude-code/overview", "kind": "doc", "why": "L'agent de code en terminal de référence : il lit, écrit et teste le code pour toi.", "how": "Lis l'overview pour comprendre le mode de travail en agent."},
              {"label": "Cursor (documentation)", "url": "https://docs.cursor.com", "kind": "doc", "why": "L'éditeur augmenté par IA le plus populaire : visuel et progressif.", "how": "Parcours la page de démarrage et compare avec l'approche terminal."},
              {"label": "OpenRouter (documentation)", "url": "https://openrouter.ai/docs/quickstart", "kind": "doc", "why": "Un accès unifié à des dizaines de modèles pour comparer et optimiser les coûts.", "how": "Lis le quickstart pour comprendre le principe de passerelle multi-modèles."}
            ],
            "quiz": [
              {"q": "Qu'est-ce que le vibe coding ?", "choices": ["Coder en musique", "Développer en pilotant une IA qui écrit le code", "Copier du code depuis des forums"], "answer": 1, "explanation": "Tu décris, l'IA code, tu vérifies et tu orientes : c'est un changement de posture."},
              {"q": "Quelle est la particularité de Claude Code ?", "choices": ["C'est un agent qui lit, écrit et teste le code directement dans ton projet", "C'est un site de tutoriels", "C'est un hébergeur"], "answer": 0, "explanation": "Claude Code agit comme un développeur : il explore le projet et exécute des commandes."},
              {"q": "Pourquoi limiter le nombre d'outils au début ?", "choices": ["Les outils sont payants", "Maîtriser un outil à fond rend plus productif que d'en survoler cinq", "C'est interdit d'en utiliser plusieurs"], "answer": 1, "explanation": "La courbe d'apprentissage se rentabilise avec la profondeur d'usage."}
            ],
            "micro_project": {
              "title": "Ton comparatif d'outils",
              "brief": "Compare 3 outils de vibe coding et choisis ton outil principal.",
              "steps": [
                "Explore les docs de 3 outils (ex : Claude Code, Cursor, Gemini)",
                "Note pour chacun : forces, limites, coût, facilité de prise en main",
                "Choisis ton outil principal et justifie en 3 lignes"
              ],
              "deliverable": "Colle ton tableau comparatif et ta décision justifiée."
            },
            "xp_reward": 50,
            "duration_minutes": 45,
            "sort_order": 10
          },
          {
            "slug": "prise-en-main-outil",
            "title": "Prendre en main ton outil IA",
            "intro": "Installer ton outil, lancer ta première session, faire générer un premier résultat concret : cette leçon transforme ton choix en compétence pratique.",
            "why_important": "La première session réussie débloque tout le reste : tu passes de la théorie à la construction réelle.",
            "how_to_use": "Suis le guide d'installation officiel de ton outil, puis réalise le micro projet directement avec lui.",
            "objectives": [
              "Installer et configurer ton outil principal",
              "Lancer une premiere generation reussie",
              "Comprendre le cycle demande -> resultat -> ajustement"
            ],
            "resources": [
              {"label": "Claude Code : quickstart", "url": "https://docs.anthropic.com/en/docs/claude-code/quickstart", "kind": "doc", "why": "Le guide d'installation et de première session pas à pas.", "how": "Suis chaque étape jusqu'à ta première commande réussie."},
              {"label": "Claude Code best practices (Anthropic Engineering)", "url": "https://www.anthropic.com/engineering/claude-code-best-practices", "kind": "article", "why": "Les patterns des utilisateurs avancés pour bien démarrer.", "how": "Lis les sections donner du contexte et itérer."}
            ],
            "quiz": [
              {"q": "Quelle est la première chose à donner à ton outil IA sur un nouveau projet ?", "choices": ["Rien, il devine", "Du contexte : objectif du projet, contraintes, résultat attendu", "Ton mot de passe"], "answer": 1, "explanation": "Plus le contexte initial est clair, plus les propositions sont pertinentes."},
              {"q": "Que faire quand le résultat généré n'est pas bon ?", "choices": ["Abandonner l'outil", "Décrire précisément ce qui ne va pas et redemander", "Recommencer à zéro systématiquement"], "answer": 1, "explanation": "L'itération guidée est le mode de travail normal du vibe coding."},
              {"q": "Pourquoi tester le résultat généré ?", "choices": ["Pour perdre du temps", "Parce que l'IA peut produire du code qui semble correct mais ne fonctionne pas", "Ce n'est pas nécessaire"], "answer": 1, "explanation": "Toujours vérifier le comportement réel : c'est toi le responsable du produit."}
            ],
            "micro_project": {
              "title": "Ta premiere page generee",
              "brief": "Fais générer par ton outil IA une page web one-page de présentation de ton projet.",
              "steps": [
                "Décris ta page à l'IA : contenu, sections, ambiance",
                "Fais générer, ouvre le résultat dans un navigateur",
                "Demande 2 améliorations et applique-les"
              ],
              "deliverable": "Décris ce que tu as obtenu, les 2 améliorations demandées, et ce que tu as appris."
            },
            "xp_reward": 70,
            "duration_minutes": 60,
            "sort_order": 20
          }
        ]
      },
      {
        "slug": "construire-avec-ia",
        "title": "Construire ton projet avec l'IA",
        "summary": "Cadrage, iterations et bonnes pratiques pour un vrai projet.",
        "sort_order": 20,
        "lessons": [
          {
            "slug": "cadrer-ton-projet",
            "title": "Cadrer ton projet et rediger le brief",
            "intro": "Avant de générer la moindre ligne, un vibe coder efficace rédige un brief : le problème, l'utilisateur cible, les fonctionnalités du MVP, et ce qui est explicitement hors scope.",
            "why_important": "90% des projets IA qui échouent partent d'un brief flou : l'IA amplifie la clarté comme la confusion.",
            "how_to_use": "Utilise la structure de brief proposée dans la leçon, et fais-toi aider par une IA conversationnelle pour le challenger.",
            "objectives": [
              "Rédiger un brief de projet complet",
              "Définir un MVP réaliste (et couper le reste)",
              "Formuler des critères de réussite vérifiables"
            ],
            "resources": [
              {"label": "Prompt engineering overview (Anthropic Docs)", "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", "kind": "doc", "why": "Un bon brief est un grand prompt : les mêmes règles s'appliquent.", "how": "Applique les principes de clarté au brief de ton projet."},
              {"label": "The Mom Test (résumé vidéo)", "url": "https://www.youtube.com/results?search_query=the+mom+test+resume", "kind": "video", "why": "Vérifier que ton projet répond à un vrai besoin avant de le construire.", "how": "Regarde un résumé et note 2 questions à poser à tes futurs utilisateurs."}
            ],
            "quiz": [
              {"q": "Que doit contenir un brief de projet ?", "choices": ["Uniquement le nom du projet", "Problème, utilisateur cible, fonctionnalités MVP, hors scope", "La liste des technologies à la mode"], "answer": 1, "explanation": "Ces 4 éléments donnent à l'IA (et à toi) un cap clair."},
              {"q": "Qu'est-ce qu'un MVP ?", "choices": ["La version la plus complète possible", "La plus petite version qui apporte déjà de la valeur à l'utilisateur", "Un prototype jetable sans utilisateurs"], "answer": 1, "explanation": "Le MVP valide l'essentiel vite ; le reste attend les retours."},
              {"q": "Pourquoi définir le hors scope ?", "choices": ["Pour faire long", "Pour éviter que le projet gonfle et ne sorte jamais", "C'est inutile"], "answer": 1, "explanation": "Dire non explicitement protège le délai et la clarté du projet."}
            ],
            "micro_project": {
              "title": "Le brief de ton projet",
              "brief": "Rédige le brief complet du projet que tu vas construire pendant ce parcours.",
              "steps": [
                "Décris le problème et l'utilisateur cible",
                "Liste 3 à 5 fonctionnalités MVP maximum",
                "Liste ce qui est hors scope et tes critères de réussite"
              ],
              "deliverable": "Colle ton brief complet."
            },
            "xp_reward": 70,
            "duration_minutes": 50,
            "sort_order": 10
          },
          {
            "slug": "iterer-efficacement",
            "title": "Iterer efficacement : specs, feedback, corrections",
            "intro": "Construire avec l'IA, c'est une conversation continue : tu découpes le brief en petites demandes, tu vérifies chaque résultat dans le navigateur, tu donnes un feedback précis, et tu avances fonctionnalité par fonctionnalité.",
            "why_important": "Demander tout d'un coup produit un projet incohérent. Le découpage en petites itérations vérifiables est LA compétence du vibe coder.",
            "how_to_use": "Applique la boucle : petite demande -> vérification -> feedback -> demande suivante, sur ton propre projet.",
            "objectives": [
              "Découper un brief en petites demandes séquentielles",
              "Vérifier chaque résultat avant de continuer",
              "Donner des feedbacks que l'IA peut exploiter"
            ],
            "resources": [
              {"label": "Claude Code best practices (Anthropic Engineering)", "url": "https://www.anthropic.com/engineering/claude-code-best-practices", "kind": "article", "why": "Les patterns d'itération validés par des milliers de projets.", "how": "Relis la section sur le découpage des tâches avant le micro projet."}
            ],
            "quiz": [
              {"q": "Pourquoi découper le projet en petites demandes ?", "choices": ["Pour payer moins cher", "Chaque étape reste vérifiable et les erreurs ne s'accumulent pas", "Parce que l'IA refuse les grandes demandes"], "answer": 1, "explanation": "Petites itérations = erreurs détectées tôt = projet qui reste sain."},
              {"q": "Que faire après chaque génération ?", "choices": ["Passer directement à la suite", "Vérifier le résultat réel dans le navigateur ou l'application", "Supprimer le code"], "answer": 1, "explanation": "La vérification systématique est ta responsabilité de pilote."},
              {"q": "Quel feedback est le plus utile à l'IA ?", "choices": ["Ça ne marche pas", "Le bouton Envoyer ne fait rien quand le champ email est vide : il devrait afficher un message d'erreur", "Recommence tout"], "answer": 1, "explanation": "Symptôme précis + comportement attendu = correction rapide."}
            ],
            "micro_project": {
              "title": "Ta premiere fonctionnalite complete",
              "brief": "Construis la première fonctionnalité de ton MVP en 3 itérations minimum avec ton outil IA.",
              "steps": [
                "Choisis la fonctionnalité la plus importante de ton brief",
                "Découpe-la en 3 petites demandes séquentielles",
                "Exécute la boucle demande -> vérification -> feedback jusqu'au résultat"
              ],
              "deliverable": "Décris la fonctionnalité obtenue, tes 3 demandes et un problème corrigé grâce à ton feedback."
            },
            "xp_reward": 80,
            "duration_minutes": 60,
            "sort_order": 20
          },
          {
            "slug": "limites-et-bonnes-pratiques",
            "title": "Limites et bonnes pratiques du vibe coding",
            "intro": "Le vibe coding a des pièges connus : code fragile accumulé sans vérification, failles de sécurité (clés API exposées, données non protégées), dépendance totale à l'IA. Cette leçon te donne les garde-fous.",
            "why_important": "Publier un projet, c'est exposer de vrais utilisateurs et de vraies données : les bases de sécurité et de qualité ne sont pas optionnelles.",
            "how_to_use": "Lis les ressources, puis passe ton projet au crible de la checklist du micro projet.",
            "objectives": [
              "Connaître les risques classiques du code généré",
              "Protéger ses clés API et ses données",
              "Construire sa checklist qualité avant publication"
            ],
            "resources": [
              {"label": "OWASP Top 10", "url": "https://owasp.org/www-project-top-ten/", "kind": "doc", "why": "Les 10 failles de sécurité les plus courantes du web, à connaître de nom.", "how": "Parcours la liste sans tout approfondir : retiens injection et secrets exposés."},
              {"label": "Environment variables (Vercel Docs)", "url": "https://vercel.com/docs/environment-variables", "kind": "doc", "why": "La bonne façon de stocker des clés API sans les exposer.", "how": "Lis l'introduction et retiens : jamais de clé en dur dans le code."}
            ],
            "quiz": [
              {"q": "Où doit-on stocker une clé API ?", "choices": ["Directement dans le code source", "Dans une variable d'environnement jamais publiée", "Dans un commentaire"], "answer": 1, "explanation": "Une clé dans le code publié est une clé volée : variables d'environnement obligatoires."},
              {"q": "Quel est le principal risque du vibe coding sans vérification ?", "choices": ["Accumuler du code fragile ou vulnérable sans s'en rendre compte", "Écrire trop vite", "Utiliser trop de couleurs"], "answer": 0, "explanation": "Sans vérification régulière, les problèmes s'empilent jusqu'à devenir ingérables."},
              {"q": "Que demander à l'IA avant de publier ?", "choices": ["Rien", "Un audit du projet : sécurité, erreurs, données exposées", "De supprimer les tests"], "answer": 1, "explanation": "Faire relire son propre projet par l'IA avec un angle sécurité attrape beaucoup de problèmes."}
            ],
            "micro_project": {
              "title": "Audit de ton projet",
              "brief": "Fais auditer ton projet en construction par ton outil IA avec un angle sécurité et qualité.",
              "steps": [
                "Demande à l'IA un audit sécurité de ton projet (clés, données, validations)",
                "Liste les problèmes trouvés par gravité",
                "Corrige au moins les 2 plus importants"
              ],
              "deliverable": "Colle la liste des problèmes trouvés et les 2 corrections appliquées."
            },
            "xp_reward": 70,
            "duration_minutes": 50,
            "sort_order": 30
          }
        ]
      },
      {
        "slug": "livrer-et-publier",
        "title": "Livrer et publier",
        "summary": "Versionner avec GitHub et mettre ton projet en ligne.",
        "sort_order": 30,
        "lessons": [
          {
            "slug": "sauvegarder-avec-github",
            "title": "Sauvegarder ton code avec GitHub",
            "intro": "GitHub conserve l'historique complet de ton projet : chaque version est sauvegardée, tu peux revenir en arrière, et c'est la porte d'entrée du déploiement. Même en vibe coding, c'est ton filet de sécurité.",
            "why_important": "Sans versionnage, une mauvaise génération de l'IA peut détruire des heures de travail. Avec GitHub, aucune erreur n'est définitive.",
            "how_to_use": "Suis le guide Hello World de GitHub, puis fais versionner ton projet par ton outil IA (il sait faire les commits pour toi).",
            "objectives": [
              "Créer un compte et un dépôt GitHub",
              "Comprendre commit et push",
              "Versionner ton projet en cours"
            ],
            "resources": [
              {"label": "Hello World (GitHub Docs)", "url": "https://docs.github.com/en/get-started/start-your-journey/hello-world", "kind": "doc", "why": "Le tutoriel officiel pour créer son premier dépôt en 30 minutes.", "how": "Suis-le pas à pas jusqu'à ton premier dépôt créé."},
              {"label": "About commits (GitHub Docs)", "url": "https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/about-commits", "kind": "doc", "why": "Comprendre l'unité de base du versionnage.", "how": "Lis l'introduction : un commit = une photo de ton projet à un instant donné."}
            ],
            "quiz": [
              {"q": "Qu'est-ce qu'un commit ?", "choices": ["Une sauvegarde horodatée de l'état de ton projet avec un message", "Un fichier supprimé", "Un mot de passe"], "answer": 0, "explanation": "Chaque commit capture une version : c'est ton historique complet."},
              {"q": "Que fait un push ?", "choices": ["Il supprime le projet", "Il envoie tes commits locaux vers GitHub", "Il ferme l'éditeur"], "answer": 1, "explanation": "Le push synchronise ton travail local avec le dépôt en ligne."},
              {"q": "Pourquoi versionner même en vibe coding ?", "choices": ["C'est obligatoire légalement", "Pour pouvoir revenir en arrière si une génération IA casse le projet", "Pour impressionner"], "answer": 1, "explanation": "Le versionnage est le filet de sécurité qui rend l'itération sans risque."}
            ],
            "micro_project": {
              "title": "Ton projet sur GitHub",
              "brief": "Mets ton projet en cours sur GitHub avec un README qui présente le projet.",
              "steps": [
                "Crée un dépôt GitHub pour ton projet",
                "Fais versionner et pousser le code (ton outil IA peut le faire)",
                "Ajoute un README court : quoi, pour qui, comment lancer"
              ],
              "deliverable": "Colle le lien de ton dépôt GitHub."
            },
            "xp_reward": 70,
            "duration_minutes": 50,
            "sort_order": 10
          },
          {
            "slug": "deployer-sur-vercel",
            "title": "Deployer ton projet sur Vercel",
            "intro": "Vercel connecte ton dépôt GitHub et publie ton projet sur une URL publique en quelques minutes. Chaque push déclenche automatiquement un nouveau déploiement.",
            "why_important": "Un projet en ligne, c'est un projet réel : tu peux le partager, recueillir des retours et itérer. C'est l'aboutissement du parcours.",
            "how_to_use": "Suis le guide de démarrage Vercel en connectant ton dépôt GitHub, puis vérifie ton URL publique.",
            "objectives": [
              "Connecter GitHub a Vercel",
              "Deployer ton projet sur une URL publique",
              "Comprendre le deploiement continu"
            ],
            "resources": [
              {"label": "Getting started (Vercel Docs)", "url": "https://vercel.com/docs/getting-started-with-vercel", "kind": "doc", "why": "Le guide officiel du premier déploiement.", "how": "Suis les étapes import project depuis GitHub jusqu'à l'URL publique."},
              {"label": "Environment variables (Vercel Docs)", "url": "https://vercel.com/docs/environment-variables", "kind": "doc", "why": "Configurer tes clés API côté production sans les exposer.", "how": "Ajoute tes variables avant le premier déploiement si ton projet en utilise."}
            ],
            "quiz": [
              {"q": "Que fait Vercel ?", "choices": ["Il héberge et publie ton projet web sur une URL publique", "Il écrit le code à ta place", "Il remplace GitHub"], "answer": 0, "explanation": "Vercel transforme ton dépôt en site accessible à tous."},
              {"q": "Que se passe-t-il quand tu pousses un nouveau commit ?", "choices": ["Rien", "Vercel re-déploie automatiquement la nouvelle version", "Le site est supprimé"], "answer": 1, "explanation": "C'est le déploiement continu : chaque push met le site à jour."},
              {"q": "Où configurer les clés API pour la production ?", "choices": ["Dans le code", "Dans les variables d'environnement du projet Vercel", "Dans le README"], "answer": 1, "explanation": "Les variables d'environnement Vercel restent secrètes et hors du code."}
            ],
            "micro_project": {
              "title": "Ton projet en ligne",
              "brief": "Déploie ton projet sur Vercel et partage l'URL publique.",
              "steps": [
                "Importe ton dépôt GitHub dans Vercel",
                "Configure les variables d'environnement si nécessaire",
                "Vérifie que le site fonctionne et récupère l'URL publique"
              ],
              "deliverable": "Colle l'URL publique de ton projet déployé et une phrase sur la suite que tu envisages."
            },
            "xp_reward": 80,
            "duration_minutes": 50,
            "sort_order": 20
          }
        ]
      }
    ]
  },
  {
    "track": {
      "slug": "dev-web-assiste-ia",
      "goal_key": "ai_dev_web",
      "title": "Parcours Developpement Web assiste par IA",
      "summary": "Apprendre reellement le developpement web en utilisant l'IA comme accelerateur.",
      "description": "HTML, CSS, JavaScript, Git, React, Next.js, Supabase et déploiement : tu apprends à lire, modifier et écrire du code, avec l'IA comme copilote et non comme béquille. Chaque leçon s'appuie sur les meilleures ressources du web.",
      "level_label": "Debutant +",
      "duration_weeks": 12,
      "accent_color": "#10B981",
      "icon": "lucide:code-2",
      "objective": "Développer et publier une application web complète en comprenant ton code.",
      "resources": ["MDN Web Docs", "React Docs", "Next.js Learn", "Supabase Docs"],
      "next_session": "Lundi 20h00",
      "next_steps": [
        {"label": "Fondations HTML et CSS", "state": "current"},
        {"label": "JavaScript et interactivite", "state": "locked"},
        {"label": "React, Next.js et mise en ligne", "state": "locked"}
      ],
      "sort_order": 3
    },
    "modules": [
      {
        "slug": "fondations-html-css",
        "title": "Fondations du Web : HTML et CSS",
        "summary": "Structurer et styler des pages web.",
        "sort_order": 10,
        "lessons": [
          {
            "slug": "html-structurer-une-page",
            "title": "HTML : structurer une page",
            "intro": "HTML est le squelette de toute page web : titres, paragraphes, liens, images, formulaires. Chaque élément a une balise, et les balises sémantiques donnent du sens à ta structure.",
            "why_important": "Tout le web repose sur HTML. Savoir le lire te permet de comprendre ce que l'IA génère et de repérer ses erreurs.",
            "how_to_use": "Suis le guide MDN, puis demande à une IA de t'expliquer chaque balise que tu ne connais pas dans une page existante.",
            "objectives": [
              "Structurer une page avec les balises essentielles",
              "Utiliser les balises sémantiques (header, main, footer...)",
              "Lire le HTML d'une page existante"
            ],
            "resources": [
              {"label": "Structurer le web avec HTML (MDN)", "url": "https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Structuring_content", "kind": "doc", "why": "LA référence du web, gratuite et en français.", "how": "Suis les 3 premières sections et code les exemples toi-même."},
              {"label": "HTML Tutorial (W3Schools)", "url": "https://www.w3schools.com/html/", "kind": "doc", "why": "Des exemples interactifs à modifier directement dans le navigateur.", "how": "Utilise les éditeurs Try it Yourself pour expérimenter chaque balise."}
            ],
            "quiz": [
              {"q": "Quel est le rôle du HTML ?", "choices": ["Styler la page", "Structurer le contenu de la page", "Gérer la base de données"], "answer": 1, "explanation": "HTML définit la structure et le sens du contenu ; le style vient du CSS."},
              {"q": "Quelle balise contient le contenu principal d'une page ?", "choices": ["<main>", "<div>", "<span>"], "answer": 0, "explanation": "<main> est la balise sémantique du contenu principal, une seule par page."},
              {"q": "Pourquoi utiliser des balises sémantiques ?", "choices": ["Elles chargent plus vite", "Elles donnent du sens au contenu pour les navigateurs, le SEO et l'accessibilité", "Elles sont obligatoires"], "answer": 1, "explanation": "La sémantique aide les moteurs de recherche et les lecteurs d'écran."}
            ],
            "micro_project": {
              "title": "Ta page profil en HTML pur",
              "brief": "Code à la main une page profil : ton nom, une photo, une bio, tes liens. Sans CSS, sans IA pour le code (l'IA peut expliquer, pas écrire).",
              "steps": [
                "Structure la page : header, main, footer",
                "Ajoute titre, image, paragraphe de bio et liste de liens",
                "Valide ton code sur validator.w3.org"
              ],
              "deliverable": "Colle ton code HTML complet."
            },
            "xp_reward": 60,
            "duration_minutes": 60,
            "sort_order": 10
          },
          {
            "slug": "css-styler-ta-page",
            "title": "CSS : styler ta page",
            "intro": "CSS contrôle l'apparence : couleurs, typographie, espacements, mise en page. Les sélecteurs ciblent les éléments, les propriétés les transforment, et flexbox organise la mise en page moderne.",
            "why_important": "Le CSS fait la différence entre une page brute et un produit crédible. Et c'est la première chose que tu voudras ajuster dans du code généré par IA.",
            "how_to_use": "Suis le guide MDN, puis style ta page profil de la leçon précédente.",
            "objectives": [
              "Utiliser sélecteurs et propriétés de base",
              "Maîtriser le modèle de boîte (marges, padding, bordures)",
              "Créer une mise en page avec flexbox"
            ],
            "resources": [
              {"label": "Apprendre a styler le HTML avec CSS (MDN)", "url": "https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Styling_basics", "kind": "doc", "why": "Le parcours CSS de reference, progressif et en francais.", "how": "Suis les premieres sections et experimente chaque propriete."},
              {"label": "Flexbox Froggy", "url": "https://flexboxfroggy.com/#fr", "kind": "tool", "why": "Apprendre flexbox en jouant : le meilleur investissement de 30 minutes.", "how": "Termine les 24 niveaux du jeu."}
            ],
            "quiz": [
              {"q": "Que fait un selecteur CSS ?", "choices": ["Il cible les elements HTML auxquels appliquer un style", "Il cree des elements", "Il supprime le HTML"], "answer": 0, "explanation": "Le selecteur cible, les proprietes stylent."},
              {"q": "Dans le modele de boite, qu'est-ce que le padding ?", "choices": ["L'espace entre le contenu et la bordure", "L'espace en dehors de la bordure", "La couleur de fond"], "answer": 0, "explanation": "Padding = interieur, margin = exterieur de la bordure."},
              {"q": "A quoi sert flexbox ?", "choices": ["A aligner et distribuer des elements dans un conteneur", "A ajouter des animations", "A charger des images"], "answer": 0, "explanation": "Flexbox est l'outil de base de la mise en page moderne."}
            ],
            "micro_project": {
              "title": "Ta page profil stylee",
              "brief": "Style ta page profil HTML avec un fichier CSS : couleurs, typographie, mise en page flexbox.",
              "steps": [
                "Cree un fichier CSS lie a ta page",
                "Definis une palette (fond, texte, accent) et une typographie",
                "Organise les sections avec flexbox et soigne les espacements"
              ],
              "deliverable": "Colle ton code CSS et decris ton choix de palette en 2 lignes."
            },
            "xp_reward": 60,
            "duration_minutes": 60,
            "sort_order": 20
          }
        ]
      },
      {
        "slug": "javascript-interactivite",
        "title": "JavaScript et interactivite",
        "summary": "Les bases du langage et la manipulation du DOM.",
        "sort_order": 20,
        "lessons": [
          {
            "slug": "bases-javascript",
            "title": "JavaScript : les bases du langage",
            "intro": "JavaScript est le langage de la logique : variables, conditions, boucles, fonctions. C'est lui qui transforme une page statique en application vivante.",
            "why_important": "JavaScript est le langage le plus utilise au monde et la base de React et Next.js. Le comprendre te rend autonome face au code genere par l'IA.",
            "how_to_use": "Suis les guides MDN et javascript.info en codant chaque exemple, puis fais expliquer par une IA tout concept flou.",
            "objectives": [
              "Manipuler variables, conditions et boucles",
              "Ecrire et appeler des fonctions",
              "Lire un script simple et predire son resultat"
            ],
            "resources": [
              {"label": "Premiers pas en JavaScript (MDN)", "url": "https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting", "kind": "doc", "why": "Le parcours officiel pour debuter proprement.", "how": "Suis les sections variables, maths, texte et logique."},
              {"label": "The Modern JavaScript Tutorial", "url": "https://javascript.info/", "kind": "doc", "why": "Le tutoriel JS le plus complet du web, avec exercices corriges.", "how": "Utilise la partie 1 (fundamentals) comme reference d'approfondissement."}
            ],
            "quiz": [
              {"q": "Comment declare-t-on une variable moderne en JavaScript ?", "choices": ["var x = 1 uniquement", "let x = 1 ou const x = 1", "variable x = 1"], "answer": 1, "explanation": "let pour les valeurs qui changent, const pour les constantes ; var est l'ancienne syntaxe."},
              {"q": "Que fait une fonction ?", "choices": ["Elle regroupe du code reutilisable qui peut recevoir des parametres et retourner un resultat", "Elle stocke une image", "Elle style la page"], "answer": 0, "explanation": "Les fonctions sont les briques de base de toute logique."},
              {"q": "Que vaut 2 + '2' en JavaScript ?", "choices": ["4", "'22'", "Une erreur"], "answer": 1, "explanation": "Le nombre est converti en texte : c'est une concatenation. Ce genre de piege justifie d'apprendre les types."}
            ],
            "micro_project": {
              "title": "Mini calculateur",
              "brief": "Code un script qui calcule le budget mensuel d'un projet : une fonction qui recoit des couts et retourne le total avec un message.",
              "steps": [
                "Cree une fonction qui additionne un tableau de couts",
                "Ajoute une condition : si le total depasse un seuil, message d'alerte",
                "Teste avec 3 jeux de donnees differents dans la console"
              ],
              "deliverable": "Colle ton code et le resultat de tes 3 tests."
            },
            "xp_reward": 70,
            "duration_minutes": 60,
            "sort_order": 10
          },
          {
            "slug": "dom-et-interactivite",
            "title": "Le DOM : rendre ta page interactive",
            "intro": "Le DOM est la representation vivante de ta page : JavaScript peut lire et modifier chaque element, reagir aux clics et aux saisies. C'est le pont entre ton code et l'utilisateur.",
            "why_important": "Boutons, formulaires, affichages dynamiques : toute l'interactivite du web passe par le DOM. C'est aussi la base pour comprendre ce que React automatise.",
            "how_to_use": "Suis le guide MDN sur les evenements, puis construis le micro projet sans framework.",
            "objectives": [
              "Selectionner et modifier des elements avec JavaScript",
              "Reagir aux evenements (clic, saisie)",
              "Construire une petite interaction complete"
            ],
            "resources": [
              {"label": "Introduction aux evenements (MDN)", "url": "https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting/Events", "kind": "doc", "why": "Comprendre comment le code reagit aux actions utilisateur.", "how": "Code les exemples de addEventListener toi-meme."},
              {"label": "Manipuler des documents (MDN)", "url": "https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting/DOM_scripting", "kind": "doc", "why": "La reference sur querySelector et la modification du DOM.", "how": "Lis la section active learning et reproduis-la."}
            ],
            "quiz": [
              {"q": "Que fait document.querySelector('#total') ?", "choices": ["Il selectionne l'element dont l'id est total", "Il supprime l'element total", "Il cree un element total"], "answer": 0, "explanation": "querySelector cible un element via un selecteur CSS."},
              {"q": "Comment reagir a un clic sur un bouton ?", "choices": ["Avec addEventListener('click', maFonction)", "Avec waitForClick()", "C'est impossible en JavaScript"], "answer": 0, "explanation": "addEventListener attache une fonction a un evenement."},
              {"q": "Qu'est-ce que le DOM ?", "choices": ["Un langage de style", "La representation en memoire de la page, manipulable par JavaScript", "Un serveur web"], "answer": 1, "explanation": "Le DOM est l'arbre des elements de la page, vivant et modifiable."}
            ],
            "micro_project": {
              "title": "Ta todo-list en JavaScript pur",
              "brief": "Construis une mini todo-list : un champ, un bouton ajouter, une liste, et la possibilite de marquer une tache comme faite.",
              "steps": [
                "Cree le HTML : input, bouton, liste vide",
                "Au clic, ajoute la valeur du champ dans la liste",
                "Au clic sur une tache, barre-la (classe CSS)"
              ],
              "deliverable": "Colle ton code HTML/CSS/JS complet."
            },
            "xp_reward": 80,
            "duration_minutes": 75,
            "sort_order": 20
          }
        ]
      },
      {
        "slug": "git-et-github",
        "title": "Git et GitHub",
        "summary": "Versionner ton code et le publier.",
        "sort_order": 30,
        "lessons": [
          {
            "slug": "git-versionner",
            "title": "Git : versionner ton code",
            "intro": "Git enregistre chaque version de ton projet en local : tu peux experimenter sans peur, revenir en arriere, et comprendre l'evolution de ton code commit par commit.",
            "why_important": "Git est utilise sur la quasi-totalite des projets professionnels. C'est aussi le prerequis du deploiement et de la collaboration.",
            "how_to_use": "Lis les premiers chapitres du livre Pro Git (gratuit, en francais), puis pratique dans ton terminal.",
            "objectives": [
              "Initialiser un depot et faire des commits",
              "Lire l'historique de ton projet",
              "Comprendre les branches"
            ],
            "resources": [
              {"label": "Pro Git : demarrage rapide (git-scm)", "url": "https://git-scm.com/book/fr/v2/D%C3%A9marrage-rapide-%C3%80-propos-de-la-gestion-de-version", "kind": "doc", "why": "Le livre officiel de Git, gratuit et traduit en francais.", "how": "Lis les chapitres 1 et 2 en pratiquant chaque commande."},
              {"label": "Learn Git Branching", "url": "https://learngitbranching.js.org/?locale=fr_FR", "kind": "tool", "why": "Visualiser les branches en jouant : le concept le plus dur devient limpide.", "how": "Fais la sequence d'introduction (4 premiers niveaux)."}
            ],
            "quiz": [
              {"q": "Que fait git commit ?", "choices": ["Il envoie le code sur internet", "Il enregistre une version de ton projet en local avec un message", "Il supprime les fichiers"], "answer": 1, "explanation": "Le commit est local ; c'est le push qui envoie vers GitHub."},
              {"q": "A quoi sert une branche ?", "choices": ["A travailler sur une evolution sans toucher a la version principale", "A accelerer le code", "A styler la page"], "answer": 0, "explanation": "La branche isole ton travail ; tu fusionnes quand c'est pret."},
              {"q": "Quelle commande montre l'etat de ton depot ?", "choices": ["git status", "git show-me", "git etat"], "answer": 0, "explanation": "git status est la commande la plus utilisee de Git."}
            ],
            "micro_project": {
              "title": "Ton historique propre",
              "brief": "Mets ta todo-list (lecon precedente) sous Git avec un historique propre.",
              "steps": [
                "Initialise un depot git dans le dossier de ta todo-list",
                "Fais 3 commits distincts avec des messages clairs (structure, style, logique)",
                "Affiche l'historique avec git log"
              ],
              "deliverable": "Colle la sortie de git log --oneline et tes 3 messages de commit."
            },
            "xp_reward": 60,
            "duration_minutes": 50,
            "sort_order": 10
          },
          {
            "slug": "github-publier",
            "title": "GitHub : publier et collaborer",
            "intro": "GitHub heberge tes depots Git en ligne : sauvegarde, portfolio public, collaboration par pull requests. C'est le reseau social du code et le point d'entree du deploiement.",
            "why_important": "Ton GitHub est ton CV de createur : chaque projet publie prouve tes competences. Et sans GitHub, pas de deploiement automatise.",
            "how_to_use": "Suis le guide Hello World officiel, puis pousse ton projet et soigne son README.",
            "objectives": [
              "Pousser un depot local vers GitHub",
              "Rediger un README utile",
              "Comprendre le principe des pull requests"
            ],
            "resources": [
              {"label": "Hello World (GitHub Docs)", "url": "https://docs.github.com/en/get-started/start-your-journey/hello-world", "kind": "doc", "why": "Le tutoriel officiel : depot, branche, commit, pull request.", "how": "Suis-le en entier, il couvre tout le cycle de base."},
              {"label": "About READMEs (GitHub Docs)", "url": "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes", "kind": "doc", "why": "Le README est la vitrine de chaque projet.", "how": "Lis la structure recommandee et applique-la a ton projet."}
            ],
            "quiz": [
              {"q": "Quelle difference entre Git et GitHub ?", "choices": ["Aucune", "Git versionne en local, GitHub heberge et partage les depots en ligne", "GitHub est plus ancien que Git"], "answer": 1, "explanation": "Git est l'outil, GitHub est la plateforme construite autour."},
              {"q": "Qu'est-ce qu'une pull request ?", "choices": ["Une proposition de modifications a examiner avant fusion", "Un telechargement", "Une erreur"], "answer": 0, "explanation": "La PR permet la relecture avant d'integrer des changements."},
              {"q": "Que doit contenir un bon README ?", "choices": ["Le mot de passe du serveur", "Ce que fait le projet, pour qui, et comment le lancer", "Uniquement le nom du projet"], "answer": 1, "explanation": "Un README repond aux 3 questions de tout visiteur : quoi, pourquoi, comment."}
            ],
            "micro_project": {
              "title": "Ton premier depot public",
              "brief": "Publie ta todo-list sur GitHub avec un README complet.",
              "steps": [
                "Cree le depot GitHub et pousse ton code",
                "Redige un README : description, capture ou demo, instructions",
                "Verifie que la page du depot est claire pour un inconnu"
              ],
              "deliverable": "Colle le lien de ton depot GitHub public."
            },
            "xp_reward": 60,
            "duration_minutes": 45,
            "sort_order": 20
          }
        ]
      },
      {
        "slug": "react-et-nextjs",
        "title": "React et Next.js",
        "summary": "Construire des interfaces en composants et des applications completes.",
        "sort_order": 40,
        "lessons": [
          {
            "slug": "react-penser-en-composants",
            "title": "React : penser en composants",
            "intro": "React decoupe l'interface en composants reutilisables : chaque composant recoit des props, gere son etat, et se re-affiche automatiquement quand les donnees changent.",
            "why_important": "React est la bibliotheque d'interface la plus demandee du marche et la fondation de Next.js. Les composants sont aussi le vocabulaire de l'IA quand elle genere du front-end.",
            "how_to_use": "Suis le tutoriel officiel react.dev, section Learn, en codant chaque exemple.",
            "objectives": [
              "Creer des composants avec props",
              "Gerer un etat local avec useState",
              "Comprendre le re-rendu automatique"
            ],
            "resources": [
              {"label": "Quick Start (react.dev)", "url": "https://react.dev/learn", "kind": "doc", "why": "Le tutoriel officiel, moderne et interactif.", "how": "Fais la section Quick Start puis Tutorial: Tic-Tac-Toe."},
              {"label": "Penser en React (react.dev)", "url": "https://fr.react.dev/learn/thinking-in-react", "kind": "doc", "why": "La methode officielle pour decouper une interface en composants.", "how": "Lis-la puis applique les 5 etapes au micro projet."}
            ],
            "quiz": [
              {"q": "Qu'est-ce qu'un composant React ?", "choices": ["Une fonction qui retourne de l'interface (JSX) reutilisable", "Un fichier CSS", "Une base de donnees"], "answer": 0, "explanation": "Un composant = une fonction qui produit un morceau d'interface."},
              {"q": "A quoi servent les props ?", "choices": ["A passer des donnees d'un composant parent a un enfant", "A styler la page", "A creer des serveurs"], "answer": 0, "explanation": "Les props sont les parametres d'un composant."},
              {"q": "Que fait useState ?", "choices": ["Il cree une variable d'etat qui declenche un re-affichage quand elle change", "Il supprime un composant", "Il appelle une API"], "answer": 0, "explanation": "L'etat est la memoire du composant ; sa modification met a jour l'interface."}
            ],
            "micro_project": {
              "title": "Ta carte profil en React",
              "brief": "Recree ta page profil sous forme de composant React reutilisable : un composant ProfileCard qui recoit nom, bio et liens en props.",
              "steps": [
                "Cree le composant ProfileCard avec ses props",
                "Affiche 3 cartes avec des donnees differentes",
                "Ajoute un bouton like avec un compteur useState"
              ],
              "deliverable": "Colle le code de ton composant et de son utilisation."
            },
            "xp_reward": 80,
            "duration_minutes": 90,
            "sort_order": 10
          },
          {
            "slug": "nextjs-application-complete",
            "title": "Next.js : ton application complete",
            "intro": "Next.js transforme React en framework complet : pages et routing par dossiers, rendu cote serveur, API integrees. C'est l'outil avec lequel des millions d'applications sont construites, TakaCode y compris.",
            "why_important": "Next.js est le standard de facto pour les applications React en production : l'apprendre te donne la stack complete front + back.",
            "how_to_use": "Suis le cours officiel Next.js Learn : il construit une vraie application de bout en bout.",
            "objectives": [
              "Creer une application Next.js avec plusieurs pages",
              "Comprendre le routing par dossiers (App Router)",
              "Distinguer composants serveur et client"
            ],
            "resources": [
              {"label": "Next.js Learn", "url": "https://nextjs.org/learn", "kind": "doc", "why": "Le cours officiel gratuit qui construit une application complete.", "how": "Fais les chapitres 1 a 5 pour cette lecon ; la suite viendra avec la pratique."},
              {"label": "App Router (Next.js Docs)", "url": "https://nextjs.org/docs/app", "kind": "doc", "why": "La reference du systeme de routing moderne.", "how": "Lis la page d'introduction pour comprendre dossiers = routes."}
            ],
            "quiz": [
              {"q": "Comment cree-t-on une page /contact dans l'App Router ?", "choices": ["Un fichier app/contact/page.js", "Un fichier contact.html", "Une ligne dans un fichier de configuration"], "answer": 0, "explanation": "Le routing suit la structure des dossiers dans app/."},
              {"q": "Qu'apporte Next.js par rapport a React seul ?", "choices": ["Routing, rendu serveur, API et optimisations integres", "De nouvelles couleurs", "Rien"], "answer": 0, "explanation": "Next.js est le cadre de production autour de React."},
              {"q": "Qu'est-ce qu'un composant serveur ?", "choices": ["Un composant rendu sur le serveur, ideal pour charger des donnees", "Un composant qui plante", "Un serveur physique"], "answer": 0, "explanation": "Par defaut dans l'App Router, les composants s'executent cote serveur."}
            ],
            "micro_project": {
              "title": "Ton site multi-pages",
              "brief": "Cree une application Next.js de 3 pages pour ton projet : accueil, a propos, contact, avec une navigation commune.",
              "steps": [
                "Cree l'application avec npx create-next-app",
                "Ajoute les pages accueil, a-propos et contact",
                "Cree un composant de navigation partage dans le layout"
              ],
              "deliverable": "Colle la structure de tes dossiers et le code de ton layout."
            },
            "xp_reward": 90,
            "duration_minutes": 90,
            "sort_order": 20
          }
        ]
      },
      {
        "slug": "backend-et-mise-en-ligne",
        "title": "Backend et mise en ligne",
        "summary": "Base de donnees, APIs et deploiement de ton application.",
        "sort_order": 50,
        "lessons": [
          {
            "slug": "supabase-base-de-donnees",
            "title": "Supabase : base de donnees et authentification",
            "intro": "Supabase te donne une base de donnees PostgreSQL, l'authentification et des APIs auto-generees, le tout gratuit pour demarrer. C'est le backend des createurs de MVP.",
            "why_important": "Une application sans donnees persistantes n'est qu'une vitrine. Supabase te permet d'ajouter comptes utilisateurs et donnees reelles sans construire un serveur.",
            "how_to_use": "Cree un projet Supabase gratuit et suis le quickstart Next.js officiel.",
            "objectives": [
              "Creer un projet Supabase et une table",
              "Lire et ecrire des donnees depuis Next.js",
              "Comprendre le role de l'authentification et de la securite RLS"
            ],
            "resources": [
              {"label": "Use Supabase with Next.js", "url": "https://supabase.com/docs/guides/getting-started/quickstarts/nextjs", "kind": "doc", "why": "Le quickstart officiel : de zero a des donnees affichees.", "how": "Suis-le en entier avec ton propre projet Supabase."},
              {"label": "Row Level Security (Supabase Docs)", "url": "https://supabase.com/docs/guides/database/postgres/row-level-security", "kind": "doc", "why": "La securite des donnees, indispensable avant toute mise en ligne.", "how": "Lis l'introduction : chaque table exposee doit avoir ses regles."}
            ],
            "quiz": [
              {"q": "Que fournit Supabase ?", "choices": ["Base de donnees PostgreSQL, authentification et APIs auto-generees", "Uniquement de l'hebergement de fichiers", "Un editeur de code"], "answer": 0, "explanation": "Supabase regroupe les briques backend essentielles d'un MVP."},
              {"q": "A quoi sert la Row Level Security (RLS) ?", "choices": ["A controler quelles lignes chaque utilisateur peut lire ou modifier", "A accelerer les requetes", "A changer les couleurs du dashboard"], "answer": 0, "explanation": "Sans RLS, tout utilisateur pourrait lire les donnees des autres."},
              {"q": "Ou stocker les cles Supabase dans un projet Next.js ?", "choices": ["Dans le fichier .env.local, jamais dans le code", "Dans le README", "Dans un commentaire du code"], "answer": 0, "explanation": "Les cles vivent dans les variables d'environnement."}
            ],
            "micro_project": {
              "title": "Tes premieres donnees reelles",
              "brief": "Connecte ton application Next.js a Supabase : une table taches affichee sur une page.",
              "steps": [
                "Cree un projet Supabase et une table taches avec 3 lignes",
                "Connecte ton app avec les cles d'environnement",
                "Affiche les taches sur une page de ton application"
              ],
              "deliverable": "Colle le code de ta page qui lit les donnees et decris le resultat affiche."
            },
            "xp_reward": 90,
            "duration_minutes": 90,
            "sort_order": 10
          },
          {
            "slug": "api-connecter-des-services",
            "title": "Les APIs : connecter des services",
            "intro": "Une API permet a ton application de dialoguer avec d'autres services : meteo, paiement, IA... Tu envoies une requete HTTP, tu recois du JSON, tu l'affiches.",
            "why_important": "Les APIs demultiplient ce que ton application peut faire sans que tu codes chaque fonctionnalite. C'est aussi comme ca que tu integreras l'IA dans tes produits.",
            "how_to_use": "Lis le guide MDN sur fetch, puis consomme une API publique dans le micro projet.",
            "objectives": [
              "Comprendre requete, reponse et JSON",
              "Utiliser fetch pour appeler une API",
              "Gerer les erreurs et les etats de chargement"
            ],
            "resources": [
              {"label": "Utiliser l'API Fetch (MDN)", "url": "https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch", "kind": "doc", "why": "La reference de l'appel reseau en JavaScript.", "how": "Lis la premiere moitie et code l'exemple de base."},
              {"label": "Public APIs (GitHub)", "url": "https://github.com/public-apis/public-apis", "kind": "repo", "why": "Un catalogue geant d'APIs gratuites pour s'entrainer.", "how": "Choisis-y une API sans authentification pour le micro projet."}
            ],
            "quiz": [
              {"q": "Que retourne generalement une API web ?", "choices": ["Du JSON", "Un fichier Word", "Une image uniquement"], "answer": 0, "explanation": "Le JSON est le format d'echange standard des APIs."},
              {"q": "Que fait fetch('https://api.exemple.com/data') ?", "choices": ["Il envoie une requete HTTP et retourne une promesse de reponse", "Il telecharge un logiciel", "Il cree une base de donnees"], "answer": 0, "explanation": "fetch est asynchrone : la reponse arrive via une promesse."},
              {"q": "Pourquoi gerer le cas d'erreur d'un appel API ?", "choices": ["Le reseau ou le service peuvent echouer : l'application doit rester utilisable", "Pour ralentir l'application", "Ce n'est jamais utile"], "answer": 0, "explanation": "Toujours prevoir l'echec : message clair plutot que page cassee."}
            ],
            "micro_project": {
              "title": "Ta page connectee au monde",
              "brief": "Ajoute a ton application une page qui affiche des donnees d'une API publique de ton choix.",
              "steps": [
                "Choisis une API publique gratuite",
                "Appelle-la avec fetch et affiche les donnees",
                "Ajoute un etat de chargement et un message d'erreur"
              ],
              "deliverable": "Colle ton code et decris l'API choisie."
            },
            "xp_reward": 80,
            "duration_minutes": 75,
            "sort_order": 20
          },
          {
            "slug": "deploiement-mise-en-ligne",
            "title": "Deployer : ton application en ligne",
            "intro": "Derniere etape : publier. Vercel connecte ton depot GitHub et deploie ton application Next.js sur une URL publique, avec redeploiement automatique a chaque push.",
            "why_important": "Un projet en ligne devient reel : partageable, testable, ajoutable a ton portfolio. C'est l'objectif de tout ce parcours.",
            "how_to_use": "Suis le guide Vercel, configure tes variables d'environnement Supabase, et verifie chaque page en production.",
            "objectives": [
              "Deployer ton application Next.js sur Vercel",
              "Configurer les variables d'environnement en production",
              "Verifier et partager ton application publiee"
            ],
            "resources": [
              {"label": "Getting started (Vercel Docs)", "url": "https://vercel.com/docs/getting-started-with-vercel", "kind": "doc", "why": "Le guide officiel du deploiement depuis GitHub.", "how": "Suis les etapes import project jusqu'a l'URL publique."},
              {"label": "Deploying (Next.js Docs)", "url": "https://nextjs.org/docs/app/getting-started/deploying", "kind": "doc", "why": "Les specificites du deploiement Next.js.", "how": "Parcours la page avant ton premier deploiement."}
            ],
            "quiz": [
              {"q": "Quel est le prerequis pour deployer sur Vercel ?", "choices": ["Un depot GitHub (ou GitLab/Bitbucket) contenant ton projet", "Un serveur physique", "Une licence payante"], "answer": 0, "explanation": "Vercel se branche sur ton depot et construit a partir de la."},
              {"q": "Ou configurer les cles Supabase pour la production ?", "choices": ["Dans les variables d'environnement du projet Vercel", "Dans le code source", "Nulle part"], "answer": 0, "explanation": "Les memes cles que ton .env.local, mais configurees cote Vercel."},
              {"q": "Que verifier apres le premier deploiement ?", "choices": ["Chaque page et chaque fonctionnalite en conditions reelles", "Rien, ca marche toujours", "Uniquement la page d'accueil"], "answer": 0, "explanation": "La production a ses surprises : verification complete obligatoire."}
            ],
            "micro_project": {
              "title": "Ton application publiee",
              "brief": "Deploie ton application complete (Next.js + Supabase) sur Vercel et partage-la.",
              "steps": [
                "Pousse la derniere version sur GitHub",
                "Importe le projet dans Vercel avec les variables d'environnement",
                "Teste toutes les pages en production et corrige si besoin"
              ],
              "deliverable": "Colle l'URL publique de ton application et 2 choses que tu ameliorerais ensuite."
            },
            "xp_reward": 100,
            "duration_minutes": 60,
            "sort_order": 30
          }
        ]
      }
    ]
  }
]
$json$::jsonb;

  track_entry jsonb;
  module_entry jsonb;
  lesson_entry jsonb;
  v_track jsonb;
  v_track_id uuid;
  v_module_id uuid;
begin
  for track_entry in select * from jsonb_array_elements(seed) loop
    v_track := track_entry -> 'track';

    insert into public.learning_tracks (
      slug, goal_key, title, summary, description, level_label, duration_weeks,
      accent_color, icon, objective, resources, next_session, next_steps, sort_order
    )
    values (
      v_track ->> 'slug',
      v_track ->> 'goal_key',
      v_track ->> 'title',
      v_track ->> 'summary',
      v_track ->> 'description',
      v_track ->> 'level_label',
      (v_track ->> 'duration_weeks')::integer,
      v_track ->> 'accent_color',
      v_track ->> 'icon',
      v_track ->> 'objective',
      coalesce(v_track -> 'resources', '[]'::jsonb),
      v_track ->> 'next_session',
      coalesce(v_track -> 'next_steps', '[]'::jsonb),
      (v_track ->> 'sort_order')::integer
    )
    on conflict (slug) do update
      set goal_key = excluded.goal_key,
          title = excluded.title,
          summary = excluded.summary,
          description = excluded.description,
          level_label = excluded.level_label,
          duration_weeks = excluded.duration_weeks,
          accent_color = excluded.accent_color,
          icon = excluded.icon,
          objective = excluded.objective,
          resources = excluded.resources,
          next_session = excluded.next_session,
          next_steps = excluded.next_steps,
          is_published = true,
          is_active = true,
          sort_order = excluded.sort_order,
          updated_at = timezone('utc'::text, now())
    returning id into v_track_id;

    for module_entry in select * from jsonb_array_elements(track_entry -> 'modules') loop
      insert into public.track_modules (track_id, slug, title, summary, sort_order, is_published)
      values (
        v_track_id,
        module_entry ->> 'slug',
        module_entry ->> 'title',
        coalesce(module_entry ->> 'summary', ''),
        (module_entry ->> 'sort_order')::integer,
        true
      )
      on conflict (track_id, slug) do update
        set title = excluded.title,
            summary = excluded.summary,
            sort_order = excluded.sort_order,
            is_published = true
      returning id into v_module_id;

      for lesson_entry in select * from jsonb_array_elements(module_entry -> 'lessons') loop
        insert into public.track_lessons (
          module_id, slug, title, intro, why_important, how_to_use,
          objectives, resources, quiz, micro_project,
          xp_reward, duration_minutes, sort_order, is_published
        )
        values (
          v_module_id,
          lesson_entry ->> 'slug',
          lesson_entry ->> 'title',
          coalesce(lesson_entry ->> 'intro', ''),
          coalesce(lesson_entry ->> 'why_important', ''),
          coalesce(lesson_entry ->> 'how_to_use', ''),
          coalesce(lesson_entry -> 'objectives', '[]'::jsonb),
          coalesce(lesson_entry -> 'resources', '[]'::jsonb),
          coalesce(lesson_entry -> 'quiz', '[]'::jsonb),
          coalesce(lesson_entry -> 'micro_project', '{}'::jsonb),
          coalesce((lesson_entry ->> 'xp_reward')::integer, 50),
          coalesce((lesson_entry ->> 'duration_minutes')::integer, 45),
          (lesson_entry ->> 'sort_order')::integer,
          true
        )
        on conflict (module_id, slug) do update
          set title = excluded.title,
              intro = excluded.intro,
              why_important = excluded.why_important,
              how_to_use = excluded.how_to_use,
              objectives = excluded.objectives,
              resources = excluded.resources,
              quiz = excluded.quiz,
              micro_project = excluded.micro_project,
              xp_reward = excluded.xp_reward,
              duration_minutes = excluded.duration_minutes,
              sort_order = excluded.sort_order,
              is_published = true;
      end loop;
    end loop;
  end loop;
end;
$seed$;
