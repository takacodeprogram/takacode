// Liens d'affiliation (table affiliate_links, gérés en admin).

import { normalizeText, isMissingSchemaError } from "./utils";

export const AFFILIATE_CATEGORIES = [
  { value: "hebergement", label: "Hebergement" },
  { value: "domaine", label: "Nom de domaine" },
  { value: "deploiement", label: "Deploiement" },
  { value: "backend", label: "Backend / BDD" },
  { value: "ia", label: "IA" },
  { value: "outil", label: "Outil" }
];

const SELECT = "id, provider, category, title, description, url, logo_url, is_published, sort_order, updated_at";

const AFFILIATE_TABLES = ["affiliate_links"];

function normalize(row) {
  if (!row || typeof row !== "object") return null;
  return {
    id: row.id,
    provider: typeof row.provider === "string" ? row.provider : "",
    category: typeof row.category === "string" ? row.category : "outil",
    title: typeof row.title === "string" ? row.title : "",
    description: typeof row.description === "string" ? row.description : "",
    url: typeof row.url === "string" ? row.url : "",
    logoUrl: typeof row.logo_url === "string" ? row.logo_url : "",
    isPublished: row.is_published === true,
    sortOrder: Number.isFinite(Number(row.sort_order)) ? Number(row.sort_order) : 100
  };
}

export function categoryLabel(value) {
  const found = AFFILIATE_CATEGORIES.find((c) => c.value === value);
  return found ? found.label : "Outil";
}

export async function listPublishedAffiliates(supabase, options = {}) {
  let query = supabase
    .from("affiliate_links")
    .select(SELECT)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(100);

  if (options.category) {
    query = query.eq("category", options.category);
  }

  const { data, error } = await query;

  if (error) {
    if (isMissingSchemaError(error, AFFILIATE_TABLES)) {
      return { links: [], schemaReady: false, error: null };
    }
    return { links: [], schemaReady: true, error };
  }

  return { links: (data || []).map(normalize).filter(Boolean), schemaReady: true, error: null };
}

export async function listAllAffiliates(supabase) {
  const { data, error } = await supabase
    .from("affiliate_links")
    .select(SELECT)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true })
    .limit(300);

  if (error) {
    if (isMissingSchemaError(error, AFFILIATE_TABLES)) {
      return { links: [], schemaReady: false, error: null };
    }
    return { links: [], schemaReady: true, error };
  }

  return { links: (data || []).map(normalize).filter(Boolean), schemaReady: true, error: null };
}

export async function getAffiliate(supabase, id) {
  if (!id) return { link: null, schemaReady: true, error: null };
  const { data, error } = await supabase.from("affiliate_links").select(SELECT).eq("id", id).maybeSingle();
  if (error) {
    if (isMissingSchemaError(error, AFFILIATE_TABLES)) return { link: null, schemaReady: false, error: null };
    return { link: null, schemaReady: true, error };
  }
  return { link: normalize(data), schemaReady: true, error: null };
}
