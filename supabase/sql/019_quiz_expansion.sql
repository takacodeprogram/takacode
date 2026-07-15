-- TakaCode - Enrichissement des quiz (3 -> 5-6 questions par lecon)
-- et correction des next_steps du parcours dev-web-assiste-ia
--
-- Run this after 018_review_progression.sql

-- ============================================================
-- PARCOURS IA FONDAMENTAUX
-- ============================================================

-- Module 1 : Comprendre les LLM
-- Lecon 1 : fonctionnement-des-llm
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Pourquoi un LLM peut-il donner des reponses differentes a la meme question ?", "choices": ["Parce que le modele est aleatoire : la temperature influence la variabilite", "Parce qu'il a ete reentraine entre-temps", "Parce que son entrainement change chaque jour"], "answer": 0, "explanation": "La temperature est un parametre qui controle le hasard dans la prediction du prochain token."},
  {"q": "Quel est le principal defaut d'un LLM ?", "choices": ["Il est trop lent", "Il peut produire des informations fausses avec assurance (hallucinations)", "Il ne comprend pas le francais"], "answer": 1, "explanation": "Les hallucinations sont le defaut majeur : toujours verifier les faits importants."},
  {"q": "Un LLM peut-il apprendre en temps reel pendant une conversation ?", "choices": ["Oui, il memorise tout ce qu'on lui dit", "Non, son entrainement est fige : la conversation est son seul contexte temporaire", "Oui, si on lui demande explicitement"], "answer": 1, "explanation": "Le modele n'apprend pas pendant la conversation : il utilise uniquement le contexte fourni."}
]'::jsonb
WHERE slug = 'fonctionnement-des-llm';

-- Lecon 2 : tokens-et-context-window
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quel outil permet de visualiser le decoupage en tokens ?", "choices": ["Le tokenizer OpenAI", "Photoshop", "Excel"], "answer": 0, "explanation": "Le tokenizer en ligne montre exactement comment ton texte est decoupe en tokens."},
  {"q": "Pourquoi le francais utilise-t-il souvent plus de tokens que l'anglais pour un meme texte ?", "choices": ["Cest faux, cest l inverse", "Parce que les tokenizers sont optimises sur les corpus anglais majoritaires", "Parce que le francais est plus long"], "answer": 1, "explanation": "Les modeles sont entraines surtout sur du texte anglais, donc les mots francais sont moins optimises."},
  {"q": "Que faire si tu atteins la limite de la context window ?", "choices": ["Continuer a ecrire, le modele s adaptera", "Resumer le debut de la conversation et recommencer un nouveau fil", "Attendre 24h que la memoire se vide"], "answer": 1, "explanation": "Resumer et repartir sur un nouveau fil est la bonne pratique pour rester efficace."}
]'::jsonb
WHERE slug = 'tokens-et-context-window';

-- Lecon 3 : system-prompt-et-user-prompt
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Peut-on changer le system prompt en cours de conversation ?", "choices": ["Non, il est definitif au demarrage", "Oui, on peut le modifier pour changer le comportement du modele", "Cela plante l IA"], "answer": 1, "explanation": "Tupeux modifier le system prompt a tout moment, cela re-cadre le comportement."},
  {"q": "Un system prompt doit etre :", "choices": ["Le plus court possible pour economiser des tokens", "Assez long et precis pour etre efficace, avec role, regles et contraintes", "Ecrit dans un langage de programmation"], "answer": 1, "explanation": "Un bon system prompt est precis, donne un role, un ton et des regles claires."},
  {"q": "Quel element devrait OBLIGATOIREMENT etre dans le user prompt ?", "choices": ["Le role de l assistant", "La demande concrete et le contexte de la tache du moment", "Les contraintes globales du projet"], "answer": 1, "explanation": "Le user prompt porte la demande immediate ; le cadre general est dans le system prompt."}
]'::jsonb
WHERE slug = 'system-prompt-et-user-prompt';

-- Module 2 : L art du prompt
-- Lecon 4 : bases-prompt-engineering
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quel pilier du prompt permet d eviter une reponse trop generique ?", "choices": ["Le contexte : donner le pourquoi et le pour qui", "La longueur : ecrire le plus possible", "Les emojis : rendre le prompt plus amical"], "answer": 0, "explanation": "Le contexte situe la demande : le public, l objectif, le support."},
  {"q": "Tu veux un tableau comparatif en sortie. Comment le specifier ?", "choices": ["Esperer que l IA devine le format souhaite", "Imposer le format dans le prompt : Reponds sous forme de tableau avec 3 colonnes", "Ecrire en majuscules TABLEAU"], "answer": 1, "explanation": "Le format doit etre explicite pour obtenir un livrable directement exploitable."},
  {"q": "Quel est l ordre le plus efficace dans un prompt ?", "choices": ["Contraintes, format, tache, contexte", "N importe quel ordre", "Contexte, tache, format, contraintes"], "answer": 2, "explanation": "Planter le decor (contexte), puis la mission (tache), puis le format attendu, puis les limites."}
]'::jsonb
WHERE slug = 'bases-prompt-engineering';

-- Lecon 5 : zero-shot-few-shot-cot
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quel est le principal inconvenient du few-shot ?", "choices": ["Il consomme plus de tokens et ralentit la reponse", "Il est moins precis que le zero-shot", "Il ne marche qu avec ChatGPT"], "answer": 0, "explanation": "Les exemples consomment des tokens dans le contexte, ce qui peut augmenter le cout et reduire la place disponible."},
  {"q": "Quelle technique est la mieux adaptee pour resoudre un probleme de maths ?", "choices": ["Zero-shot : demander directement le resultat", "Chain of thought : demander un raisonnement etape par etape", "Few-shot : montrer 3 problemes avec leurs solutions"], "answer": 1, "explanation": "Decomposer le raisonnement reduit les erreurs sur les problemes complexes."},
  {"q": "Difference cle entre few-shot et chain of thought ?", "choices": ["Few-shot montre des exemples du resultat, CoT montre le cheminement", "C est la meme chose", "CoT utilise des images, few-shot non"], "answer": 0, "explanation": "Few-shot = exemples du resultat attendu. CoT = demande de raisonner pas a pas."}
]'::jsonb
WHERE slug = 'zero-shot-few-shot-cot';

-- Lecon 6 : loop-engineering
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quelle est la premiere etape du loop engineering ?", "choices": ["Accepter la premiere reponse", "Analyser le resultat et identifier des axes d amelioration precis", "Recommencer depuis le debut"], "answer": 1, "explanation": "Analyser d abord ce qui est bon et ce qui peut etre ameliore est la base de l iteration."},
  {"q": "Pourquoi ne pas donner des feedbacks vagues comme fais mieux ?", "choices": ["Parce que l IA ne comprend pas les sous-entendus", "Parce qu un feedback precis donne une direction claire et evite de tourner en rond", "Les feedbacks vagues marchent aussi bien"], "answer": 1, "explanation": "Donne un symptome precis et le comportement attendu pour des iterations qui progressent."},
  {"q": "Combien d iterations faut-il viser en moyenne ?", "choices": ["Exactement 3, pas une de plus", "Autant que necessaire jusqu au critere de qualite define au depart", "10 minimum pour etre professionnel"], "answer": 1, "explanation": "Le nombre ideal est celui qui atteint ton critere de qualite, ni plus ni moins."}
]'::jsonb
WHERE slug = 'loop-engineering';

-- Module 3 : Agents, MCP et RAG
-- Lecon 7 : agents-ia
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quel est le role des outils dans un agent ?", "choices": ["Ils permettent a l agent d interagir avec le monde (fichiers, web, terminal)", "Ils ralentissent l agent volontairement", "Ils remplacent le LLM"], "answer": 0, "explanation": "Les outils donnent a l agent la capacite d agir concretement au-dela de la simple generation de texte."},
  {"q": "Un agent peut-il travailler sans supervision humaine ?", "choices": ["Oui, completement, il est autonome", "Non, jamais", "Oui, sur des taches bien definies, mais une supervision legere est recommandee"], "answer": 2, "explanation": "L autonomie depend de la tache et du risque : toujours superviser les actions critiques."}
]'::jsonb
WHERE slug = 'agents-ia';

-- Lecon 8 : mcp-connecter-ia
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "MCP est un protocole : que signifie cette acronyme ?", "choices": ["Model Context Protocol", "Machine Control Program", "Multi Code Platform"], "answer": 0, "explanation": "MCP = Model Context Protocol, un standard ouvert pour connecter l IA a des outils."},
  {"q": "Qui peut creer un serveur MCP ?", "choices": ["Seulement Anthropic", "N importe quel developpeur : c est un standard ouvert", "Uniquement les grandes entreprises"], "answer": 1, "explanation": "MCP est un protocole ouvert, tout le monde peut creer des serveurs et clients."},
  {"q": "Quel est l equivalent dans le monde des APIs ?", "choices": ["Aucun, MCP est unique", "SOAP", "REST : MCP est au LLM ce que REST est aux applications web"], "answer": 2, "explanation": "MCP standardise la connexion entre modeles et outils, comme REST a standardise les APIs web."}
]'::jsonb
WHERE slug = 'mcp-connecter-ia';

-- Lecon 9 : rag-et-bonnes-pratiques
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quelle est la difference entre RAG et fine-tuning ?", "choices": ["RAG injecte des documents dans le prompt ; fine-tuning re-entraine le modele", "C est exactement la meme chose", "RAG est plus lent que le fine-tuning"], "answer": 0, "explanation": "RAG est temporaire et ne modifie pas le modele ; fine-tuning change ses poids."},
  {"q": "Quand le RAG est-il preferable au fine-tuning ?", "choices": ["Quand les donnees changent souvent ou sont trop volumineuses pour un re-entrainement", "Toujours, le fine-tuning ne sert a rien", "Jamais, le fine-tuning est superieur"], "answer": 0, "explanation": "RAG est ideal pour des donnees dynamiques ; fine-tuning est pour des taches ou styles specifiques stables."},
  {"q": "Quelle ressource du parcours IA recommande-t-on pour comprendre les vecteurs et le RAG ?", "choices": ["Le site de Wikipedia", "Supabase AI and vectors", "Le manuel Python"], "answer": 1, "explanation": "La doc Supabase sur l IA explique concretement le RAG avec une base de donnees vectorielle."}
]'::jsonb
WHERE slug = 'rag-et-bonnes-pratiques';

-- ============================================================
-- PARCOURS FULL VIBE CODING
-- ============================================================

-- Module 1 : Choisir tes outils
-- Lecon 10 : panorama-outils-vibe-coding
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quel est l avantage de Claude Code par rapport a Cursor ?", "choices": ["Claude Code est un agent terminal qui peut executer des commandes ; Cursor est un editeur augmente", "Cursor est gratuit, Claude Code est payant", "Ils sont strictement identiques"], "answer": 0, "explanation": "Claude Code opere directement dans ton terminal comme un agent ; Cursor augmente l editeur de code."},
  {"q": "OpenRouter permet de :", "choices": ["Utiliser un seul modele gratuitement", "Acceder a des dizaines de modeles via une API unique et comparer leurs resultats", "Heberger son site web"], "answer": 1, "explanation": "OpenRouter est une passerelle multi-modeles qui permet de comparer et choisir le meilleur pour chaque tache."},
  {"q": "Quel outil est le plus adapte pour un debutant complet en code ?", "choices": ["Un editeur terminal comme Claude Code", "Un editeur visuel comme Cursor qui integre l IA directement dans l interface", "Un editeur de texte basique sans IA"], "answer": 1, "explanation": "L interface visuelle et la progression guidee de Cursor le rendent plus accessible aux debutants."}
]'::jsonb
WHERE slug = 'panorama-outils-vibe-coding';

-- Lecon 11 : prise-en-main-outil
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quel est le premier reflexe avant de laisser l IA generer du code ?", "choices": ["Lui donner le contexte complet du projet et le resultat attendu", "Lui dire simplement cree une app", "Ne rien dire, elle devinera"], "answer": 0, "explanation": "Plus le contexte initial est riche, plus les generations seront pertinentes des le premier essai."},
  {"q": "Ton outil IA propose du code qui semble correct mais tu as un doute. Que fais-tu ?", "choices": ["Tu l acceptes, l IA ne se trompe jamais", "Tu poses une question a l IA : explique ce code, pourquoi ce choix ? pour verifier", "Tu reinitialises tout le projet"], "answer": 1, "explanation": "Tu peux toujour demander a l IA d expliquer ce qu elle a fait. C est un excellent moyen d apprendre."},
  {"q": "Apres avoir genere une page web avec l IA, comment la visualiser ?", "choices": ["Tu ouvres le fichier HTML dans un navigateur", "Tu l envoies par email", "Tu attends le deploiement automatique"], "answer": 0, "explanation": "Ouvrir le fichier HTML genere directement dans le navigateur est le moyen le plus rapide de verifier."}
]'::jsonb
WHERE slug = 'prise-en-main-outil';

-- Module 2 : Construire avec l IA
-- Lecon 12 : cadrer-ton-projet
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Pourquoi est-il important de definir le hors-scope dans un brief ?", "choices": ["Pour avoir un document plus long", "Pour eviter que le projet ne gonfle et ne sorte jamais", "Ca n a pas d importance"], "answer": 1, "explanation": "Dire non explicitement est la meilleure facon de proteger le perimetre et la date de livraison."},
  {"q": "Qui doit verifier qu un projet repond a un vrai besoin avant de le construire ?", "choices": ["Le developpeur seulement", "Personne, on construit d abord", "Toi, en parlant a des utilisateurs potentiels avec des questions ouvertes"], "answer": 2, "explanation": "Le Mom Test recommande de poser des questions sur la vie de l utilisateur, pas sur ton idee."},
  {"q": "Un critere de reussite verifiable ressemble a :", "choices": ["Le site sera beau", "L utilisateur peut creer un compte et publier une annonce en moins de 2 minutes", "Le projet avance bien"], "answer": 1, "explanation": "Un bon critere est mesurable et testable : on sait exactement quand il est atteint."}
]'::jsonb
WHERE slug = 'cadrer-ton-projet';

-- Lecon 13 : iterer-efficacement
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quel est le bon rythme d iteration avec l IA ?", "choices": ["Tout construire d un coup", "Une petite fonctionnalite a la fois, verifier apres chaque etape", "Faire 10 iterations d affilee avant de verifier"], "answer": 1, "explanation": "Petite demande → verification → feedback : chaque cycle est rapide et les erreurs ne s accumulent pas."},
  {"q": "Si une modification de l IA casse une fonctionnalite precedente, que faire ?", "choices": ["Recommencer tout le projet", "Utiliser le versionnage (Git) pour revenir a la version stable, puis reformuler ta demande", "Ignorer le probleme"], "answer": 1, "explanation": "Le versionnage est ton filet de securite : aucune erreur n est definitive."},
  {"q": "A quoi sert la verification systematique entre chaque iteration ?", "choices": ["A perdre du temps", "A detecter les problemes tot avant qu ils ne s accumulent", "A impressionner le client"], "answer": 1, "explanation": "Plus tu detectes un probleme tot, moins il coute cher a corriger."}
]'::jsonb
WHERE slug = 'iterer-efficacement';

-- Lecon 14 : limites-et-bonnes-pratiques
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quel est le risque d accumuler du code IA sans jamais le relire ?", "choices": ["Le code peut etre vulne rable, fragile ou contenir des failles de securite sans que tu le saches", "Le code est toujours parfait", "L IA refuse d ecrire plus de code"], "answer": 0, "explanation": "Le code genere par IA doit etre audite regulierement, surtout avant mise en production."},
  {"q": "Quelle est la premiere chose a proteger dans un projet avant publication ?", "choices": ["Les couleurs du site", "Les cles API et donnees sensibles : jamais en dur dans le code", "Le nom de domaine"], "answer": 1, "explanation": "Une cle API exposee dans le code publie est immediatement compromise."},
  {"q": "Comment verifier la securite de son projet avant de le publier ?", "choices": ["On ne peut pas verifier la securite soi-meme", "Demander un audit a l IA avec un angle securite : cles exposees, validations, injections", "Publier et esperer que ca marche"], "answer": 1, "explanation": "L IA peut auditer son propre code si on lui demande avec un angle securite."}
]'::jsonb
WHERE slug = 'limites-et-bonnes-pratiques';

-- Module 3 : Livrer et publier
-- Lecon 15 : sauvegarder-avec-github
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quelle est la difference entre un commit et un push ?", "choices": ["C est la meme chose", "Le commit enregistre en local, le push envoie vers GitHub", "Le push enregistre en local, le commit envoie vers GitHub"], "answer": 1, "explanation": "Commit = photo locale ; Push = synchronisation vers le cloud."},
  {"q": "Pourquoi ecrire des messages de commit clairs ?", "choices": ["Pour impressionner les autres developpeurs", "Pour pouvoir comprendre l historique du projet des mois plus tard", "C est obligatoire"], "answer": 1, "explanation": "Un historique clair permet de retrouver pourquoi un changement a ete fait, meme longtemps apres."}
]'::jsonb
WHERE slug = 'sauvegarder-avec-github';

-- Lecon 16 : deployer-sur-vercel
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Vercel redeploie automatiquement ton site. Quand ?", "choices": ["Tous les jours a minuit", "A chaque push sur la branche principale du depot GitHub connecte", "Quand tu cliques sur le bouton deploiement manuel"], "answer": 1, "explanation": "Le deploiement continu : chaque push = nouvelle version en ligne automatiquement."},
  {"q": "Ou configurer les variables d environnement pour la production ?", "choices": ["Dans le fichier .env du depot GitHub", "Dans le dashboard Vercel > Settings > Environment Variables", "Dans le code source"], "answer": 1, "explanation": "Les variables d environnement de production se configurent dans le dashboard Vercel, pas dans le code."},
  {"q": "Quelle URL obtiens-tu apres un premier deploiement Vercel ?", "choices": ["https://ton-projet.vercel.app", "https://ton-projet.com", "http://localhost:3000"], "answer": 0, "explanation": "Vercel genere une URL publique unique sur son sous-domaine, personnalisable plus tard."}
]'::jsonb
WHERE slug = 'deployer-sur-vercel';

-- ============================================================
-- PARCOURS DEV WEB ASSISTE PAR IA
-- ============================================================

-- Module 1 : Fondations HTML et CSS
-- Lecon 17 : html-structurer-une-page
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quelle balise utilises-tu pour un lien hypertexte ?", "choices": ["<link>", "<a>", "<href>"], "answer": 1, "explanation": "La balise <a> (anchor) definit un lien. L attribut href specifie la destination."},
  {"q": "Quelle est la difference entre <article> et <section> ?", "choices": ["<article> est un contenu autonome qui a du sens seul ; <section> groupe un theme", "C est exactement la meme balise", "<article> est pour les blogs, <section> pour tout le reste"], "answer": 0, "explanation": "<article> = contenu independant (ex: article de blog) ; <section> = groupe thematique."},
  {"q": "Quel outil valide que ton HTML est bien forme ?", "choices": ["validator.w3.org", "HTML Checker Pro", "Le navigateur uniquement"], "answer": 0, "explanation": "Le validateur W3C est la reference officielle pour verifier ton code HTML."}
]'::jsonb
WHERE slug = 'html-structurer-une-page';

-- Lecon 18 : css-styler-ta-page
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quelle propriete CSS change la couleur du texte ?", "choices": ["background-color", "color", "text-color"], "answer": 1, "explanation": "color definit la couleur du texte ; background-color definit la couleur de fond."},
  {"q": "Que fait display: flex ?", "choices": ["Il transforme le conteneur en flexbox, alignant les enfants horizontalement par defaut", "Il cache les elements", "Il ajoute une animation"], "answer": 0, "explanation": "Flexbox est le mode de mise en page moderne pour aligner et distribuer les elements."},
  {"q": "Quelle est la difference entre padding et margin ?", "choices": ["Padding est l espace interieur a la bordure, margin est l espace exterieur", "C est la meme propriete", "Padding est horizontal, margin est vertical"], "answer": 0, "explanation": "Padding = interieur de la bordure ; margin = exterieur de la bordure."}
]'::jsonb
WHERE slug = 'css-styler-ta-page';

-- Module 2 : JavaScript interactivite
-- Lecon 19 : bases-javascript
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quelle est la difference entre let et const ?", "choices": ["let permet de reassigner la variable, const non", "const est plus rapide que let", "let est pour les nombres, const pour le texte"], "answer": 0, "explanation": "let declare une variable modifiable ; const declare une constante qui ne peut pas etre reassignee."},
  {"q": "Quelle structure repetitive permet d executer du code pour chaque element d un tableau ?", "choices": ["if/else", "for ou forEach", "switch"], "answer": 1, "explanation": "Les boucles for et forEach permettent d iterer sur les elements d un tableau."},
  {"q": "A quoi sert le mot-cle return dans une fonction ?", "choices": ["A arreter la fonction", "A renvoyer une valeur la ou la fonction a ete appelee", "A afficher un resultat dans la console"], "answer": 1, "explanation": "return renvoie une valeur a l appelant de la fonction."}
]'::jsonb
WHERE slug = 'bases-javascript';

-- Lecon 20 : dom-et-interactivite
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Que retourne document.querySelectorAll(.item) ?", "choices": ["Un seul element", "Une NodeList de tous les elements correspondant au selecteur", "Un tableau JavaScript standard"], "answer": 1, "explanation": "querySelectorAll retourne tous les elements correspondant au selecteur CSS."},
  {"q": "Comment empecher le comportement par defaut d un formulaire ?", "choices": ["form.preventDefault()", "event.preventDefault() dans le gestionnaire d evenement submit", "C est impossible"], "answer": 1, "explanation": "event.preventDefault() empeche le rechargement de la page lors de la soumission d un formulaire."},
  {"q": "Quelle methode ajoute un nouvel element a la fin d un conteneur ?", "choices": ["appendChild()", "insertBefore()", "createElement()"], "answer": 0, "explanation": "appendChild() ajoute un element enfant a la fin du conteneur choisi."}
]'::jsonb
WHERE slug = 'dom-et-interactivite';

-- Module 3 : Git et GitHub
-- Lecon 21 : git-versionner
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Que permet de faire une branche dans Git ?", "choices": ["Travailler sur une evolution sans impacter la version principale", "Accelerer le code", "Faire des sauvegardes automatiques"], "answer": 0, "explanation": "Les branches isolent le travail en cours de la version stable."},
  {"q": "Comment fusionner une branche dans une autre ?", "choices": ["git merge", "git push", "git combine"], "answer": 0, "explanation": "git merge integre les changements d une branche dans une autre."},
  {"q": "Quelle commande annule les dernieres modifications non commitees ?", "choices": ["git reset --hard", "git delete", "git cancel"], "answer": 0, "explanation": "git reset --hard permet de revenir a l etat du dernier commit, annulant les modifications non sauvees."}
]'::jsonb
WHERE slug = 'git-versionner';

-- Lecon 22 : github-publier
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "A quoi sert un README sur GitHub ?", "choices": ["A presenter le projet : quoi, pour qui, comment l utiliser", "A stocker des mots de passe", "A afficher le code source"], "answer": 0, "explanation": "Le README est la premiere chose que les visiteurs voient : il doit repondre rapidement a quoi, pourquoi, comment."},
  {"q": "Quelle est l etape manquante entre faire des commits locaux et les voir sur GitHub ?", "choices": ["Il n y a pas d etape manquante", "git push envoie les commits locaux vers le depot GitHub", "git pull telecharge les modifications de GitHub"], "answer": 1, "explanation": "Le push synchronise tes commits locaux vers le depot distant."},
  {"q": "Une pull request permet de :", "choices": ["Proposer des modifications qui seront examinees avant d etre fusionnees", "Fermer un depot", "Copier un depot chez soi"], "answer": 0, "explanation": "La pull request est le mecanisme de proposition et de relecture de code sur GitHub."}
]'::jsonb
WHERE slug = 'github-publier';

-- Module 4 : React et Next.js
-- Lecon 23 : react-penser-en-composants
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quand un composant React se re-affiche-t-il ?", "choices": ["Quand son etat (useState) ou ses props changent", "Quand on rafraichit la page", "Toutes les 5 secondes"], "answer": 0, "explanation": "React re-rend automatiquement le composant quand ses donnees changent."},
  {"q": "Quelle est la regle des hooks React ?", "choices": ["On peut les appeler n importe ou dans le code", "Ils doivent etre appeles au niveau racine du composant, jamais dans des conditions ou boucles", "Ils ne fonctionnent qu avec Next.js"], "answer": 1, "explanation": "Les hooks suivent un ordre d appel constant pour que React puisse les associer correctement a chaque rendu."},
  {"q": "Que vaut props dans un composant React ?", "choices": ["Les parametres passes au composant par son parent", "L etat interne du composant", "Les variables globales de l application"], "answer": 0, "explanation": "props sont les arguments qu un composant parent passe a son enfant."}
]'::jsonb
WHERE slug = 'react-penser-en-composants';

-- Lecon 24 : nextjs-application-complete
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quel fichier cree-t-on pour avoir un layout partage sur toutes les pages Next.js ?", "choices": ["layout.js dans le dossier app/", "header.js dans chaque page", "global.css"], "answer": 0, "explanation": "Le fichier layout.js dans app/ definit le cadre commun a toutes les pages."},
  {"q": "Quelle est la difference entre un composant serveur et client dans Next.js ?", "choices": ["Les composants serveur s executent sur le serveur ; les clients ont interactivite et hooks", "Les composants clients sont plus rapides", "Il n y a pas de difference"], "answer": 0, "explanation": "Les composants serveur (defaut) sont rendus cote serveur. Les composants clients (use client) ajoutent l interactivite."},
  {"q": "Comment creer une page dynamique /projets/[id] dans l App Router ?", "choices": ["Creer un dossier app/projets/[id]/ avec un fichier page.js", "Creer un fichier app/projets/[id].js", "Ajouter une ligne dans la config Next.js"], "answer": 0, "explanation": "Les crochets [] dans le nom du dossier creent une route dynamique."}
]'::jsonb
WHERE slug = 'nextjs-application-complete';

-- Module 5 : Backend et mise en ligne
-- Lecon 25 : supabase-base-de-donnees
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Quel type de base de donnees utilise Supabase ?", "choices": ["MongoDB", "PostgreSQL", "MySQL"], "answer": 1, "explanation": "Supabase est construit sur PostgreSQL, la base de donnees relationnelle la plus avancee."},
  {"q": "Comment Supabase genere-t-il automatiquement une API ?", "choices": ["En analysant ton schema PostgreSQL et en creant des endpoints REST et Realtime", "Tu dois coder chaque endpoint manuellement", "Via un assistant IA integre"], "answer": 0, "explanation": "Supabase inspecte tes tables et cree automatiquement des APIs REST et Realtime."},
  {"q": "Pourquoi la RLS (Row Level Security) est-elle importante ?", "choices": ["Parce qu elle chiffre la base de donnees", "Parce que, sans elle, tout utilisateur pourrait lire les donnees de tout le monde via l API", "Parce qu elle accelere les requetes"], "answer": 1, "explanation": "Sans RLS, les tables exposees via l API sont accessibles sans restriction."}
]'::jsonb
WHERE slug = 'supabase-base-de-donnees';

-- Lecon 26 : api-connecter-des-services
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Dans quel format les APIs web renvoient-elles generalement leurs donnees ?", "choices": ["XML", "JSON", "CSV"], "answer": 1, "explanation": "Le JSON (JavaScript Object Notation) est le format standard des APIs modernes."},
  {"q": "Que retourne la fonction fetch() en JavaScript ?", "choices": ["Les donnees directement", "Une promesse (Promise) qui sera resolue avec la reponse", "Rien, c est synchrone"], "answer": 1, "explanation": "fetch retourne une promesse : il faut await ou .then() pour obtenir la reponse."},
  {"q": "Comment gerer une erreur reseau dans un appel fetch ?", "choices": ["Elle est automatiquement ignoree", "Avec un bloc try/catch qui affiche un message utilisateur", "En arretant l application"], "answer": 1, "explanation": "Un bloc try/catch attrape les erreurs reseau et permet d afficher un message de secours."}
]'::jsonb
WHERE slug = 'api-connecter-des-services';

-- Lecon 27 : deploiement-mise-en-ligne
UPDATE track_lessons
SET quiz = quiz || '[
  {"q": "Avant le premier deploiement sur Vercel, quelle configuration est cruciale ?", "choices": ["Ajouter les variables d environnement (cles Supabase, API...) dans le dashboard Vercel", "Creer un logo", "Ecrire la page 404"], "answer": 0, "explanation": "Sans les variables d environnement, l application ne pourra pas se connecter a Supabase ou aux API en production."},
  {"q": "Qu est-ce que le deploiement continu ?", "choices": ["Chaque push sur la branche principale declenche automatiquement un nouveau deploiement", "Tu deployes manuellement chaque mise a jour", "Le site se met a jour tout seul sans intervention"], "answer": 0, "explanation": "Vercel detecte les pushs sur la branche principale et redeploie automatiquement."},
  {"q": "Que se passe-t-il si une erreur de build survient lors d un deploiement ?", "choices": ["La version precedente reste en ligne", "Le site est supprime", "L erreur est ignoree"], "answer": 0, "explanation": "En cas d echec du build, Vercel conserve la version precedente : le site ne casse jamais."}
]'::jsonb
WHERE slug = 'deploiement-mise-en-ligne';

-- ============================================================
-- MISE A JOUR DES next_steps DU PARCOURS DEV-WEB
-- ============================================================
-- Le parcours dev-web a 5 modules mais ses next_steps n en montraient que 3.
-- On les aligne sur les 5 modules reels.

UPDATE learning_tracks
SET next_steps = '[
  {"label": "Fondations HTML et CSS", "state": "current"},
  {"label": "JavaScript et interactivite", "state": "locked"},
  {"label": "Git et GitHub", "state": "locked"},
  {"label": "React et Next.js", "state": "locked"},
  {"label": "Backend et mise en ligne", "state": "locked"}
]'::jsonb
WHERE slug = 'dev-web-assiste-ia';
