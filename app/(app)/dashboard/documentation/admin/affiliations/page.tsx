import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Configurer les affiliations",
  description: "Guide administrateur pour configurer le programme d'affiliation sur TakaCode.",
  path: "/dashboard/documentation/admin/affiliations",
  noIndex: true
});

export default function AdminAffiliationsDocPage() {
  return (
    <>
      <PageHeader title="PROGRAMME D'AFFILIATION" subtitle="Guide administrateur" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Programme d'affiliation</h2>
        <p>
          Le programme d'affiliation permet aux membres de parrainer de nouveaux utilisateurs
          et de suivre leurs recommandations. Chaque membre dispose d'un lien unique.
        </p>

        <h3>Configuration</h3>
        <ul>
          <li>Accede à la section <strong>Affiliations</strong> du panneau d'administration.</li>
          <li>Consulte la liste des affiliés et leurs statistiques.</li>
          <li>Configure les recompenses et les conditions de validation.</li>
        </ul>

        <h3>Suivi</h3>
        <p>
          Le tableau de bord des affiliations affiche pour chaque membre :
        </p>
        <ul>
          <li>Nombre de personnes parrainees</li>
          <li>Points gagnes via le parrainage</li>
          <li>Date du dernier parrainage</li>
        </ul>
      </DocContent>
    </>
  );
}

