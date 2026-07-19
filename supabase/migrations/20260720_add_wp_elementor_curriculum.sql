-- TakaCode - Curriculum for WordPress No-Code Elementor track
-- Run after 005_seed_mvp_curriculum.sql

do $seed$
declare
  v_track_id uuid;
  v_module_id uuid;
  v_lesson_id uuid;
begin
  -- Get track id for WordPress No-Code Elementor
  select id into v_track_id from learning_tracks where slug = 'wordpress-elementor';
  
  if v_track_id is null then
    raise exception 'Track wordpress-elementor not found';
  end if;

  -- ============================================================
  -- MODULE 1 : Démarrage WordPress + Elementor (sort_order 10)
  -- ============================================================
  insert into track_modules (track_id, slug, title, summary, sort_order)
  values (
    v_track_id,
    'demarrage-wordpress-elementor',
    'Démarrage : WordPress + Elementor',
    'Installer WordPress, choisir l\'hébergement, installer Elementor et Hello Theme.',
    10
  )
  returning id into v_module_id;

  -- Lesson 1.1 : Choisir son hébergement et installer WordPress
  insert into track_lessons (module_id, slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project, xp_reward, duration_minutes, sort_order)
  values (
    v_module_id,
    'choisir-hebergement-installer-wp',
    'Choisir son hébergement et installer WordPress',
    'Un bon hébergement WordPress (o2switch, Kinsta, WP Engine, Hostinger) garantit vitesse, sécurité et support. L\'installation se fait en 1 clic via cPanel/Plesk ou en manuel (FTP + base de données).',
    'L\'hébergement est la fondation : un site lent ou instable fait fuir les visiteurs. Choisir un hébergeur WordPress-optimisé évite 80% des soucis techniques.',
    'Compare 2-3 hébergeurs sur : PHP 8+, SSD, CDN, backups auto, support WP, prix renouvellement. Installe WordPress via l\'auto-installer de ton hébergeur.',
    '["Comprendre les critères d\'un bon hébergement WordPress", "Installer WordPress en 1 clic (ou manuel)", "Configurer les réglages de base (permalinks, fuseau, langue)"]',
    '[
      {"label": "Comparatif hébergement WordPress 2024 (WPFormation)", "url": "https://wpformation.com/hebergement-wordpress/", "kind": "article", "why": "Le comparatif de référence en français, mis à jour régulièrement.", "how": "Lis le tableau comparatif et retiens les 3 critères décisifs."},
      {"label": "Installer WordPress - Guide officiel", "url": "https://wordpress.org/support/article/how-to-install-wordpress/", "kind": "doc", "why": "La procédure officielle, valable chez tous les hébergeurs.", "how": "Suis la méthode \"Installation célèbre en 5 minutes\"."},
      {"label": "o2switch vs Kinsta vs Hostinger (WPCrafter)", "url": "https://www.youtube.com/watch?v=wgSLBb3aim0", "kind": "video", "why": "Test réel et avis honnête sur les hébergeurs populaires.", "how": "Regarde à partir de 15:00 pour la partie hébergement."}
    ]'::jsonb,
    '[
      {"q": "Quel critère est le PLUS important pour un hébergement WordPress ?", "choices": ["Le prix le plus bas", "PHP 8+, SSD, backups auto et support WP réactif", "Le plus de stockage possible"], "answer": 1, "explanation": "Performances et fiabilité priment : un site lent ou down ne sert à rien."},
      {"q": "Que faire APRES l\'installation WordPress ?", "choices": ["Installer 50 plugins", "Changer les permaliens en \"Nom de l\'article\" et régler fuseau/ langue", "Acheter un thème premium"], "answer": 1, "explanation": "Permaliens propres = SEO friendly. Fuseau/ langue = expérience utilisateur correcte."},
      {"q": "Pourquoi éviter l\'hébergement mutualisé bas de gamme ?", "choices": ["C\'est trop cher", "Ressources partagées = lenteurs, pas de backup, support lent", "WordPress ne fonctionne pas dessus"], "answer": 1, "explanation": "Le mutualisé low-cost sature vite : ton site ralentit aux heures de pointe."}
    ]'::jsonb,
    '{"title": "Ton WordPress prêt à l\'emploi", "brief": "Installe WordPress chez ton hébergeur, configure les réglages de base et vérifie que tout fonctionne.", "steps": ["Choisis ton hébergeur et commande (ou utilise un existant)", "Installe WordPress via l\'auto-installer (1 clic)", "Connecte-toi à /wp-admin, change permaliens > Nom de l\'article, règle fuseau Paris et langue FR", "Vérifie la page d\'accueil par défaut s\'affiche correctement"], "deliverable": "Colle l\'URL de ton site + capture d\'écran du tableau de bord WP.", "validation": "auto", "requiresLink": true}'::jsonb,
    60,
    45,
    10
  )
  returning id into v_lesson_id;

  -- Lesson 1.2 : Installer Elementor Free + Hello Theme
  insert into track_lessons (module_id, slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project, xp_reward, duration_minutes, sort_order)
  values (
    v_module_id,
    'installer-elementor-hello-theme',
    'Installer Elementor Free + Hello Theme',
    'Elementor Free s\'installe depuis Extensions > Ajouter > "Elementor". Hello Theme (le thème officiel Elementor) s\'installe depuis Apparence > Thèmes > Ajouter > "Hello Elementor". C\'est le duo optimal : léger, rapide, 100% compatible.',
    'Hello Theme est un canevas vierge (5 KB) : pas de CSS parasite, pas de réglages de thème qui entrent en conflit avec Elementor. Elementor Free donne déjà 40+ widgets et l\'éditeur visuel complet.',
    'Installe Elementor, active-le. Installe Hello Theme, active-le. Va dans Elementor > Réglages > Général : coche "Désactiver les couleurs par défaut" et "Désactiver les polices par défaut" pour un contrôle total.',
    '["Installer et activer Elementor Free", "Installer et activer Hello Theme", "Configurer les réglages Elementor de base"]',
    '[
      {"label": "Elementor - Installation (doc officielle)", "url": "https://elementor.com/help/install-elementor/", "kind": "doc", "why": "La procédure officielle à jour.", "how": "Suis les 3 étapes : installer, activer, créer ta première page."},
      {"label": "Hello Theme - Pourquoi l\'utiliser (Elementor Blog)", "url": "https://elementor.com/blog/hello-theme/", "kind": "article", "why": "Explique pourquoi Hello Theme = meilleur ami d\'Elementor.", "how": "Lis l\'intro et la section \"Performance\"."},
      {"label": "WP Addict : Installer Elementor + Hello Theme", "url": "https://www.youtube.com/watch?v=Pv1WSQBqeI4", "kind": "video", "why": "Formation complète Elementor A-Z en français (début à 5:30 pour l\'install).", "how": "Regarde les 10 premières minutes pour l\'install et la première page."}
    ]'::jsonb,
    '[
      {"q": "Pourquoi Hello Theme est-il recommandé avec Elementor ?", "choices": ["Il a plein de widgets intégrés", "Ultra-léger (5 KB), sans CSS parasite, zéro conflit avec Elementor", "C\'est le seul thème compatible"], "answer": 1, "explanation": "Hello Theme est un canevas vierge : Elementor gère TOUT le design."},
      {"q": "Quel réglage Elementor désactiver pour contrôler toi-même les couleurs ?", "choices": ["Désactiver les couleurs par défaut", "Activer le mode développeur", "Cacher le panneau latéral"], "answer": 0, "explanation": "Sinon Elementor impose sa palette par défaut sur tes nouveaux sites."},
      {"q": "Elementor Free suffit-il pour un site vitrine pro ?", "choices": ["Non, il faut Pro obligatoirement", "Oui : 40+ widgets, sections/colonnes, responsive, templates de base", "Uniquement pour les blogs"], "answer": 1, "explanation": "La version gratuite couvre 80% des besoins vitrine/portfolio."}
    ]'::jsonb,
    '{"title": "Ta première page Elementor", "brief": "Crée une page \"Accueil\" avec Elementor : une section Hero (titre + bouton), une section À propos (texte + image), une section Contact (formulaire basique).", "steps": ["Pages > Ajouter > Titre \"Accueil\" > Modifier avec Elementor", "Ajoute une section 1 colonne > Widget Titre (ton nom/activité) + Widget Bouton", "Ajoute une section 2 colonnes > Texte à gauche, Image à droite", "Ajoute une section > Widget Formulaire (champs : nom, email, message)", "Publie et vérifie en navigation privée"], "deliverable": "Colle l\'URL de ta page publiée + capture du Hero.", "validation": "auto", "requiresLink": true}'::jsonb,
    70,
    60,
    20
  );

  -- ============================================================
  -- MODULE 2 : Maîtriser l'éditeur Elementor (sort_order 20)
  -- ============================================================
  insert into track_modules (track_id, slug, title, summary, sort_order)
  values (
    v_track_id,
    'maitriser-editeur-elementor',
    'Maîtriser l\'éditeur Elementor',
    'Sections, colonnes, widgets, responsive, style global, templates, kits de site.',
    20
  )
  returning id into v_module_id;

  -- Lesson 2.1 : Structure : Sections, Colonnes, Conteneurs (Flexbox)
  insert into track_lessons (module_id, slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project, xp_reward, duration_minutes, sort_order)
  values (
    v_module_id,
    'structure-sections-colonnes-conteneurs',
    'Structure : Sections, Colonnes et Conteneurs Flexbox',
    'Elementor structure la page en Sections (pleine largeur ou contenues) > Colonnes > Widgets. Depuis Elementor 3.0, les Conteneurs Flexbox remplacent les colonnes classiques : plus souples, meilleurs pour le responsive, alignement précis (justify, align, gap, wrap).',
    'Comprendre la hiérarchie Section > Conteneur > Widget évite les mises en page cassées. Le Flexbox Container est LE standard moderne : il gère le responsive nativement.',
    'Crée une section > passe en mode "Conteneur" (icône grille) > ajoute des conteneurs imbriqués > teste justify-content (start/center/space-between) et gap. Essaie le responsive : bureau > tablette > mobile.',
    '["Maîtriser la hiérarchie Section > Conteneur > Widget", "Utiliser Flexbox Container : direction, alignement, gap, wrap", "Construire une mise en page responsive sans media queries manuelles"]',
    '[
      {"label": "Flexbox Container - Guide complet (Elementor)", "url": "https://elementor.com/help/flexbox-containers/", "kind": "doc", "why": "La doc officielle sur le nouveau système de conteneurs.", "how": "Lis les sections Structure, Layout, Responsive."},
      {"label": "Flexbox Froggy (jeu interactif)", "url": "https://flexboxfroggy.com/#fr", "kind": "tool", "why": "Apprendre Flexbox en jouant : le meilleur investissement de 30 min.", "how": "Termine les 24 niveaux pour maîtriser justify/align/gap."},
      {"label": "WP Addict : Sections, Colonnes, Conteneurs", "url": "https://www.youtube.com/watch?v=Pv1WSQBqeI4", "kind": "video", "why": "Tutoriel complet Elementor : partie structure à ~25:00.", "how": "Regarde de 25:00 à 45:00 pour la mise en page pratique."}
    ]'::jsonb,
    '[
      {"q": "Quelle est la hiérarchie correcte dans Elementor ?", "choices": ["Widget > Colonne > Section", "Section > Conteneur/Colonne > Widget", "Conteneur > Section > Widget"], "answer": 1, "explanation": "Section (pleine largeur) > Conteneur/Colonnes (structure interne) > Widgets (contenu)."},
      {"q": "À quoi sert justify-content: space-between dans un conteneur ?", "choices": ["Centre les éléments", "Écarte le premier et le dernier aux bords, espace égal entre les autres", "Aligne à gauche"], "answer": 1, "explanation": "Space-between = éléments aux extrémités, espace réparti entre. Idéal pour header (logo à gauche, menu à droite)."},
      {"q": "Comment rendre une mise en page responsive sans media queries ?", "choices": ["Impossible", "Utiliser les Conteneurs Flexbox : direction column sur mobile, row sur desktop", "Dupliquer la section pour chaque device"], "answer": 1, "explanation": "Flexbox Container > Réglages Responsive > Direction : Row (bureau) / Column (mobile). C\'est natif."}
    ]'::jsonb,
    '{"title": "Maquette responsive : Hero + 3 cartes", "brief": "Recrée cette structure classique : Hero (titre + CTA) + 3 cartes en grille (bureau) / colonne (mobile).", "steps": ["Section Hero : Conteneur > direction row > Titre (flex-grow 1) + Bouton CTA", "Section Cartes : Conteneur parent > direction row > wrap > gap 30px", "3 Conteneurs enfants (cartes) : flex 1 1 300px > Image + Titre + Texte + Bouton", "Teste responsive : bureau (3 colonnes) > tablette (2+1) > mobile (1 colonne)"], "deliverable": "Capture d\'écran bureau + tablette + mobile de ta maquette.", "validation": "auto", "requiresLink": false}'::jsonb,
    80,
    60,
    10
  );

  -- Lesson 2.2 : Widgets essentiels + Style global (couleurs, typo, ombres)
  insert into track_lessons (module_id, slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project, xp_reward, duration_minutes, sort_order)
  values (
    v_module_id,
    'widgets-essentiels-style-global',
    'Widgets essentiels + Style global (couleurs, typo, ombres)',
    'Elementor Free donne : Titre, Texte, Image, Vidéo, Bouton, Icône, Espacement, Séparateur, Google Maps, Formulaire (basique), Galerie, Carrousel, Témoignages, Onglets, Accordéon. Le Style Global (hamburger > Réglages du site > Style global) définit couleurs primaires/secondaires, typo titres/texte, ombres, bordures : une seule source de vérité pour tout le site.',
    'Le Style Global évite de régler la même police ou couleur sur 50 widgets. Change la couleur primaire une fois, tout le site suit. C\'est la base d\'un design cohérent et maintenable.',
    'Ouvre hamburger (coin haut gauche) > Réglages du site > Style global. Défins : Couleur primaire, secondaire, texte, fond. Typo : titres (ex: Poppins), texte (ex: Inter). Ombres : 3 niveaux (soft, medium, strong). Applique sur tes widgets via "Globals" dans les réglages de style.',
    '["Utiliser les 15+ widgets gratuits les plus utiles", "Configurer le Style Global : couleurs, typo, ombres, bordures", "Appliquer les styles globaux aux widgets (onglet Style > Globals)"]',
    '[
      {"label": "Style Global - Doc officielle", "url": "https://elementor.com/help/global-settings/", "kind": "doc", "why": "Comment configurer et utiliser les styles globaux.", "how": "Suis le guide pas à pas : couleurs > typo > ombres > appliquer."},
      {"label": "Liste widgets Elementor Free", "url": "https://elementor.com/widgets/", "kind": "doc", "why": "Catalogue officiel de tous les widgets (gratuit + Pro).", "how": "Filtre \"Free\" et note les 10 que tu utiliseras le plus."},
      {"label": "WP Addict : Style Global et Widgets", "url": "https://www.youtube.com/watch?v=Pv1WSQBqeI4", "kind": "video", "why": "Partie style global à ~1:15:00, widgets essentiels tout au long.", "how": "Regarde 1:15:00 à 1:35:00 pour le style global complet."}
    ]'::jsonb,
    '[
      {"q": "Où configure-t-on la police de TOUS les titres du site en une fois ?", "choices": ["Sur chaque widget Titre", "Hamburger > Réglages du site > Style global > Typographie > Titre", "Apparence > Personnaliser"], "answer": 1, "explanation": "Style Global = source unique de vérité pour typo, couleurs, ombres."},
      {"q": "Quel widget Elementor Free permet de faire un formulaire de contact ?", "choices": ["Formulaire (gratuit, basique)", "Uniquement Formulaire Pro", "Contact Form 7 requis"], "answer": 0, "explanation": "Elementor Free inclut un widget Formulaire basique (champs texte, email, textarea, submit). Pro ajoute champs avancés, actions après envoi, reCAPTCHA."},
      {"q": "À quoi sert l\'onglet \"Globals\" dans le panneau Style d\'un widget ?", "choices": ["À cacher le widget", "À appliquer une couleur/typo/ombre définie dans le Style Global", "À dupliquer le widget"], "answer": 1, "explanation": "Clique l\'icône globe à côté d\'une couleur/typo > choisis Primary, Secondary, Text, Accent... = cohérence garantie."}
    ]'::jsonb,
    '{"title": "Ton kit de style global", "brief": "Défins ton identité visuelle dans le Style Global et applique-la sur une page test.", "steps": ["Hamburger > Réglages du site > Style global > Couleurs : Primary, Secondary, Text, Accent, Background", "Typo : Titre (ex: Poppins Bold), Texte (ex: Inter Regular), Accent (ex: Playfair Display)", "Ombres : Soft (box-shadow 0 2px 8px), Medium (0 8px 24px), Strong (0 16px 48px)", "Crée une page test : Hero + 3 cartes + Footer > applique UNIQUEMENT des styles Globals", "Change la couleur Primary > vérifie que toute la page suit"], "deliverable": "Capture de ton Style Global configuré + page test avant/après changement Primary.", "validation": "auto", "requiresLink": false}'::jsonb,
    80,
    60,
    20
  );

  -- Lesson 2.3 : Templates, Blocs, Kits de site (Site Kits)
  insert into track_lessons (module_id, slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project, xp_reward, duration_minutes, sort_order)
  values (
    v_module_id,
    'templates-blocs-kits-site',
    'Templates, Blocs et Kits de site (Site Kits)',
    'Elementor propose 3 niveaux de réutilisation : Blocs (sections prêtes : Hero, Features, Témoignages...), Templates (pages complètes : Accueil, À propos, Contact...), Kits de site (Site Kits = ensemble complet : pages + header/footer + style global + réglages). Les Kits s\'installent en 1 clic depuis Elementor > Modèles > Kits.',
    'Un Kit de site te donne un site complet en 5 minutes : design cohérent, pages essentielles, header/footer, style global déjà configuré. Tu ne changes que le contenu (textes, images). C\'est le workflow pro pour livrer vite.',
    'Elementor > Modèles > Kits > choisis un Kit gratuit (ex: "Digital Agency", "Creative Portfolio", "Local Business") > Importer le kit complet. Vérifie : pages créées, header/footer, style global appliqué. Remplace contenus dummy par les tiens.',
    '["Comprendre la hiérarchie : Bloc < Template < Kit de site", "Installer un Kit de site complet en 1 clic", "Personnaliser un Kit : contenus, images, couleurs de marque"]',
    '[
      {"label": "Site Kits Elementor - Bibliothèques", "url": "https://elementor.com/library/", "kind": "doc", "why": "Catalogue officiel des Kits (gratuits et Pro).", "how": "Filtre \"Free\" et explore 3 kits différents."},
      {"label": "Importer un Kit - Guide", "url": "https://elementor.com/help/site-kits/", "kind": "doc", "why": "Procédure officielle d\'import de Kit.", "how": "Suis les étapes : Modèles > Kits > Importer > Appliquer."},
      {"label": "WP Addict : Kits de site et Templates", "url": "https://www.youtube.com/watch?v=Pv1WSQBqeI4", "kind": "video", "why": "Partie Kits à ~2:10:00.", "how": "Regarde 2:10:00 à 2:25:00 pour l\'import et la personnalisation."}
    ]'::jsonb,
    '[
      {"q": "Quelle est la différence entre un Template et un Kit de site ?", "choices": ["Aucune", "Template = 1 page ; Kit = site complet (pages + header/footer + style global)", "Kit = payant uniquement"], "answer": 1, "explanation": "Le Kit est un package complet : il installe pages, header, footer, style global, réglages en une fois."},
      {"q": "Où trouve-t-on les Kits de site dans Elementor ?", "choices": ["Extensions > Elementor > Kits", "Elementor > Modèles > Kits", "Apparence > Thèmes > Kits"], "answer": 1, "explanation": "Menu Elementor (barre d\'admin) > Modèles > Kits."},
      {"q": "Après import d\'un Kit, que dois-tu remplacer en priorité ?", "choices": ["Les couleurs du Style Global", "Les textes et images (contenu dummy)", "La structure des pages"], "answer": 1, "explanation": "Le design est fait. Ton travail = mettre TON contenu (textes, photos, logo)."}
    ]'::jsonb,
    '{"title": "Ton site depuis un Kit", "brief": "Importe un Kit gratuit, remplace le contenu dummy par ton contenu réel, publie.", "steps": ["Elementor > Modèles > Kits > choisis un Kit gratuit adapté à ton activité", "Importer le kit complet (patiente 30-60s)", "Va sur chaque page : remplace titres, textes, images, boutons", "Vérifie header (logo, menu) et footer (mentions, réseaux)", "Publie la page d\'accueil et teste en navigation privée"], "deliverable": "URL du site + nom du Kit utilisé + 3 captures (accueil, à propos, contact).", "validation": "auto", "requiresLink": true}'::jsonb,
    80,
    60,
    30
  );

  -- ============================================================
  -- MODULE 3 : Elementor Pro - Theme Builder (sort_order 30)
  -- ============================================================
  insert into track_modules (track_id, slug, title, summary, sort_order)
  values (
    v_track_id,
    'elementor-pro-theme-builder',
    'Elementor Pro : Theme Builder',
    'Header, Footer, Archive, Single, Search, 404 : concevoir toutes les parties dynamiques du site visuellement.',
    30
  )
  returning id into v_module_id;

  -- Lesson 3.1 : Header et Footer globaux
  insert into track_lessons (module_id, slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project, xp_reward, duration_minutes, sort_order)
  values (
    v_module_id,
    'header-footer-globaux',
    'Header et Footer globaux avec Theme Builder',
    'Le Theme Builder (Elementor Pro) remplace le système de thèmes WordPress : tu crées visuellement ton Header et ton Footer une seule fois, ils s\'appliquent sur TOUT le site. Fini les réglages de thème limités : tu as le contrôle total (logo, menu, CTA, sticky, mobile menu, langue, panier WooCommerce...).',
    'Header/Footer sont sur 100% des pages. Les construire dans Elementor = cohérence absolue, modifications en 1 clic sur tout le site, responsive natif, pas de PHP/templates à toucher.',
    'Elementor > Modèles > Theme Builder > Ajouter > Header (ou Footer) > Construis ton header : Conteneur > Logo (Site Logo) + Menu (Nav Menu) + Bouton CTA + Menu mobile (Hamburger). Conditions d\'affichage : "Tout le site". Publie. Répète pour Footer.',
    '["Créer un Header global avec Logo, Menu, CTA, Menu mobile", "Créer un Footer global avec mentions, réseaux, newsletter", "Comprendre les Conditions d\'affichage (Tout le site, Singulier, Archive...)"]',
    '[
      {"label": "Theme Builder - Header (Elementor)", "url": "https://elementor.com/help/theme-builder-header/", "kind": "doc", "why": "Guide officiel pour créer un header complet.", "how": "Suis pas à pas : nouveau template > Header > conditions."},
      {"label": "Theme Builder - Footer (Elementor)", "url": "https://elementor.com/help/theme-builder-footer/", "kind": "doc", "why": "Guide officiel pour le footer.", "how": "Même workflow que header."},
      {"label": "WP Addict : Theme Builder Header/Footer", "url": "https://www.youtube.com/watch?v=Pv1WSQBqeI4", "kind": "video", "why": "Partie Theme Builder à ~2:45:00 (Header) et ~3:10:00 (Footer).", "how": "Regarde 2:45:00 à 3:30:00 pour header + footer complets."}
    ]'::jsonb,
    '[
      {"q": "Quel widget utiliser pour le menu de navigation dans Elementor Pro ?", "choices": ["Menu WordPress natif", "Nav Menu (widget Elementor Pro)", "Custom Menu"], "answer": 1, "explanation": "Nav Menu = widget Pro qui affiche un menu WP avec style Elementor complet (dropdown, mega menu, hamburger mobile)."},
      {"q": "Comment faire un header sticky (qui reste en haut au scroll) ?", "choices": ["CSS custom", "Réglages du conteneur Header > Motion Effects > Sticky > Top", "Impossible sans code"], "answer": 1, "explanation": "Elementor Pro a le Sticky natif : Conteneur > Avancé > Motion Effects > Sticky > Top."},
      {"q": "À quoi servent les \"Conditions d\'affichage\" dans Theme Builder ?", "choices": ["À cacher le header sur mobile", "À définir SUR QUELLES PAGES s\'applique le template (Tout le site, Accueil, Articles, Catégories...)", "À programmer l\'affichage dans le temps"], "answer": 1, "explanation": "Conditions = règles d\'application du template. Header principal = \"Tout le site\". Header spécial blog = \"Archive > Blog\"."}
    ]'::jsonb,
    '{"title": "Ton Header/Footer pro", "brief": "Crée un header sticky avec logo, menu responsive (hamburger mobile) + CTA, et un footer 3 colonnes (infos, liens, newsletter).", "steps": ["Theme Builder > Ajouter Header > Conteneur > Logo + Nav Menu + Bouton CTA", "Conteneur Header > Avancé > Motion Effects > Sticky Top", "Nav Menu > Réglages Mobile > Hamburger + Breakpoint tablette", "Conditions : Tout le site > Publier", "Theme Builder > Ajouter Footer > 3 colonnes : Infos société / Liens utiles / Newsletter + Réseaux", "Conditions : Tout le site > Publier", "Vérifie sur 3 pages différentes + mobile"], "deliverable": "Captures : Header bureau, Header mobile (ouvert), Footer. URL du site.", "validation": "auto", "requiresLink": true}'::jsonb,
    90,
    75,
    10
  );

  -- Lesson 3.2 : Templates Archive (blog, catégories) et Single (article, page)
  insert into track_lessons (module_id, slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project, xp_reward, duration_minutes, sort_order)
  values (
    v_module_id,
    'archive-single-templates',
    'Templates Archive (blog, catégories) et Single (article, page)',
    'Le Theme Builder gère aussi les pages dynamiques : Archive (liste des articles, page catégorie, auteur, tag, recherche) et Single (article unique, page unique, produit WooCommerce). Tu dessines la mise en page UNE fois, elle s\'applique à TOUS les articles de ce type.',
    'Sans Theme Builder : tu dépends du thème pour l\'affichage des articles (souvent rigide). Avec : tu choisis exactement comment s\'affiche la grille blog, la méta (date, auteur, catégorie), la pagination, le contenu de l\'article, les articles liés.',
    'Theme Builder > Ajouter > Archive > choisis "Archive des articles" > Construis : Section > Conteneur grille (Posts widget) + Pagination. Conditions : Archives > Tous les articles. Publie. Puis Theme Builder > Ajouter > Single > Article > Contenu : Titre (Post Title), Méta (Post Info), Image à la une (Featured Image), Contenu (Post Content), Auteur (Author Box), Articles liés (Related Posts). Conditions : Singulier > Articles.',
    '["Créer un template Archive : grille blog + pagination + filtres", "Créer un template Single Article : titre, méta, image, contenu, auteur, articles liés", "Utiliser les widgets dynamiques : Post Title, Post Info, Featured Image, Post Content, Author Box, Related Posts"]',
    '[
      {"label": "Theme Builder - Archive (Elementor)", "url": "https://elementor.com/help/theme-builder-archive/", "kind": "doc", "why": "Guide officiel pour les templates d\'archive.", "how": "Focus sur Posts widget (grille) + Pagination widget."},
      {"label": "Theme Builder - Single (Elementor)", "url": "https://elementor.com/help/theme-builder-single/", "kind": "doc", "why": "Guide officiel pour les templates single.", "how": "Note les widgets dynamiques : Post Title, Post Info, Featured Image, Post Content, Author Box."},
      {"label": "WP Addict : Archive et Single Templates", "url": "https://www.youtube.com/watch?v=Pv1WSQBqeI4", "kind": "video", "why": "Partie Archive à ~3:30:00, Single à ~3:55:00.", "how": "Regarde 3:30:00 à 4:20:00 pour les deux templates complets."}
    ]'::jsonb,
    '[
      {"q": "Quel widget affiche la grille d\'articles dans un template Archive ?", "choices": ["Articles récents (natif WP)", "Posts (widget Elementor Pro)", "Query Loop (Gutenberg)"], "answer": 1, "explanation": "Posts = widget Pro puissant : grille/masonry/liste, filtres, pagination, méta, extrait, image."},
      {"q": "Comment afficher la date + auteur + catégorie sur chaque carte d\'article ?", "choices": ["À la main sur chaque article", "Posts widget > Réglages Contenu > Méta > cocher Date, Auteur, Catégories", "Impossible avec Elementor"], "answer": 1, "explanation": "Posts widget gère la méta automatiquement : tu choisis quoi afficher, dans quel ordre, avec quelles icônes."},
      {"q": "Dans un template Single, quel widget affiche le contenu COMPLET de l\'article (blocs Gutenberg) ?", "choices": ["Post Excerpt", "Post Content", "The Content"], "answer": 1, "explanation": "Post Content = widget dynamique qui rend le contenu intégral de l\'article (blocs, images, vidéos, shortcodes)."}
    ]'::jsonb,
    '{"title": "Ton blog designé", "brief": "Crée le template Archive (grille blog 3 colonnes + pagination) et le template Single (article complet avec auteur + articles liés).", "steps": ["Theme Builder > Archive > Posts widget : grille 3 colonnes, image ratio 16:9, méta (date + cat), extrait 30 mots, pagination", "Conditions : Archives > Tous les articles > Publier", "Theme Builder > Single > Article > Post Title + Post Info (date + auteur + cat) + Featured Image + Post Content + Author Box + Related Posts (3)", "Conditions : Singulier > Articles > Publier", "Crée 3 articles test avec images > vérifie Archive et Single"], "deliverable": "URL de la page blog + URL d\'un article single + captures des 2 templates.", "validation": "auto", "requiresLink": true}'::jsonb,
    100,
    90,
    20
  );

  -- Lesson 3.3 : Templates Search, 404, WooCommerce (intro)
  insert into track_lessons (module_id, slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project, xp_reward, duration_minutes, sort_order)
  values (
    v_module_id,
    'search-404-woocommerce-intro',
    'Templates Search, 404 et intro WooCommerce',
    'Les pages souvent oubliées : Recherche (résultats), 404 (page introuvable). Elementor Pro permet de les designer comme le reste. Pour l\'e-commerce : templates Single Produit, Archive Produit, Panier, Commande, Mon compte - même logique que le blog.',
    'Une page 404 bien faite (recherche + liens utiles + humour) retient le visiteur. La page Recherche doit afficher les résultats clairement. Pour WooCommerce : même puissance = fiches produit designées visuellement, sans toucher au code.',
    'Theme Builder > Ajouter > Search Results > Posts widget (ou Products pour WooCommerce) + champ de recherche (Search Form widget). Conditions : Recherche. Theme Builder > Ajouter > 404 > Message sympa + Search Form + liens vers Accueil/Blog/Contact. Conditions : 404. Pour WooCommerce : Theme Builder > Single Produit / Archive Produit.',
    '["Créer template Search Results avec Search Form + Posts/Products", "Créer template 404 engageant (message + recherche + liens)", "Comprendre la logique Theme Builder pour WooCommerce (Single/Archive Produit, Panier, Commande)"]',
    '[
      {"label": "Theme Builder - Search Results (Elementor)", "url": "https://elementor.com/help/theme-builder-search-results/", "kind": "doc", "why": "Guide pour la page de résultats de recherche.", "how": "Focus sur Search Form widget + Posts/Products widget."},
      {"label": "Theme Builder - 404 Page (Elementor)", "url": "https://elementor.com/help/theme-builder-404-page/", "kind": "doc", "why": "Guide pour la page 404.", "how": "Crée une 404 qui convertit : humour + recherche + liens."},
      {"label": "Elementor Pro WooCommerce Builder", "url": "https://elementor.com/features/woocommerce-builder/", "kind": "doc", "why": "Présentation des widgets WooCommerce Pro (40+).", "how": "Parcours la liste : Product Title, Price, Images, Add to Cart, Upsells, Related..."}
    ]'::jsonb,
    '[
      {"q": "Quel widget placer sur la page Search Results pour que l\'utilisateur puisse relancer une recherche ?", "choices": ["Search Form (widget Elementor Pro)", "Champ de texte basique", "Rien, le navigateur gère"], "answer": 0, "explanation": "Search Form = widget Pro qui affiche le champ de recherche WP stylisé Elementor, avec placeholder, bouton, icône."},
      {"q": "Quels éléments mettre sur une bonne page 404 ?", "choices": ["Juste \"Page introuvable\"", "Message clair + Search Form + liens Accueil/Blog/Contact + touche d\'humour", "Redirection auto vers l\'accueil"], "answer": 1, "explanation": "La 404 est une opportunité : aide le visiteur à retrouver son chemin, ne le frustre pas."},
      {"q": "Pour créer une fiche produit designée avec Elementor Pro, on utilise :", "choices": ["Theme Builder > Single Produit", "WooCommerce > Réglages > Produits", "Un shortcode"], "answer": 0, "explanation": "Theme Builder > Ajouter > Single Produit = contrôle total sur la fiche produit (galerie, prix, variations, upsells, onglets, avis)."}
    ]'::jsonb,
    '{"title": "Pages Search, 404 et produit test", "brief": "Crée les templates Search et 404, et (optionnel) un Single Produit si tu as WooCommerce.", "steps": ["Theme Builder > Search Results > Search Form + Posts widget (grille 2 colonnes) > Conditions: Recherche", "Theme Builder > 404 > Conteneur centré : Illustration/Emoji + \"Oups !\" + Search Form + 3 liens (Accueil, Blog, Contact) > Conditions: 404", "Optionnel : WooCommerce > Theme Builder > Single Produit > Product Gallery + Product Title + Product Price + Add to Cart + Product Tabs > Conditions: Produits", "Teste : recherche un terme > page 404 (URL inventée) > fiche produit"], "deliverable": "Captures : Search Results, 404, (optionnel) Single Produit. URL du site.", "validation": "auto", "requiresLink": true}'::jsonb,
    80,
    60,
    30
  );

  -- ============================================================
  -- MODULE 4 : Responsive, Performance, SEO, Publication (sort_order 40)
  -- ============================================================
  insert into track_modules (track_id, slug, title, summary, sort_order)
  values (
    v_track_id,
    'responsive-perf-seo-publication',
    'Responsive, Performance, SEO et Publication',
    'Peaufiner le responsive, optimiser la vitesse, bases SEO, connecter domaine et publier.',
    40
  )
  returning id into v_module_id;

  -- Lesson 4.1 : Responsive perfectionniste (bureau, tablette, mobile)
  insert into track_lessons (module_id, slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project, xp_reward, duration_minutes, sort_order)
  values (
    v_module_id,
    'responsive-perfectionniste',
    'Responsive perfectionniste : bureau, tablette, mobile',
    'Elementor a 3 points de rupture natifs : Bureau (par défaut), Tablette (≤1024px), Mobile (≤768px). Chaque réglage (taille police, marge, padding, largeur, visibilité, ordre des colonnes) peut être surchargé par device. L\'icône device (en bas de la barre latérale) bascule les vues. La règle : mobile-first dans la tête, desktop-first dans l\'éditeur (on part du bureau et on surcharge pour tablette/mobile).',
    '60%+ du trafic = mobile. Un site qui casse sur mobile perd la majorité des visiteurs. Elementor rend le responsive granulaire : tu ne recrées pas la page, tu ajustes les valeurs existantes par device.',
    'Ouvre le panneau Responsive (icône device en bas à gauche). Pour chaque widget/conteneur : passe en vue Tablette > ajuste taille police, marges, gap, direction (row→column). Passe en vue Mobile > idem. Utilise "Masquer sur mobile/tablette/bureau" (Avancé > Responsive) pour alléger le mobile. Teste VRAIMENT sur téléphone physique.',
    '["Maîtriser les 3 breakpoints Elementor et l\'icône device", "Surcharger les valeurs par device (typo, espacements, visibilité, ordre)", "Utiliser \"Masquer sur\" pour alléger le mobile", "Tester sur vrai device (pas seulement l\'émulateur)"]',
    '[
      {"label": "Responsive Mode - Doc officielle", "url": "https://elementor.com/help/responsive-mode/", "kind": "doc", "why": "Guide complet du mode responsive Elementor.", "how": "Lis les sections Breakpoints, Device Preview, Responsive Controls."},
      {"label": "Responsive Best Practices (Elementor Blog)", "url": "https://elementor.com/blog/responsive-website/", "kind": "article", "why": "Bonnes pratiques responsive spécifiques Elementor.", "how": "Note les 5 erreurs à éviter (trop de colonnes, police fixe, images non responsives...)."},
      {"label": "WP Addict : Responsive complet", "url": "https://www.youtube.com/watch?v=Pv1WSQBqeI4", "kind": "video", "why": "Partie responsive à ~4:45:00.", "how": "Regarde 4:45:00 à 5:15:00 pour le workflow responsive complet."}
    ]'::jsonb,
    '[
      {"q": "Comment changer la taille de police UNIQUEMENT sur mobile ?", "choices": ["Créer un widget distinct pour mobile", "Vue Mobile (icône device) > onglet Style > Typographie > taille > l\'icône device à côté du champ > saisir valeur mobile", "CSS media query dans Custom CSS"], "answer": 1, "explanation": "Chaque champ de style a une icône device : clique > choisis l\'appareil > valeur spécifique. C\'est le cœur du responsive Elementor."},
      {"q": "Quelle est la meilleure pratique pour l\'ordre des colonnes sur mobile ?", "choices": ["Laisser l\'ordre bureau", "Conteneur parent > direction column-reverse (ou row-reverse) sur mobile uniquement", "Dupliquer la section"], "answer": 1, "explanation": "Flexbox Container > Responsive > Direction : Row (bureau) / Column-reverse (mobile) = réordonne sans dupliquer."},
      {"q": "Pourquoi tester sur VRAI téléphone et pas seulement l\'émulateur ?", "choices": ["L\'émulateur ment sur le tactile, la police, le viewport réel, les performances", "C\'est plus rapide", "L\'émulateur ne montre pas les images"], "answer": 0, "explanation": "Émulateur = simulation navigateur. Vrai device = vrai tactile, vraie police système, vrai viewport, vrai réseau. Toujours valider sur device physique."}
    ]'::jsonb,
    '{"title": "Audit responsive de ton site", "brief": "Parcours ton site complet sur bureau, tablette, mobile et corrige tous les défauts.", "steps": ["Ouvre ton site sur ordinateur > note les tailles police, espacements, alignements", "Basculen vue Tablette (Elementor) > corrige : police -20%, marges -30%, gap réduit, direction column si >2 colonnes", "Basculen vue Mobile > corrige : police lisible (min 16px), marges confortables, 1 colonne, masquer éléments superflus", "TEST RÉEL : ouvre l\'URL sur ton téléphone (pas l\'émulateur) > navigue partout > note ce qui casse", "Corrige dans Elementor > republie > re-teste sur téléphone"], "deliverable": "Liste des 5 corrections faites + captures mobile avant/après du pire élément.", "validation": "auto", "requiresLink": true}'::jsonb,
    90,
    75,
    10
  );

  -- Lesson 4.2 : Performance : optimisation images, cache, chargement
  insert into track_lessons (module_id, slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project, xp_reward, duration_minutes, sort_order)
  values (
    v_module_id,
    'performance-optimisation',
    'Performance : images, cache, chargement différé',
    'Un site Elementor peut être lent si : images non optimisées (trop lourdes, pas de WebP), trop de plugins, pas de cache, CSS/JS non minifiés. Les leviers : 1) Images : WebP + dimensions exactes + lazy-load natif (WP 5.5+). 2) Cache : WP Rocket / LiteSpeed Cache / WP Super Cache. 3) Elementor : Experiments > Improved Asset Loading, CSS Print Method > External Files, Element Caching. 4) Hébergement : PHP 8.3, Redis, CDN.',
    'La vitesse impacte SEO (Core Web Vitals), conversion (1s de retard = -7% conversion), expérience. Elementor 3.5+ a des optimisations natives puissantes : il suffit de les activer et de bien configurer le cache.',
    'Images : installe "Converter for Media" (WebP auto) ou "ShortPixel" / "Imagify". Cache : installe WP Rocket (payant, le meilleur) ou LiteSpeed Cache (gratuit, excellent sur serveur LiteSpeed). Elementor > Réglages > Experiments : active "Improved Asset Loading", "CSS Print Method: External Files", "Element Caching". Teste sur PageSpeed Insights.',
    '["Optimiser images : WebP, dimensions, lazy-load, compression", "Configurer cache complet (WP Rocket / LiteSpeed Cache)", "Activer les Experiments Elementor de performance", "Mesurer avec PageSpeed Insights et GTmetrix"]',
    '[
      {"label": "Elementor Performance - Experiments", "url": "https://elementor.com/help/elementor-experiments/", "kind": "doc", "why": "Liste et explication de tous les experiments de performance.", "how": "Active : Improved Asset Loading, CSS Print Method: External, Element Caching, Lazy Load Background Images."},
      {"label": "WP Rocket - Configuration Elementor", "url": "https://docs.wp-rocket.me/article/792-elementor-compatibility", "kind": "doc", "why": "Config optimale WP Rocket + Elementor.", "how": "Applique : Cache mobile, Préchargement, CSS/JS minify, Différer JS, Heartbeat."},
      {"label": "WP Addict : Performance Elementor", "url": "https://www.youtube.com/watch?v=Pv1WSQBqeI4", "kind": "video", "why": "Partie performance à ~5:30:00.", "how": "Regarde 5:30:00 à 5:55:00 pour cache + experiments + test PageSpeed."}
    ]'::jsonb,
    '[
      {"q": "Quel Experiment Elementor charge le CSS dans un fichier externe (meilleur pour le cache) ?", "choices": ["Improved Asset Loading", "CSS Print Method: External Files", "Element Caching"], "answer": 1, "explanation": "CSS Print Method: External Files = le CSS Elementor sort dans un .css statique (cachable par navigateur/CDN) au lieu d\'être inline."},
      {"q": "Quel plugin gratuit excellent pour le cache sur serveur LiteSpeed (o2switch, Hostinger...) ?", "choices": ["WP Super Cache", "LiteSpeed Cache", "W3 Total Cache"], "answer": 1, "explanation": "LiteSpeed Cache est fait POUR les serveurs LiteSpeed (o2switch, Hostinger, Kinsta...). Il gère ESI, objet cache, CDN, optimisation images."},
      {"q": "Quelle est la taille CIBLE pour une image Hero full-width (1920px) en WebP ?", "choices": ["500 Ko", "< 100 Ko", "2 Mo"], "answer": 1, "explanation": "Hero 1920px WebP qualité 80% = 60-100 Ko. Au-delà = non optimisé. Outils : Squoosh.app, Converter for Media, ShortPixel."}
    ]'::jsonb,
    '{"title": "Audit performance + correction", "brief": "Mesure ton site sur PageSpeed, applique les corrections, re-mesure.", "steps": ["Teste ton URL sur PageSpeed Insights (mobile + desktop) > note les scores", "Active les 4 Experiments Elementor de performance", "Installe et configure LiteSpeed Cache (ou WP Rocket)", "Installe Converter for Media > régénère les images en WebP", "Re-teste PageSpeed > note l\'amélioration"], "deliverable": "Scores PageSpeed AVANT / APRÈS (Mobile + Desktop) + liste des 3 actions qui ont le plus impacté.", "validation": "auto", "requiresLink": true}'::jsonb,
    80,
    60,
    20
  );

  -- Lesson 4.3 : SEO basique + Publication (domaine, SSL, analytics)
  insert into track_lessons (module_id, slug, title, intro, why_important, how_to_use, objectives, resources, quiz, micro_project, xp_reward, duration_minutes, sort_order)
  values (
    v_module_id,
    'seo-publication-domaine-ssl',
    'SEO basique + Publication : domaine, SSL, Analytics',
    'SEO on-page : titres (H1 unique), méta description, structure H2/H3, alt images, URLs propres, sitemap.xml, robots.txt. Publication : connecter ton domaine (DNS A + CNAME ou NS), forcer HTTPS (SSL Let\'s Encrypt auto chez la plupart des hébergeurs), installer Google Analytics (GA4) + Search Console, soumettre sitemap.',
    'Sans SEO : ton site est invisible. Sans domaine propre + SSL : pas de crédibilité. Sans analytics : tu pilotes à l\'aveugle. Ces 3 piliers (SEO technique, domaine/SSL, analytics) transforment un "site de test" en "site pro en production".',
    'SEO : installe "Yoast SEO" ou "Rank Math" (gratuit, plus complet). Configure : titre site, séparateur, méta par défaut, sitemap auto, breadcrumbs. Publication : chez ton registrar (OVH, Gandi, Cloudflare...) : ajoute A (@ → IP serveur) + CNAME (www → @) OU change NS vers ton hébergeur. SSL : hébergeur > Let\'s Encrypt > Forcer HTTPS. Analytics : GA4 > flux Web > ID de mesure > colle dans Rank Math > onglet Analytics. Search Console : ajoute propriété > valide via DNS > soumet sitemap.xml.',
    '["Configurer SEO on-page : titres, méta, Hn, alt, URLs, sitemap", "Connecter domaine personnalisé (DNS A/CNAME ou NS)", "Activer SSL (HTTPS) et forcer le HTTPS", "Installer GA4 + Search Console + soumettre sitemap"]',
    '[
      {"label": "Rank Math - Configuration complète (WPFormation)", "url": "https://wpformation.com/rank-math/", "kind": "article", "why": "Guide français détaillé de Rank Math (gratuit, puissant).", "how": "Suis l\'assistant de configuration + onglets Titres, Sitemap, Analytics."},
      {"label": "Connecter domaine - Guide hébergeur (ex: o2switch)", "url": "https://aide.o2switch.fr/domaine-nom-de-domaine/", "kind": "doc", "why": "Procédure DNS selon ton registrar/hébergeur.", "how": "Suis la méthode A+CNAME ou Changement NS selon ton cas."},
      {"label": "GA4 + Search Console - Guide (AxeNet)", "url": "https://www.axenet.fr/blog/ga4-google-analytics-4-installation/", "kind": "article", "why": "Installation GA4 + lien Search Console pas à pas.", "how": "Crée propriété GA4 > Flux Web > ID G-XXXX > Rank Math > Analytics > colle ID."}
    ]'::jsonb,
    '[
      {"q": "Combien de H1 par page ?", "choices": ["Autant qu\'on veut", "1 seul (le titre principal)", "2 : un pour le logo, un pour le titre"], "answer": 1, "explanation": "1 H1 unique = signal fort pour Google. Elementor : widget Titre sur la page = H1. Logo dans le header = pas de H1 (ou H1 masqué)."},
      {"q": "Pour forcer HTTPS sur tout le site, quelle méthode est la plus propre ?", "choices": ["Plugin Really Simple SSL", "Hébergeur > Let\'s Encrypt > Forcer HTTPS (niveau serveur) + HSTS", "Réglages WordPress > URL en https"], "answer": 1, "explanation": "Niveau serveur (Nginx/Apache) = redirection 301 avant même WordPress. Plus rapide, plus sûr. HSTS = navigateur retient HTTPS."},
      {"q": "Quelle info trouve-t-on dans Search Console qu\'on n\'a PAS dans GA4 ?", "choices": ["Le nombre de visiteurs", "Les requêtes de recherche (mots-clés) qui font apparaître ton site + erreurs d\'indexation", "Le taux de rebond"], "answer": 1, "explanation": "Search Console = vision Google : requêtes, position moyenne, CTR, couverture indexation, erreurs. GA4 = vision utilisateur : sessions, événements, conversions."}
    ]'::jsonb,
    '{"title": "Ton site en production", "brief": "Connecte ton domaine, active SSL, configure SEO + Analytics, soumets le sitemap.", "steps": ["DNS : chez ton registrar, ajoute A (@ → IP serveur) + CNAME (www → @) OU change NS vers hébergeur", "Hébergeur : active Let\'s Encrypt SSL > Forcer HTTPS > Active HSTS", "Installe Rank Math > Assistant config > Sitemap auto > Breadcrumbs > Analytics (colle GA4 ID)", "Crée propriété GA4 > Flux Web > Mesure améliorée ON > Copie ID G-XXXX", "Search Console : Ajoute propriété (préfixe URL) > Valide via DNS > Sitemaps > Soumet sitemap_index.xml", "Teste : https://tondomaine.com > HTTPS vert > PageSpeed > Rank Math > GA4 temps réel"], "deliverable": "URL finale en HTTPS + captures : Rank Math OK, GA4 temps réel 1 utilisateur (toi), Search Console sitemap soumis.", "validation": "auto", "requiresLink": true}'::jsonb,
    100,
    90,
    30
  );

  -- ============================================================
  -- Update track next_steps
  -- ============================================================
  update learning_tracks
  set next_steps = '[
    {"label": "Installer WordPress + Elementor", "state": "done"},
    {"label": "Construire la page d\'accueil avec Elementor", "state": "current"},
    {"label": "Créer Header/Footer globaux (Theme Builder)", "state": "locked"},
    {"label": "Optimiser responsive, performance, SEO", "state": "locked"},
    {"label": "Publier le site et connecter son domaine", "state": "locked"}
  ]'::jsonb
  where id = v_track_id;

end $seed$;