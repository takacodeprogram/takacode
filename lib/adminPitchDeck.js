import PptxGenJS from "pptxgenjs";

const COLORS = {
  bg: "0A0A0A",
  card: "111111",
  border: "2A2A2A",
  blue: "4F8EF7",
  violet: "9B6DFF",
  cyan: "22D3EE",
  green: "4ADE80",
  white: "FFFFFF",
  muted: "A0A0A0",
  dim: "6F6F6F"
};

function addBackground(slide) {
  slide.background = { color: COLORS.bg };

  slide.addShape("ellipse", {
    x: -1.2,
    y: -1,
    w: 4.1,
    h: 4.1,
    fill: { color: COLORS.blue, transparency: 82 },
    line: { color: COLORS.bg, transparency: 100 }
  });

  slide.addShape("ellipse", {
    x: 9.6,
    y: -0.8,
    w: 3.6,
    h: 3.6,
    fill: { color: COLORS.violet, transparency: 84 },
    line: { color: COLORS.bg, transparency: 100 }
  });

  slide.addShape("ellipse", {
    x: 4.7,
    y: 6.3,
    w: 3,
    h: 3,
    fill: { color: COLORS.cyan, transparency: 90 },
    line: { color: COLORS.bg, transparency: 100 }
  });
}

function addHeader(slide, { label, title, appUrl }) {
  addBackground(slide);

  slide.addText("TAKACODE", {
    x: 0.6,
    y: 0.26,
    w: 3.1,
    h: 0.4,
    fontFace: "Poppins",
    bold: true,
    color: COLORS.blue,
    fontSize: 14,
    charSpace: 2
  });

  slide.addText(String(label || "PITCH").toUpperCase(), {
    x: 0.6,
    y: 0.72,
    w: 5,
    h: 0.35,
    fontFace: "Poppins",
    bold: true,
    color: COLORS.cyan,
    fontSize: 10,
    charSpace: 2
  });

  slide.addText(title, {
    x: 0.6,
    y: 1.08,
    w: 8.6,
    h: 1.25,
    fontFace: "Poppins",
    bold: true,
    italic: true,
    color: COLORS.white,
    fontSize: 30,
    valign: "top"
  });

  if (appUrl) {
    slide.addText(appUrl, {
      x: 8.2,
      y: 0.3,
      w: 4.45,
      h: 0.35,
      fontFace: "Poppins",
      color: COLORS.green,
      fontSize: 10,
      align: "right"
    });
  }

  slide.addShape("line", {
    x: 0.6,
    y: 2.42,
    w: 12.15,
    h: 0,
    line: { color: COLORS.border, pt: 1 }
  });
}

function addCard(slide, { x, y, w, h, title, lines, accent }) {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: COLORS.card, transparency: 8 },
    line: { color: COLORS.border, pt: 1 }
  });

  slide.addShape("line", {
    x: x + 0.16,
    y: y + 0.2,
    w: w - 0.32,
    h: 0,
    line: { color: accent || COLORS.blue, pt: 1.5 }
  });

  slide.addText(title, {
    x: x + 0.2,
    y: y + 0.28,
    w: w - 0.4,
    h: 0.34,
    fontFace: "Poppins",
    bold: true,
    color: COLORS.white,
    fontSize: 12
  });

  slide.addText(lines.map((line) => `- ${line}`).join("\n"), {
    x: x + 0.2,
    y: y + 0.72,
    w: w - 0.4,
    h: h - 0.86,
    fontFace: "Poppins",
    color: COLORS.muted,
    fontSize: 10.5,
    breakLine: true,
    valign: "top",
    margin: 0.02,
    fit: "resize"
  });
}

function addCoverSlide(pptx, appUrl) {
  const slide = pptx.addSlide();

  addHeader(slide, {
    label: "Pitch deploiement",
    title: "TakaCode\nCommunaute + Parcours + Projets",
    appUrl
  });

  slide.addText(
    "Application deployee pour apprendre en construisant.\nParcours guides, projets concretisables, dashboard utilisateur et panel admin.",
    {
      x: 0.62,
      y: 2.7,
      w: 8.2,
      h: 1.1,
      fontFace: "Poppins",
      color: COLORS.muted,
      fontSize: 14,
      breakLine: true,
      valign: "top"
    }
  );

  slide.addShape("roundRect", {
    x: 0.62,
    y: 4.08,
    w: 4.2,
    h: 1.8,
    rectRadius: 0.08,
    fill: { color: COLORS.card, transparency: 6 },
    line: { color: COLORS.blue, pt: 1 }
  });

  slide.addText("Positionnement", {
    x: 0.84,
    y: 4.3,
    w: 3.4,
    h: 0.3,
    fontFace: "Poppins",
    bold: true,
    color: COLORS.blue,
    fontSize: 11
  });

  slide.addText("Apprendre vite\nProduire des livrables\nProgresser avec la communaute", {
    x: 0.84,
    y: 4.62,
    w: 3.84,
    h: 1.08,
    fontFace: "Poppins",
    color: COLORS.white,
    fontSize: 14,
    bold: true,
    breakLine: true,
    fit: "resize"
  });

  slide.addShape("roundRect", {
    x: 5.08,
    y: 4.08,
    w: 7.68,
    h: 1.8,
    rectRadius: 0.08,
    fill: { color: COLORS.card, transparency: 6 },
    line: { color: COLORS.border, pt: 1 }
  });

  slide.addText("Story", {
    x: 5.3,
    y: 4.3,
    w: 2,
    h: 0.28,
    fontFace: "Poppins",
    bold: true,
    color: COLORS.cyan,
    fontSize: 11
  });

  slide.addText(
    "Du onboarding jusqu'au dashboard, chaque ecran pousse l'utilisateur vers l'execution d'un projet reel.",
    {
      x: 5.3,
      y: 4.6,
      w: 7.25,
      h: 0.95,
      fontFace: "Poppins",
      color: COLORS.white,
      fontSize: 13,
      breakLine: true,
      fit: "resize"
    }
  );

  slide.addText(`Version deck: ${new Date().toISOString().slice(0, 10)}`, {
    x: 10,
    y: 6.95,
    w: 2.75,
    h: 0.2,
    fontFace: "Poppins",
    color: COLORS.dim,
    fontSize: 8,
    align: "right"
  });
}

function addProblemSlide(pptx, appUrl) {
  const slide = pptx.addSlide();

  addHeader(slide, {
    label: "Probleme et solution",
    title: "Pourquoi TakaCode existe",
    appUrl
  });

  addCard(slide, {
    x: 0.62,
    y: 2.72,
    w: 6.22,
    h: 3.96,
    title: "Problemes courants",
    accent: COLORS.violet,
    lines: [
      "Formation trop theorique sans livrable",
      "Parcours flous et difficultes a rester constant",
      "Peu de feedback terrain pour progresser",
      "Difficile de connecter IA, no-code et dev dans un seul flux"
    ]
  });

  addCard(slide, {
    x: 6.98,
    y: 2.72,
    w: 5.8,
    h: 3.96,
    title: "Reponse TakaCode",
    accent: COLORS.blue,
    lines: [
      "Parcours structures avec etapes concretes",
      "Projets directement actionnables",
      "Sessions live + communaute active",
      "Dashboard de progression orientee execution"
    ]
  });
}

function addProductSlide(pptx, appUrl) {
  const slide = pptx.addSlide();

  addHeader(slide, {
    label: "Produit",
    title: "Experience utilisateur de bout en bout",
    appUrl
  });

  const cards = [
    {
      x: 0.62,
      title: "01 Onboarding",
      lines: ["Objectif utilisateur", "Niveau actuel", "Outils preferes"]
    },
    {
      x: 3.78,
      title: "02 Parcours",
      lines: ["Catalogue clair", "Competences fournies", "Etapes de progression"]
    },
    {
      x: 6.94,
      title: "03 Projets",
      lines: ["Objectif", "Livrable final", "Stack recommandee"]
    },
    {
      x: 10.1,
      title: "04 Dashboard",
      lines: ["Suivi personnel", "Actions rapides", "Acces ressources"]
    }
  ];

  cards.forEach((item, index) => {
    addCard(slide, {
      x: item.x,
      y: 2.9,
      w: 2.95,
      h: 3.2,
      title: item.title,
      lines: item.lines,
      accent: index % 2 === 0 ? COLORS.blue : COLORS.cyan
    });

    if (index < cards.length - 1) {
      slide.addShape("chevron", {
        x: item.x + 2.86,
        y: 4.1,
        w: 0.22,
        h: 0.5,
        fill: { color: COLORS.dim, transparency: 20 },
        line: { color: COLORS.dim, transparency: 100 }
      });
    }
  });

  slide.addText("Resultat: un utilisateur passe rapidement de l'idee a un projet executable.", {
    x: 0.62,
    y: 6.45,
    w: 12.15,
    h: 0.4,
    fontFace: "Poppins",
    color: COLORS.green,
    bold: true,
    fontSize: 12.5
  });
}

function addTechSlide(pptx, appUrl) {
  const slide = pptx.addSlide();

  addHeader(slide, {
    label: "Architecture",
    title: "Stack de production et deployment",
    appUrl
  });

  addCard(slide, {
    x: 0.62,
    y: 2.72,
    w: 4,
    h: 3.94,
    title: "Frontend",
    accent: COLORS.blue,
    lines: ["Next.js App Router", "UI dark premium TakaCode", "Pages publiques + espace auth"]
  });

  addCard(slide, {
    x: 4.8,
    y: 2.72,
    w: 4,
    h: 3.94,
    title: "Backend et data",
    accent: COLORS.cyan,
    lines: ["Supabase Auth", "Tables user_profiles et tracks", "RLS et controle de roles admin"]
  });

  addCard(slide, {
    x: 8.98,
    y: 2.72,
    w: 3.8,
    h: 3.94,
    title: "DevOps",
    accent: COLORS.violet,
    lines: ["GitHub -> Vercel", "Build Next.js valide", "URL production active"]
  });
}

function addTractionSlide(pptx, appUrl) {
  const slide = pptx.addSlide();

  addHeader(slide, {
    label: "Traction",
    title: "Positionnement et impact",
    appUrl
  });

  addCard(slide, {
    x: 0.62,
    y: 2.8,
    w: 3.85,
    h: 2.25,
    title: "Audience",
    accent: COLORS.blue,
    lines: ["2 400+ membres", "Communaute Discord + Twitch", "Parcours multi-domaines"]
  });

  addCard(slide, {
    x: 4.64,
    y: 2.8,
    w: 3.85,
    h: 2.25,
    title: "Execution",
    accent: COLORS.cyan,
    lines: ["Catalogue parcours detaille", "Bibliotheque projets claire", "Dashboard utilisateur/admin"]
  });

  addCard(slide, {
    x: 8.66,
    y: 2.8,
    w: 4.12,
    h: 2.25,
    title: "Monetisation cible",
    accent: COLORS.violet,
    lines: ["Freemium + offres premium", "Coaching et mentorat", "Services B2B formation"]
  });

  slide.addShape("roundRect", {
    x: 0.62,
    y: 5.24,
    w: 12.16,
    h: 1.3,
    rectRadius: 0.08,
    fill: { color: COLORS.card, transparency: 6 },
    line: { color: COLORS.border, pt: 1 }
  });

  slide.addText("Message clef investisseurs / partenaires", {
    x: 0.86,
    y: 5.48,
    w: 4.4,
    h: 0.24,
    fontFace: "Poppins",
    bold: true,
    color: COLORS.blue,
    fontSize: 11
  });

  slide.addText(
    "TakaCode transforme l'apprentissage numerique en execution concrete grace a un produit deployee, un parcours guide et une communaute active.",
    {
      x: 0.86,
      y: 5.76,
      w: 11.7,
      h: 0.56,
      fontFace: "Poppins",
      color: COLORS.white,
      fontSize: 13,
      bold: true,
      fit: "resize"
    }
  );
}

function addRoadmapSlide(pptx, appUrl) {
  const slide = pptx.addSlide();

  addHeader(slide, {
    label: "Roadmap",
    title: "Prochaines etapes de croissance",
    appUrl
  });

  addCard(slide, {
    x: 0.62,
    y: 2.82,
    w: 3.95,
    h: 3.84,
    title: "Phase 1 (0-2 mois)",
    accent: COLORS.blue,
    lines: [
      "Completer onboarding intelligent",
      "Ajouter analytics produit",
      "Lancer acquisition communautaire"
    ]
  });

  addCard(slide, {
    x: 4.74,
    y: 2.82,
    w: 3.95,
    h: 3.84,
    title: "Phase 2 (3-6 mois)",
    accent: COLORS.cyan,
    lines: [
      "Programme mentorat premium",
      "Bundles parcours + projets",
      "Pilotage conversion dashboard"
    ]
  });

  addCard(slide, {
    x: 8.86,
    y: 2.82,
    w: 3.92,
    h: 3.84,
    title: "Phase 3 (6+ mois)",
    accent: COLORS.violet,
    lines: [
      "Offres B2B pour equipes",
      "Marketplace de projets",
      "Expansion regionale Afrique francophone"
    ]
  });

  slide.addText("Call to action", {
    x: 0.62,
    y: 6.74,
    w: 1.9,
    h: 0.25,
    fontFace: "Poppins",
    bold: true,
    color: COLORS.green,
    fontSize: 11
  });

  slide.addText(
    "Soutenir TakaCode: acceleration produit, acquisition utilisateur et partenariats strategiques.",
    {
      x: 0.62,
      y: 6.98,
      w: 12.1,
      h: 0.3,
      fontFace: "Poppins",
      color: COLORS.white,
      fontSize: 11.5,
      bold: true
    }
  );
}

function resolveAppUrl(inputUrl) {
  const candidates = [
    inputUrl,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${String(process.env.VERCEL_PROJECT_PRODUCTION_URL).replace(/^https?:\/\//i, "")}`
      : "",
    "https://takacode.vercel.app"
  ];

  for (const candidate of candidates) {
    const value = String(candidate || "").trim();
    if (!value) {
      continue;
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    return `https://${value.replace(/^\/+/, "")}`;
  }

  return "https://takacode.vercel.app";
}

export async function buildAdminPitchDeckBuffer({ appUrl } = {}) {
  const resolvedAppUrl = resolveAppUrl(appUrl);

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "TakaCode";
  pptx.company = "TakaCode";
  pptx.subject = "Pitch deck de l'application TakaCode deployee";
  pptx.title = "TakaCode - Pitch Deck";

  addCoverSlide(pptx, resolvedAppUrl);
  addProblemSlide(pptx, resolvedAppUrl);
  addProductSlide(pptx, resolvedAppUrl);
  addTechSlide(pptx, resolvedAppUrl);
  addTractionSlide(pptx, resolvedAppUrl);
  addRoadmapSlide(pptx, resolvedAppUrl);

  const payload = await pptx.write({ outputType: "arraybuffer" });
  return Buffer.from(payload);
}
