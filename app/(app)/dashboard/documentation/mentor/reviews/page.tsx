import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Reviewer les projets",
  description: "Guide mentor pour reviewer les projets des apprenants sur TakaCode.",
  path: "/dashboard/documentation/mentor/reviews",
  noIndex: true
});

export default function MentorReviewsDocPage() {
  return (
    <>
      <PageHeader title="REVIEWER LES PROJETS" subtitle="Guide mentor" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Revue de projets</h2>
        <p>
          En tant que mentor, tu peux reviewer les projets soumis par les apprenants.
          Rends-toi dans la section <strong>Revues</strong> pour voir la file d'attente.
        </p>

        <h3>Processus de revue</h3>
        <ol>
          <li>Consulte la liste des projets en attente de revue.</li>
          <li>Ouvre un projet pour voir le travail soumis et les consignes.</li>
          <li>Evalue le projet selon les criteres definis dans le parcours.</li>
          <li>Ajoute un feedback ecrit avec des suggestions d'amelioration.</li>
          <li>Valide ou refuse le projet.</li>
        </ol>

        <h3>Criteres d'evaluation</h3>
        <ul>
          <li>Respect des consignes</li>
          <li>Qualite technique du travail</li>
          <li>Pertinence des choix effectues</li>
          <li>Effort et progression visibles</li>
        </ul>

        <h3>Notifications</h3>
        <p>
          Quand tu reviews un projet, l'apprenant recoit une notification.
          Il peut voir ton feedback et retravailler son projet si necessaire.
        </p>
      </DocContent>
    </>
  );
}

