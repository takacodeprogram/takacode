"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dictionnaire des termes techniques du glossaire.
 * Chaque cle est un terme recherche dans le texte.
 */
const GLOSSARY = {
  token:
    "Fragment de texte (mot, morceau de mot ou ponctuation) : l'unite de base que le LLM manipule a chaque etape.",
  tokens:
    "Fragments de texte (mots, morceaux de mots ou ponctuation) : les unites de base manipulees par le LLM.",
  LLM:
    "Large Language Model : modele d'IA entraine sur d'immenses corpus de textes. Il predit le prochain token le plus probable.",
  "context window":
    "Quantite maximale de tokens que le modele peut traiter en une seule fois : sa memoire de travail.",
  hallucination:
    "Reponse plausible mais factuellement fausse generee par le modele. Toujours verifier les faits critiques.",
  MCP:
    "Model Context Protocol : standard ouvert pour connecter une IA a des outils externes (BDD, API, fichiers...).",
  RAG:
    "Retrieval-Augmented Generation : technique qui injecte des documents pertinents dans le prompt pour que l'IA reponde sur tes donnees.",
  agent:
    "LLM equipe d'outils (fichiers, terminal, web...) qui travaille en boucle : planifie, agit, observe et recommence.",
  API:
    "Interface de programmation qui permet a des applications de communiquer entre elles.",
  "fine-tuning":
    "Entrainement supplementaire d'un modele sur des donnees specifiques pour le specialiser.",
  "few-shot":
    "Technique de prompt : donner 2-3 exemples du resultat attendu pour calibrer le format et le style.",
  "zero-shot":
    "Technique de prompt : demander directement sans exemple.",
  "chain of thought":
    "Technique qui demande au modele de raisonner etape par etape, ce qui reduit les erreurs sur les problemes complexes.",
  prompt:
    "Instruction ou question donnee a l'IA. Structure, contexte et format determinent la qualite de la reponse.",
};

// Trier les termes du plus long au plus court pour matcher d'abord les expressions composees
const TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
const ESCAPED = TERMS.map((t) =>
  t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
);

/**
 * Affiche un terme souligne avec un tooltip au clic.
 * Utilise un ref pour detecter le clic externe et fermer le popup.
 */
function GlossaryTooltip({ term }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const definition = GLOSSARY[term];
  if (!definition) return <>{term}</>;

  return (
    <span
      ref={ref}
      onClick={() => setOpen((v) => !v)}
      style={{
        borderBottom: "1px dashed rgba(79, 142, 247, 0.5)",
        cursor: "help",
        position: "relative",
        color: "#89c7ff"
      }}
    >
      {term}
      {open ? (
        <span
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            width: "240px",
            padding: "8px 10px",
            fontSize: "11px",
            lineHeight: "1.4",
            borderRadius: "10px",
            border: "1px solid rgba(79, 142, 247, 0.25)",
            background: "#111",
            color: "#d1d1d1",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            pointerEvents: "auto",
            fontFamily: "var(--font-body, system-ui)"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {definition}
          <span
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              border: "6px solid transparent",
              borderTopColor: "rgba(79, 142, 247, 0.25)"
            }}
          />
        </span>
      ) : null}
    </span>
  );
}

/**
 * Analyse un texte et remplace les termes du glossaire par des tooltips cliquables.
 * Utilise une expression reguliere avec limites de mot (\b).
 */
export function GlossaryText({ text, as = "span", className = "" }) {
  if (!text) return null;

  const pattern = new RegExp(`\\b(${ESCAPED.join("|")})\\b`, "gi");

  const parts = text.split(pattern);

  const Tag = as;

  return (
    <Tag className={className}>
      {parts.map((part, i) => {
        const lower = part.toLowerCase();
        const matchedTerm = TERMS.find((t) => t.toLowerCase() === lower);
        if (matchedTerm) {
          return <GlossaryTooltip key={i} term={matchedTerm} />;
        }
        return part;
      })}
    </Tag>
  );
}
