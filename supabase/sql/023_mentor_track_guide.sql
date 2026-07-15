-- TakaCode - Parcours "Guide Mentor : creer des parcours"
-- Visible uniquement pour les mentors et admins
--
-- Run this after 022_internet_basics_complete.sql

do $seed$
declare
  seed jsonb := $json$
[
  {
    "track": {
      "slug": "guide-mentor-creation-parcours",
      "goal_key": "mentor_guide",
      "title": "Guide Mentor : Creer des parcours",
      "summary": "Apprends a concevoir, structurer et publier des parcours de formation sur TakaCode.",
      "description": "Ce parcours est reserve aux mentors et admins. Il t'apprend a concevoir des parcours de formation complets : definir les objectifs, structurer les modules et les leons, rediger des quiz et des micro-projets, et publier ton parcours sur la plateforme. Chaque etape est accompagnee d'exemples concrets et de bonnes pratiques.",
      "level_label": "Mentor",
      "duration_weeks": 2,
      "accent_color": "#9B6DFF",
      "icon": "lucide:graduation-cap",
      "objective": "Etre capable de creer et publier un parcours de formation complet sur TakaCode.",
      "resources": ["Guide du createur TakaCode", "Templates de parcours", "Bonnes pratiques pedagogiques"],
      "next_session": "Sur demande",
      "next_steps": [
        {"label": "Comprendre la structure d'un parcours", "state": "current"},
        {"label": "Creer les modules et lecons", "state": "locked"},
        {"label": "Rediger quiz et micro-projets", "state": "locked"},
        {"label": "Publier et gerer son parcours", "state": "locked"}
      ],
      "sort_order": 900
    },
    "modules": [
      {
        "slug": "structure-parcours",
        "title": "Comprendre la structure d'un parcours",
        "summary": "L'architecture d'un parcours : track, modules, lecons, quiz, micro-projets.",
        "sort_order": 10,
        "lessons": [
          {
            "slug": "architecture-takacode",
            "title": "L'architecture de TakaCode",
            "intro": "TakaCode est organise en parcours (tracks), chacun compose de modules, qui contiennent des lecons. Chaque lecon peut avoir un quiz et un micro-projet. Cette hierarchie est la cle pour creer des formations progressives et engageantes.",
            "why_important": "Comprendre l'architecture t'evite de creer des parcours desorganises. C'est la fondation de toute formation efficace.",
            "how_to_use": "Explore les parcours existants sur TakaCode pour comprendre comment ils sont structures.",
            "objectives": [
              "Comprendre la hierarchie track > module > lecon",
              "Identifier les elements d'une lecon (intro, objectifs, ressources, quiz, projet)",
              "Analyser un parcours existant pour en comprendre la structure"
            ],
            "resources": [
              {"label": "Page admin parcours (TakaCode)", "url": "/admin/parcours", "kind": "tool", "why": "Pour observer la structure des parcours existants.", "how": "Explore 2-3 parcours et note leur organisation."},
              {"label": "Schema de la base de donnees", "url": "/admin", "kind": "tool", "why": "Pour comprendre les tables track_modules et track_lessons.", "how": "Observe les relations entre les tables."}
            ],
            "quiz": [
              {"q": "Quelle est la hierarchie d'un parcours TakaCode ?", "choices": ["Track > Module > Lecon", "Lecon > Module > Track", "Module > Track > Lecon"], "answer": 0, "explanation": "Un track contient des modules, qui contiennent des lecons."},
              {"q": "Quels elements peut avoir une lecon ?", "choices": ["Intro, objectifs, ressources, quiz, micro-projet", "Uniquement du texte", "Uniquement un quiz"], "answer": 0, "explanation": "Une lecon riche combine texte, objectifs, ressources, quiz et projet."},
              {"q": "A quoi sert le champ 'goal_key' d'un parcours ?", "choices": ["A categoriser le parcours par objectif utilisateur", "A stocker le slug", "A definir l'ordre d'affichage"], "answer": 0, "explanation": "Le goal_key lie le parcours a un objectif de l'onboarding (ex: website, mobile_app)."},
              {"q": "Qu'est-ce qu'un micro-projet ?", "choices": ["Un exercice pratique qui applique les notions apprises", "Un quiz a reponse unique", "Un document a telecharger"], "answer": 0, "explanation": "Le micro-projet est la mise en pratique concrète des acquis."},
              {"q": "Combien de lecons recommandees par module ?", "choices": ["2 a 5 lecons", "1 seule lecon", "10 lecons minimum"], "answer": 0, "explanation": "2 a 5 lecons par module est un bon equilibre entre profondeur et accesibilite."}
            ],
            "micro_project": {
              "title": "Analyse un parcours existant",
              "brief": "Choisis un parcours TakaCode et analyse sa structure en profondeur.",
              "steps": [
                "Choisis un parcours sur TakaCode",
                "Liste les modules et les lecons de chaque module",
                "Identifie les elements de chaque lecon (objectifs, quiz, projet)",
                "Note ce qui fonctionne bien et ce qui pourrait etre ameliore"
              ],
              "deliverable": "Un document decrivant la structure du parcours analyse avec tes recommandations."
            },
            "xp_reward": 50,
            "duration_minutes": 30,
            "sort_order": 10
          },
          {
            "slug": "principes-pedagogiques",
            "title": "Principes pedagogiques pour createurs",
            "intro": "Creer un parcours efficace ne se limite pas a jeter du contenu. Il faut des principes pedagogiques : objectifs clairs, progression graduelle, pratique active, et feedback immediat.",
            "why_important": "Un parcours sans pédagogie est juste une liste de liens. Les principes pedagogiques font la difference entre un parcours que les gens abandonnent et un parcours qu'ils terminent.",
            "how_to_use": "Lis les principes ci-dessous et applique-les a ton propre parcours.",
            "objectives": [
              "Formuler des objectifs d'apprentissage clairs (Bloom)",
              "Structurer la progression du simple au complexe",
              "Integrer la pratique a chaque etape",
              "Donner un feedback clair et constructif"
            ],
            "resources": [
              {"label": "Taxonomie de Bloom", "url": "https://cft.vanderbilt.edu/guides-sub-pages/blooms-taxonomy/", "kind": "doc", "why": "Pour formuler des objectifs mesurables.", "how": "Utilise les niveaux : memoriser, comprendre, appliquer, analyser, evaluer, creer."},
              {"label": "Bonne pratiques e-learning", "url": "https://www.educationplace.com/articles/best-practices", "kind": "doc", "why": "Recommandations pour la creation de formations.", "how": "Note les 10 commandements."},
              {"label": "Micro-learning (article)", "url": "https://microlearning.com/what-is-microlearning/", "kind": "doc", "why": "Le format court fonctionne mieux en ligne.", "how": "Applique le principe a tes lecons (max 45 min)."}
            ],
            "quiz": [
              {"q": "Selon Bloom, quel est le premier niveau de la pyramide ?", "choices": ["Memoriser / Connaissance", "Creer / Evaluer", "Appliquer"], "answer": 0, "explanation": "La pyramide de Bloom va du plus simple (memoriser) au plus complexe (creer)."},
              {"q": "Pourquoi la pratique est-elle essentielle ?", "choices": ["Pour ancrer les connaissances par l'action", "Pour allonger le parcours", "C'est optionnel"], "answer": 0, "explanation": "On retient 10% de ce qu'on lit, 75% de ce qu'on pratique."},
              {"q": "Quelle est la duree ideale d'une lecon en ligne ?", "choices": ["15 a 45 minutes", "2 heures", "5 minutes"], "answer": 0, "explanation": "Le micro-learning recommande des sessions courtes et focalisees."},
              {"q": "A quoi servent les objectifs d'apprentissage ?", "choices": ["A dire a l'apprenant ce qu'il sera capable de faire", "A decorer la page", "A remplir le texte"], "answer": 0, "explanation": "Les objectifs motivent et donnent un cap clair."},
              {"q": "Quel est le meilleur moyen de donner du feedback ?", "choices": ["Specifique, constructif et oriente amelioration", "Generique ('bien vu')", "Pas de feedback"], "answer": 0, "explanation": "Un feedback utile dit ce qui est bien, ce qui manque, et comment s'ameliorer."}
            ],
            "micro_project": {
              "title": "Definis les objectifs d'un parcours",
              "brief": "Choisis un sujet et formule les objectifs d'apprentissage de ton parcours.",
              "steps": [
                "Choisis un sujet que tu maitrises",
                "Formule 3 a 5 objectifs d'apprentissage utilisant la taxonomie de Bloom",
                "Verifie que chaque objectif est mesurable",
                "Organise-les du plus simple au plus complexe"
              ],
              "deliverable": "La liste des objectifs avec leur niveau de Bloom."
            },
            "xp_reward": 60,
            "duration_minutes": 40,
            "sort_order": 20
          }
        ]
      },
      {
        "slug": "creer-modules-lecons",
        "title": "Creer les modules et les lecons",
        "summary": "Rediger le contenu, structurer les lecons, choisir les ressources.",
        "sort_order": 20,
        "lessons": [
          {
            "slug": "rediger-contenu",
            "title": "Rediger le contenu d'une lecon",
            "intro": "Chaque lecon a une structure fixe sur TakaCode : introduction, pourquoi c'est important, comment travailler, objectifs, et ressources. Savoir remplir chaque champ est la cle d'une lecon efficace.",
            "why_important": "Un contenu bien structure est plus facile a suivre et a maintenir. Les apprenants savent toujours ou ils en sont.",
            "how_to_use": "Suis le template ci-dessous pour rediger tes propres lecons.",
            "objectives": [
              "Rediger une introduction claire et engageante",
              "Justifier l'importance du sujet (pourquoi c'est important)",
              "Donner des instructions pratiques (comment travailler)",
              "Selectionner les meilleures ressources"
            ],
            "resources": [
              {"label": "Exemples de lecons (TakaCode)", "url": "/parcours/bases-internet", "kind": "tool", "why": "Pour observer des lecons bien redigees.", "how": "Analyse 2-3 lecons et note leur structure."},
              {"label": "Guide de redaction technique", "url": "https://developers.google.com/style", "kind": "doc", "why": "Bonnes pratiques de redaction technique.", "how": "Note les regles cles (clarte, concision, exemples)."}
            ],
            "quiz": [
              {"q": "Quels sont les 4 champs principaux d'une lecon ?", "choices": ["Intro, Pourquoi c'est important, Comment travailler, Objectifs", "Titre, Description, Contenu, Quiz", "Titre, Texte, Image, Video"], "answer": 0, "explanation": "Ces 4 champs structurent chaque lecon TakaCode."},
              {"q": "Pourquoi faut-il justifier 'pourquoi c'est important' ?", "choices": ["Pour motiver l'apprenant et donner du contexte", "Pour allonger la page", "C'est optionnel"], "answer": 0, "explanation": "La motivation est un facteur cle de reussite."},
              {"q": "Combien de ressources recommandees par lecon ?", "choices": ["2 a 4 ressources soigneusement selec.tees", "10 liens au hasard", "Aucune"], "answer": 0, "explanation": "Mieux vaut 3 excellentes ressources que 10 mediocre."},
              {"q": "Quel ton adopter dans un parcours technique ?", "choices": ["Direct, pratique, avec des exemples concrets", "Academique et formel", "Familier et humour partout"], "answer": 0, "explanation": "Le ton direct avec des exemples fonctionne le mieux en ligne."},
              {"q": "A quoi sert l'objectif d'apprentissage d'une lecon ?", "choices": ["Dire a l'apprenant ce qu'il sera capable de faire", "Avoir un texte en plus", "Pour le SEO"], "answer": 0, "explanation": "Les objectifs motivent et donnent un cap clair."}
            ],
            "micro_project": {
              "title": "Redige ta premiere lecon",
              "brief": "Redige une lecon complete en utilisant le template TakaCode.",
              "steps": [
                "Choisis un sujet que tu maitrises",
                "Redige l'introduction (2-3 phrases)",
                "Redige 'Pourquoi c'est important' (3 points)",
                "Redige 'Comment travailler' (3 etapes)",
                "Ajoute 3 objectifs et 3 ressources"
              ],
              "deliverable": "Le contenu complet de ta lecon en suivant le template."
            },
            "xp_reward": 60,
            "duration_minutes": 45,
            "sort_order": 10
          },
          {
            "slug": "structurer-modules",
            "title": "Structurer les modules",
            "intro": "Un module regroupe 2 a 5 lecons sur un meme theme. Bien structurer ses modules rend le parcours plus lisible et facilite la progression de l'apprenant.",
            "why_important": "Les modules sont les chapitres de ton parcours. Une bonne organisation evite la confusion et maintient la motivation.",
            "how_to_use": "Regroupe les lecons par theme et definit un ordre logique.",
            "objectives": [
              "Regrouper les lecons par theme coherent",
              "Definir un ordre de progression logique",
              "Ecrire un resume percutant pour chaque module",
              "Definir l'ordre de tri (sort_order)"
            ],
            "resources": [
              {"label": "Exemples de modules (TakaCode)", "url": "/parcours/bases-internet", "kind": "tool", "why": "Pour observer l'organisation des modules.", "how": "Note l'ordre et les themes de chaque module."},
              {"label": "Tableau des modules (admin)", "url": "/admin/parcours", "kind": "tool", "why": "Pour gerer les modules depuis l'admin.", "how": "Observe la structure des modules existants."}
            ],
            "quiz": [
              {"q": "Combien de lecons par module recommandees ?", "choices": ["2 a 5", "1 seule", "10 minimum"], "answer": 0, "explanation": "2 a 5 lecons par module est un bon equilibre."},
              {"q": "Le resume du module doit etre :", "choices": ["Court (1 phrase) et descriptif", "Long et detaille", "Identique au titre"], "answer": 0, "explanation": "Le resume donne un apercu rapide du contenu du module."},
              {"q": "A quoi sert le champ sort_order ?", "choices": ["A definir l'ordre d'affichage des modules", "A nommer le module", "A definir le nombre de lecons"], "answer": 0, "explanation": "Le sort_order determine l'ordre dans lequel les modules apparaissent."},
              {"q": "Comment nommer un module ?", "choices": ["Avec un titre clair et descriptif", "Avec un numero seul", "Avec un acronyme"], "answer": 0, "explanation": "Un titre descriptif aide l'apprenant a savoir quoi attendre."},
              {"q": "Faut-il un resume pour chaque module ?", "choices": ["Oui, c'est important pour la navigation", "Non, c'est optionnel", "Uniquement pour le premier"], "answer": 0, "explanation": "Le resume aide l'apprenant a naviguer entre les modules."}
            ],
            "micro_project": {
              "title": "Structure tes modules",
              "brief": "Organise 3 a 5 modules pour ton parcours.",
              "steps": [
                "Liste toutes les lecons que tu veux creer",
                "Regroupe-les par theme (3-5 modules)",
                "Donne un titre et un resume a chaque module",
                "Definis l'ordre (sort_order) de chaque module"
              ],
              "deliverable": "La structure complete de tes modules avec titres, resumes et ordre."
            },
            "xp_reward": 50,
            "duration_minutes": 30,
            "sort_order": 20
          }
        ]
      },
      {
        "slug": "quiz-micro-projets",
        "title": "Quiz et micro-projets",
        "summary": "Creer des quiz efficaces et des micro-projets pratiques.",
        "sort_order": 30,
        "lessons": [
          {
            "slug": "creer-quiz",
            "title": "Creer des quiz efficaces",
            "intro": "Les quiz verifient les acquis de l'apprenant. Un bon quiz teste la comprehension, pas la memorisation. Chaque question doit etre claire, sans ambiguïte, avec des choix pertinents.",
            "why_important": "Le quiz est le premier moment de verification pour l'apprenant. Il doit etre fair, clair et instructif.",
            "how_to_use": "Suis les regles ci-dessous pour creer tes quiz.",
            "objectives": [
              "Formuler des questions claires et sans ambiguïte",
              "Creer des choix plausibles (pas de 'toutes les reponses ci-dessus')",
              "Rediger des explications pedagogiques",
              "Varier les niveaux de difficulte"
            ],
            "resources": [
              {"label": "Quiz existants (TakaCode)", "url": "/parcours/bases-internet", "kind": "tool", "why": "Pour observer des quiz bien faits.", "how": "Analyse 3-4 quiz et note la qualite des questions."},
              {"label": "Bonne pratiques de quiz", "url": "https://www.thinkific.com/blog/create-online-quiz/", "kind": "doc", "why": "Conseils pour creer des quiz engagesants.", "how": "Note les regles cles."}
            ],
            "quiz": [
              {"q": "Combien de choix recommandes par question ?", "choices": ["3 a 4 choix", "2 choix", "6 choix minimum"], "answer": 0, "explanation": "3-4 choix est le sweet spot : assez pour etre difficile, pas trop pour ne pas decourager."},
              {"q": "Quelle est la pire erreur dans un quiz ?", "choices": ["Une question ambiguë avec plusieurs reponses possibles", "Trop de questions", "Des explications apres chaque reponse"], "answer": 0, "explanation": "L'ambiguïte frustre les apprenants et detruit la confiance."},
              {"q": "A quoi sert l'explication sous chaque reponse ?", "choices": ["A enseigner meme quand l'apprenant se trompe", "A decorer", "C'est optionnel"], "answer": 0, "explanation": "L'explication est un moment d'apprentissage meme en cas d'erreur."},
              {"q": "Faut-il des questions faciles dans un quiz ?", "choices": ["Oui, pour confirmer les bases avant de complexifier", "Non, toutes les questions doivent etre difficiles", "Uniquement les premieres"], "answer": 0, "explanation": "Un quiz equilibre commence facile et devient progressivement plus difficile."},
              {"q": "Peut-on poser des questions ouvertes dans un quiz ?", "choices": ["Oui, avec validation manuelle ou IA", "Non, uniquement des QCM", "Uniquement en mode peer review"], "answer": 0, "explanation": "Les questions ouvertes testent la capacite a synthetiser, mais necessitent une validation."}
            ],
            "micro_project": {
              "title": "Cree un quiz de 5 questions",
              "brief": "Redige un quiz complet pour une de tes lecons.",
              "steps": [
                "Choisis une lecon que tu as redigee",
                "Formule 5 questions progressives (facile a difficile)",
                "Donne 3-4 choix pour chaque question",
                "Redige l'explication pour chaque reponse"
              ],
              "deliverable": "Le quiz complet au format JSON avec questions, choix et explications."
            },
            "xp_reward": 60,
            "duration_minutes": 40,
            "sort_order": 10
          },
          {
            "slug": "creer-micro-projets",
            "title": "Creer des micro-projets pratiques",
            "intro": "Le micro-projet est l'exercice pratique qui ancre les acquis. Il doit etre realisable en 30-60 minutes, avec un livrable clair et des etapes detaillees.",
            "why_important": "C'est via le micro-projet que l'apprenant applique veritablement ce qu'il a appris. C'est le moment le plus important de chaque lecon.",
            "how_to_use": "Suis le template pour creer des micro-projets engagesants.",
            "objectives": [
              "Definir un livrable clair et realisable",
              "Decouper le projet en etapes simples",
              "Choisir le bon mode de validation (auto, IA, pairs, mentor)",
              "Rediger un brief engageant"
            ],
            "resources": [
              {"label": "Micro-projets existants (TakaCode)", "url": "/parcours/bases-internet", "kind": "tool", "why": "Pour observer des projets bien faits.", "how": "Analyse 3-4 micro-projets."},
              {"label": "Guide des modes de validation", "url": "/admin/parcours", "kind": "tool", "why": "Pour comprendre auto, IA, pairs, mentor.", "how": "Note quand utiliser chaque mode."}
            ],
            "quiz": [
              {"q": "Quelle est la duree ideale d'un micro-projet ?", "choices": ["30 a 60 minutes", "5 minutes", "3 heures"], "answer": 0, "explanation": "Assez court pour rester motive, assez long pour etre substantiel."},
              {"q": "Que doit contenir le brief du projet ?", "choices": ["Le contexte, l'objectif et le livrable attendu", "Uniquement le livrable", "Des instructions de code"], "answer": 0, "explanation": "Le brief donne le contexte et la direction."},
              {"q": "Quand utiliser la validation par les pairs ?", "choices": ["Pour les projets creatifs ou subjectifs", "Pour les quiz", "Pour les projets auto-valides"], "answer": 0, "explanation": "Les pairs sont ideaux pour les travaux creatifs ou ouverts."},
              {"q": "Combien d'etapes recommandees par projet ?", "choices": ["2 a 4 etapes simples", "1 seule etape", "10 etapes detaillees"], "answer": 0, "explanation": "Pas trop pour ne pas decourager, assez pour guider."},
              {"q": "Le livrable doit etre :", "choices": ["Clair, concret et verifiable", "Vague et ouvert", "Uniquement un texte"], "answer": 0, "explanation": "Un livrable clair permet de valider la reussite du projet."}
            ],
            "micro_project": {
              "title": "Cree un micro-projet",
              "brief": "Cree un micro-projet complet pour une de tes lecons.",
              "steps": [
                "Choisis une lecon",
                "Definis le livrable (ce que l'apprenant doit produire)",
                "Ecris le brief (contexte + objectif)",
                "Decoupe en 2-4 etapes simples",
                "Choisis le mode de validation"
              ],
              "deliverable": "Le micro-projet complet au format JSON avec brief, etapes et livrable."
            },
            "xp_reward": 60,
            "duration_minutes": 40,
            "sort_order": 20
          }
        ]
      },
      {
        "slug": "publier-gerer",
        "title": "Publier et gerer son parcours",
        "summary": "Soumettre, valider, publier et maintenir un parcours.",
        "sort_order": 40,
        "lessons": [
          {
            "slug": "soumettre-parcours",
            "title": "Soumettre et valider un parcours",
            "intro": "Avant d'etre visible des membres, un parcours doit etre valide par un admin. Ce processus garantit la qualite du contenu sur TakaCode.",
            "why_important": "La validation est un garde-fou de qualite. Elle evite les parcours incomplets ou erronees.",
            "how_to_use": "Suis les etapes pour soumettre ton parcours depuis l'espace mentor.",
            "objectives": [
              "Soumettre un parcours depuis l'espace mentor",
              "Comprendre les criteres de validation",
              "Gerer les retours d'un admin",
              "Publier le parcours une fois valide"
            ],
            "resources": [
              {"label": "Espace mentor (TakaCode)", "url": "/dashboard/mentor", "kind": "tool", "why": "Pour soumettre un parcours.", "how": "Clique sur 'Proposer un parcours'."},
              {"label": "Admin parcours", "url": "/admin/parcours", "kind": "tool", "why": "Pour observer le processus de validation.", "how": "Note les criteres de validation."}
            ],
            "quiz": [
              {"q": "Qui valide les parcours soumis par les mentors ?", "choices": ["Un admin de TakaCode", "Un autre mentor", "Le systeme automatiquement"], "answer": 0, "explanation": "Les admins sont les gatekeepers de la qualite."},
              {"q": "Qu'est-ce qu'un parcours 'en attente' ?", "choices": ["Un parcours soumis mais pas encore valide", "Un parcours publie", "Un parcours supprime"], "answer": 0, "explanation": "En attente = en cours de revision par un admin."},
              {"q": "Peut-on modifier un parcours apres publication ?", "choices": ["Oui, via le formulaire d'edition", "Non, c'est fige", "Uniquement en le supprimant"], "answer": 0, "explanation": "Les parcours peuvent etre mis a jour a tout moment."},
              {"q": "Quels sont les criteres de validation ?", "choices": ["Contenu correct, structure complete, ressources fonctionnelles", "Uniquement le titre", "Le nombre de lecons"], "answer": 0, "explanation": "La validation porte sur la qualite globale du contenu."},
              {"q": "Combien de temps prend la validation ?", "choices": ["Varie selon la charge des admins", "Toujours 24h", "Instantane"], "answer": 0, "explanation": "Le delai depend de la charge de travail des admins."}
            ],
            "micro_project": {
              "title": "Simule la soumission d'un parcours",
              "brief": "Prepare un parcours complet et soumets-le (ou simule la soumission).",
              "steps": [
                "Complete un parcours avec au moins 2 modules et 4 lecons",
                "Verifie que chaque lecon a : intro, objectifs, ressources, quiz, projet",
                "Soumets le parcours depuis /dashboard/mentor",
                "Attends les retours de l'admin"
              ],
              "deliverable": "Capture d'ecran de la soumission ou description du parcours soumis."
            },
            "xp_reward": 50,
            "duration_minutes": 30,
            "sort_order": 10
          },
          {
            "slug": "maintenir-parcours",
            "title": "Maintenir et ameliorer un parcours",
            "intro": "Un parcours n'est jamais 'fini'. Les liens cassent, les technologies evoluent, les apprenants donnent des retours. La maintenance est un processus continu.",
            "why_important": "Un parcours non maintenu devient vite obsolete et nuis a la credibilite de TakaCode.",
            "how_to_use": "Mets en place un processus de mise a jour reguliere.",
            "objectives": [
              "Verifier les liens et ressources regulierement",
              "Mettre a jour le contenu selon les retours",
              "Ajouter de nouvelles lecons si necessaire",
              "Communiquer les mises a jour aux apprenants"
            ],
            "resources": [
              {"label": "Admin parcours (TakaCode)", "url": "/admin/parcours", "kind": "tool", "why": "Pour gerer et mettre a jour les parcours.", "how": "Edite un parcours existant."},
              {"label": "Checklist de maintenance", "url": "https://www.smashingmagazine.com/2022/01/keeping-content-fresh/", "kind": "doc", "why": "Pour organiser la maintenance.", "how": "Adapte la checklist a ton parcours."}
            ],
            "quiz": [
              {"q": "A quelle frequence faut-il verifier les liens ?", "choices": ["Au moins une fois par mois", "Une fois par an", "Jamais"], "answer": 0, "explanation": "Les liens cassent regulierement. Un check mensuel est recommande."},
              {"q": "Comment gerer les retours des apprenants ?", "choices": ["Les lire, les trier, et integrer les ameliorations pertinentes", "Les ignorer", "Tout appliquer sans reflexion"], "answer": 0, "explanation": "Les retours sont precieux, mais il faut les trier et prioriser."},
              {"q": "Faut-il versionner son contenu ?", "choices": ["Oui, garder un historique des modifications", "Non, ecraser l'ancien", "Uniquement pour les gros changements"], "answer": 0, "explanation": "L'historique permet de revenir en arriere si besoin."},
              {"q": "Comment informer les apprenants d'une mise a jour ?", "choices": ["Via la description du parcours ou un message", "Pas besoin", "Un email individuel a chacun"], "answer": 0, "explanation": "Un message visible suffit pour les mises a jour mineures."},
              {"q": "Que faire si un lien externe est casse ?", "choices": ["Le remplacer par une alternative ou le supprimer", "Le laisser tel quel", "Attendre qu'il soit repara"], "answer": 0, "explanation": "Un lien casse est frustrant. Remplace-le ou retire-le."}
            ],
            "micro_project": {
              "title": "Audit de maintenance",
              "brief": "Audite un parcours existant et propose des ameliorations.",
              "steps": [
                "Choisis un parcours existant",
                "Verifie tous les liens des ressources",
                "Verifie que le contenu est encore a jour",
                "Propose 3 ameliorations concretes"
              ],
              "deliverable": "Le rapport d'audit avec les liens casses et les ameliorations proposees."
            },
            "xp_reward": 50,
            "duration_minutes": 30,
            "sort_order": 20
          }
        ]
      }
    ]
  }
]
$json$;

  v_track_id uuid;
  v_module_id uuid;
  lesson_record jsonb;
  module_record jsonb;
  track_record jsonb;
begin
  track_record := seed -> 0 -> 'track';

  -- Ce parcours n'est PAS published (visible uniquement mentor/admin via admin)
  insert into public.learning_tracks (
    slug, goal_key, title, summary, description,
    level_label, duration_weeks, accent_color, icon,
    objective, resources, next_session, next_steps,
    is_published, is_active, sort_order
  ) values (
    track_record ->> 'slug',
    track_record ->> 'goal_key',
    track_record ->> 'title',
    track_record ->> 'summary',
    track_record ->> 'description',
    track_record ->> 'level_label',
    (track_record ->> 'duration_weeks')::integer,
    track_record ->> 'accent_color',
    track_record ->> 'icon',
    track_record ->> 'objective',
    (track_record -> 'resources')::jsonb,
    track_record ->> 'next_session',
    (track_record -> 'next_steps')::jsonb,
    false, true,
    (track_record ->> 'sort_order')::integer
  )
  on conflict (slug) do update set
    title = excluded.title,
    summary = excluded.summary,
    description = excluded.description,
    level_label = excluded.level_label,
    resources = excluded.resources,
    next_session = excluded.next_session,
    next_steps = excluded.next_steps,
    is_published = false,
    is_active = true,
    updated_at = timezone('utc'::text, now())
  returning id into v_track_id;

  -- Supprimer les anciens modules/lecons
  delete from public.track_lessons where module_id in (
    select id from public.track_modules where track_id = v_track_id
  );
  delete from public.track_modules where track_id = v_track_id;

  for module_record in select jsonb_array_elements(seed -> 0 -> 'modules') loop
    insert into public.track_modules (track_id, slug, title, summary, sort_order, is_published)
    values (
      v_track_id,
      module_record ->> 'slug',
      module_record ->> 'title',
      module_record ->> 'summary',
      (module_record ->> 'sort_order')::integer,
      true
    )
    returning id into v_module_id;

    for lesson_record in select jsonb_array_elements(module_record -> 'lessons') loop
      insert into public.track_lessons (
        module_id, slug, title, intro, why_important, how_to_use,
        objectives, resources, quiz, micro_project,
        xp_reward, duration_minutes, sort_order, is_published
      ) values (
        v_module_id,
        lesson_record ->> 'slug',
        lesson_record ->> 'title',
        lesson_record ->> 'intro',
        lesson_record ->> 'why_important',
        lesson_record ->> 'how_to_use',
        coalesce(lesson_record -> 'objectives', '[]'::jsonb),
        coalesce(lesson_record -> 'resources', '[]'::jsonb),
        coalesce(lesson_record -> 'quiz', '[]'::jsonb),
        coalesce(lesson_record -> 'micro_project', '{}'::jsonb),
        (lesson_record ->> 'xp_reward')::integer,
        (lesson_record ->> 'duration_minutes')::integer,
        (lesson_record ->> 'sort_order')::integer,
        true
      );
    end loop;
  end loop;

  raise notice 'Parcours "Guide Mentor : Creer des parcours" insere (non publie, mentor/admin uniquement).';
end;
$seed$;
