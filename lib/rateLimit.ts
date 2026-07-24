/**
 * Rate limiter utilitaire — sliding window en mémoire.
 *
 * ⚠️ Limitation : cette implémentation est en mémoire (Map).
 * En production multi-instance (Vercel), migrer vers Upstash Redis :
 * `npm i @upstash/ratelimit @upstash/redis`
 * puis remplacer le store Map par un store Redis.
 *
 * Usage :
 *   const rateLimit = createRateLimiter({ windowMs: 60000, max: 10 });
 *   const result = rateLimit.check("user-123");
 *   if (!result.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
 */

interface RateLimitConfig {
  /** Fenêtre en millisecondes (defaut: 60s) */
  windowMs: number;
  /** Requêtes max autorisées dans la fenêtre */
  max: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

interface WindowEntry {
  count: number;
  resetAt: number;
}

function createWindowEntry(windowMs: number): WindowEntry {
  return {
    count: 1,
    resetAt: Date.now() + windowMs
  };
}

export function createRateLimiter(config: Partial<RateLimitConfig> = {}) {
  const windowMs = Number.isFinite(config.windowMs) && config.windowMs! > 0 ? config.windowMs! : 60_000;
  const max = Number.isFinite(config.max) && config.max! > 0 ? config.max! : 30;

  // Nettoyage périodique toutes les 5 min pour éviter les fuites mémoire
  const store = new Map<string, WindowEntry>();
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) {
        store.delete(key);
      }
    }
  }, 300_000);

  // Permet au garbage collector de nettoyer l'intervalle si l'objet est perdu
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      const entry = store.get(key);

      // Première requête ou fenêtre expirée
      if (!entry || entry.resetAt <= now) {
        const newEntry = createWindowEntry(windowMs);
        store.set(key, newEntry);
        return { allowed: true, remaining: max - 1, resetAt: newEntry.resetAt };
      }

      // Dans la fenêtre : on incrémente
      entry.count += 1;

      if (entry.count > max) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
      }

      return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
    },

    /** Réinitialise le compteur pour une clé donnée */
    reset(key: string): void {
      store.delete(key);
    },

    /** Nettoie toutes les entrées expirées */
    cleanup(): void {
      const now = Date.now();
      for (const [key, entry] of store) {
        if (entry.resetAt <= now) {
          store.delete(key);
        }
      }
    }
  };
}

// Rate limiters pré-configurés pour les routes critiques
export const apiRateLimit = {
  /** Routes d'IA review (coût API) : 10 requêtes / min par utilisateur */
  aiReview: createRateLimiter({ windowMs: 60_000, max: 10 }),

  /** Routes de soumission de projet : 20 requêtes / min par utilisateur */
  projectSubmission: createRateLimiter({ windowMs: 60_000, max: 20 }),

  /** Routes de quiz : 30 requêtes / min par utilisateur */
  quiz: createRateLimiter({ windowMs: 60_000, max: 30 }),

  /** Routes de test IA (admin) : 5 requêtes / min */
  aiTest: createRateLimiter({ windowMs: 60_000, max: 5 }),

  /** Routes générales : 60 requêtes / min par utilisateur */
  general: createRateLimiter({ windowMs: 60_000, max: 60 })
};

/** Construit la clé de rate limiting à partir de l'IP + userId */
export function buildRateLimitKey(userId: string, ip: string): string {
  return `${userId}:${ip}`;
}
