import { normalizeText, isMissingSchemaError } from "./utils";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface AffiliateCategory {
  value: string;
  label: string;
}

export const AFFILIATE_CATEGORIES: AffiliateCategory[] = [
  { value: "hebergement", label: "Hebergement" },
  { value: "domaine", label: "Nom de domaine" },
  { value: "deploiement", label: "Deploiement" },
  { value: "backend", label: "Backend / BDD" },
  { value: "ia", label: "IA" },
  { value: "outil", label: "Outil" }
];

const SELECT = "id, provider, category, title, description, url, logo_url, is_published, sort_order, track_slug, updated_at";

const AFFILIATE_TABLES = ["affiliate_links"];

export interface AffiliateLink {
  id: string;
  provider: string;
  category: string;
  title: string;
  description: string;
  url: string;
  logoUrl: string;
  isPublished: boolean;
  sortOrder: number;
  trackSlug: string;
}

interface AffiliateRow {
  id: string;
  provider: string;
  category: string;
  title: string;
  description: string;
  url: string;
  logo_url: string;
  is_published: boolean;
  sort_order: number;
  track_slug: string;
}

function normalize(row: unknown): AffiliateLink | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  return {
    id: r.id as string,
    provider: typeof r.provider === "string" ? r.provider : "",
    category: typeof r.category === "string" ? r.category : "outil",
    title: typeof r.title === "string" ? r.title : "",
    description: typeof r.description === "string" ? r.description : "",
    url: typeof r.url === "string" ? r.url : "",
    logoUrl: typeof r.logo_url === "string" ? r.logo_url : "",
    isPublished: r.is_published === true,
    sortOrder: Number.isFinite(Number(r.sort_order)) ? Number(r.sort_order) : 100,
    trackSlug: typeof r.track_slug === "string" ? r.track_slug : ""
  };
}

export function categoryLabel(value: string): string {
  const found = AFFILIATE_CATEGORIES.find((c) => c.value === value);
  return found ? found.label : "Outil";
}

interface AffiliateQueryOptions {
  category?: string;
  trackSlug?: string;
}

interface AffiliateListResult {
  links: AffiliateLink[];
  schemaReady: boolean;
  error: Error | null;
}

interface AffiliateGetResult {
  link: AffiliateLink | null;
  schemaReady: boolean;
  error: Error | null;
}

export async function listPublishedAffiliates(supabase: SupabaseClient, options: AffiliateQueryOptions = {}): Promise<AffiliateListResult> {
  let query = supabase
    .from("affiliate_links")
    .select(SELECT)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(100);

  if (options.category) {
    query = query.eq("category", options.category);
  }

  if (options.trackSlug) {
    query = query.eq("track_slug", options.trackSlug);
  }

  const { data, error } = await query;

  if (error) {
    if (isMissingSchemaError(error, AFFILIATE_TABLES)) {
      return { links: [], schemaReady: false, error: null };
    }
    return { links: [], schemaReady: true, error };
  }

  return { links: ((data as AffiliateRow[]) || []).map(normalize).filter(Boolean) as AffiliateLink[], schemaReady: true, error: null };
}

export async function listAffiliatesByTrack(supabase: SupabaseClient, trackSlug: string): Promise<AffiliateListResult> {
  return listPublishedAffiliates(supabase, { trackSlug });
}

export async function listAllAffiliates(supabase: SupabaseClient): Promise<AffiliateListResult> {
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

  return { links: ((data as AffiliateRow[]) || []).map(normalize).filter(Boolean) as AffiliateLink[], schemaReady: true, error: null };
}

export async function getAffiliate(supabase: SupabaseClient, id: string | null): Promise<AffiliateGetResult> {
  if (!id) return { link: null, schemaReady: true, error: null };
  const { data, error } = await supabase.from("affiliate_links").select(SELECT).eq("id", id).maybeSingle();
  if (error) {
    if (isMissingSchemaError(error, AFFILIATE_TABLES)) return { link: null, schemaReady: false, error: null };
    return { link: null, schemaReady: true, error };
  }
  return { link: normalize(data) as AffiliateLink | null, schemaReady: true, error: null };
}
