# Architecture IA agentique de TakaCode

> État actuel (juillet 2026) : l'IA est présente en **completion mode** dans
> le dashboard (chat coach, recommandations), les leçons (assistant), les
> reviews de projets et les suggestions admin. Chaque appel est isolé, sans
> tools, sans mémoire, sans coordination.
>
> Ce document propose l'évolution vers un système **multi-agent avec tools**
> qui participe à tout le flow : idée → projet → parcours → publication →
> **expérience → portfolio → opportunité** (emploi, mission, collaboration ou
> business à soi).
>
> **Mise à jour du 19 août 2026 :** deux choses ont changé. Le parcours ne s'arrête plus
> à la monétisation — il va jusqu'à la preuve d'expérience et à l'opportunité. Et
> « projet » ne veut plus dire « projet informatique » : une formation en ligne, une
> chaîne YouTube, un podcast ou une activité freelance sont des projets à part entière,
> avec des livrables différents.
>
> Concrètement, le rôle de l'agent est celui décrit au §03 de la vision : transformer un
> objectif en parcours concret — **objectif → étapes → tâches → ressources → livrables →
> publication**. Il doit donc raisonner par **type de projet**, pas par technologie :
> accompagner une chaîne YouTube n'a rien à voir avec accompagner un SaaS.
>
> Voir [VISION.md](../VISION.md) et le jalon J1 de
> [ROADMAP_REPOSITIONNEMENT.md](../ROADMAP_REPOSITIONNEMENT.md).

---

## Pourquoi passer de "IA complétion" à "IA agentique"

**Aujourd'hui** un appel IA = un prompt → une réponse texte. L'IA suggère,
l'humain exécute. Zéro action côté app.

**Demain** un agent = un système qui peut :
- Lire l'état du user, du projet, des parcours (via **tools**)
- Décider d'une action (créer une leçon manquante, ouvrir un ticket, envoyer
  une notif, réassigner un track)
- Écrire dans la BDD via des **tools spécifiques** avec permissions
- Réévaluer et itérer

Résultat : le user ne se contente pas de recevoir des conseils, l'app
**avance concrètement pour lui** dans son parcours quand c'est utile.

---

## Trois agents spécialisés à construire

### 1. ProjectCoach — accompagne le membre au quotidien

**Rôle** : aider le user à faire progresser SON projet.

**Tools** :
- `get_current_project()` : titre, description, statut, revenue model, track lié
- `get_track_progress(trackId)` : leçons validées, prochain module
- `get_last_review(projectId)` : dernier verdict IA + feedback
- `list_next_actions(projectId)` : ce qui est bloqué / prêt à faire
- `create_next_action(projectId, action)` : ajoute une action dans NextActionBlock
- `update_project_status(projectId, status)` : fait passer "idea" → "building" → "shipping"
- `suggest_track_enrollment(trackSlug, reason)` : propose une inscription
- `send_reminder(delayMinutes, text)` : posera une notif à l'heure H

**Trigger** : bouton "Coach IA" du dashboard (déjà en place, à upgrader),
ou automatique 1x/semaine.

**Différence avec l'existant** : le chat actuel donne des conseils textuels.
Le ProjectCoach agentique **crée l'action** dans NextActionBlock, **change
le statut** du projet, **inscrit** au track pertinent, **planifie** un
reminder — le user n'a qu'à valider chaque action proposée.

---

### 2. TrackAdvisor — courator du parcours d'apprentissage

**Rôle** : garantir que le user consomme les bons parcours dans le bon
ordre pour son projet.

**Tools** :
- `list_user_enrollments()` : parcours suivis + progression
- `list_available_tracks(locale)` : catalogue publié
- `analyze_project_needs(projectId)` : compétences nécessaires détectées
- `enroll_user(trackId)` : inscription à un parcours (avec accord user)
- `unenroll_user(trackId, reason)` : quand un track n'est plus pertinent
- `set_track_priority(trackId, priority)` : réordonne la roadmap
- `flag_track_gap(competency)` : signale à l'admin qu'un track manque au catalogue

**Trigger** : nightly cron sur les users actifs, ou changement de projet.

**Différence** : la roadmap "Accélérateurs de projet" actuelle est
**suggestive**. Le TrackAdvisor l'**exécute** — quand une compétence est
identifiée comme critique, le user est inscrit automatiquement au track (avec
notification), pas juste "recommandé".

---

### 3. ReviewBot — évalue et enrichit projets + tracks

**Rôle** : review technique + amélioration continue du catalogue.

**Tools** :
- `read_project_submission(projectId)` : livrable + repo + live URL
- `fetch_repo_files(repoUrl, paths[])` : lecture GitHub via API
- `analyze_live_url(url)` : perf, SEO basique, accessibilité
- `verdict_and_feedback(submissionId, verdict, feedback)` : écrit la review
- `flag_lesson_for_improvement(lessonId, reason)` : signale une leçon faible
- `propose_new_lesson(moduleSlug, title, brief)` : suggestion → validation admin
- `test_quiz(questionId)` : re-vérifie la validité d'une question

**Trigger** : soumission projet (auto), publication d'un track (auto), ou
manuellement depuis l'admin.

**Différence** : l'`aiReview` actuel donne un verdict texte. Le ReviewBot
lit **vraiment** le code du repo (via GitHub API), teste le live URL,
compare aux consignes, et propose des améliorations concrètes au catalogue.

---

## Stack technique proposée

### Option A — Anthropic Tool Use natif (recommandée)

Claude a un support tool use robuste, natif :
```typescript
const response = await anthropic.messages.create({
  model: "claude-haiku-4-5",
  tools: [
    { name: "get_current_project", input_schema: {...} },
    { name: "create_next_action", input_schema: {...} },
    ...
  ],
  messages: [...]
});
```

Le SDK Anthropic gère le tool use loop côté serveur — chaque itération :
1. Claude renvoie soit un texte, soit un `tool_use`
2. Notre code exécute le tool
3. On renvoie le résultat comme `tool_result`
4. Boucle jusqu'à réponse finale

**Avantages** : Natif Anthropic, JSON schemas typés, très fiable.
**Cost** : Claude Haiku facturé au token — un agent complet = 2000-5000 tokens.

### Option B — MCP (Model Context Protocol)

MCP standardise "tools" comme des serveurs indépendants réutilisables. On
créerait :
- `mcp-server-takacode-projects` (tools projet)
- `mcp-server-takacode-tracks` (tools tracks)
- `mcp-server-takacode-github` (tools GitHub)

Chaque agent pointerait vers les serveurs MCP dont il a besoin. Portable
entre providers.

**Avantages** : Standardisé, réutilisable, permet à des utilisateurs
externes (Claude Desktop, autres agents) de brancher TakaCode.
**Coût** : Complexité additionnelle, MCP est encore récent.

### Recommandation

**Phase 1 (2 semaines)** : Anthropic Tool Use natif, un agent ProjectCoach
en pilote sur le dashboard. Prouve la mécanique bout en bout.

**Phase 2 (2-3 semaines)** : TrackAdvisor et ReviewBot, toujours en tool
use direct. Enrichit le catalogue automatiquement.

**Phase 3 (3-4 semaines)** : Externalisation des tools en serveurs MCP
pour :
1. Permettre à Claude Desktop / autres agents externes de brancher TakaCode
2. Ouvrir une API "TakaCode as a platform" — les créateurs peuvent brancher
   leurs propres agents sur leurs projets

---

## Sécurité et permissions

**Chaque tool a une portée**. Un `create_next_action` doit :
- Vérifier que le user cible = user courant (RLS)
- Rate limiter (max 10 actions/heure/user)
- Écrire dans une table `agent_actions` pour audit
- Ne jamais exécuter d'action irréversible sans confirmation user

**Chaque agent a un rôle** :
- ProjectCoach → n'accède qu'aux données du user courant
- TrackAdvisor → lecture globale (catalogue), écriture sur les enrollments du user
- ReviewBot → lecture repo user (via son token GitHub), écriture reviews et flags

**Table d'audit** :
```sql
create table agent_actions (
  id uuid primary key,
  agent_name text not null,   -- project_coach, track_advisor, review_bot
  user_id uuid references auth.users(id),
  tool_name text not null,
  input jsonb,
  output jsonb,
  succeeded boolean,
  created_at timestamptz default now()
);
```

Toutes les actions agent apparaîtront dans `/admin/agent-log` pour observabilité.

---

## Roadmap d'implémentation concrète

### Sprint 1 — Foundation (1 semaine)
- [ ] `lib/agents/toolRegistry.ts` : registre typé des tools
- [ ] `lib/agents/anthropicAgent.ts` : wrapper autour du tool use Anthropic
- [ ] Migration `agent_actions` + RLS
- [ ] Endpoint `/api/agents/project-coach/run` (proof of concept)

### Sprint 2 — ProjectCoach V1 (1-2 semaines)
- [ ] 4 tools : get_current_project, get_track_progress, list_next_actions,
      create_next_action
- [ ] UI : bouton "Coach IA (agentique)" dans le dashboard, remplace le chat
      actuel quand la config user a une clé Anthropic
- [ ] Chaque action proposée par le coach s'affiche comme un "diff" que le
      user peut Accepter ou Rejeter (pas d'action silencieuse)

### Sprint 3 — TrackAdvisor (2 semaines)
- [ ] Tools tracks + enrollments
- [ ] Cron nightly : détection de gap → notif user
- [ ] UI : notifications style "3 parcours recommandés pour ton projet"

### Sprint 4 — ReviewBot (2-3 semaines)
- [ ] Tools GitHub (via user's OAuth token, si configuré)
- [ ] Tool analyze_live_url (fetch + parsing simple)
- [ ] Intégration dans le flow soumission projet — review remplace l'actuel
      `reviewProject` quand la config user a une clé Anthropic
- [ ] Flag lessons → admin dashboard "Suggestions IA sur le catalogue"

### Sprint 5 — MCP externalisation (3-4 semaines, optionnel)
- [ ] Extraction des tools TakaCode en serveur MCP standalone
- [ ] Doc "Brancher TakaCode dans Claude Desktop"

---

## Points de décision pour toi

1. **Provider par défaut pour agents** : Anthropic (Claude Haiku) recommandé
   pour la fiabilité du tool use, mais coûte plus cher que Mistral. Alternatives :
   - Mistral avec tool use (fonctionnel mais moins mature)
   - OpenAI GPT-4o mini (tool use natif, prix proche de Claude Haiku)

2. **Auto-actions ou toujours confirmer ?**
   - **Toujours confirmer** (safe, moins wow effect)
   - **Auto pour actions réversibles** (créer une NextAction), confirmer pour
     actions engageantes (inscription track) (recommandé)

3. **Priorité entre les 3 agents**
   - ProjectCoach en premier — c'est celui qui touche le user quotidien.
   - Puis ReviewBot — automatise le flow le plus fastidieux.
   - Puis TrackAdvisor — utile mais moins urgent.

4. **MCP maintenant ou plus tard**
   - Plus tard. On prouve d'abord la valeur en interne, puis on externalise.

Dis-moi si tu veux que je démarre le Sprint 1 (foundation) tout de suite.
