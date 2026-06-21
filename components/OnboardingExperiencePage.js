"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GOAL_OPTIONS,
  LEVEL_OPTIONS,
  PROJECT_CLARITY_OPTIONS,
  TOOL_OPTIONS,
  WEEKLY_COMMITMENT_OPTIONS,
  buildOnboardingRecommendation
} from "../lib/onboarding";
import { createClient } from "../utils/supabase/client";

const TOTAL_STEPS = 7;

function findOption(options, key, fallbackKey) {
  const normalized = typeof key === "string" ? key.trim() : "";
  const byKey = options.find((option) => option.key === normalized);
  if (byKey) {
    return byKey;
  }

  const fallback = options.find((option) => option.key === fallbackKey);
  return fallback || options[0];
}

function sanitizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeTools(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => sanitizeText(item))
    .filter((item, index, array) => item && TOOL_OPTIONS.includes(item) && array.indexOf(item) === index)
    .slice(0, 12);
}

function getStepStateUi(state) {
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

export default function OnboardingExperiencePage({ user }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const metadata = user?.metadata && typeof user.metadata === "object" ? user.metadata : {};
  const existingProfile = metadata?.onboarding_profile && typeof metadata.onboarding_profile === "object"
    ? metadata.onboarding_profile
    : {};

  const [step, setStep] = useState(1);
  const [goalKey, setGoalKey] = useState(findOption(GOAL_OPTIONS, existingProfile.goal_key, "website").key);
  const [levelKey, setLevelKey] = useState(findOption(LEVEL_OPTIONS, existingProfile.level_key, "beginner").key);
  const [projectClarityKey, setProjectClarityKey] = useState(findOption(PROJECT_CLARITY_OPTIONS, existingProfile.project_clarity, "explore").key);
  const [projectIdea, setProjectIdea] = useState(sanitizeText(existingProfile.project_idea));
  const [tools, setTools] = useState(sanitizeTools(existingProfile.tools));
  const [weeklyCommitmentKey, setWeeklyCommitmentKey] = useState(
    findOption(WEEKLY_COMMITMENT_OPTIONS, existingProfile.weekly_commitment, "2_to_5").key
  );
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedGoal = findOption(GOAL_OPTIONS, goalKey, "website");
  const selectedLevel = findOption(LEVEL_OPTIONS, levelKey, "beginner");
  const selectedProjectClarity = findOption(PROJECT_CLARITY_OPTIONS, projectClarityKey, "explore");
  const selectedWeeklyCommitment = findOption(WEEKLY_COMMITMENT_OPTIONS, weeklyCommitmentKey, "2_to_5");

  const recommendation = useMemo(() => buildOnboardingRecommendation(goalKey), [goalKey]);

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

  function toggleTool(toolName) {
    setTools((current) => {
      if (current.includes(toolName)) {
        return current.filter((item) => item !== toolName);
      }

      return [...current, toolName].slice(0, 12);
    });
  }

  async function completeOnboarding(targetPath) {
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
        ...metadata,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        onboarding_profile: profilePayload
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
      <div className="hero-glow w-[560px] h-[560px] bg-blue-500/[0.05] -left-[80px] top-[10%]" />
      <div className="hero-glow w-[480px] h-[480px] bg-violet-500/[0.07] -right-[80px] bottom-[10%]" />

      <div className="relative z-10 w-full max-w-[980px] mx-auto">
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
            <div className="flex items-center gap-2 flex-wrap">
              {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
                const rank = index + 1;
                const active = rank <= step;
                return (
                  <span
                    key={`step-${rank}`}
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: active ? "28px" : "9px",
                      background: active ? "#4F8EF7" : "rgba(255,255,255,0.14)"
                    }}
                  />
                );
              })}
            </div>
            <span className="text-[11px] text-[#666] uppercase tracking-widest font-semibold">Etape {step} / {TOTAL_STEPS}</span>
          </div>

          {step === 1 ? (
            <section className="space-y-6">
              <div className="section-label">Bienvenue</div>
              <h1 className="font-valorax text-[clamp(36px,4vw,54px)] leading-[0.9] gradient-text-blue">BIENVENUE SUR TAKACODE</h1>
              <p className="font-body-readable text-[15px] text-[#888] leading-relaxed max-w-[680px]">
                L'endroit ou l'on apprend en construisant. Nous allons personnaliser ton experience en moins d'une minute.
              </p>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="space-y-7">
              <div>
                <div className="section-label mb-3">Ton objectif</div>
                <h2 className="font-valorax text-[clamp(30px,3.4vw,44px)] leading-[0.9] gradient-text">QUE VEUX-TU REALISER ?</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {GOAL_OPTIONS.map((goal) => {
                  const selected = goal.key === goalKey;
                  return (
                    <button
                      key={goal.key}
                      type="button"
                      onClick={() => setGoalKey(goal.key)}
                      className={[
                        "rounded-2xl border p-4 text-left transition-all",
                        selected
                          ? "border-blue-500/45 bg-blue-500/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18]"
                      ].join(" ")}
                    >
                      <div className="w-10 h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] inline-flex items-center justify-center mb-3">
                        <iconify-icon icon={goal.icon} style={{ fontSize: "18px", color: selected ? "#4F8EF7" : "#bdbdbd" }} />
                      </div>
                      <div className="text-[13px] font-semibold text-white leading-snug">{goal.label}</div>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="space-y-7">
              <div>
                <div className="section-label mb-3">Ton niveau</div>
                <h2 className="font-valorax text-[clamp(30px,3.4vw,44px)] leading-[0.9] gradient-text">OU EN ES-TU AUJOURD'HUI ?</h2>
              </div>

              <div className="space-y-3">
                {LEVEL_OPTIONS.map((level) => {
                  const selected = level.key === levelKey;
                  return (
                    <button
                      key={level.key}
                      type="button"
                      onClick={() => setLevelKey(level.key)}
                      className={[
                        "w-full rounded-xl border px-4 py-3.5 text-left transition-all flex items-center gap-3",
                        selected
                          ? "border-blue-500/45 bg-blue-500/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18]"
                      ].join(" ")}
                    >
                      <span className={[
                        "w-4 h-4 rounded-full border inline-flex items-center justify-center",
                        selected ? "border-blue-400" : "border-[#666]"
                      ].join(" ")}>
                        {selected ? <span className="w-2 h-2 rounded-full bg-blue-400" /> : null}
                      </span>
                      <span className="text-[14px] text-white font-body-readable">{level.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}

          {step === 4 ? (
            <section className="space-y-7">
              <div>
                <div className="section-label mb-3">Ton projet</div>
                <h2 className="font-valorax text-[clamp(30px,3.4vw,44px)] leading-[0.9] gradient-text">AS-TU DEJA UNE IDEE PRECISE ?</h2>
              </div>

              <div className="space-y-3">
                {PROJECT_CLARITY_OPTIONS.map((option) => {
                  const selected = option.key === projectClarityKey;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setProjectClarityKey(option.key)}
                      className={[
                        "w-full rounded-xl border px-4 py-3.5 text-left transition-all flex items-center gap-3",
                        selected
                          ? "border-blue-500/45 bg-blue-500/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18]"
                      ].join(" ")}
                    >
                      <span className={[
                        "w-4 h-4 rounded-full border inline-flex items-center justify-center",
                        selected ? "border-blue-400" : "border-[#666]"
                      ].join(" ")}>
                        {selected ? <span className="w-2 h-2 rounded-full bg-blue-400" /> : null}
                      </span>
                      <span className="text-[14px] text-white font-body-readable">{option.label}</span>
                    </button>
                  );
                })}
              </div>

              {projectClarityKey !== "explore" ? (
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <label className="text-[12px] text-[#999] block mb-2">Decris ton projet en quelques mots</label>
                  <textarea
                    className="auth-input min-h-[110px] resize-y"
                    value={projectIdea}
                    onChange={(event) => setProjectIdea(event.target.value)}
                    placeholder="Ex: creer un site pour mon restaurant, automatiser WhatsApp, lancer une chaine YouTube"
                  />
                  {projectClarityKey === "clear_idea" && projectIdea.trim().length > 0 && projectIdea.trim().length < 8 ? (
                    <p className="text-[11px] text-orange-300 mt-2">Ajoute un peu plus de contexte pour un plan plus precis.</p>
                  ) : null}
                </div>
              ) : null}
            </section>
          ) : null}

          {step === 5 ? (
            <section className="space-y-7">
              <div>
                <div className="section-label mb-3">Tes outils</div>
                <h2 className="font-valorax text-[clamp(30px,3.4vw,44px)] leading-[0.9] gradient-text">QUELS OUTILS T'INTERESSENT ?</h2>
                <p className="font-body-readable text-[13px] text-[#666] mt-3">Etape facultative. Tu peux continuer sans selection.</p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {TOOL_OPTIONS.map((toolName) => {
                  const selected = tools.includes(toolName);
                  return (
                    <button
                      key={toolName}
                      type="button"
                      onClick={() => toggleTool(toolName)}
                      className={[
                        "px-3.5 py-2 rounded-full border text-[12px] font-medium transition-colors",
                        selected
                          ? "border-blue-500/45 bg-blue-500/10 text-blue-100"
                          : "border-white/[0.09] bg-white/[0.02] text-[#9a9a9a] hover:text-white"
                      ].join(" ")}
                    >
                      {toolName}
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}

          {step === 6 ? (
            <section className="space-y-7">
              <div>
                <div className="section-label mb-3">Ton rythme</div>
                <h2 className="font-valorax text-[clamp(30px,3.4vw,44px)] leading-[0.9] gradient-text">
                  COMBIEN DE TEMPS PEUX-TU CONSACRER CHAQUE SEMAINE ?
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {WEEKLY_COMMITMENT_OPTIONS.map((option) => {
                  const selected = option.key === weeklyCommitmentKey;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setWeeklyCommitmentKey(option.key)}
                      className={[
                        "rounded-xl border px-4 py-4 text-left transition-all",
                        selected
                          ? "border-blue-500/45 bg-blue-500/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18]"
                      ].join(" ")}
                    >
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
                <div className="section-label mb-3">Resultat</div>
                <h2 className="font-valorax text-[clamp(30px,3.4vw,44px)] leading-[0.9] gradient-text-blue">TON ESPACE EST PRET</h2>
                <p className="font-body-readable text-[14px] text-[#888] mt-3 max-w-[680px]">
                  On t'a prepare une premiere trajectoire selon ton objectif: {selectedGoal.label.toLowerCase()}.
                </p>
              </div>

              <div className="grid lg:grid-cols-[1.35fr_1fr] gap-5">
                <article className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-5">
                  <div>
                    <div className="text-[11px] text-[#666] uppercase tracking-widest mb-2">Parcours recommande</div>
                    <h3 className="font-valorax text-[24px] leading-[0.95]">{recommendation.parcoursTitle}</h3>
                    <p className="text-[12px] text-[#888] mt-1 font-body-readable">{recommendation.parcoursMeta}</p>
                  </div>

                  <div>
                    <div className="text-[12px] font-semibold text-white mb-2">Premieres ressources</div>
                    <div className="space-y-2">
                      {recommendation.resources.map((resource) => (
                        <div key={resource} className="flex items-center gap-2 text-[12px] text-[#9a9a9a] font-body-readable">
                          <iconify-icon icon="lucide:book-marked" style={{ color: "#4F8EF7", fontSize: "14px" }} />
                          <span>{resource}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-blue-500/25 bg-blue-500/10 px-4 py-3 text-[12px] text-blue-100 font-body-readable">
                    <div className="font-semibold mb-1">Objectif</div>
                    {recommendation.objective}
                  </div>
                </article>

                <article className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5 space-y-5">
                  <div>
                    <div className="text-[11px] text-[#666] uppercase tracking-widest mb-2">Ton profil</div>
                    <div className="text-[13px] text-white font-semibold">{selectedGoal.label}</div>
                    <div className="text-[12px] text-[#888] font-body-readable mt-1">{selectedLevel.label}</div>
                    <div className="text-[12px] text-[#888] font-body-readable">{selectedWeeklyCommitment.label} / semaine</div>
                  </div>

                  <div>
                    <div className="text-[12px] font-semibold text-white mb-2">Prochaine session live</div>
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-[12px] text-[#9a9a9a] font-body-readable">
                      {recommendation.nextSession}
                    </div>
                  </div>

                  <div>
                    <div className="text-[12px] font-semibold text-white mb-2">Prochaines etapes</div>
                    <div className="space-y-2">
                      {recommendation.nextSteps.map((stepItem) => {
                        const ui = getStepStateUi(stepItem.state);
                        return (
                          <div key={stepItem.label} className="flex items-center gap-2 text-[12px] font-body-readable">
                            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${ui.chip}`}>
                              <iconify-icon icon={ui.icon} style={{ fontSize: "12px" }} />
                            </span>
                            <span className="text-[#bdbdbd]">{stepItem.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>
              </div>
            </section>
          ) : null}

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