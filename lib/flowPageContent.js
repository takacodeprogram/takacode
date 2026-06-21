import fs from "node:fs/promises";
import path from "node:path";

const FLOW_DIR = path.join(process.cwd(), "flow-export");

const HREF_TOKEN_TO_ROUTE = {
  homeHref: "/",
  parcoursHref: "/parcours",
  competencesHref: "/competences",
  projetsHref: "/projets",
  ressourcesHref: "/ressources",
  communauteHref: "/communaute",
  tarifsHref: "/tarifs",
  connexionHref: "/signin",
  ctaPrimaryHref: "/projets",
  sessionsHref: "/communaute",
  challengesHref: "/communaute",
  galerieHref: "/projets",
  inscriptionHref: "/signup",
  profilHref: "/communaute",
  aboutHref: "/",
  blogHref: "/ressources",
  contactHref: "/communaute",
  privacyHref: "/privacy",
  termsHref: "/terms",
  frenchHref: "/"
};

const DIRECT_HREF_REPLACEMENTS = {
  ...HREF_TOKEN_TO_ROUTE,
  "https://draft-095df780-601e-4cd7-b102-3817d5cc7eee.preview.superdesign.dev": "/parcours",
  "https://draft-ed7eb485-c940-42df-a4ad-ce4c792c26d4.preview.superdesign.dev": "/projets",
  "https://draft-afb26455-ac89-4ceb-9d0f-2aca5900a69a.preview.superdesign.dev": "/projets",
  "https://draft-6b430e13-6268-4704-83cd-ff9d67d635cf.preview.superdesign.dev": "/communaute"
};

const LINK_BY_ID = {
  "nav-logo-link": "/",
  "nav-accueil-link": "/",
  "nav-home-link": "/",
  "breadcrumb-home-link": "/",
  "breadcrumb-parcours-link": "/parcours",
  "nav-parcours-link": "/parcours",
  "nav-competences-link": "/competences",
  "nav-projets-link": "/projets",
  "nav-ressources-link": "/ressources",
  "nav-communaute-link": "/communaute",
  "nav-tarifs-link": "/tarifs",
  "enroll-cta-primary": "/projets",
  "enroll-cta-secondary": "/projets",
  "assistant-ia-link": "/ressources",
  "cta-final-enroll": "/projets",
  "cta-final-explore": "/parcours",
  "prev-step-link": "/parcours",
  "next-step-link": "/dashboard",
  "resource-guide-link": "/ressources",
  "resource-video-link": "/ressources",
  "resource-template-link": "/ressources",
  "workspace-run-link": "/dashboard",
  "workspace-save-link": "/dashboard",
  "res-1-link": "/ressources",
  "res-2-link": "/ressources",
  "res-3-link": "/ressources",
  "res-4-link": "/ressources",
  "res-5-link": "/ressources",
  "session-join-link": "/communaute",
  "sidebar-dashboard": "/dashboard",
  "sidebar-parcours": "/parcours",
  "sidebar-projets": "/projets",
  "sidebar-ressources": "/ressources",
  "sidebar-galerie": "/projets",
  "sidebar-profil": "/communaute",
  "sidebar-challenges": "/communaute",
  "sidebar-sessions": "/communaute",
  "sidebar-settings": "/dashboard",
  "sidebar-help": "/ressources",
  "dashboard-new-project-btn": "/projets",
  "dashboard-continue-btn": "/parcours",
  "dashboard-all-paths-link": "/parcours",
  "pathway-1-continue": "/parcours",
  "pathway-2-continue": "/parcours",
  "pathway-3-continue": "/parcours",
  "dashboard-all-projects-link": "/projets",
  "proj-recent-1": "/projets",
  "proj-recent-2": "/projets",
  "proj-recent-3": "/projets",
  "dashboard-leaderboard-link": "/communaute",
  "dashboard-session-join": "/communaute",
  "rec-1-link": "/parcours",
  "rec-2-link": "/ressources",
  "rec-3-link": "/ressources",
  "rec-4-link": "/communaute",
  "quick-continue": "/parcours",
  "quick-new-project": "/projets",
  "quick-challenges": "/communaute",
  "quick-gallery": "/projets",
  "quick-profile": "/communaute",
  "all-projects-link": "/projets",
  "project-featured-link": "/projets",
  "project-2-profile-link": "/projets",
  "project-3-profile-link": "/projets",
  "project-4-profile-link": "/projets",
  "project-5-profile-link": "/projets",
  "profile-website-link": "/communaute",
  "profile-github-link": "/communaute",
  "profile-linkedin-link": "/communaute",
  "sidebar-parcours-link": "/parcours",
  "classement-voir-link": "/communaute"
};

const ACTIVE_IDS_BY_KEY = {
  parcours: ["nav-parcours-link", "breadcrumb-parcours-link"],
  projets: ["nav-projets-link"],
  ressources: ["nav-ressources-link", "sidebar-ressources"],
  communaute: ["nav-communaute-link"],
  dashboard: ["nav-ressources-link", "sidebar-dashboard", "sidebar-ressources"]
};

const ACTIVE_PAGE_BY_ROUTE_KEY = {
  home: "home",
  parcours: "parcours",
  competences: "competences",
  projets: "projets",
  ressources: "ressources",
  communaute: "communaute",
  tarifs: "tarifs",
  dashboard: "ressources"
};

function upsertClassToken(classValue, token, shouldExist) {
  const set = new Set(classValue.split(/\s+/).filter(Boolean));
  if (shouldExist) {
    set.add(token);
  } else {
    set.delete(token);
  }
  return [...set].join(" ");
}

function setAnchorClassById(html, id, token, shouldExist) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const idBeforeClass = new RegExp(`(<a[^>]*\\bid="${escapedId}"[^>]*\\bclass=")([^"]*)(")`, "g");
  const classBeforeId = new RegExp(`(<a[^>]*\\bclass=")([^"]*)("(?=[^>]*\\bid="${escapedId}"))`, "g");

  const update = (_, prefix, classValue, suffix) => `${prefix}${upsertClassToken(classValue, token, shouldExist)}${suffix}`;

  let next = html.replace(idBeforeClass, update);
  next = next.replace(classBeforeId, update);
  return next;
}

function replaceHrefById(html, id, href) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const hrefBeforeId = new RegExp(`href="[^"]*"(\\s+id="${escapedId}")`, "g");
  const idBeforeHref = new RegExp(`(id="${escapedId}"[^>]*?)href="[^"]*"`, "g");

  let next = html.replace(hrefBeforeId, `href="${href}"$1`);
  next = next.replace(idBeforeHref, `$1href="${href}"`);
  return next;
}

function replaceBoundHrefTokens(html) {
  return html.replace(/:href=(["'])([A-Za-z0-9_-]+)\1/g, (match, quote, token) => {
    const href = HREF_TOKEN_TO_ROUTE[token];
    if (!href) {
      return `href=${quote}#${quote}`;
    }
    return `href=${quote}${href}${quote}`;
  });
}

function replaceDirectHrefTargets(html) {
  return html.replace(/href=(["'])([^"']+)\1/g, (match, quote, href) => {
    const nextHref = DIRECT_HREF_REPLACEMENTS[href];
    if (!nextHref) {
      return match;
    }
    return `href=${quote}${nextHref}${quote}`;
  });
}

function resolveDynamicActiveClasses(html, routeKey) {
  const activePage = ACTIVE_PAGE_BY_ROUTE_KEY[routeKey] ?? "";
  const pattern = /<a([^>]*?)class="([^"]*)"([^>]*?)\s:class="activePage === '([^']+)' \? 'text-white' : 'text-\[#888\] hover:text-white'"([^>]*)>/g;

  return html.replace(pattern, (_, beforeClass, classValue, between, pageKey, after) => {
    const stateClasses = activePage === pageKey ? "text-white active" : "text-[#888] hover:text-white";
    const mergedClasses = `${classValue} ${stateClasses}`.replace(/\s+/g, " ").trim();
    return `<a${beforeClass}class="${mergedClasses}"${between}${after}>`;
  });
}

function removeAccentMarks(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function stripAccentsInTextNodes(htmlFragment) {
  return htmlFragment.replace(/(^|>)([^<]+)(?=<|$)/g, (match, prefix, textContent) => {
    return `${prefix}${removeAccentMarks(textContent)}`;
  });
}

function stripAccentsInHeadings(html) {
  return html.replace(/(<h([1-6])[^>]*>)([\s\S]*?)(<\/h\2>)/gi, (match, openTag, level, innerHtml, closeTag) => {
    return `${openTag}${stripAccentsInTextNodes(innerHtml)}${closeTag}`;
  });
}

function extractTagContent(html, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  return html.match(regex)?.[1]?.trim() ?? "";
}

function extractStyleBlocks(html) {
  return [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1].trim());
}

function extractBodyHtml(html) {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  return body.replace(/<script[\s\S]*?<\/script>/gi, "").trim();
}

function rewriteLinks(html, routeKey) {
  let next = html;

  Object.entries(LINK_BY_ID).forEach(([id, href]) => {
    next = replaceHrefById(next, id, href);
  });

  // Resolve Flow dynamic href tokens such as :href="parcoursHref".
  next = replaceBoundHrefTokens(next);

  // Replace stale preview URLs with real local routes.
  next = replaceDirectHrefTargets(next);

  // Resolve Flow dynamic active nav classes for the current route.
  next = resolveDynamicActiveClasses(next, routeKey);

  // Enforce no-accent titles from flow exports by normalizing heading text only.
  next = stripAccentsInHeadings(next);

  const activeIds = new Set(ACTIVE_IDS_BY_KEY[routeKey] ?? []);
  Object.keys(LINK_BY_ID).forEach((id) => {
    next = setAnchorClassById(next, id, "active", activeIds.has(id));
  });

  return next;
}

export async function getFlowPageContent(fileName, routeKey) {
  const fullPath = path.join(FLOW_DIR, fileName);
  const html = await fs.readFile(fullPath, "utf8");

  const title = extractTagContent(html, "title") || "TakaCode";
  const styles = extractStyleBlocks(html);
  const bodyHtml = rewriteLinks(extractBodyHtml(html), routeKey);

  return { title, styles, bodyHtml };
}

