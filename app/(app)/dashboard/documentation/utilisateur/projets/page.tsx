import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Construire et publier son projet",
  description: "Guide pour créer, construire et publier ton projet digital sur TakaCode.",
  path: "/dashboard/documentation/utilisateur/projets",
  noIndex: true
});

export default function ProjetsDocPage() {
  return (
    <>
      <PageHeader title="CONSTRUIRE ET PUBLIER TON PROJET" subtitle="Guide utilisateur" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Le projet est au coeur de TakaCode</h2>
        <p>
          Tout commence par un projet. Pas un exercice, pas un devoir : un vrai projet digital que tu vas construire,
          mettre en ligne et monetiser. Les parcours, les ressources et les mentors sont la pour t'y aider.
        </p>

        <h3>1. Creer ton projet</h3>
        <p>
          Apres ton inscription, un premier projet est cree automatiquement. Tu peux le modifier ou en creer d'autres
          depuis la section <strong>Mes projets</strong>.
        </p>
        <ul>
          <li>Choisis un nom et un objectif clair pour ton projet.</li>
          <li>Sélectionne un starter kit (site vitrine, SaaS, e-commerce, blog, app mobile, API, IA chatbot, dashboard).</li>
          <li>Definis une deadline pour te fixer un rythme.</li>
        </ul>

        <h3>2. Suivre les parcours lies a ton projet</h3>
        <p>
          Chaque parcours correspond a un archetype de projet. Quand tu choisis un starter kit, les parcours
          recommandes te sont proposes. Chaque leçon te rapproche de la mise en ligne.
        </p>
        <ul>
          <li>Les modules et leçons sont concus pour produire des livrables concrets.</li>
          <li>Les quiz verifient ta comprehension avant de passer a la suite.</li>
          <li>Les micro-projets sont des étapes de ton projet principal.</li>
        </ul>

        <h3>3. Publier ton projet</h3>
        <p>
          Une fois construit, suis le guide de déploiement pour mettre ton projet en ligne :
        </p>
        <ol>
          <li>Pousse ton code sur GitHub (un dépôt est crée automatiquement).</li>
          <li>Connecte-le a Vercel ou Netlify pour le déploiement.</li>
          <li>Attache un domaine personnalise si tu en as un.</li>
          <li>Active les analytics pour suivre tes visiteurs.</li>
        </ol>

        <h3>4. Monetiser ton projet</h3>
        <p>
          Un projet en ligne peut generer des revenus. Selon le type de projet, plusieurs voies s'offrent a toi :
        </p>
        <ul>
          <li><strong>Abonnements</strong> : Stripe, factures recurrentes, metering.</li>
          <li><strong>Produits digitaux</strong> : ebooks, formations, templates, presets.</li>
          <li><strong>Publicite et affiliation</strong> : audiences, partenariats.</li>
          <li><strong>Freelance / prestation</strong> : utilise ton projet comme portfolio.</li>
        </ul>
        <p>
          Les guides de monetisation t'accompagnent pas a pas dans chaque approche.
        </p>

        <h3>Modes de validation des etapes</h3>
        <ul>
          <li><strong>Automatique :</strong> vérification par des critères prédéfinis.</li>
          <li><strong>Par l'IA :</strong> analyse et feedback generes automatiquement.</li>
          <li><strong>Par un pair :</strong> un autre membre evalue ton livrable.</li>
          <li><strong>Par un mentor :</strong> evaluation personnalisée par un encadrant.</li>
        </ul>
      </DocContent>
    </>
  );
}
