-- TakaCode - Parcours "Bases d'Internet & du Web" (VERSION COMPLETE)
-- 8 modules : reseau, TCP/IP, securite, hebergement, HTML, CSS, JavaScript, outils
-- Remplace/etend 020_internet_basics_track.sql
--
-- Run this after 021_ai_review_support.sql

do $seed$
declare
  seed jsonb := $json$
[
  {
    "track": {
      "slug": "bases-internet",
      "goal_key": "internet_basics",
      "title": "Bases d'Internet et du Web",
      "summary": "Du fonctionnement d'Internet jusqu'au premier site web : reseau, securite, HTML, CSS, JS et outils.",
      "description": "Un parcours complet pour comprendre Internet de A a Z. Tu commenceras par les fondations reseau (IP, DNS, TCP/IP, securite TLS), puis tu apprendras a construire ton premier site web avec HTML, CSS et JavaScript. Chaque lecon inclut des ressources soigneusement selectionnees, un quiz et un micro-projet pour appliquer immediatement ce que tu apprends.",
      "level_label": "Fondations",
      "duration_weeks": 8,
      "accent_color": "#F59E0B",
      "icon": "lucide:globe",
      "objective": "Comprendre Internet et etre capable de creer, styler et publier ton premier site web.",
      "resources": ["MDN Web Docs", "Cloudflare Learning", "web.dev", "freeCodeCamp"],
      "next_session": "Mardi 20h00",
      "next_steps": [
        {"label": "Comment marche Internet", "state": "current"},
        {"label": "Protocoles et DNS", "state": "locked"},
        {"label": "Securite web", "state": "locked"},
        {"label": "Hebergement et domaine", "state": "locked"},
        {"label": "HTML : structurer", "state": "locked"},
        {"label": "CSS : styler", "state": "locked"},
        {"label": "JavaScript : interactivite", "state": "locked"},
        {"label": "Outils du dev", "state": "locked"}
      ],
      "sort_order": 0
    },
    "modules": [
      {
        "slug": "comment-marche-internet",
        "title": "Comment marche Internet",
        "summary": "Adresses IP, client-serveur, paquets, ports et protocoles.",
        "sort_order": 10,
        "lessons": [
          {
            "slug": "internet-adresse-ip",
            "title": "Adresses IP et modele client-serveur",
            "intro": "Internet est un reseau de reseaux : des milliards d'appareils connectes qui communiquent grace aux adresses IP. Chaque appareil a une adresse unique, comme chaque maison a une adresse postale. Le modele client-serveur est le fondement : le client (ton navigateur) envoie des requetes, le serveur repond avec des donnees.",
            "why_important": "Comprendre les adresses IP et le modele client-serveur te permet de saisir comment les donnees voyagent, pourquoi le DNS existe, et comment diagnostiquer les problemes de connexion.",
            "how_to_use": "Regarde la video Cloudflare pour les visuels, lis l'article MDN pour fixer les notions, puis utilise les outils en ligne pour explorer ta propre connexion.",
            "objectives": [
              "Expliquer ce qu'est une adresse IP et la difference IPv4/IPv6",
              "Deccrire le modele client-serveur",
              "Comprendre le role des ports dans la communication",
              "Distinguer TCP et UDP"
            ],
            "resources": [
              {"label": "What is an IP address? (Cloudflare)", "url": "https://www.cloudflare.com/learning/network-layer/what-is-an-ip-address/", "kind": "doc", "why": "L'explication la plus claire sur le web.", "how": "Lis la page entiere puis note la difference IPv4/IPv6."},
              {"label": "How the Internet works (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works", "kind": "doc", "why": "Reference MDN complete sur le fonctionnement du web.", "how": "Lis les sections client-serveur et paquets."},
              {"label": "How the Internet works (YouTube - Cloudflare)", "url": "https://www.youtube.com/watch?v=7_LPdttKXPc", "kind": "video", "why": "Video de 8 minutes tres visuelle.", "how": "Regarde une fois en entier, puis une deuxieme en notant les mots cles."},
              {"label": "What is my IP (outil en ligne)", "url": "https://whatismyipaddress.com/", "kind": "tool", "why": "Decouvrir ta propre adresse IP publique.", "how": "Note ton IP et ton fournisseur d'acces."}
            ],
            "quiz": [
              {"q": "Qu'est-ce qu'une adresse IP ?", "choices": ["Un identifiant unique attribue a chaque appareil connecte a un reseau", "Un mot de passe pour acceder a Internet", "Un logiciel de navigation"], "answer": 0, "explanation": "L'adresse IP est la carte d'identite de ton appareil sur le reseau."},
              {"q": "Quelle est la difference entre IPv4 et IPv6 ?", "choices": ["IPv6 permet beaucoup plus d'adresses qu'IPv4", "IPv4 est plus rapide", "IPv6 n'utilise que des lettres"], "answer": 0, "explanation": "IPv4 permet ~4 milliards d'adresses, IPv6 un nombre quasi illimite."},
              {"q": "Dans le modele client-serveur, que fait le client ?", "choices": ["Il envoie des requetes au serveur pour obtenir des donnees", "Il stocke les donnees", "Il securise la connexion"], "answer": 1, "explanation": "Le client (navigateur) demande des ressources ; le serveur les fournit."},
              {"q": "A quoi servent les ports dans la communication reseau ?", "choices": ["A diriger le trafic vers le bon service sur une machine", "A chiffrer les donnees", "A加速er la connexion"], "answer": 0, "explanation": "Les ports permettent de distinguer differents services sur une meme machine (80=HTTP, 443=HTTPS)."},
              {"q": "Qu'est-ce qu'un routeur ?", "choices": ["Un appareil qui achemine les paquets entre reseaux", "Un logiciel antivirus", "Un type de cable"], "answer": 0, "explanation": "Le routeur dirige le trafic entre les reseaux."}
            ],
            "micro_project": {
              "title": "Explore ton identite numerique",
              "brief": "Decouvre et analyse ta propre connexion Internet.",
              "steps": [
                "Va sur whatismyipaddress.com et note ton adresse IP publique",
                "Utilise la commande ping google.com dans ton terminal",
                "Note le temps de reponse et le nombre de paquets envoyes/recus"
              ],
              "deliverable": "Colle ton adresse IP, le resultat du ping, et explique ce que chaque outil t'a appris sur ta connexion."
            },
            "xp_reward": 50,
            "duration_minutes": 40,
            "sort_order": 10
          },
          {
            "slug": "http-https-communication",
            "title": "HTTP et HTTPS : comment le web communique",
            "intro": "HTTP (HyperText Transfer Protocol) est le protocole que les navigateurs utilisent pour communiquer avec les serveurs web. Chaque page que tu charges est le resultat de requetes HTTP. HTTPS ajoute le chiffrement pour securiser ces echanges.",
            "why_important": "HTTP est le语言age du web. Comprendre les requetes, les reponses, les codes de statut et les en-tetes te donne une vision claire de ce qui se passe quand tu charges une page.",
            "how_to_use": "Lis les articles MDN et Cloudflare, puis utilise les outils de dev de ton navigateur pour observer les requetes HTTP en temps reel.",
            "objectives": [
              "Expliquer le cycle requete-reponse HTTP",
              "Connaître les codes de statut courants (200, 301, 404, 500)",
              "Comprendre la difference entre HTTP et HTTPS",
              "Observer les en-tetes de requetes avec les outils du navigateur"
            ],
            "resources": [
              {"label": "HTTP overview (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", "kind": "doc", "why": "Reference complete sur HTTP.", "how": "Lis les sections sur les methodes et les codes de statut."},
              {"label": "What is HTTPS? (Cloudflare)", "url": "https://www.cloudflare.com/learning/ssl/what-is-https/", "kind": "doc", "why": "Explication claire de HTTPS et pourquoi c'est essentiel.", "how": "Note les differences avec HTTP."},
              {"label": "HTTP status codes (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status", "kind": "doc", "why": "Liste complete des codes de statut.", "how": "Memorise les plus courants (200, 301, 404, 500)."},
              {"label": "Chrome DevTools Network tab (outil)", "url": "https://developer.chrome.com/docs/devtools/network/", "kind": "tool", "why": "Pour observer les requetes HTTP en temps reel.", "how": "Ouvre les DevTools (F12), va dans l'onglet Network, et charge une page."}
            ],
            "quiz": [
              {"q": "Que signifie HTTP ?", "choices": ["HyperText Transfer Protocol", "High Tech Transfer Program", "Home Tool Transfer Process"], "answer": 0, "explanation": "HTTP = HyperText Transfer Protocol, le protocole de transfert de contenu hypertexte."},
              {"q": "Que retourne un serveur quand la page demandee n'existe pas ?", "choices": ["Code 404 Not Found", "Code 200 OK", "Code 500 Internal Server Error"], "answer": 0, "explanation": "Le 404 indique que la ressource demandee n'a pas ete trouvee."},
              {"q": "Quelle est la principale difference entre HTTP et HTTPS ?", "choices": ["HTTPS chiffre les donnees", "HTTPS est plus rapide", "HTTP est plus recent"], "answer": 0, "explanation": "Le S de HTTPS signifie Secure : les donnees sont chiffrees."},
              {"q": "A quoi servent les en-tetes HTTP ?", "choices": ["A transmettre des meta-informations sur la requete ou la reponse", "A stocker les cookies", "A accelerer le chargement"], "answer": 0, "explanation": "Les en-tetes contiennent des informations comme le type de contenu, les autorisations, les caches, etc."},
              {"q": "Quelle methode HTTP utilise-t-on pour envoyer des donnees d'un formulaire ?", "choices": ["POST", "GET", "DELETE"], "answer": 0, "explanation": "POST envoie des donnees dans le corps de la requete, ideal pour les formulaires."}
            ],
            "micro_project": {
              "title": "Inspecte les requetes HTTP",
              "brief": "Utilise les outils de developpement de ton navigateur pour observer le fonctionnement de HTTP.",
              "steps": [
                "Ouvre les DevTools de Chrome (F12) et va dans l'onglet Network",
                "Charge une page web et observe les requetes HTTP",
                "Clique sur une requete et note le code de statut, les en-tetes, et la taille de la reponse"
              ],
              "deliverable": "Decris 3 requetes HTTP que tu as observees avec leur code de statut et leur type (GET/POST)."
            },
            "xp_reward": 50,
            "duration_minutes": 40,
            "sort_order": 20
          }
        ]
      },
      {
        "slug": "protocoles-et-dns",
        "title": "Protocoles et DNS",
        "summary": "TCP/IP, DNS, et les systemes de noms de domaine.",
        "sort_order": 20,
        "lessons": [
          {
            "slug": "tcp-ip-protocoles",
            "title": "TCP/IP : les protocoles d'Internet",
            "intro": "TCP/IP est la famille de protocoles qui gere la transmission des donnees sur Internet. TCP decoupe, envoie et reassemble les donnees ; IP s'occupe de l'adressage et du routage.",
            "why_important": "TCP/IP est le fondement technique d'Internet. Comprendre son fonctionnement t'aide a diagnostiquer des problemes et a comprendre les limites du web.",
            "how_to_use": "Lis les articles de Cloudflare, puis utilise ping et traceroute pour observer TCP/IP en action.",
            "objectives": [
              "Comprendre le role de TCP (fiabilite, reassemblage)",
              "Comprendre le role de IP (adressage, routage)",
              "Distinguer TCP et UDP et leurs usages"
            ],
            "resources": [
              {"label": "What is TCP/IP? (Cloudflare)", "url": "https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/", "kind": "doc", "why": "Explication claire de la pile TCP/IP.", "how": "Memorise les 4 couches."},
              {"label": "TCP vs UDP (GeeksforGeeks)", "url": "https://www.geeksforgeeks.org/differences-between-tcp-and-udp/", "kind": "doc", "why": "Comparatif simple entre les deux protocoles.", "how": "Lis le tableau comparatif."},
              {"label": "ping et traceroute (outil)", "url": "https://www.cloudflare.com/learning/network-layer/what-is-a-route/", "kind": "tool", "why": "Pour observer le routage IP en temps reel.", "how": "Tape ping google.com et traceroute google.com dans ton terminal."}
            ],
            "quiz": [
              {"q": "Quel est le role de TCP ?", "choices": ["Garantir la fiabilite de la transmission", "Attribuer les adresses IP", "Chiffrer les donnees"], "answer": 0, "explanation": "TCP detecte les pertes et renvoie les paquets manquants."},
              {"q": "Quand utilise-t-on UDP plutot que TCP ?", "choices": ["Pour le streaming et les jeux en ligne (temps reel)", "Pour les emails", "Pour les telechargements"], "answer": 0, "explanation": "UDP est plus rapide car il ne verifie pas la reception."},
              {"q": "Que se passe-t-il si un paquet TCP est perdu ?", "choices": ["TCP le detecte et le renvoie", "La connexion est coupee", "Le paquet est ignore"], "answer": 0, "explanation": "TCP assure la fiabilite : retransmission automatique."}
            ],
            "micro_project": {
              "title": "Observe TCP/IP en action",
              "brief": "Utilise des commandes reseau pour observer le fonctionnement de TCP/IP.",
              "steps": [
                "Tape ping google.com et note le temps de reponse",
                "Tape traceroute google.com et note les sauts",
                "Compare les resultats avec un site europeen et un site asiatique"
              ],
              "deliverable": "Colle les resultats et explique ce que chaque commande revele sur le routage IP."
            },
            "xp_reward": 50,
            "duration_minutes": 40,
            "sort_order": 10
          },
          {
            "slug": "dns-noms-de-domaine",
            "title": "DNS : l'annuaire d'Internet",
            "intro": "Le DNS (Domain Name System) traduit les noms de domaine (takacode.fr) en adresses IP que les serveurs comprennent. Sans DNS, tu devrais memoriser des chiffres.",
            "why_important": "Comprendre le DNS t'aide a gerer tes propres domaines, a diagnostiquer les pannes, et a comprendre comment les sites web sont accessibles.",
            "how_to_use": "Lis l'article Cloudflare, explore howdns.works (site interactif), puis utilise nslookup ou dig pour interroger le DNS.",
            "objectives": [
              "Expliquer le role du DNS",
              "Comprendre la hierarchie des domaines",
              "Interroger le DNS manuellement (nslookup/dig)",
              "Connaître les types d'enregistrements courants (A, CNAME, MX)"
            ],
            "resources": [
              {"label": "What is DNS? (Cloudflare)", "url": "https://www.cloudflare.com/learning/dns/what-is-dns/", "kind": "doc", "why": "LA reference pour comprendre le DNS.", "how": "Lis l'article en entier."},
              {"label": "How DNS works (site interactif)", "url": "https://howdns.works/", "kind": "tool", "why": "Bande dessinee interactive tres pedagogique.", "how": "Parcours l'histoire en entier."},
              {"label": "Google DNS lookup (outil)", "url": "https://dns.google/", "kind": "tool", "why": "Pour interroger les enregistrements DNS.", "how": "Tape takacode.fr et observe les differents types."}
            ],
            "quiz": [
              {"q": "A quoi sert le DNS ?", "choices": ["Traduire les noms de domaine en adresses IP", "Heberger les sites web", "Chiffrer les connexions"], "answer": 0, "explanation": "Le DNS est l'annuaire qui associe noms et IP."},
              {"q": "Quel enregistrement DNS associe un domaine a une IPv4 ?", "choices": ["Enregistrement A", "Enregistrement MX", "Enregistrement CNAME"], "answer": 0, "explanation": "L'enregistrement A (Address) pointe vers une IPv4."},
              {"q": "Que se passe-t-il si le serveur DNS est inaccessible ?", "choices": ["Tu ne peux plus acceder aux sites par leur nom", "Internet ne marche plus", "Les IP ne fonctionnent plus"], "answer": 0, "explanation": "Sans DNS, les noms ne se traduisent plus en IP."},
              {"q": "A quoi sert un enregistrement MX ?", "choices": ["A diriger les emails d'un domaine", "A resolver un domaine en IP", "A creer un sous-domaine"], "answer": 0, "explanation": "MX = Mail Exchange, definit le serveur de mail du domaine."}
            ],
            "micro_project": {
              "title": "Enquete DNS",
              "brief": "Analyse les coulisses DNS de sites que tu utilises.",
              "steps": [
                "Va sur dns.google et tape google.com",
                "Note les enregistrements A, CNAME et MX",
                "Compare avec takacode.fr"
              ],
              "deliverable": "Colle les enregistrements DNS des 2 sites et explique a quoi sert chaque type."
            },
            "xp_reward": 60,
            "duration_minutes": 50,
            "sort_order": 20
          }
        ]
      },
      {
        "slug": "securite-web",
        "title": "Securite web",
        "summary": "TLS/SSL, HTTPS, certificats et bonnes pratiques de securite.",
        "sort_order": 30,
        "lessons": [
          {
            "slug": "tls-ssl-https",
            "title": "TLS, SSL et HTTPS",
            "intro": "HTTPS est la version securisee de HTTP. Les donnees sont chiffrees grace au protocole TLS (anciennement SSL). Un cadenas vert indique que la connexion est protegee.",
            "why_important": "Chaque site que tu construis devrait etre en HTTPS. Sans chiffrement, les donnees voyagent en clair et peuvent etre interceptees.",
            "how_to_use": "Lis les ressources Cloudflare et Let's Encrypt, puis teste la securite de sites avec SSL Labs.",
            "objectives": [
              "Comprendre le handshake TLS",
              "Expliquer le role des certificats",
              "Verifier la securite d'un site avec SSL Labs"
            ],
            "resources": [
              {"label": "What is HTTPS? (Cloudflare)", "url": "https://www.cloudflare.com/learning/ssl/what-is-https/", "kind": "doc", "why": "Explication complete de HTTPS.", "how": "Lis les sections sur le handshake TLS."},
              {"label": "Let's Encrypt - How it works", "url": "https://letsencrypt.org/how-it-works/", "kind": "doc", "why": "Comprendre les certificats gratuits.", "how": "Note le processus de validation automatise."},
              {"label": "SSL Labs (outil de test)", "url": "https://www.ssllabs.com/ssltest/", "kind": "tool", "why": "Tester la configuration HTTPS d'un site.", "how": "Teste google.com et observe le rapport."}
            ],
            "quiz": [
              {"q": "Que signifie le cadenas vert ?", "choices": ["La connexion est securisee par TLS", "Le site est gratuit", "Le site est recommande"], "answer": 0, "explanation": "Le cadenas indique un certificat TLS valide."},
              {"q": "Let's Encrypt propose des certificats :", "choices": ["Gratuits et renouvelables auto", "Payants, valables 5 ans", "Uniquement pour les entreprises"], "answer": 0, "explanation": "Let's Encrypt a democratise le HTTPS gratuit."},
              {"q": "A quoi sert un certificat TLS ?", "choices": ["Verifier l'identite du site et activer le chiffrement", "Stocker les mots de passe", "Accelerer le site"], "answer": 0, "explanation": "Le certificat prouve l'identite et active le chiffrement."}
            ],
            "micro_project": {
              "title": "Audit securite HTTPS",
              "brief": "Analyse la securite de 3 sites web.",
              "steps": [
                "Teste google.com sur ssllabs.com/ssltest",
                "Teste un petit site et compare",
                "Note le type de certificat et la note obtenue"
              ],
              "deliverable": "Colle les notes et explique ce qui fait une bonne configuration securisee."
            },
            "xp_reward": 60,
            "duration_minutes": 50,
            "sort_order": 10
          },
          {
            "slug": "authentification-sessions",
            "title": "Authentification et gestion des sessions",
            "intro": "L'authentification verifie qui tu es ; la gestion des sessions maintient cet etat entre les requetes. Cookies, tokens JWT, OAuth : comprendre ces mecanismes est essentiel pour tout developpeur web.",
            "why_important": "La plupart des applications web gerent des comptes utilisateurs. Comprendre l'authentification t'evite de creer des failles de securite.",
            "how_to_use": "Lis les articles MDN sur les cookies et les sessions, puis explore les cookies de ton navigateur.",
            "objectives": [
              "Distinguer cookies, tokens JWT et OAuth",
              "Comprendre le cycle de vie d'une session",
              "Connaître les bonnes pratiques de stockage des secrets"
            ],
            "resources": [
              {"label": "HTTP cookies (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies", "kind": "doc", "why": "Reference complete sur les cookies.", "how": "Note les attributs importants (HttpOnly, Secure, SameSite)."},
              {"label": "Session vs Token (Auth0)", "url": "https://auth0.com/docs/sessions", "kind": "doc", "why": "Comparatif clair entre sessions et tokens.", "how": "Lis les avantages/inconvenients de chaque approche."},
              {"label": "JWT.io (outil)", "url": "https://jwt.io/", "kind": "tool", "why": "Pour decoder et inspecter des tokens JWT.", "how": "Colle un token JWT et observe son contenu."}
            ],
            "quiz": [
              {"q": "Quelle est la difference entre un cookie et un token JWT ?", "choices": ["Le cookie est stocke par le navigateur, le JWT est un objet signe", "C'est la meme chose", "Le JWT est plus sur"], "answer": 0, "explanation": "Les cookies sont stockes cote navigateur ; les JWT sont des tokens self-contained."},
              {"q": "A quoi sert l'attribut HttpOnly d'un cookie ?", "choices": ["Empecher JavaScript d'acceder au cookie", "Rendre le cookie permanent", "Chiffrer le cookie"], "answer": 0, "explanation": "HttpOnly protege contre les attaques XSS en bloquant l'acces JS."},
              {"q": "Qu'est-ce que OAuth ?", "choices": ["Un protocole d'authorisation permettant de se connecter via un tiers", "Un type de chiffrement", "Un langage de programmation"], "answer": 0, "explanation": "OAuth permet de se connecter avec Google, GitHub, etc. sans partager son mot de passe."}
            ],
            "micro_project": {
              "title": "Inspecte les sessions",
              "brief": "Explore comment les sites gerent l'authentification.",
              "steps": [
                "Ouvre les DevTools, onglet Application > Cookies",
                "Connecte-toi a un site et observe les cookies crees",
                "Decide si le site utilise des cookies ou des tokens"
              ],
              "deliverable": "Decris ce que tu as observe : noms de cookies, attributs, et mecanisme devine."
            },
            "xp_reward": 60,
            "duration_minutes": 45,
            "sort_order": 20
          }
        ]
      },
      {
        "slug": "hebergement-et-domaine",
        "title": "Hebergement et domaine",
        "summary": "Choisir un hebergement, acheter un domaine et deployer.",
        "sort_order": 40,
        "lessons": [
          {
            "slug": "choisir-hebergement-domaine",
            "title": "Choisir hebergement et nom de domaine",
            "intro": "Un site a besoin d'un hebergement (serveur) et d'un nom de domaine (adresse). Ce sont les deux piliers de la mise en ligne.",
            "why_important": "Savoir choisir et configurer un hebergement et un domaine est indispensable pour tout createur de projet.",
            "how_to_use": "Compare les offres, choisis un domaine, et suis le guide de configuration DNS.",
            "objectives": [
              "Distinguer hebergement et domaine",
              "Choisir un hebergement adapte a son projet",
              "Connecter un domaine a un hebergement"
            ],
            "resources": [
              {"label": "Learn web hosting (Cloudflare)", "url": "https://www.cloudflare.com/learning/learn-web-hosting/", "kind": "doc", "why": "Guide complet des types d'hebergement.", "how": "Identifie quel type correspond a ton projet."},
              {"label": "What is a domain name? (Cloudflare)", "url": "https://www.cloudflare.com/learning/dns/glossary/what-is-a-domain-name/", "kind": "doc", "why": "Comprendre les noms de domaine.", "how": "Note les criteres de choix."},
              {"label": "Vercel (hebergement gratuit)", "url": "https://vercel.com/", "kind": "tool", "why": "Hebergement moderne et gratuit pour les projets front.", "how": "Cree un compte et deploie un projet."},
              {"label": "Netlify (hebergement gratuit)", "url": "https://www.netlify.com/", "kind": "tool", "why": "Alternative a Vercel avec des fonctionnalites similaires.", "how": "Compare les offres avec Vercel."}
            ],
            "quiz": [
              {"q": "Quelle est la difference entre hebergement et domaine ?", "choices": ["L'hebergement stocke les fichiers, le domaine est l'adresse", "C'est la meme chose", "Le domaine stocke les fichiers"], "answer": 0, "explanation": "L'hebergement est le serveur ; le domaine est le panneau indicateur."},
              {"q": "Quel hebergement est adapte pour un site debutant ?", "choices": ["Hebergement partage ou gratuit (Vercel, Netlify)", "Serveur dedie", "VPS"], "answer": 0, "explanation": "Les hebergements gratuits suffisent pour demarrer."},
              {"q": "Comment relier un domaine a un hebergement ?", "choices": ["Configurer les enregistrements DNS", "C'est automatique", "Acheter un certificat"], "answer": 0, "explanation": "Tu pointes le domaine vers l'IP via les DNS."}
            ],
            "micro_project": {
              "title": "Planifie ton hebergement",
              "brief": "Choisis un domaine et un hebergement pour ton projet.",
              "steps": [
                "Cherche un domaine disponible sur un registrar",
                "Compare Vercel et Netlify (prix, fonctionnalites)",
                "Note la configuration DNS que tu utiliserais"
              ],
              "deliverable": "Colle ton choix de domaine, le comparatif, et la config prevue."
            },
            "xp_reward": 70,
            "duration_minutes": 50,
            "sort_order": 10
          },
          {
            "slug": "deployer-premier-site",
            "title": "Deployer son premier site",
            "intro": "Deployer, c'est mettre ton site en ligne pour que tout le monde puisse y acceder. Avec des outils comme Vercel ou Netlify, c'est devenu tres simple.",
            "why_important": "Le deploiement est l'etape finale qui transforme ton code en site accessible. C'est la recompense de tout le travail precedent.",
            "how_to_use": "Suis les etapes pour creer un site simple et le deployer sur une plateforme gratuite.",
            "objectives": [
              "Creer un site HTML/CSS simple",
              "Le deployer sur Vercel ou Netlify",
              "Verifier que le site est accessible en ligne"
            ],
            "resources": [
              {"label": "Deploy to Vercel (doc officielle)", "url": "https://vercel.com/docs/getting-started", "kind": "doc", "why": "Guide officiel pour deployer sur Vercel.", "how": "Suis le tutoriel pas a pas."},
              {"label": "Deploy to Netlify (doc officielle)", "url": "https://docs.netlify.com/getting-started/", "kind": "doc", "why": "Guide officiel pour Netlify.", "how": "Compare avec Vercel."},
              {"label": "GitHub Pages (doc)", "url": "https://docs.github.com/en/pages", "kind": "doc", "why": "Option gratuite pour les sites statiques.", "how": "Decouvre cette alternative."}
            ],
            "quiz": [
              {"q": "Qu'est-ce que le deploiement ?", "choices": ["Mettre son code en ligne pour qu'il soit accessible", "Ecrire du code", "Tester son site"], "answer": 0, "explanation": "Le deploiement rend ton site accessible sur Internet."},
              {"q": "Quel est l'avantage principal de Vercel/Netlify ?", "choices": ["Deploiement automatique depuis Git", "Ils sont payants", "Ils fournissent une base de donnees"], "answer": 0, "explanation": "Push sur Git = deploiement automatique."},
              {"q": "Peut-on deployer un site gratuitement ?", "choices": ["Oui, Vercel et Netlify offrent des plans gratuits", "Non, c'est toujours payant", "Uniquement avec un VPS"], "answer": 0, "explanation": "Les plateformes modernes offrent des generaux plans gratuits."}
            ],
            "micro_project": {
              "title": "Deploie ton premier site",
              "brief": "Cree un site HTML simple et deploie-le en ligne.",
              "steps": [
                "Cree un fichier index.html avec du contenu simple",
                "Cree un compte sur Vercel ou Netlify",
                "Deploie le fichier et vérifie que le site est accessible"
              ],
              "deliverable": "Colle l'URL de ton site deploye et decris le processus."
            },
            "xp_reward": 80,
            "duration_minutes": 60,
            "sort_order": 20
          }
        ]
      },
      {
        "slug": "html-structurer",
        "title": "HTML : structurer le contenu",
        "summary": "Les bases du HTML, les elements, les formulaires et l'accessibilite.",
        "sort_order": 50,
        "lessons": [
          {
            "slug": "html-bases",
            "title": "Les bases du HTML",
            "intro": "HTML (HyperText Markup Language) est le语言age de balisage qui structure le contenu des pages web. Chaque page web est un fichier HTML contenant des balises qui definissent le titre, les paragraphes, les liens, les images, etc.",
            "why_important": "HTML est le fondement de tout site web. Meme avec un framework comme React, le resultat final est toujours du HTML.",
            "how_to_use": "Lis les tutoriels MDN, puis cree ta premiere page dans un editeur de code.",
            "objectives": [
              "Creer une page HTML valide avec la structure de base",
              "Utiliser les balises de texte (h1-h6, p, a, strong, em)",
              "Inserer des images et des liens",
              "Comprendre la difference entre elements de bloc et en ligne"
            ],
            "resources": [
              {"label": "HTML basics (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax", "kind": "doc", "why": "Reference MDN pour les bases du HTML.", "how": "Lis et reproduis les exemples."},
              {"label": "Learn HTML (web.dev)", "url": "https://web.dev/learn/html", "kind": "doc", "why": "Cours complet de Google sur HTML.", "how": "Parcours les modules."},
              {"label": "HTML playground (outil)", "url": "https://developer.mozilla.org/en-US/play", "kind": "tool", "why": "Pour tester du HTML en ligne.", "how": "Ecris du HTML et observe le rendu en temps reel."},
              {"label": "freeCodeCamp HTML (cours gratuit)", "url": "https://www.freecodecamp.org/learn/2022/responsive-web-design/", "kind": "doc", "why": "Cours interactif gratuit avec exercices.", "how": "Complete les premiers exercices."}
            ],
            "quiz": [
              {"q": "Que signifie HTML ?", "choices": ["HyperText Markup Language", "Home Tool Markup Language", "Hyper Transfer Markup Language"], "answer": 0, "explanation": "HTML = langage de balisage hypertexte."},
              {"q": "Quelle balise cree un lien ?", "choices": ["<a>", "<link>", "<href>"], "answer": 0, "explanation": "La balise <a> (anchor) cree des liens avec l'attribut href."},
              {"q": "Quelle est la difference entre <strong> et <b> ?", "choices": ["<strong> indique l'importance semantique, <b> est juste visuel", "C'est la meme chose", "<b> est plus important"], "answer": 0, "explanation": "<strong> a une signification semantique (important), <b> est purement visuel."},
              {"q": "Quelle balise insere une image ?", "choices": ["<img>", "<image>", "<pic>"], "answer": 0, "explanation": "<img> avec l'attribut src insere une image."},
              {"q": "Quelle est la structure de base d'un fichier HTML ?", "choices": ["<!DOCTYPE html>, <html>, <head>, <body>", "<html>, <body>", "<head>, <body>"], "answer": 0, "explanation": "La structure complete inclut DOCTYPE, html, head et body."}
            ],
            "micro_project": {
              "title": "Ta premiere page web",
              "brief": "Cree une page HTML personnelle avec du contenu structure.",
              "steps": [
                "Cree un fichier index.html avec la structure de base",
                "Ajoute un titre (h1), des paragraphes, et des liens",
                "Insere au moins une image",
                "Ouvre le fichier dans ton navigateur"
              ],
              "deliverable": "Colle le code HTML de ta page et l'URL si tu l'as deployee."
            },
            "xp_reward": 70,
            "duration_minutes": 50,
            "sort_order": 10
          },
          {
            "slug": "html-formulaires",
            "title": "Formulaires et elements d'entree",
            "intro": "Les formulaires HTML permettent aux utilisateurs d'envoyer des donnees au serveur : inscriptions, connexions, commentaires, recherches. Chaque element d'entree (input, select, textarea) a un role specifique.",
            "why_important": "Les formulaires sont au coeur de l'interaction utilisateur. Savoir les creer correctement est indispensable pour tout site web.",
            "how_to_use": "Lis les tutoriels MDN sur les formulaires, puis cree un formulaire de contact.",
            "objectives": [
              "Creer un formulaire avec differents types d'inputs",
              "Utiliser les attributs de validation (required, pattern, min/max)",
              "Comprendre la difference entre GET et POST pour les formulaires",
              "Rendre un formulaire accessible"
            ],
            "resources": [
              {"label": "HTML forms (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_forms", "kind": "doc", "why": "Reference complete sur les formulaires.", "how": "Lis les sections sur les types d'input."},
              {"label": "Learn Forms (web.dev)", "url": "https://web.dev/learn/forms", "kind": "doc", "why": "Cours complet de Google sur les formulaires.", "how": "Parcours les modules."},
              {"label": "Form element (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form", "kind": "doc", "why": "Documentation de reference de la balise form.", "how": "Note les attributs importants (action, method)."}
            ],
            "quiz": [
              {"q": "Quel attribut empeche de soumettre un champ vide ?", "choices": ["required", "mandatory", "empty"], "answer": 0, "explanation": "L'attribut required rend le champ obligatoire."},
              {"q": "Quelle est la difference entre GET et POST ?", "choices": ["GET affiche les donnees dans l'URL, POST les envoie dans le corps", "GET est plus sur", "POST est plus rapide"], "answer": 0, "explanation": "GET = donnees visibles dans l'URL ; POST = donnees dans le corps de la requete."},
              {"q": "Quel element d'entree permet d'ecrire du texte sur plusieurs lignes ?", "choices": ["<textarea>", "<input type='text'>", "<text>"], "answer": 0, "explanation": "textarea cree une zone de texte multi-lignes."}
            ],
            "micro_project": {
              "title": "Formulaire de contact",
              "brief": "Cree un formulaire de contact complet avec validation.",
              "steps": [
                "Cree un formulaire avec nom, email, sujet et message",
                "Ajoute la validation (required, type email)",
                "Ajoute un bouton de soumission",
                "Teste la validation dans ton navigateur"
              ],
              "deliverable": "Colle le code du formulaire et decris comment la validation fonctionne."
            },
            "xp_reward": 60,
            "duration_minutes": 45,
            "sort_order": 20
          },
          {
            "slug": "html-avance",
            "title": "HTML avance : media, tableaux et semantique",
            "intro": "Au-dela des bases, HTML offre des elements pour les tableaux, les videos, l'audio, et la semantique (header, nav, article, footer). Ces elements ameliorent l'accessibilite et le SEO.",
            "why_important": "Un HTML semantique est plus accessible, mieux indexe par les moteurs de recherche, et plus facile a maintenir.",
            "how_to_use": "Decouvre les elements semantiques, puis refactore une page pour les utiliser.",
            "objectives": [
              "Utiliser les elements semantiques (header, nav, main, article, footer)",
              "Inserer des videos et audio HTML",
              "Creer des tableaux accessibles",
              "Comprendre la structure d'un document HTML moderne"
            ],
            "resources": [
              {"label": "Semantic HTML (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Glossary/Semantics", "kind": "doc", "why": "Pour comprendre la semantique HTML.", "how": "Compare une page avec et sans elements semantiques."},
              {"label": "HTML video/audio (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_video_and_audio", "kind": "doc", "why": "Pour integrer des medias.", "how": "Cree une page avec une video."},
              {"label": "HTML tables (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics", "kind": "doc", "why": "Pour creer des tableaux accessibles.", "how": "Note les bonnes pratiques (caption, thead, tbody)."}
            ],
            "quiz": [
              {"q": "A quoi sert la balise <nav> ?", "choices": ["Indiquer une section de navigation", "Creer un lien", "Afficher une image"], "answer": 0, "explanation": "<nav> est un element semantique pour les zones de navigation."},
              {"q": "Quelle est la bonne facon d'inserer une video HTML ?", "choices": ["<video src='video.mp4' controls></video>", "<iframe src='video.mp4'>", "<media src='video.mp4'>"], "answer": 0, "explanation": "La balise <video> avec controls permet de lire la video."},
              {"q": "Pourquoi utiliser <thead> et <tbody> dans un tableau ?", "choices": ["Pour separer l'en-tete du contenu et ameliorer l'accessibilite", "Pour le style uniquement", "C'est obligatoire"], "answer": 0, "explanation": "thead/tbody ameliorent la semantique et l'accessibilite."}
            ],
            "micro_project": {
              "title": "Page semantique complete",
              "brief": "Construis une page avec elements semantiques, video et tableau.",
              "steps": [
                "Cree une page avec header, nav, main, article, footer",
                "Ajoute une section avec une video YouTube integree",
                "Ajoute un tableau de donnees avec thead et tbody",
                "Valide ton HTML sur validator.w3.org"
              ],
              "deliverable": "Colle le code et le lien de validation W3C."
            },
            "xp_reward": 60,
            "duration_minutes": 50,
            "sort_order": 30
          }
        ]
      },
      {
        "slug": "css-styler",
        "title": "CSS : styler le contenu",
        "summary": "Les bases du CSS, le modele de boite, Flexbox, Grid et le design responsive.",
        "sort_order": 60,
        "lessons": [
          {
            "slug": "css-bases",
            "title": "Les bases du CSS",
            "intro": "CSS (Cascading Style Sheets) est le langage qui donne du style aux pages web : couleurs, polices, espacements, positions. Il se compose de selecteurs, de proprietes et de valeurs.",
            "why_important": "HTML structure le contenu, CSS le rend beau et lisible. Sans CSS, les pages seraient toutes identiques et laides.",
            "how_to_use": "Lis les bases sur MDN, puis experimente dans un editeur CSS en ligne.",
            "objectives": [
              "Ecrire des regles CSS avec selecteurs, proprietes et valeurs",
              "Comprendre la cascade et l'especifite",
              "Appliquer des styles aux elements HTML",
              "Utiliser les couleurs, polices et espacements"
            ],
            "resources": [
              {"label": "CSS first steps (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/What_is_CSS", "kind": "doc", "why": "Introduction complete au CSS.", "how": "Lis et reproduis les exemples."},
              {"label": "Learn CSS (web.dev)", "url": "https://web.dev/learn/css", "kind": "doc", "why": "Cours complet de Google.", "how": "Parcours les modules."},
              {"label": "CSS Diner (outil interactif)", "url": "https://flukeout.github.io/", "kind": "tool", "why": "Apprendre les selecteurs CSS de maniere ludique.", "how": "Complete tous les niveaux."},
              {"label": "Flexbox Froggy (outil interactif)", "url": "https://flexboxfroggy.com/", "kind": "tool", "why": "Apprendre Flexbox en jouant.", "how": "Complete les 24 niveaux."}
            ],
            "quiz": [
              {"q": "Que signifie CSS ?", "choices": ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System"], "answer": 0, "explanation": "CSS = feuilles de style en cascade."},
              {"q": "Quel selecteur cible un element avec l'id 'main' ?", "choices": ["#main", ".main", "main"], "answer": 0, "explanation": "# cible un id, . cible une classe, sans prefixe c'est un type."},
              {"q": "Quelle propriete change la couleur du texte ?", "choices": ["color", "text-color", "font-color"], "answer": 0, "explanation": "La propriete 'color' definit la couleur du texte."},
              {"q": "Qu'est-ce que l'especifite en CSS ?", "choices": ["Le systeme qui determine quelle regle s'applique en cas de conflit", "La vitesse de rendu", "L'ordre des fichiers CSS"], "answer": 0, "explanation": "L'especifite determine la priorite des regles CSS."},
              {"q": "Quelle propriete ajoute de l'espace autour d'un element ?", "choices": ["margin", "padding", "spacing"], "answer": 0, "explanation": "margin = espace exterieur, padding = espace interieur."}
            ],
            "micro_project": {
              "title": "Style ta premiere page",
              "brief": "Applique du CSS a la page HTML que tu as creee precedemment.",
              "steps": [
                "Cree un fichier style.css et lie-le a ta page HTML",
                "Change les couleurs de fond et de texte",
                "Ajoute des espacements et des bordures",
                "Modifie les polices et les tailles"
              ],
              "deliverable": "Colle le code CSS et montre la difference avant/apres."
            },
            "xp_reward": 70,
            "duration_minutes": 50,
            "sort_order": 10
          },
          {
            "slug": "css-layout",
            "title": "Mise en page : Flexbox et Grid",
            "intro": "Flexbox et CSS Grid sont les deux systemes de mise en page modernes. Flexbox est ideal pour les layouts en une dimension (ligne ou colonne), Grid pour les layouts en deux dimensions (grille).",
            "why_important": "Ces deux outils remplacent les anciennes techniques (float, position) et rendent la mise en page beaucoup plus simple et puissante.",
            "how_to_use": "Joue a Flexbox Froggy et Grid Garden pour apprendre en pratiquant, puis applique a un vrai projet.",
            "objectives": [
              "Utiliser Flexbox pour aligner des elements en ligne ou en colonne",
              "Creer une mise en page Grid avec colonnes et lignes",
              "Comprendre quand utiliser Flexbox vs Grid",
              "Aligner et centrer des elements"
            ],
            "resources": [
              {"label": "Flexbox (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox", "kind": "doc", "why": "Reference complete sur Flexbox.", "how": "Lis les proprietes principales."},
              {"label": "CSS Grid (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Grids", "kind": "doc", "why": "Reference complete sur CSS Grid.", "how": "Note les proprietes cles."},
              {"label": "Flexbox Froggy (outil interactif)", "url": "https://flexboxfroggy.com/", "kind": "tool", "why": "Apprendre Flexbox en jouant.", "how": "Complete les 24 niveaux."},
              {"label": "Grid Garden (outil interactif)", "url": "https://cssgridgarden.com/", "kind": "tool", "why": "Apprendre Grid en jouant.", "how": "Complete les 28 niveaux."}
            ],
            "quiz": [
              {"q": "Quand utiliser Flexbox plutot que Grid ?", "choices": ["Pour les layouts en une dimension (ligne ou colonne)", "Pour les grilles 2D complexes", "Pour les animations"], "answer": 0, "explanation": "Flexbox = 1D, Grid = 2D."},
              {"q": "Quelle propriete Flexbox centrer un element horizontalement ?", "choices": ["justify-content: center", "align-items: center", "text-align: center"], "answer": 0, "explanation": "justify-content aligne sur l'axe principal."},
              {"q": "Comment creer 3 colonnes egales avec Grid ?", "choices": ["grid-template-columns: repeat(3, 1fr)", "grid-columns: 3", "display: grid(3)"], "answer": 0, "explanation": "repeat(3, 1fr) cree 3 colonnes de largeur egale."},
              {"q": "Quelle propriete Flexbox permet de centrer un element a la fois horizontalement et verticalement ?", "choices": ["justify-content: center + align-items: center sur un conteneur flex", "text-align: center + vertical-align: middle", "margin: auto"], "answer": 0, "explanation": "Les deux proprietes combinees sur un conteneur flex centrent l'element."}
            ],
            "micro_project": {
              "title": "Layout Flexbox + Grid",
              "brief": "Cree une mise en page moderne avec Flexbox et Grid.",
              "steps": [
                "Cree un layout de page avec header, sidebar, main et footer",
                "Utilise Grid pour la structure globale",
                "Utilise Flexbox pour les elements internes",
                "Rends le layout responsive"
              ],
              "deliverable": "Colle le code CSS et montre le rendu sur mobile et desktop."
            },
            "xp_reward": 70,
            "duration_minutes": 50,
            "sort_order": 20
          },
          {
            "slug": "css-responsive",
            "title": "Design responsive et media queries",
            "intro": "Le design responsive adapte le layout a la taille de l'ecran : mobile, tablette, desktop. Les media queries permettent d'appliquer des styles differents selon la largeur de l'ecran.",
            "why_important": "Plus de 50% du trafic web vient des mobiles. Un site non responsive perd la moitie de son audience.",
            "how_to_use": "Lis les guides MDN, puis adapte ton site pour qu'il soit responsive.",
            "objectives": [
              "Comprendre le concept mobile-first",
              "Ecrire des media queries pour differentes tailles d'ecran",
              "Utiliser les unites relatives (rem, em, %, vw, vh)",
              "Adapter les images et les polices aux ecrans mobiles"
            ],
            "resources": [
              {"label": "Responsive design (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design", "kind": "doc", "why": "Reference complete sur le responsive.", "how": "Note les bonnes pratiques."},
              {"label": "Learn Responsive Design (web.dev)", "url": "https://web.dev/learn/design", "kind": "doc", "why": "Cours de Google sur le design responsive.", "how": "Parcours les modules."},
              {"label": "Can I Use (outil)", "url": "https://caniuse.com/", "kind": "tool", "why": "Verifier la compatibilite des fonctionnalites CSS.", "how": "Teste media queries et autres proprietes."}
            ],
            "quiz": [
              {"q": "Qu'est-ce que mobile-first ?", "choices": [" concevoir d'abord pour mobile puis adapter au desktop", " concevoir d'abord pour desktop", "Utiliser un framework mobile"], "answer": 0, "explanation": "Mobile-first = les styles de base sont pour mobile, les media queries agrandissent."},
              {"q": "Quelle media query cible les ecrans superieurs a 768px ?", "choices": ["@media (min-width: 768px)", "@media (max-width: 768px)", "@media (screen: 768px)"], "answer": 0, "explanation": "min-width cible les ecrans au moins aussi larges."},
              {"q": "Quelle unite CSS est relative a la taille de la police racine ?", "choices": ["rem", "px", "vh"], "answer": 0, "explanation": "rem = root em, relatif a la police du document."},
              {"q": "Comment adapter une image au conteneur ?", "choices": ["max-width: 100%", "width: 100%", "Les deux fonctionnent"], "answer": 2, "explanation": "Les deux fonctionnent, max-width est plus flexible (ne depasse pas la taille originale)."}
            ],
            "micro_project": {
              "title": "Rends ton site responsive",
              "brief": "Adapte le site que tu as cree pour qu'il fonctionne sur mobile.",
              "steps": [
                "Ajoute la meta viewport dans le head",
                "Ajoute des media queries pour mobile (max-width: 768px)",
                "Adapte les polices et les espacements",
                "Teste sur ton telephone"
              ],
              "deliverable": "Colle le code des media queries et montre le rendu mobile vs desktop."
            },
            "xp_reward": 60,
            "duration_minutes": 45,
            "sort_order": 30
          }
        ]
      },
      {
        "slug": "javascript-interactivite",
        "title": "JavaScript : interactivite",
        "summary": "Les bases du JS, le DOM, les evenements et les appels reseau.",
        "sort_order": 70,
        "lessons": [
          {
            "slug": "js-bases",
            "title": "Les bases du JavaScript",
            "intro": "JavaScript est le langage de programmation du web. Il ajoute l'interactivite aux pages web : animations, formulaires dynamiques, mises a jour en temps reel, etc.",
            "why_important": "JavaScript est le seul langage nativement execute par les navigateurs. Sans JS, pas d'interactivite sur le web.",
            "how_to_use": "Lis les bases sur MDN, puis experimente dans la console de ton navigateur.",
            "objectives": [
              "Ecrire du JavaScript de base (variables, conditions, boucles)",
              "Utiliser les fonctions et les objets",
              "Comprendre la difference entre var, let et const",
              "Manipuler les tableaux et les methods courantes"
            ],
            "resources": [
              {"label": "JS basics (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript", "kind": "doc", "why": "Introduction complete au JavaScript.", "how": "Lis et reproduis les exemples."},
              {"label": "Learn JavaScript (web.dev)", "url": "https://web.dev/learn/javascript", "kind": "doc", "why": "Cours de Google sur JavaScript.", "how": "Parcours les modules."},
              {"label": "JavaScript.info (cours)", "url": "https://javascript.info/", "kind": "doc", "why": "Cours moderne et complet sur JS.", "how": "Complete les premieres parties."},
              {"label": "Console JS (outil)", "url": "https://developer.chrome.com/docs/devtools/console/", "kind": "tool", "why": "Pour tester du JS dans le navigateur.", "how": "Ouvre la console (F12) et tape des commandes."}
            ],
            "quiz": [
              {"q": "Quelle est la difference entre let et const ?", "choices": ["const ne peut pas etre reaffectee, let si", "let est plus rapide", "const est pour les strings"], "answer": 0, "explanation": "const = constante (pas de reaffectation), let = variable (reaffectable)."},
              {"q": "Comment ecrire une fonction en JS ?", "choices": ["function maFonction() {}", "def maFonction():", "fn maFonction()"], "answer": 0, "explanation": "La syntaxe standard est function nom() {}."},
              {"q": "Que retourne typeof 'hello' ?", "choices": ["string", "text", "String"], "answer": 0, "explanation": "typeof retourne le type en minuscules."},
              {"q": "Comment acceder au premier element d'un tableau ?", "choices": ["tableau[0]", "tableau[1]", "tableau.first()"], "answer": 0, "explanation": "Les tableaux sont indexes a partir de 0."},
              {"q": "Quelle methode ajoute un element a la fin d'un tableau ?", "choices": ["push()", "add()", "append()"], "answer": 0, "explanation": "push() ajoute a la fin du tableau."}
            ],
            "micro_project": {
              "title": "Ta premiere page interactive",
              "brief": "Ajoute de l'interactivite a ta page web avec JavaScript.",
              "steps": [
                "Cree un bouton qui change la couleur de fond au clic",
                "Ajoute un compteur qui s'increment a chaque clic",
                "Affiche une alerte avec le nombre de clics"
              ],
              "deliverable": "Colle le code JS et decris comment l'interactivite fonctionne."
            },
            "xp_reward": 70,
            "duration_minutes": 50,
            "sort_order": 10
          },
          {
            "slug": "js-dom-evenements",
            "title": "Le DOM et les evenements",
            "intro": "Le DOM (Document Object Model) est la representation en memoire de ta page HTML. JavaScript peut le modifier pour changer le contenu, le style et la structure de la page en temps reel.",
            "why_important": "Le DOM est l'interface entre JS et HTML. Toute modification visible d'une page passe par le DOM.",
            "how_to_use": "Decouvre le DOM avec les DevTools, puis modifie-le avec JS.",
            "objectives": [
              "Selectionner des elements HTML avec JS",
              "Modifier le contenu, le style et les attributs",
              "Ajouter et supprimer des elements dynamiquement",
              "Ecouter et reagir aux evenements (clic, saisie, soumission)"
            ],
            "resources": [
              {"label": "Introduction to the DOM (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction", "kind": "doc", "why": "Reference sur le DOM.", "how": "Lis les concepts cles."},
              {"label": "DOM scripting (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting", "kind": "doc", "why": "Pour apprendre a manipuler le DOM.", "how": "Reproduis les exemples."},
              {"label": "Events (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events", "kind": "doc", "why": "Pour comprendre les evenements JS.", "how": "Note les types d'evenements courants."}
            ],
            "quiz": [
              {"q": "Comment selectionner un element par son ID ?", "choices": ["document.getElementById('id')", "document.querySelector('#id')", "Les deux fonctionnent"], "answer": 2, "explanation": "Les deux methodes fonctionnent, querySelector est plus flexible."},
              {"q": "Comment ajouter un ecouteur d'evenement ?", "choices": ["element.addEventListener('click', fn)", "element.onClick(fn)", "element.on('click', fn)"], "answer": 0, "explanation": "addEventListener est la methode standard."},
              {"q": "Comment modifier le texte d'un element ?", "choices": ["element.textContent = 'texte'", "element.innerText = 'texte'", "Les deux fonctionnent"], "answer": 2, "explanation": "Les deux fonctionnent, textContent est plus rapide."},
              {"q": "Qu'est-ce que preventDefault() ?", "choices": ["Empeche le comportement par defaut d'un evenement", "Supprime un element", "Arrete le script"], "answer": 0, "explanation": "preventDefault() evite le rechargement de page sur un formulaire, par exemple."}
            ],
            "micro_project": {
              "title": "To-do list interactive",
              "brief": "Cree une liste de taches fonctionnelle avec le DOM.",
              "steps": [
                "Cree un formulaire avec un input et un bouton Ajouter",
                "Ajoute les taches a la liste au clic",
                "Permet de supprimer les taches",
                "Compte le nombre de taches restantes"
              ],
              "deliverable": "Colle le code et montre la liste en action."
            },
            "xp_reward": 70,
            "duration_minutes": 50,
            "sort_order": 20
          },
          {
            "slug": "js-api-fetch",
            "title": "Appels reseau avec Fetch et API",
            "intro": "L'API Fetch permet a JavaScript de recuperer des donnees depuis un serveur (API REST, fichier JSON, etc.) sans recharger la page. C'est la base du web moderne et des applications reactives.",
            "why_important": "La plupart des sites modernes chargent les donnees dynamiquement via des API. Fetch est l'outil principal pour ca.",
            "how_to_use": "Decouvre l'API Fetch, puis recupere des donnees depuis une API publique.",
            "objectives": [
              "Utiliser fetch() pour recuperer des donnees",
              "Parser les reponses JSON",
              "Gerer les erreurs reseau",
              "Comprendre les promesses (promises) en JS"
            ],
            "resources": [
              {"label": "Fetch API (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API", "kind": "doc", "why": "Reference complete sur Fetch.", "how": "Lis les exemples."},
              {"label": "Using Fetch (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch", "kind": "doc", "why": "Tutoriel pratique sur Fetch.", "how": "Reproduis les exemples."},
              {"label": "Public APIs (liste)", "url": "https://github.com/public-apis/public-apis", "kind": "doc", "why": "Liste d'APIs publiques pour pratiquer.", "how": "Choisis une API et recupere des donnees."},
              {"label": "JSONPlaceholder (API fake)", "url": "https://jsonplaceholder.typicode.com/", "kind": "tool", "why": "API fictive pour tester fetch.", "how": "Recupere des posts avec fetch."}
            ],
            "quiz": [
              {"q": "Que retourne fetch() ?", "choices": ["Une promesse (Promise)", "Un objet JSON", "Une chaine de caracteres"], "answer": 0, "explanation": "fetch() retourne une Promise qui resout en Response."},
              {"q": "Comment convertir la reponse en JSON ?", "choices": ["response.json()", "JSON.parse(response)", "response.toJson()"], "answer": 0, "explanation": "response.json() est une methode asynchrone qui parse le JSON."},
              {"q": "Comment gerer les erreurs avec fetch ?", "choices": ["Avec try/catch et .catch()", "Avec if/else", "C'est automatique"], "answer": 0, "explanation": "Utilise try/catch avec async/await ou .catch() avec les promesses."},
              {"q": "Quelle methode HTTP utilise fetch() par defaut ?", "choices": ["GET", "POST", "PUT"], "answer": 0, "explanation": "fetch() utilise GET par defaut."},
              {"q": "Comment envoyer des donnees avec fetch() ?", "choices": ["Avec l'option method: 'POST' et body: JSON.stringify(data)", "Avec l'option data:", "C'est impossible"], "answer": 0, "explanation": "Tu dois specifier method et body dans les options."}
            ],
            "micro_project": {
              "title": "Affiche des donnees d'API",
              "brief": "Recupere et affiche des donnees depuis une API publique.",
              "steps": [
                "Utilise fetch pour recuperer les posts depuis jsonplaceholder.typicode.com/posts",
                "Parse la reponse en JSON",
                "Affiche les titres des 5 premiers posts dans la page",
                "Ajoute un bouton pour rafraichir les donnees"
              ],
              "deliverable": "Colle le code et montre les donnees affichees."
            },
            "xp_reward": 80,
            "duration_minutes": 60,
            "sort_order": 30
          }
        ]
      },
      {
        "slug": "outils-developpeur",
        "title": "Outils du developpeur",
        "summary": "Editeur de code, terminal, Git et outils de developpement.",
        "sort_order": 80,
        "lessons": [
          {
            "slug": "editeur-terminal",
            "title": "Editeur de code et terminal",
            "intro": "Un editeur de code (VS Code) et le terminal sont les outils de base de tout developpeur. L'editeur facilite l'ecriture de code, le terminal permet d'executer des commandes.",
            "why_important": "Bien maitriser ses outils gagne un temps considerable. VS Code et le terminal sont les standards de l'industrie.",
            "how_to_use": "Installe VS Code, decouvre les raccourcis, et pratique les commandes de base du terminal.",
            "objectives": [
              "Installer et configurer VS Code",
              "Connaitre les raccourcis essentiels du terminal",
              "Naviguer dans le systeme de fichiers en ligne de commande",
              "Executer des scripts depuis le terminal"
            ],
            "resources": [
              {"label": "VS Code setup (doc officielle)", "url": "https://code.visualstudio.com/docs/setup/setup-overview", "kind": "doc", "why": "Guide d'installation officiel.", "how": "Installe VS Code."},
              {"label": "VS Code keyboard shortcuts", "url": "https://code.visualstudio.com/docs/getstarted/keybindings", "kind": "doc", "why": "Raccourcis pour etre plus productif.", "how": "Memorise les 10 plus utiles."},
              {"label": "Command line basics (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line", "kind": "doc", "why": "Pour apprendre le terminal.", "how": "Pratique les commandes de base."},
              {"label": "Oh My Zsh (outil)", "url": "https://ohmyz.sh/", "kind": "tool", "why": "Pour ameliorer le terminal (Mac/Linux).", "how": "Decouvre les themes et plugins."}
            ],
            "quiz": [
              {"q": "Quel est le raccourci pour ouvrir le terminal dans VS Code ?", "choices": ["Ctrl+` (backtick)", "Ctrl+T", "Ctrl+Shift+T"], "answer": 0, "explanation": "Ctrl+` ouvre/ferme le terminal integre."},
              {"q": "Quelle commande affiche le repertoire courant ?", "choices": ["pwd", "cd", "ls"], "answer": 0, "explanation": "pwd = Print Working Directory."},
              {"q": "Quelle commande cree un dossier ?", "choices": ["mkdir", "touch", "create"], "answer": 0, "explanation": "mkdir = Make Directory."},
              {"q": "Quelle commande affiche le contenu d'un dossier ?", "choices": ["ls", "dir", "show"], "answer": 0, "explanation": "ls = list (sur Mac/Linux), dir sur Windows."},
              {"q": "Quel editor est le plus populaire pour le developpement web ?", "choices": ["VS Code", "Notepad", "Word"], "answer": 0, "explanation": "VS Code est l'editor le plus utilise par les developpeurs web."}
            ],
            "micro_project": {
              "title": "Configure ton environnement",
              "brief": "Installe et configure un environnement de developpement complet.",
              "steps": [
                "Installe VS Code et les extensions recommandees",
                "Ouvre un projet dans VS Code",
                "Utilise le terminal integre pour naviguer et creer des fichiers",
                "Configure un raccourci personnalise"
              ],
              "deliverable": "Decris ton environnement : extensions installees, raccourcis favoris, configuration personnalisee."
            },
            "xp_reward": 50,
            "duration_minutes": 40,
            "sort_order": 10
          },
          {
            "slug": "git-version-control",
            "title": "Git et le version control",
            "intro": "Git est le systeme de controle de version le plus utilise au monde. Il garde l'historique de chaque modification de ton code, te permet de revenir en arriere et de collaborer avec d'autres.",
            "why_important": "Git est indispensable pour tout developpeur. C'est le standard de l'industrie et la base de GitHub/GitLab.",
            "how_to_use": "Installe Git, apprends les commandes de base, puis cree un depot sur GitHub.",
            "objectives": [
              "Installer et configurer Git",
              "Creer un depot, ajouter des fichiers, faire des commits",
              "Utiliser les branches pour isoler les features",
              "Pousser et tirer depuis un depot distant (GitHub)"
            ],
            "resources": [
              {"label": "Git handbook (GitHub)", "url": "https://docs.github.com/en/get-started/using-git/about-git", "kind": "doc", "why": "Guide officiel GitHub sur Git.", "how": "Lis les commandes de base."},
              {"label": "Learn Git (freeCodeCamp)", "url": "https://www.freecodecamp.org/news/learn-git-basics/", "kind": "doc", "why": "Tutoriel interactif gratuit.", "how": "Complete le tutoriel."},
              {"label": "Git Cheat Sheet", "url": "https://education.github.com/git-cheat-sheet-education.pdf", "kind": "doc", "why": "Reference rapide des commandes.", "how": "Garde sous la main."},
              {"label": "GitHub (outil)", "url": "https://github.com/", "kind": "tool", "why": "Pour heberger tes depots Git.", "how": "Cree un compte et un depot."}
            ],
            "quiz": [
              {"q": "Quelle commande initialise un depot Git ?", "choices": ["git init", "git start", "git create"], "answer": 0, "explanation": "git init cree un nouveau depot Git."},
              {"q": "Quelle commande ajoute les fichiers a l'index ?", "choices": ["git add", "git commit", "git push"], "answer": 0, "explanation": "git add prepare les fichiers pour le commit."},
              {"q": "Quelle commande enregistre les changements ?", "choices": ["git commit -m 'message'", "git save", "git push"], "answer": 0, "explanation": "git commit enregistre les changements avec un message."},
              {"q": "Quelle commande envoie les commits sur GitHub ?", "choices": ["git push", "git send", "git upload"], "answer": 0, "explanation": "git push envoie les commits au depot distant."},
              {"q": "A quoi servent les branches ?", "choices": ["Isoler des features ou des corrections", "Accelerer le code", "Stocker les secrets"], "answer": 0, "explanation": "Les branches permettent de travailler en parallele sans casser le code principal."}
            ],
            "micro_project": {
              "title": "Ton premier depot Git",
              "brief": "Cree un depot Git pour le projet que tu as construit.",
              "steps": [
                "Initialise Git dans ton projet (git init)",
                "Ajoute tous les fichiers (git add .)",
                "Fais ton premier commit (git commit -m 'Initial commit')",
                "Cree un depot sur GitHub et pousse ton code"
              ],
              "deliverable": "Colle l'URL de ton depot GitHub et decris le processus."
            },
            "xp_reward": 70,
            "duration_minutes": 50,
            "sort_order": 20
          },
          {
            "slug": "outils-debogage",
            "title": "Outils de debogage et performances",
            "intro": "Les outils de debogage (DevTools) t'aident a comprendre ce qui se passe dans ton site : inspecter le HTML, le CSS, le JS, observer les requetes reseau, et mesurer les performances.",
            "why_important": "Savoir deboguer est aussi important que savoir coder. Les DevTools sont ton meilleur allie pour resoudre les problemes.",
            "how_to_use": "Decouvre chaque onglet des DevTools et utilise-les sur un vrai site.",
            "objectives": [
              "Utiliser l'inspecteur HTML/CSS des DevTools",
              "Debugger du JavaScript avec les DevTools",
              "Observer les requetes reseau (onglet Network)",
              "Mesurer les performances d'une page"
            ],
            "resources": [
              {"label": "Chrome DevTools (doc officielle)", "url": "https://developer.chrome.com/docs/devtools/", "kind": "doc", "why": "Reference complete sur les DevTools.", "how": "Parcours les onglets principaux."},
              {"label": "Debugging JavaScript (MDN)", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Debugging_JavaScript", "kind": "doc", "why": "Pour apprendre a debugger en JS.", "how": "Pratique avec des exemples."},
              {"label": "PageSpeed Insights (outil)", "url": "https://pagespeed.web.dev/", "kind": "tool", "why": "Pour mesurer les performances d'un site.", "how": "Teste ton site et observe les suggestions."},
              {"label": "Lighthouse (outil)", "url": "https://developer.chrome.com/docs/lighthouse/", "kind": "tool", "why": "Audit complet d'un site web.", "how": "Lance un audit sur ton site."}
            ],
            "quiz": [
              {"q": "Quel raccourci ouvre les DevTools Chrome ?", "choices": ["F12", "F5", "Ctrl+S"], "answer": 0, "explanation": "F12 ouvre/ferme les DevTools."},
              {"q": "Dans quel onglet on observe les requetes reseau ?", "choices": ["Network", "Console", "Elements"], "answer": 0, "explanation": "L'onglet Network affiche toutes les requetes HTTP."},
              {"q": "A quoi sert l'onglet Console ?", "choices": ["Afficher les messages JS et les erreurs", "Editer le HTML", "Voir les cookies"], "answer": 0, "explanation": "La console affiche les logs et les erreurs JavaScript."},
              {"q": "Qu'est-ce que Lighthouse ?", "choices": ["Un outil d'audit de performance et d'accessibilite", "Un editeur de code", "Un navigateur"], "answer": 0, "explanation": "Lighthouse analyse les performances, l'accessibilite, le SEO, et les bonnes pratiques."},
              {"q": "Comment placer un breakpoint en JS ?", "choices": ["Cliquer sur le numero de ligne dans l'onglet Sources", "Avec le mot-cle 'break' en JS", "Dans le fichier CSS"], "answer": 0, "explanation": "Les breakpoints se placent dans l'onglet Sources des DevTools."}
            ],
            "micro_project": {
              "title": "Audite ton site",
              "brief": "Analyse les performances et la qualite de ton site avec les outils de debogage.",
              "steps": [
                "Ouvre les DevTools et inspecte le HTML/CSS de ton site",
                "Observe les requetes reseau (onglet Network)",
                "Lance Lighthouse depuis les DevTools",
                "Note la note de performance et les suggestions d'amelioration"
              ],
              "deliverable": "Colle les notes Lighthouse et decris ce que tu as observe dans chaque onglet."
            },
            "xp_reward": 60,
            "duration_minutes": 45,
            "sort_order": 30
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
    true, true,
    (track_record ->> 'sort_order')::integer
  )
  on conflict (slug) do update set
    title = excluded.title,
    summary = excluded.summary,
    description = excluded.description,
    level_label = excluded.level_label,
    duration_weeks = excluded.duration_weeks,
    resources = excluded.resources,
    next_session = excluded.next_session,
    next_steps = excluded.next_steps,
    is_published = true,
    is_active = true,
    updated_at = timezone('utc'::text, now())
  returning id into v_track_id;

  -- Supprimer les anciens modules/lecons pour ce track (re-creation complete)
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

  raise notice 'Parcours "Bases d Internet et du Web" (complet) insere/mis a jour : 8 modules, ~20 lecons.';
end;
$seed$;
