-- TakaCode - Parcours "Bases d'Internet & du Web"
-- 4 modules : fondations reseau, TCP/IP et DNS, securite TLS/SSL, hebergement et domaine
--
-- Run this after 019_quiz_expansion.sql

do $seed$
declare
  seed jsonb := $json$
[
  {
    "track": {
      "slug": "bases-internet",
      "goal_key": "internet_basics",
      "title": "Bases d'Internet et du Web",
      "summary": "IP, DNS, TCP/IP, securite, hebergement et domaine : les fondations du web.",
      "description": "Tu comprends comment Internet fonctionne vraiment : les adresses IP, le DNS qui traduit les noms de domaine, les protocoles TCP/IP, la securite TLS/SSL, et enfin comment choisir un hebergement et un nom de domaine pour mettre ton projet en ligne. Chaque lecon s'appuie sur les meilleures ressources du web, avec un quiz et un micro projet pour appliquer immediatement.",
      "level_label": "Fondations",
      "duration_weeks": 3,
      "accent_color": "#F59E0B",
      "icon": "lucide:globe",
      "objective": "Comprendre les fondamentaux d'Internet pour maitriser ton environnement de projet.",
      "resources": ["Cloudflare Learning", "DNS explained", "Let's Encrypt", "Hostinger"],
      "next_session": "Mardi 20h00",
      "next_steps": [
        {"label": "Comment marche Internet", "state": "current"},
        {"label": "TCP/IP et DNS", "state": "locked"},
        {"label": "Securite et chiffrement", "state": "locked"},
        {"label": "Hebergement et domaine", "state": "locked"}
      ],
      "sort_order": 0
    },
    "modules": [
      {
        "slug": "comment-marche-internet",
        "title": "Comment marche Internet",
        "summary": "Adresse IP, modele client-serveur, paquets et routage.",
        "sort_order": 10,
        "lessons": [
          {
            "slug": "internet-adresse-ip",
            "title": "Internet et les adresses IP",
            "intro": "Internet est un reseau de reseaux : des milliards d'appareils connectes qui communiquent grace aux adresses IP. Chaque appareil a une adresse unique, comme chaque maison a une adresse postale.",
            "why_important": "Comprendre les adresses IP te permet de saisir comment les donnees voyagent et pourquoi des concepts comme le DNS, le routage ou les pare-feux existent.",
            "how_to_use": "Regarde la video de Cloudflare pour les visuels, puis lis l'article pour fixer les notions. Utilise les outils en ligne pour explorer ta propre adresse IP.",
            "objectives": [
              "Expliquer ce qu'est une adresse IP",
              "Distinguer IPv4 et IPv6",
              "Comprendre le modele client-serveur"
            ],
            "resources": [
              {"label": "Qu'est-ce qu'une adresse IP ? (Cloudflare Learning)", "url": "https://www.cloudflare.com/learning/network-layer/what-is-an-ip-address/", "kind": "doc", "why": "L'explication la plus claire sur le web, avec des schemas et des analogies simples.", "how": "Lis la page en entier puis note la difference entre IPv4 et IPv6."},
              {"label": "How the Internet works (YouTube - Cloudflare)", "url": "https://www.youtube.com/watch?v=7_LPdttKXPc", "kind": "video", "why": "Une video de 8 minutes qui explique tout le fonctionnement d'Internet de maniere visuelle.", "how": "Regarde la video une fois en entier, puis une deuxieme fois en notant les mots cles."},
              {"label": "What is my IP (outil en ligne)", "url": "https://whatismyipaddress.com/", "kind": "tool", "why": "Un outil simple pour decouvrir ta propre adresse IP publique.", "how": "Ouvre le site et note ton adresse IP et ton fournisseur d'acces."}
            ],
            "quiz": [
              {"q": "Qu'est-ce qu'une adresse IP ?", "choices": ["Un identifiant unique attribue a chaque appareil connecte a un reseau", "Un mot de passe pour acceder a Internet", "Un logiciel de navigation"], "answer": 0, "explanation": "L'adresse IP est la carte d'identite de ton appareil sur le reseau."},
              {"q": "Quelle est la principale difference entre IPv4 et IPv6 ?", "choices": ["IPv6 est plus recent et permet beaucoup plus d'adresses qu'IPv4", "IPv4 est plus rapide qu'IPv6", "IPv6 n'utilise que des lettres"], "answer": 0, "explanation": "IPv4 permet ~4 milliards d'adresses, IPv6 permet un nombre quasi illimite."},
              {"q": "Dans le modele client-serveur, que fait le client ?", "choices": ["Il stocke les donnees", "Il envoie des requetes au serveur pour obtenir des donnees", "Il securise la connexion"], "answer": 1, "explanation": "Le client (ex: navigateur) demande des ressources ; le serveur les fournit."},
              {"q": "Qu'est-ce qu'un routeur ?", "choices": ["Un appareil qui achemine les paquets de donnees entre reseaux", "Un logiciel antivirus", "Un type de cable Internet"], "answer": 0, "explanation": "Le routeur dirige le trafic entre les reseaux pour que les donnees arrivent a destination."},
              {"q": "Que sont les paquets dans le contexte d'Internet ?", "choices": ["Les unites de donnees transmises sur le reseau, decoupees pour le transport", "Des colis physiques", "Des fichiers compresses"], "answer": 0, "explanation": "Les donnees sont decoupees en paquets qui voyagent independamment avant d'etre reassembles."}
            ],
            "micro_project": {
              "title": "Explore ton identite numerique",
              "brief": "Decouvre et analyse ta propre connexion Internet en utilisant des outils en ligne.",
              "steps": [
                "Va sur whatismyipaddress.com et note ton adresse IP publique",
                "Utilise un outil de traceroute (ou ping) pour voir le chemin jusqu'a cloudflare.com",
                "Note le nombre de sauts (hops) et les serveurs traverses"
              ],
              "deliverable": "Colle ton adresse IP, le nombre de sauts jusqu'a cloudflare.com et ta conclusion sur le chemin emprunte."
            },
            "xp_reward": 50,
            "duration_minutes": 40,
            "sort_order": 10
          }
        ]
      },
      {
        "slug": "tcp-ip-et-dns",
        "title": "TCP/IP et DNS",
        "summary": "Les protocoles qui font marcher Internet et la traduction des noms de domaine.",
        "sort_order": 20,
        "lessons": [
          {
            "slug": "tcp-ip-protocoles",
            "title": "TCP/IP : les protocoles d'Internet",
            "intro": "TCP/IP est la famille de protocoles qui gere la transmission des donnees sur Internet. TCP decoupe, envoie et reassemble les donnees ; IP s'occupe de l'adressage et du routage.",
            "why_important": "TCP/IP est le fondement technique d'Internet. Comprendre son fonctionnement t'aide a diagnostiquer des problemes et a comprendre les limites du web.",
            "how_to_use": "Lis les articles de Cloudflare et de GeeksforGeeks, puis utilise la commande ping dans ton terminal pour observer TCP/IP en action.",
            "objectives": [
              "Comprendre le role de TCP (decoupage et reassemblage)",
              "Comprendre le role de IP (adressage et routage)",
              "Distinguer TCP et UDP"
            ],
            "resources": [
              {"label": "What is TCP/IP ? (Cloudflare Learning)", "url": "https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/", "kind": "doc", "why": "Une explication claire et concise de la pile TCP/IP.", "how": "Lis l'article et memorise les couches de la pile."},
              {"label": "Difference between TCP and UDP (GeeksforGeeks)", "url": "https://www.geeksforgeeks.org/differences-between-tcp-and-udp/", "kind": "doc", "why": "Un comparatif simple entre les deux protocoles de transport.", "how": "Lis le tableau comparatif pour retenir les differences cles."}
            ],
            "quiz": [
              {"q": "Quel est le role de TCP dans la transmission de donnees ?", "choices": ["Il decoupe les donnees en paquets et verifie leur arrivee en bon ordre", "Il attribue les adresses IP", "Il securise la connexion"], "answer": 0, "explanation": "TCP garantit que tous les paquets arrivent correctement et dans l'ordre."},
              {"q": "Quand utilise-t-on UDP plutot que TCP ?", "choices": ["Pour le streaming video et les jeux en ligne, car il est plus rapide", "Pour les emails, car il est plus sur", "Pour le telechargement de fichiers, car il est plus fiable"], "answer": 0, "explanation": "UDP est plus rapide car il ne verifie pas la reception : ideal pour le temps reel."},
              {"q": "Que signifie le sigle IP dans TCP/IP ?", "choices": ["Internet Protocol", "Internal Program", "Information Provider"], "answer": 0, "explanation": "IP = Internet Protocol, le standard d'adressage et de routage des paquets."},
              {"q": "Quel port est utilise par defaut pour le trafic web (HTTP) ?", "choices": ["80", "443", "21"], "answer": 0, "explanation": "Le port 80 est le port par defaut pour HTTP ; le 443 pour HTTPS."},
              {"q": "Que se passe-t-il si un paquet est perdu pendant la transmission TCP ?", "choices": ["TCP le detecte et le renvoie automatiquement", "La connexion est coupee", "Le paquet perdu est ignore"], "answer": 0, "explanation": "TCP assure la fiabilite : il detecte les pertes et renvoie les paquets manquants."}
            ],
            "micro_project": {
              "title": "Observe TCP/IP en action",
              "brief": "Utilise des commandes reseau pour observer le fonctionnement de TCP/IP en temps reel.",
              "steps": [
                "Ouvre ton terminal et tape ping google.com (ou ping -n 4 google.com sur Windows)",
                "Note le temps de reponse (ping) et le nombre de paquets envoyes/recus",
                "Tape traceroute takacode.fr (ou tracert takacode.fr sur Windows) et note les sauts"
              ],
              "deliverable": "Colle le resultat du ping et du traceroute, et explique ce que chaque commande t'a appris."
            },
            "xp_reward": 50,
            "duration_minutes": 40,
            "sort_order": 10
          },
          {
            "slug": "dns-noms-de-domaine",
            "title": "DNS : l'annuaire d'Internet",
            "intro": "Le DNS (Domain Name System) est l'annuaire telephonique d'Internet : il traduit les noms de domaine que tu tapes (takacode.fr) en adresses IP que les serveurs comprennent.",
            "why_important": "Sans DNS, tu devrais memoriser des adresses IP comme 104.16.85.20 au lieu de takacode.fr. Comprendre le DNS t'aide a gerer tes propres domaines et a diagnostiquer les pannes.",
            "how_to_use": "Lis l'article Cloudflare, explore le site How DNS Works, puis utilise la commande nslookup pour interroger le DNS toi-meme.",
            "objectives": [
              "Expliquer le role du DNS",
              "Comprendre la hierarchie des domaines (.fr, .com, etc.)",
              "Interroger le DNS manuellement"
            ],
            "resources": [
              {"label": "What is DNS ? (Cloudflare Learning)", "url": "https://www.cloudflare.com/learning/dns/what-is-dns/", "kind": "doc", "why": "LA reference pour comprendre le DNS, avec des schemas clairs.", "how": "Lis l'article et les sections sur le fonctionnement etantdonne la hierarchie."},
              {"label": "How DNS works (site interactif)", "url": "https://howdns.works/", "kind": "tool", "why": "Une bande dessinee interactive pour comprendre le DNS visuellement.", "how": "Parcours l'histoire en entier, c'est rapide et tres pedagogique."},
              {"label": "DNS lookup tool (outil en ligne)", "url": "https://dns.google/", "kind": "tool", "why": "Un outil Google pour interroger les enregistrements DNS de n'importe quel domaine.", "how": "Tape takacode.fr et observe les differents types d'enregistrement."}
            ],
            "quiz": [
              {"q": "A quoi sert le DNS ?", "choices": ["A traduire les noms de domaine en adresses IP", "A heberger les sites web", "A chiffrer les connexions"], "answer": 0, "explanation": "Le DNS est l'annuaire qui associe les noms (takacode.fr) aux adresses IP."},
              {"q": "Quelle est la hierarchie correcte d'un nom de domaine ?", "choices": ["Domaine de premier niveau (.fr), domaine principal (tacacode), sous-domaine (www)", "Domaine principal, extension, sous-domaine", "Sous-domaine, domaine, extension"], "answer": 0, "explanation": "L'extension (.fr) est le domaine de premier niveau ; le nom principal est juste avant."},
              {"q": "Que se passe-t-il si le serveur DNS est inaccessible ?", "choices": ["Tu ne peux pas acceder aux sites web par leur nom de domaine", "Internet ne marche plus du tout", "Les adresses IP ne fonctionnent plus"], "answer": 0, "explanation": "Sans DNS, tu ne peux plus traduire les noms en IP. Mais les IP directes marchent encore."},
              {"q": "Quel type d'enregistrement DNS associe un domaine a une adresse IPv4 ?", "choices": ["Enregistrement A", "Enregistrement MX", "Enregistrement CNAME"], "answer": 0, "explanation": "L'enregistrement A (Address) associe un domaine a une adresse IPv4."},
              {"q": "Qu'est-ce qu'un sous-domaine ?", "choices": ["Un sous-ensemble du domaine principal (ex: blog.takacode.fr)", "Un deuxieme nom de domaine", "Un domaine d'extension inferieure"], "answer": 0, "explanation": "Les sous-domaines permettent d'organiser differentes sections d'un meme domaine."}
            ],
            "micro_project": {
              "title": "Enquete sur un domaine",
              "brief": "Utilise les outils DNS pour analyser les coulisses d'un site web que tu utilises.",
              "steps": [
                "Va sur dns.google et tape le nom de domaine d'un site que tu aimes",
                "Note les differents types d'enregistrement (A, MX, CNAME) que tu trouves",
                "Trouve le fournisseur d'hebergement du site"
              ],
              "deliverable": "Colle les enregistrements DNS du site que tu as analyse et explique a quoi sert chaque type."
            },
            "xp_reward": 60,
            "duration_minutes": 50,
            "sort_order": 20
          }
        ]
      },
      {
        "slug": "securite-chiffrement",
        "title": "Securite et chiffrement",
        "summary": "TLS/SSL, HTTPS, certificats et bonnes pratiques de securite.",
        "sort_order": 30,
        "lessons": [
          {
            "slug": "tls-ssl-https",
            "title": "TLS, SSL et HTTPS : naviguer en securite",
            "intro": "HTTPS est la version securisee de HTTP. Les donnees sont chiffrees entre ton navigateur et le serveur grace au protocole TLS (anciennement SSL). Un cadenas vert dans la barre d'adresse indique que la connexion est protegee.",
            "why_important": "Chaque site que tu construis devrait etre en HTTPS. Sans chiffrement, les donnees (mots de passe, emails) voyagent en clair et peuvent etre interceptees.",
            "how_to_use": "Lis les ressources Cloudflare et Let's Encrypt, puis verifie la securite des sites que tu utilises avec l'outil SSL Labs.",
            "objectives": [
              "Comprendre la difference entre HTTP et HTTPS",
              "Expliquer le role de TLS/SSL",
              "Verifier la securite d'un site web"
            ],
            "resources": [
              {"label": "What is HTTPS ? (Cloudflare Learning)", "url": "https://www.cloudflare.com/learning/ssl/what-is-https/", "kind": "doc", "why": "Explication claire de HTTPS et pourquoi c'est essentiel.", "how": "Lis l'article et les sections sur le handshake TLS."},
              {"label": "How SSL/TLS works (YouTube)", "url": "https://www.youtube.com/watch?v=pg0sW0m3GsI", "kind": "video", "why": "Une video technique mais abordable sur le fonctionnement du chiffrement TLS.", "how": "Regarde la video et note les etapes du handshake."},
              {"label": "Let's Encrypt - How it works", "url": "https://letsencrypt.org/how-it-works/", "kind": "doc", "why": "Let's Encrypt delivre des certificats HTTPS gratuits. Comprendre leur fonctionnement te permet d'en obtenir pour tes projets.", "how": "Lis la page pour comprendre le processus de validation automatise."},
              {"label": "SSL Labs (outil de test)", "url": "https://www.ssllabs.com/ssltest/", "kind": "tool", "why": "L'outil de reference pour verifier la configuration HTTPS d'un site.", "how": "Teste la securite d'un site que tu utilises et observe le rapport."}
            ],
            "quiz": [
              {"q": "Quelle est la difference principale entre HTTP et HTTPS ?", "choices": ["HTTPS chiffre les donnees entre le navigateur et le serveur", "HTTPS est plus rapide", "HTTP est plus recent"], "answer": 0, "explanation": "Le S de HTTPS signifie Secure : les donnees sont chiffrees avec TLS/SSL."},
              {"q": "A quoi sert un certificat TLS/SSL ?", "choices": ["A verifier l'identite du site web et permettre le chiffrement", "A stocker les mots de passe", "A accelerer le chargement des pages"], "answer": 0, "explanation": "Le certificat prouve que le site est bien celui qu'il pretend etre et active le chiffrement."},
              {"q": "Qui peut delivrer un certificat HTTPS valide ?", "choices": ["Une autorite de certification reconnue (comme Let's Encrypt)", "N'importe qui peut en creer un", "Uniquement les hebergeurs"], "answer": 0, "explanation": "Les autorites de certification (CA) sont des organisations de confiance qui delivrent les certificats."},
              {"q": "Que signifie le cadenas vert dans la barre d'adresse du navigateur ?", "choices": ["La connexion est securisee par un certificat valide", "Le site est gratuit", "Le site est recommande"], "answer": 0, "explanation": "Le cadenas indique que la connexion HTTPS est bien etablie avec un certificat valide."},
              {"q": "Let's Encrypt propose des certificats :", "choices": ["Gratuits, renouvelables automatiquement", "Payants, valables 5 ans", "Uniquement pour les entreprises"], "answer": 0, "explanation": "Let's Encrypt est une autorite gratuite et automatisee qui a democratise le HTTPS."}
            ],
            "micro_project": {
              "title": "Audit securite d'un site",
              "brief": "Analyse la securite HTTPS de 3 sites web pour comprendre les bonnes pratiques.",
              "steps": [
                "Va sur ssllabs.com/ssltest et teste un site que tu utilises (ex: google.com)",
                "Teste un petit site ou blog et compare les resultats",
                "Note le type de certificat et la note de securite obtenue"
              ],
              "deliverable": "Colle les notes des 3 sites testes et explique ce qui fait une bonne configuration securisee."
            },
            "xp_reward": 60,
            "duration_minutes": 50,
            "sort_order": 10
          }
        ]
      },
      {
        "slug": "hebergement-et-domaine",
        "title": "Hebergement et nom de domaine",
        "summary": "Choisir un hebergement, acheter un domaine et connecter le tout.",
        "sort_order": 40,
        "lessons": [
          {
            "slug": "choisir-hebergement-domaine",
            "title": "Choisir son hebergement et son nom de domaine",
            "intro": "Pour qu'un site soit visible sur Internet, il a besoin de deux choses : un hebergement (un serveur qui stocke les fichiers) et un nom de domaine (l'adresse que les visiteurs tapent). Ce sont les deux piliers de la mise en ligne.",
            "why_important": "Savoir choisir et configurer un hebergement et un domaine est indispensable pour tout createur de projet. C'est aussi un levier de monetisation pour TakaCode via les liens d'affiliation.",
            "how_to_use": "Compare les offres des hebergeurs recommandes, choisis un nom de domaine, et suis le guide de configuration DNS pour le connecter a ton hebergement.",
            "objectives": [
              "Distinguer hebergement et nom de domaine",
              "Choisir un hebergement adapte a son projet",
              "Comprendre comment connecter un domaine a un hebergement"
            ],
            "resources": [
              {"label": "How to choose a web host (Cloudflare Learning)", "url": "https://www.cloudflare.com/learning/learn-web-hosting/", "kind": "doc", "why": "Guide complet pour comprendre les differents types d'hebergement (partage, VPS, dedie).", "how": "Lis les sections pour identifier quel type d'hebergement correspond a ton projet."},
              {"label": "What is a domain name ? (Cloudflare Learning)", "url": "https://www.cloudflare.com/learning/dns/glossary/what-is-a-domain-name/", "kind": "doc", "why": "Comprendre ce qu'est un nom de domaine, comment le choisir et le proteger.", "how": "Lis l'article pour les criteres de choix d'un bon nom de domaine."},
              {"label": "Hostinger (hebergement)", "url": "https://www.hostinger.com/", "kind": "doc", "why": "Hebergement economique et performant, ideal pour demarrer.", "how": "Parcours les offres pour comparer les formules."},
              {"label": "Namecheap (domaines)", "url": "https://www.namecheap.com/", "kind": "doc", "why": "Registre de domaines repute avec des prix transparents.", "how": "Cherche un domaine disponible pour ton projet et note son prix."}
            ],
            "quiz": [
              {"q": "Quelle est la difference entre un hebergement et un nom de domaine ?", "choices": ["L'hebergement stocke les fichiers, le domaine est l'adresse pour y acceder", "C'est la meme chose", "Le domaine stocke les fichiers, l'hebergement donne l'adresse"], "answer": 0, "explanation": "L'hebergement est le serveur ; le domaine est le panneau indicateur."},
              {"q": "Quel type d'hebergement est le plus adapte pour un site vitrine debutant ?", "choices": ["Hebergement partage (mutualise)", "Serveur dedie", "VPS"], "answer": 0, "explanation": "L'hebergement partage est economique et suffisant pour un site debutant."},
              {"q": "Que faut-il configurer pour relier un domaine a un hebergement ?", "choices": ["Les enregistrements DNS du domaine vers l'adresse IP de l'hebergement", "Rien, c'est automatique", "Un compte email chez l'hebergeur"], "answer": 0, "explanation": "Tu pointes le domaine vers l'IP de l'hebergement via les enregistrements DNS (en general un A record)."},
              {"q": "Qu'est-ce qu'un sous-domaine comme blog.monsite.fr ?", "choices": ["Un sous-ensemble du domaine principal, souvent utilise pour organiser les sections", "Un deuxieme domaine", "Une redirection vers un autre site"], "answer": 0, "explanation": "Les sous-domaines permettent de creer des sections distinctes d'un meme site."},
              {"q": "Pourquoi est-il important de renouveler son nom de domaine ?", "choices": ["Sinon quelqu'un d'autre peut l'acheter", "Le site sera supprime definitivement", "Les emails cesseront de fonctionner"], "answer": 0, "explanation": "Un domaine non renouvele devient disponible pour tout le monde."}
            ],
            "micro_project": {
              "title": "Planifie ton hebergement ideal",
              "brief": "Choisis un nom de domaine et un hebergement pour ton projet, simule la configuration DNS.",
              "steps": [
                "Cherche un nom de domaine disponible sur Namecheap ou un autre registrar",
                "Compare 2 offres d'hebergement (Hostinger et un autre) : prix, stockage, bande passante",
                "Simule la configuration DNS : note quel enregistrement A tu creerais"
              ],
              "deliverable": "Colle ton choix de domaine, le comparatif des hebergeurs et la configuration DNS prevue."
            },
            "xp_reward": 70,
            "duration_minutes": 50,
            "sort_order": 10
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
  v_slug text;
  v_goal text;
begin
  -- Parcours unique
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
    resources = excluded.resources,
    next_session = excluded.next_session,
    next_steps = excluded.next_steps,
    is_published = true,
    is_active = true,
    updated_at = timezone('utc'::text, now())
  returning id into v_track_id;

  -- Modules et lecons
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
    on conflict (track_id, slug) do update set
      title = excluded.title,
      summary = excluded.summary,
      sort_order = excluded.sort_order,
      is_published = true,
      updated_at = timezone('utc'::text, now())
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
      )
      on conflict (module_id, slug) do update set
        title = excluded.title,
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
        is_published = true,
        updated_at = timezone('utc'::text, now());
    end loop;
  end loop;

  raise notice 'Parcours "Bases d Internet et du Web" insere/mis a jour.';
end;
$seed$;
