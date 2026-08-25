import { cookies } from "next/headers";
import PageHeader from "../../../../components/app-shell/PageHeader";
import { buildPageMetadata } from "../../../../lib/seo";
import { createClient } from "../../../../utils/supabase/server";
import { getServerLocale } from "../../../../lib/serverLocale";
import { getLocale } from "../../../../lib/i18n";

/**
 * Les frameworks — cf. ROADMAP_REPOSITIONNEMENT.md §11.7.
 *
 * Ce que l'admin edite change de nature : on ne redige plus une lecon, on
 * decrit ce que le Builder doit produire et a quelles conditions c'est termine.
 * Cette page donne d'abord la visibilite ; l'edition viendra ensuite.
 */

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { t } = getLocale(locale);
  return buildPageMetadata({
    title: t("adminFrameworks.metaTitle"),
    description: t("adminFrameworks.metaDesc"),
    path: "/admin/frameworks",
    noIndex: true
  });
}

interface FrameworkRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  locale: string;
  levelLabel: string;
  isPublished: boolean;
  typeLabel: string;
  icon: string;
  accent: string;
  phases: number;
  steps: number;
}

export default async function AdminFrameworksPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const locale = await getServerLocale();
  const { t } = getLocale(locale);

  const { data: frameworksData } = await supabase
    .from("project_frameworks")
    .select("id, slug, title, summary, locale, level_label, is_published, project_types(label, icon, accent_color)")
    .order("sort_order", { ascending: true });

  const frameworks = Array.isArray(frameworksData) ? frameworksData : [];
  const ids = frameworks.map((f) => String((f as Record<string, unknown>).id));

  // Deux requetes de comptage plutot qu'une jointure imbriquee : PostgREST ne
  // sait pas compter a deux niveaux, et le volume reste faible.
  const phasesResult = ids.length
    ? await supabase.from("framework_phases").select("id, framework_id").in("framework_id", ids)
    : { data: [] };
  const phases = Array.isArray(phasesResult.data) ? phasesResult.data : [];
  const phaseIds = phases.map((p) => String((p as Record<string, unknown>).id));

  const stepsResult = phaseIds.length
    ? await supabase.from("phase_step_templates").select("id, phase_id").in("phase_id", phaseIds)
    : { data: [] };
  const steps = Array.isArray(stepsResult.data) ? stepsResult.data : [];

  const phasesByFramework = new Map<string, string[]>();
  for (const p of phases) {
    const row = p as Record<string, unknown>;
    const key = String(row.framework_id);
    const list = phasesByFramework.get(key) || [];
    list.push(String(row.id));
    phasesByFramework.set(key, list);
  }

  const stepsByPhase = new Map<string, number>();
  for (const s of steps) {
    const row = s as Record<string, unknown>;
    const key = String(row.phase_id);
    stepsByPhase.set(key, (stepsByPhase.get(key) || 0) + 1);
  }

  const rows: FrameworkRow[] = frameworks.map((f) => {
    const row = f as Record<string, unknown>;
    const rawType = row.project_types;
    const type = (Array.isArray(rawType) ? rawType[0] : rawType) as Record<string, unknown> | null;
    const id = String(row.id);
    const ownPhases = phasesByFramework.get(id) || [];
    return {
      id,
      slug: typeof row.slug === "string" ? row.slug : "",
      title: typeof row.title === "string" ? row.title : "",
      summary: typeof row.summary === "string" ? row.summary : "",
      locale: typeof row.locale === "string" ? row.locale : "",
      levelLabel: typeof row.level_label === "string" ? row.level_label : "",
      isPublished: row.is_published === true,
      typeLabel: type && typeof type.label === "string" ? type.label : "—",
      icon: type && typeof type.icon === "string" ? type.icon : "lucide:target",
      accent: type && typeof type.accent_color === "string" ? type.accent_color : "#4F8EF7",
      phases: ownPhases.length,
      steps: ownPhases.reduce((sum, phaseId) => sum + (stepsByPhase.get(phaseId) || 0), 0)
    };
  });

  return (
    <>
      <PageHeader title={t("adminFrameworks.title")} subtitle={t("adminFrameworks.subtitle")} />

      <div className="rounded-2xl border border-[var(--border-3)] bg-[var(--surface-1)] p-5 mb-5">
        <p className="font-body-readable text-[12px] text-[var(--muted-3)] leading-relaxed">
          {t("adminFrameworks.intro")}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-3)] bg-[var(--surface-1)] p-8 text-center">
          <div className="font-body-readable text-[13px] text-[var(--text-primary)] mb-1">
            {t("adminFrameworks.empty")}
          </div>
          <div className="font-body-readable text-[11px] text-[var(--muted-5)]">
            {t("adminFrameworks.emptyHint")}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-[var(--border-3)] bg-[var(--surface-1)] p-5">
              <div className="flex items-start gap-3.5 flex-wrap">
                <div
                  className="w-10 h-10 rounded-xl inline-flex items-center justify-center shrink-0"
                  style={{ background: `${row.accent}15`, border: `1px solid ${row.accent}30` }}
                >
                  <iconify-icon icon={row.icon} style={{ color: row.accent, fontSize: "18px" }} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-venite-italic text-[14px] text-[var(--text-primary)] leading-tight">
                      {row.title}
                    </h3>
                    <span
                      className={[
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                        row.isPublished
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                          : "border-[var(--border-4)] bg-[var(--overlay-3)] text-[var(--muted-3)]"
                      ].join(" ")}
                    >
                      {row.isPublished ? t("adminFrameworks.published") : t("adminFrameworks.draft")}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[var(--border-4)] bg-[var(--overlay-3)] text-[var(--muted-3)] uppercase">
                      {row.locale}
                    </span>
                  </div>

                  <p className="font-body-readable text-[12px] text-[var(--muted-4)] leading-relaxed mb-2">
                    {row.summary}
                  </p>

                  <div className="font-body-readable text-[11px] text-[var(--muted-5)] flex flex-wrap gap-x-4 gap-y-1">
                    <span>{row.typeLabel}</span>
                    <span>{row.levelLabel}</span>
                    <span>
                      {row.phases} {t("adminFrameworks.phases")}
                    </span>
                    <span>
                      {row.steps} {t("adminFrameworks.steps")}
                    </span>
                    <code className="text-[10px] text-[var(--muted-5)]">{row.slug}</code>
                  </div>

                  {row.steps === 0 ? (
                    <div className="mt-2 font-body-readable text-[11px] text-amber-300/90">
                      {t("adminFrameworks.noStepWarning")}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
