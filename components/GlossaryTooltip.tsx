"use client";

import { useEffect, useRef, useState } from "react";

const GLOSSARY: Record<string, string> = {
  token:
    "Fragment de texte (mot, morceau de mot ou ponctuation) : l'unité de base que le LLM manipule à chaque étape.",
  tokens:
    "Fragments de texte (mots, morceaux de mots ou ponctuation) : les unités de base manipulées par le LLM.",
  LLM:
    "Large Language Model : modèle d'IA entraîné sur d'immenses corpus de textes. Il prédit le prochain token le plus probable.",
  "context window":
    "Quantité maximale de tokens que le modèle peut traiter en une seule fois : sa mémoire de travail.",
  hallucination:
    "Réponse plausible mais factuellement fausse générée par le modèle. Toujours vérifier les faits critiques.",
  MCP:
    "Model Context Protocol : standard ouvert pour connecter une IA à des outils externes (BDD, API, fichiers...).",
  RAG:
    "Retrieval-Augmented Generation : technique qui injecte des documents pertinents dans le prompt pour que l'IA réponde sur tes données.",
  agent:
    "LLM équipé d'outils (fichiers, terminal, web...) qui travaille en boucle : planifie, agit, observe et recommence.",
  API:
    "Interface de programmation qui permet à des applications de communiquer entre elles.",
  "fine-tuning":
    "Entraînement supplémentaire d'un modèle sur des données spécifiques pour le spécialiser.",
  "few-shot":
    "Technique de prompt : donner 2-3 exemples du résultat attendu pour calibrer le format et le style.",
  "zero-shot":
    "Technique de prompt : demander directement sans exemple.",
  "chain of thought":
    "Technique qui demande au modèle de raisonner étape par étape, ce qui réduit les erreurs sur les problèmes complexes.",
  prompt:
    "Instruction ou question donnée à l'IA. Structure, contexte et format déterminent la qualité de la réponse.",
  "adresse IP":
    "Étiquette numérique unique attribuée à chaque appareil connecté à un réseau (comme une adresse postale pour ton ordinateur).",
  "IPv4":
    "Version 4 du protocole IP : 4 nombres séparés par des points (ex: 192.168.1.1). Permet environ 4 milliards d'adresses.",
  "IPv6":
    "Version 6 du protocole IP : format hexadecimal long, créé pour remplacer IPv4 et résoudre la pénurie d'adresses.",
  TCP:
    "Transmission Control Protocol : protocole qui découpe les données en paquets, les envoie, et vérifie qu'ils arrivent dans le bon ordre.",
  UDP:
    "User Datagram Protocol : protocole plus rapide mais sans vérification, utilisé pour le streaming et les jeux en ligne.",
  DNS:
    "Domain Name System : l'annuaire d'Internet qui traduit les noms de domaine (google.com) en adresses IP.",
  HTTP:
    "HyperText Transfer Protocol : le protocole de base du web, définit comment le navigateur et le serveur communiquent.",
  HTTPS:
    "Version sécurisée de HTTP : les données sont chiffrées entre le navigateur et le serveur grâce à TLS/SSL.",
  TLS:
    "Transport Layer Security : protocole de chiffrement qui sécurise les communications sur Internet (le successeur de SSL).",
  SSL:
    "Secure Sockets Layer : ancien protocole de chiffrement remplacé par TLS, mais le terme est encore utilisé couramment.",
  certificat:
    "Document électronique qui vérifie l'identité d'un site web et permet le chiffrement HTTPS. Délivré par une autorité de certification.",
  serveur:
    "Ordinateur distant qui stocke et fournit des données (pages web, fichiers) aux clients qui les demandent.",
  client:
    "Appareil ou logiciel (navigateur, app) qui envoie des requêtes à un serveur pour obtenir des données.",
  navigateur:
    "Logiciel (Chrome, Firefox, Safari) qui affiche les pages web en interprétant le HTML, CSS et JavaScript.",
  "nom de domaine":
    "Adresse lisible d'un site web (ex: takacode.fr) qui pointe vers une adresse IP via le DNS.",
  hebergement:
    "Service qui stocke les fichiers de ton site web sur un serveur accessible 24h/24 sur Internet.",
  URL:
    "Uniform Resource Locator : l'adresse complète d'une ressource sur le web (ex: https://takacode.fr/parcours).",
  paquet:
    "Unité de données transmise sur un réseau. Les fichiers sont découpés en paquets avant d'être envoyés.",
  routeur:
    "Appareil qui achemine les paquets de données entre différents réseaux pour qu'ils arrivent à destination.",
  "bande passante":
    "Quantité de données maximale qui peut être transmise par seconde sur une connexion. Plus c'est haut, plus c'est rapide.",
  ping:
    "Temps de latence entre l'envoi d'une requête et la réception de la réponse. Mesure la réactivité de la connexion.",
  parefeu:
    "Firewall : système de sécurité qui filtre le trafic réseau pour bloquer les connexions non autorisées.",
  proxy:
    "Serveur intermédiaire entre le client et le serveur destination, utilisé pour l'anonymat ou le contournement.",
  CDN:
    "Content Delivery Network : réseau de serveurs distribués dans le monde pour livrer le contenu plus vite aux utilisateurs.",
};

const TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
const ESCAPED = TERMS.map((t) =>
  t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
);

interface GlossaryTooltipProps {
  term: string;
}

function GlossaryTooltip({ term }: GlossaryTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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

interface GlossaryTextProps {
  text?: string;
  as?: React.ElementType<{ className?: string; children?: React.ReactNode }>;
  className?: string;
}

export function GlossaryText({ text, as: Tag = "span", className = "" }: GlossaryTextProps) {
  if (!text) return null;

  const pattern = new RegExp(`\\b(${ESCAPED.join("|")})\\b`, "gi");

  const parts = text.split(pattern);

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
