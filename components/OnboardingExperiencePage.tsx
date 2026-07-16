"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GOAL_OPTIONS,
  LEVEL_OPTIONS,
  PROJECT_CLARITY_OPTIONS,
  TOOL_OPTIONS,
  WEEKLY_COMMITMENT_OPTIONS,
  buildOnboardingRecommendation
} from "../lib/onboarding";
import type { Option } from "../lib/onboarding";
import { createClient } from "../utils/supabase/client";

interface User {
  displayName?: string;
  email?: string;
  metadata?: Record<string, unknown>;
}

interface OnboardingExperiencePageProps {
  user: User;
}

interface Recommendation {
  parcoursTitle: string;
  parcoursMeta: string;
  objective: string;
  resources: string[];
  nextSession: string;
  nextSteps: { label: string; state: string }[];
}

interface StepMeta {
  label: string;
  icon: string;
  accent: string;
}

interface Visual {
  icon: string;
  accent: string;
}

interface StepStateUi {
  icon: string;
  chip: string;
}

const TOTAL_STEPS = 7;

function clampStep(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.max(1, Math.min(TOTAL_STEPS, Math.round(value)));
}

const STEP_META: Record<number, StepMeta> = {
  1: { label: "Bienvenue", icon: "lucide:sparkles", accent: "#4F8EF7" },
  2: { label: "Objectif", icon: "lucide:target", accent: "#22D3EE" },
  3: { label: "Niveau", icon: "lucide:layers-3", accent: "#9B6DFF" },
  4: { label: "Projet", icon: "lucide:lightbulb", accent: "#F59E0B" },
  5: { label: "Outils", icon: "lucide:wrench", accent: "#10B981" },
  6: { label: "Rythme", icon: "lucide:clock-3", accent: "#38BDF8" },
  7: { label: "Resultat", icon: "lucide:rocket", accent: "#4F8EF7" }
};

const LEVEL_VISUALS: Record<string, Visual> = {
  beginner: { icon: "lucide:rocket", accent: "#22D3EE" },
  basics: { icon: "lucide:book-open", accent: "#4F8EF7" },
  projects: { icon: "lucide:target", accent: "#9B6DFF" },
  advanced: { icon: "lucide:trending-up", accent: "#10B981" }
};

const CLARITY_VISUALS: Record<string, Visual> = {
  clear_idea: { icon: "lucide:circle-check-big", accent: "#22C55E" },
  some_ideas: { icon: "lucide:lightbulb", accent: "#F59E0B" },
  explore: { icon: "lucide:compass", accent: "#4F8EF7" }
};

const WEEKLY_VISUALS: Record<string, Visual> = {
  lt_2: { icon: "lucide:timer", accent: "#38BDF8" },
  "2_to_5": { icon: "lucide:calendar-range", accent: "#4F8EF7" },
  "5_to_10": { icon: "lucide:zap", accent: "#9B6DFF" },
  gt_10: { icon: "lucide:flame", accent: "#F59E0B" }
};

const TOOL_SWATCHES = ["#4F8EF7", "#9B6DFF", "#22D3EE", "#10B981", "#F59E0B"];

function findOption(options: Option[], key: string | undefined, fallbackKey: string): Option {
  const normalized = typeof key === "string" ? key.trim() : "";
  const byKey = options.find((option) => option.key === normalized);
  if (byKey) {
    return byKey;
  }
  const fallback = options.find((option) => option.key === fallbackKey);
  return fallback || options[0];
}

function sanitizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeTools(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return (value as string[])
    .map((item) => sanitizeText(item))
    .filter((item, index, array) => item && TOOL_OPTIONS.includes(item) && array.indexOf(item) === index)
    .slice(0, 12);
}

function getStepStateUi(state: string): StepStateUi {
  if (state === "done") {
    return {
      icon: "lucide:check",
      chip: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
    };
  }

  if (state === "current") {
    return {
      icon: "lucide:hourglass",
      chip: "bg-blue-500/10 border-blue-500/30 text-blue-200"
    };
  }

  return {
    icon: "lucide:lock",
    chip: "bg-white/[0.03] border-white/[0.08] text-[#777]"
  };
}

function getToolChipStyle(index: number, selected: boolean): React.CSSProperties {
  const color = TOOL_SWATCHES[index % TOOL_SWATCHES.length];

  if (selected) {
    return {
      borderColor: `${color}77`,
      background: `linear-gradient(135deg, ${color}44, rgba(255,255,255,0.04))`,
      color: "#ffffff",
      boxShadow: `0 0 18px ${color}26`
    };
  }

  return {
    borderColor: "rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.02)",
    color: "#a3a3a3"
  };
}

export default function OnboardingExperiencePage({ user }: OnboardingExperiencePageProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const metadata = user?.metadata && typeof user.metadata === "object" ? user.metadata : {};
  const existingProfile = metadata?.onboarding_profile && typeof metadata?.onboarding_profile === "object"
    ? metadata.onboarding_profile as Record<string, unknown>
    : {};
  const onboardingDraft = metadata?.onboarding_draft && typeof metadata?.onboarding_draft === "object"
    ? metadata.onboarding_draft as Record<string, unknown>
    : {};
  const profileSeed = Object.keys(onboardingDraft).length > 0 ? onboardingDraft : existingProfile;

  const [step, setStep] = useState<number>(clampStep(Number(onboardingDraft.step) || 1));
  const [goalKey, setGoalKey] = useState<string>(findOption(GOAL_OPTIONS, profileSeed.goal_key as string | undefined, "website").key);
  const [levelKey, setLevelKey] = useState<string>(findOption(LEVEL_OPTIONS, profileSeed.level_key as string | undefined, "beginner").key);
  const [projectClarityKey, setProjectClarityKey] = useState<string>(findOption(PROJECT_CLARITY_OPTIONS, profileSeed.project_clarity as string | undefined, "explore").key);
  const [projectIdea, setProjectIdea] = useState<string>(sanitizeText(profileSeed.project_idea));
  const [tools, setTools] = useState<string[]>(sanitizeTools(profileSeed.tools));
  const [weeklyCommitmentKey, setWeeklyCommitmentKey] = useState<string>(
    findOption(WEEKLY_COMMITMENT_OPTIONS, profileSeed.weekly_commitment as string | undefined, "2_to_5").key
  );
  const [databaseRecommendation, setDatabaseRecommendation] = useState<Recommendation | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const skipDraftSyncRef = useRef<boolean>(true);

  const selectedGoal = findOption(GOAL_OPTIONS, goalKey, "website");
  const selectedLevel = findOption(LEVEL_OPTIONS, levelKey, "beginner");
  const selectedProjectClarity = findOption(PROJECT_CLARITY_OPTIONS, projectClarityKey, "explore");
  const selectedWeeklyCommitment = findOption(WEEKLY_COMMITMENT_OPTIONS, weeklyCommitmentKey, "2_to_5");

  const fallbackRecommendation = useMemo(() => buildOnboardingRecommendation(goalKey), [goalKey]);
  const recommendation = databaseRecommendation || (fallbackRecommendation as unknown as Recommendation);
  const stepMeta = STEP_META[step] || STEP_META[1];

  const draftPayload = useMemo(() => {
    return {
      step,
      goal_key: selectedGoal.key,
      level_key: selectedLevel.key,
      project_clarity: selectedProjectClarity.key,
      project_idea: selectedProjectClarity.key === "explore" ? "" : sanitizeText(projectIdea),
      tools,
      weekly_commitment: selectedWeeklyCommitment.key
    };
  }, [
    step,
    selectedGoal.key,
    selectedLevel.key,
    selectedProjectClarity.key,
    projectIdea,
    tools,
    selectedWeeklyCommitment.key
  ]);

  useEffect(() => {
    if (metadata?.onboarding_completed === true || saving) {
      return;
    }

    if (skipDraftSyncRef.current) {
      skipDraftSyncRef.current = false;
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      const { error } = await supabase.auth.updateUser({
        data: {
          onboarding_draft: {
            ...draftPayload,
            updated_at: new Date().toISOString()
          }
        }
      });

      if (error) {
        console.error("Unable to save onboarding draft", error);
      }
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [draftPayload, metadata?.onboarding_completed, saving, supabase]);

  useEffect(() => {
    let isMounted = true;

    async function loadDatabaseRecommendation() {
      if (isMounted) {
        setDatabaseRecommendation(null);
      }

      try {
        const response = await fetch("/api/tracks/recommendation?goal_key=" + encodeURIComponent(goalKey), {
          method: "GET",
          cache: "no-store"
        });

        if (!response.ok) {
          if (isMounted) {
            setDatabaseRecommendation(null);
          }
          return;
        }

        const payload = await response.json();

        if (!isMounted) {
          return;
        }

        if (payload?.recommendation && typeof payload.recommendation === "object") {
          setDatabaseRecommendation(payload.recommendation as Recommendation);
          return;
        }

        setDatabaseRecommendation(null);
      } catch {
        if (isMounted) {
          setDatabaseRecommendation(null);
        }
      }
    }

    loadDatabaseRecommendation();

    return () => {
      isMounted = false;
    };
  }, [goalKey]);

  const canContinue = useMemo(() => {
    if (step === 1) return true;
    if (step === 2) return Boolean(goalKey);
    if (step === 3) return Boolean(levelKey);
    if (step === 4) {
      if (!projectClarityKey) {
        return false;
      }

      if (projectClarityKey === "clear_idea") {
        return projectIdea.trim().length >= 8;
      }

      return true;
    }

    if (step === 5) return true;
    if (step === 6) return Boolean(weeklyCommitmentKey);
    return true;
  }, [goalKey, levelKey, projectClarityKey, projectIdea, weeklyCommitmentKey, step]);

  function handleNext() {
    if (!canContinue || step >= TOTAL_STEPS) {
      return;
    }

    setStep((current) => Math.min(TOTAL_STEPS, current + 1));
  }

  function handleBack() {
    setStep((current) => Math.max(1, current - 1));
  }

  function toggleTool(toolName: string) {
    setTools((current) => {
      if (current.includes(toolName)) {
        return current.filter((item) => item !== toolName);
      }

      return [...current, toolName].slice(0, 12);
    });
  }

  async function completeOnboarding(targetPath: string) {
    if (saving) {
      return;
    }

    setSaving(true);
    setErrorMessage("");

    const cleanIdea = sanitizeText(projectIdea);

    const profilePayload = {
      goal_key: selectedGoal.key,
      goal_label: selectedGoal.label,
      level_key: selectedLevel.key,
      level_label: selectedLevel.label,
      project_clarity: selectedProjectClarity.key,
      project_clarity_label: selectedProjectClarity.label,
      project_idea: selectedProjectClarity.key === "explore" ? "" : cleanIdea,
      tools,
      weekly_commitment: selectedWeeklyCommitment.key,
      weekly_commitment_label: selectedWeeklyCommitment.label,
      progress: 8,
      recommendation: {
        parcours_title: recommendation.parcoursTitle,
        parcours_meta: recommendation.parcoursMeta,
        objective: recommendation.objective,
        resources: recommendation.resources,
        next_session: recommendation.nextSession,
        next_steps: recommendation.nextSteps
      }
    };

    const { error } = await supabase.auth.updateUser({
      data: {
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        onboarding_profile: profilePayload,
        onboarding_draft: null
      }
    });

    if (error) {
      setErrorMessage(error.message);
      setSaving(false);
      return;
    }

    router.push(targetPath);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 py-20 md:py-24 relative overflow-hidden text-white">
      <div className="hero-glow w-[620px] h-[620px] bg-blue-500/[0.06] -left-[110px] top-[8%]" />
      <div className="hero-glow w-[520px] h-[520px] bg-violet-500/[0.08] -right-[90px] bottom-[8%]" />
      <div className="hero-glow w-[420px] h-[420px] bg-cyan-500/[0.07] left-[42%] top-[45%]" />

      <div className="relative z-10 w-full max-w-[1020px] mx-auto">
        <div className="mb-8 animate-fade-up">
          <Link
            href="/"
            id="onboarding-back-home"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/30 px-4 py-2.5 group"
          >
            <span className="w-7 h-7 rounded-lg border border-white/[0.12] bg-white/[0.04] inline-flex items-center justify-center text-[#8ba1ff] group-hover:text-white transition-colors">
              <iconify-icon icon="lucide:arrow-left" style={{ fontSize: "15px" }} />
            </span>
            <span className="text-[11px] font-semibold text-[#666] tracking-widest uppercase group-hover:text-[#9a9a9a] transition-colors">
              Retour au site
            </span>
          </Link>
        </div>

        <div className="bg-[#111] border border-white/[0.07] rounded-3xl p-8 sm:p-10 shadow-2xl animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2.5 flex-wrap">
              {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
                const rank = index + 1;
                const active = rank <= step;
                return (
                  <span
                    key={`step-${rank}`}
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: active ? "30px" : "9px",
                      background: active
                        ? "linear-gradient(90deg, #4F8EF7, #9B6DFF, #22D3EE)"
                        : "rgba(255,255,255,0.14)",
                      boxShadow: active ? "0 0 14px rgba(79,142,247,0.45)" : "none"
                    } as React.CSSProperties}
                  />
                );
              })}
            </div>

            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
              style={{
                borderColor: `${stepMeta.accent}66`,
                background: `${stepMeta.accent}1f`
              } as React.CSSProperties}
            >
              <iconify-icon icon={stepMeta.icon} style={{ color: stepMeta.accent, fontSize: "14px" }} />
              <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: stepMeta.accent }}>
                {"Étape"} {step} / {TOTAL_STEPS}
              </span>
            </div>
          </div>

          <div key={step} className="onboarding-step-pane">
            {step === 1 ? (
              <section className="space-y-8">
                <div className="section-label font-venite-italic">Bienvenue</div>
                <h1 className="font-valorax text-[clamp(36px,4vw,54px)] leading-[0.9] gradient-text-blue">BIENVENUE SUR TAKACODE</h1>
                <p className="font-body-readable text-[15px] text-[#9b9b9b] leading-relaxed max-w-[700px]">
                  {"L'endroit où l'on apprend en construisant. Nous allons personnaliser ton expérience en moins d'une minute."}
                </p>

                <div className="grid sm:grid-cols-3 gap-3">
                  <article className="rounded-2xl border border-blue-500/25 bg-blue-500/10 p-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/30 inline-flex items-center justify-center mb-3">
                      <iconify-icon icon="lucide:route" style={{ color: "#4F8EF7", fontSize: "16px" }} />
                    </div>
                    <h3 className="font-venite-italic text-[13px] text-white mb-1">{"Parcours cible"}</h3>
                    <p className="text-[12px] text-blue-100/80 font-body-readable">{"Ton plan s'adapte à ton objectif réel."}</p>
                  </article>

                  <article className="rounded-2xl border border-violet-500/25 bg-violet-500/10 p-4">
                    <div className="w-9 h-9 rounded-lg bg-violet-500/20 border border-violet-400/30 inline-flex items-center justify-center mb-3">
                      <iconify-icon icon="lucide:users" style={{ color: "#9B6DFF", fontSize: "16px" }} />
                    </div>
                    <h3 className="font-venite-italic text-[13px] text-white mb-1">{"Communaute active"}</h3>
                    <p className="text-[12px] text-violet-100/80 font-body-readable">{"Sessions live, échanges et feedback concrets."}</p>
                  </article>

                  <article className="rounded-2xl border border-cyan-500/25 bg-cyan-500/10 p-4">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/30 inline-flex items-center justify-center mb-3">
                      <iconify-icon icon="lucide:bot" style={{ color: "#22D3EE", fontSize: "16px" }} />
                    </div>
                    <h3 className="font-venite-italic text-[13px] text-white mb-1">IA pratique</h3>
                    <p className="text-[12px] text-cyan-100/80 font-body-readable">{"Tu gagnes du temps sur chaque étape."}</p>
                  </article>
                </div>
              </section>
            ) : null}

            {step === 2 ? (
              <section className="space-y-7">
                <div>
                  <div className="section-label font-venite-italic mb-3">Ton objectif</div>
                  <h2 className="font-valorax text-[clamp(30px,3.4vw,44px)] leading-[0.9] gradient-text">{"QUE VEUX-TU REALISER ?"}</h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {GOAL_OPTIONS.map((goal: Option) => {
                    const selected = goal.key === goalKey;
                    const accent = goal.accent || "#4F8EF7";

                    return (
                      <button
                        key={goal.key}
                        type="button"
                        onClick={() => setGoalKey(goal.key)}
                        className={[
                          "onboarding-goal-card rounded-2xl border p-4 text-left transition-all duration-300",
                          selected
                            ? "border-white/0"
                            : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2]"
                        ].join(" ")}
                        style={
                          selected
                            ? {
                                background: `linear-gradient(145deg, ${accent}30, rgba(255,255,255,0.02))`,
                                boxShadow: `0 0 24px ${accent}33`
                              } as React.CSSProperties
                            : { "--goal-accent": accent } as React.CSSProperties
                        }
                      >
                        <div
                          className="w-10 h-10 rounded-xl border inline-flex items-center justify-center mb-3"
                          style={{
                            borderColor: `${accent}55`,
                            background: `${accent}22`
                          } as React.CSSProperties}
                        >
                          <iconify-icon icon={goal.icon!} style={{ fontSize: "18px", color: accent }} />
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-venite-italic text-[13px] text-white leading-snug">{goal.label}</div>
                          {selected ? (
                            <span className="onboarding-pulse-dot inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/35 bg-white/15">
                              <iconify-icon icon="lucide:check" style={{ fontSize: "11px", color: "#fff" }} />
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {step === 3 ? (
              <section className="space-y-7">
                <div>
                  <div className="section-label font-venite-italic mb-3">Ton niveau</div>
                  <h2 className="font-valorax text-[clamp(30px,3.4vw,44px)] leading-[0.9] gradient-text">{"OU EN ES-TU AUJOURD'HUI ?"}</h2>
                </div>

                <div className="space-y-3">
                  {LEVEL_OPTIONS.map((level: Option) => {
                    const selected = level.key === levelKey;
                    const visual = LEVEL_VISUALS[level.key] || LEVEL_VISUALS.beginner;

                    return (
                      <button
                        key={level.key}
                        type="button"
                        onClick={() => setLevelKey(level.key)}
                        className={[
                          "w-full rounded-xl border px-4 py-3.5 text-left transition-all flex items-center gap-3",
                          selected
                            ? "border-white/0"
                            : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2]"
                        ].join(" ")}
                        style={
                          selected
                            ? {
                                background: `linear-gradient(145deg, ${visual.accent}2e, rgba(255,255,255,0.02))`,
                                boxShadow: `0 0 20px ${visual.accent}22`
                              } as React.CSSProperties
                            : undefined
                        }
                      >
                        <span
                          className="w-8 h-8 rounded-lg border inline-flex items-center justify-center"
                          style={{
                            borderColor: `${visual.accent}66`,
                            background: `${visual.accent}1f`
                          } as React.CSSProperties}
                        >
                          <iconify-icon icon={visual.icon} style={{ fontSize: "14px", color: visual.accent }} />
                        </span>

                        <span className="text-[14px] text-white font-body-readable flex-1">{level.label}</span>

                        <span className={[
                          "w-4 h-4 rounded-full border inline-flex items-center justify-center",
                          selected ? "border-blue-300" : "border-[#666]"
                        ].join(" ")}>
                          {selected ? <span className="w-2 h-2 rounded-full bg-blue-300" /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {step === 4 ? (
              <section className="space-y-7">
                <div>
                  <div className="section-label font-venite-italic mb-3">Ton projet</div>
                  <h2 className="font-valorax text-[clamp(30px,3.4vw,44px)] leading-[0.9] gradient-text">{"AS-TU DEJA UNE IDEE PRECISE ?"}</h2>
                </div>

                <div className="space-y-3">
                  {PROJECT_CLARITY_OPTIONS.map((option: Option) => {
                    const selected = option.key === projectClarityKey;
                    const visual = CLARITY_VISUALS[option.key] || CLARITY_VISUALS.explore;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setProjectClarityKey(option.key)}
                        className={[
                          "w-full rounded-xl border px-4 py-3.5 text-left transition-all flex items-center gap-3",
                          selected
                            ? "border-white/0"
                            : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2]"
                        ].join(" ")}
                        style={
                          selected
                            ? {
                                background: `linear-gradient(145deg, ${visual.accent}2e, rgba(255,255,255,0.02))`,
                                boxShadow: `0 0 20px ${visual.accent}22`
                              } as React.CSSProperties
                            : undefined
                        }
                      >
                        <span
                          className="w-8 h-8 rounded-lg border inline-flex items-center justify-center"
                          style={{
                            borderColor: `${visual.accent}66`,
                            background: `${visual.accent}1f`
                          } as React.CSSProperties}
                        >
                          <iconify-icon icon={visual.icon} style={{ fontSize: "14px", color: visual.accent }} />
                        </span>
                        <span className="text-[14px] text-white font-body-readable flex-1">{option.label}</span>
                        <span className={[
                          "w-4 h-4 rounded-full border inline-flex items-center justify-center",
                          selected ? "border-blue-300" : "border-[#666]"
                        ].join(" ")}>
                          {selected ? <span className="w-2 h-2 rounded-full bg-blue-300" /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {projectClarityKey !== "explore" ? (
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <label className="text-[12px] text-[#9d9d9d] block mb-2">{"Decris ton projet en quelques mots"}</label>
                    <textarea
                      className="auth-input min-h-[110px] resize-y"
                      value={projectIdea}
                      onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setProjectIdea(event.target.value)}
                      placeholder={"Ex: créer un site pour mon restaurant, automatiser WhatsApp, lancer une chaîne YouTube"}
                    />
                    {projectClarityKey === "clear_idea" && projectIdea.trim().length > 0 && projectIdea.trim().length < 8 ? (
                      <p className="text-[11px] text-orange-300 mt-2">{"Ajoute un peu plus de contexte pour un plan plus précis."}</p>
                    ) : null}
                  </div>
                ) : null}
              </section>
            ) : null}

            {step === 5 ? (
              <section className="space-y-7">
                <div>
                  <div className="section-label font-venite-italic mb-3">Tes outils</div>
                  <h2 className="font-valorax text-[clamp(30px,3.4vw,44px)] leading-[0.9] gradient-text">{"QUELS OUTILS T'INTERESSENT ?"}</h2>
                  <p className="font-body-readable text-[13px] text-[#7b7b7b] mt-3">{"Étape facultative. Tu peux continuer sans sélection."}</p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {TOOL_OPTIONS.map((toolName: string, index: number) => {
                    const selected = tools.includes(toolName);
                    return (
                      <button
                        key={toolName}
                        type="button"
                        onClick={() => toggleTool(toolName)}
                        className="onboarding-tool-chip px-3.5 py-2 rounded-full border text-[12px] font-medium transition-all duration-300 inline-flex items-center gap-1.5"
                        style={getToolChipStyle(index, selected)}
                      >
                        <span>{toolName}</span>
                        {selected ? <iconify-icon icon="lucide:check" style={{ fontSize: "11px" }} /> : null}
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {step === 6 ? (
              <section className="space-y-7">
                <div>
                  <div className="section-label font-venite-italic mb-3">Ton rythme</div>
                  <h2 className="font-valorax text-[clamp(30px,3.4vw,44px)] leading-[0.9] gradient-text">
                    COMBIEN DE TEMPS PEUX-TU CONSACRER CHAQUE SEMAINE ?
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {WEEKLY_COMMITMENT_OPTIONS.map((option: Option) => {
                    const selected = option.key === weeklyCommitmentKey;
                    const visual = WEEKLY_VISUALS[option.key] || WEEKLY_VISUALS.lt_2;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setWeeklyCommitmentKey(option.key)}
                        className={[
                          "rounded-xl border px-4 py-4 text-left transition-all flex items-center gap-3",
                          selected
                            ? "border-white/0"
                            : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2]"
                        ].join(" ")}
                        style={
                          selected
                            ? {
                                background: `linear-gradient(145deg, ${visual.accent}2e, rgba(255,255,255,0.02))`,
                                boxShadow: `0 0 20px ${visual.accent}22`
                              } as React.CSSProperties
                            : undefined
                        }
                      >
                        <span
                          className="w-9 h-9 rounded-lg border inline-flex items-center justify-center"
                          style={{
                            borderColor: `${visual.accent}66`,
                            background: `${visual.accent}1f`
                          } as React.CSSProperties}
                        >
                          <iconify-icon icon={visual.icon} style={{ fontSize: "15px", color: visual.accent }} />
                        </span>
                        <div className="text-[14px] font-semibold">{option.label}</div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {step === 7 ? (
              <section className="space-y-7">
                <div>
                  <div className="section-label font-venite-italic mb-3">{"Resultat"}</div>
                  <h2 className="font-valorax text-[clamp(30px,3.4vw,44px)] leading-[0.9] gradient-text-blue">{"TON ESPACE EST PRET"}</h2>
                  <p className="font-body-readable text-[14px] text-[#8f8f8f] mt-3 max-w-[680px]">
                    {"On t'a préparé une première trajectoire selon ton objectif: "}{selectedGoal.label.toLowerCase()}.
                  </p>
                </div>

                <div className="grid lg:grid-cols-[1.35fr_1fr] gap-5">
                  <article className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-[#15162a] to-violet-500/10 p-5 space-y-5">
                    <div>
                      <div className="font-venite-italic text-[11px] text-[#7a8fd8] uppercase tracking-widest mb-2">{"Parcours recommande"}</div>
                      <h3 className="font-venite-italic text-[24px] leading-[0.95] text-white">{recommendation.parcoursTitle}</h3>
                      <p className="text-[12px] text-[#a2b2d9] mt-1 font-body-readable">{recommendation.parcoursMeta}</p>
                    </div>

                    <div>
                      <div className="font-venite-italic text-[12px] text-white mb-2">{"Premieres ressources"}</div>
                      <div className="space-y-2">
                        {recommendation.resources.map((resource: string) => (
                          <div key={resource} className="flex items-center gap-2 text-[12px] text-[#c1d1ff] font-body-readable">
                            <iconify-icon icon="lucide:book-marked" style={{ color: "#4F8EF7", fontSize: "14px" }} />
                            <span>{resource}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-[12px] text-cyan-100 font-body-readable">
                      <div className="font-venite-italic text-[12px] mb-1">Objectif</div>
                      {recommendation.objective}
                    </div>
                  </article>

                  <article className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-[#101019] to-cyan-500/10 p-5 space-y-5">
                    <div>
                      <div className="font-venite-italic text-[11px] text-[#888] uppercase tracking-widest mb-2">Ton profil</div>
                      <div className="font-venite-italic text-[13px] text-white">{selectedGoal.label}</div>
                      <div className="text-[12px] text-[#a2a2b5] font-body-readable mt-1">{selectedLevel.label}</div>
                      <div className="text-[12px] text-[#a2a2b5] font-body-readable">{selectedWeeklyCommitment.label} / semaine</div>
                    </div>

                    <div>
                      <div className="font-venite-italic text-[12px] text-white mb-2">Prochaine session live</div>
                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-[12px] text-[#bfbfe0] font-body-readable">
                        {recommendation.nextSession}
                      </div>
                    </div>

                    <div>
                      <div className="font-venite-italic text-[12px] text-white mb-2">{"Prochaines etapes"}</div>
                      <div className="space-y-2">
                        {recommendation.nextSteps.map((stepItem: { label: string; state: string }) => {
                          const ui = getStepStateUi(stepItem.state);
                          return (
                            <div key={stepItem.label} className="flex items-center gap-2 text-[12px] font-body-readable">
                              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${ui.chip}`}>
                                <iconify-icon icon={ui.icon} style={{ fontSize: "12px" }} />
                              </span>
                              <span className="text-[#d1d1e8]">{stepItem.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </article>
                </div>
              </section>
            ) : null}
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-[12px] text-red-300">
              {errorMessage}
            </div>
          ) : null}

          {step < TOTAL_STEPS ? (
            <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-between gap-3">
              {step > 1 ? (
                <button type="button" onClick={handleBack} className="btn-secondary" disabled={saving}>
                  Retour
                </button>
              ) : <span />}

              <button type="button" onClick={handleNext} className="btn-primary" disabled={!canContinue || saving}>
                {step === 1 ? "Commencer" : "Continuer"}
              </button>
            </div>
          ) : (
            <div className="mt-8 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => completeOnboarding("/parcours")}
                disabled={saving}
              >
                {saving ? "Chargement..." : "Explorer la plateforme"}
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => completeOnboarding("/dashboard")}
                disabled={saving}
              >
                {saving ? "Chargement..." : "Commencer mon parcours"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
