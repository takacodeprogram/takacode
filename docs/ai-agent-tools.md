# Coach IA outille

Le coach global utilise une boucle agent limitee a quatre etapes. Les outils de
lecture s'executent automatiquement. Les outils avec effet de bord affichent
une confirmation dans l'interface avant toute execution.

## Outils natifs

- `get_my_projects` : liste les projets du membre connecte.
- `get_project` : lit un projet appartenant au membre.
- `search_web` : Tavily, puis Brave Search, puis DuckDuckGo Instant Answer.
- `update_project` : modifie uniquement une liste blanche de champs et verifie
  `user_id`; confirmation obligatoire.
- `list_mcp_tools` : decouvre les outils des serveurs MCP autorises.
- `call_mcp_tool` : appelle un outil MCP autorise; confirmation obligatoire.

## Recherche web

Configurer de preference une des variables suivantes :

```env
TAVILY_API_KEY=
BRAVE_SEARCH_API_KEY=
```

Sans cle, le fallback public DuckDuckGo fournit des reponses plus limitees.

## Serveurs MCP distants

Les URL MCP ne viennent jamais du navigateur. Elles sont listees cote serveur
afin d'eviter les requetes arbitraires et le SSRF.

```env
AI_MCP_SERVERS_JSON=[{"id":"notion","name":"Notion MCP","url":"https://mcp.example.com/mcp","headers":{"Authorization":"Bearer secret"}}]
```

Contraintes :

- HTTPS obligatoire en production;
- dix serveurs maximum;
- les outils sont revalides avec `listTools` avant chaque appel;
- les appels ont un delai maximum et sont fermes apres la requete;
- chaque appel MCP demande une confirmation utilisateur.

Pour un serveur local en developpement uniquement :

```env
AI_MCP_ALLOW_INSECURE=true
```
