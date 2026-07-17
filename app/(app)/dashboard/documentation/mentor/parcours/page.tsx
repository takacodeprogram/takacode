import PageHeader from "../../../../../../components/app-shell/PageHeader";
import DocContent from "../../DocContent";
import { buildPageMetadata } from "../../../../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Créer et gerer un parcours",
  description: "Guide mentor pour créer et gerer des parcours sur TakaCode.",
  path: "/dashboard/documentation/mentor/parcours",
  noIndex: true
});

export default function MentorParcoursDocPage() {
  return (
    <>
      <PageHeader title="CREER ET GERER UN PARCOURS" subtitle="Guide mentor" backHref="/dashboard/documentation" />
      <DocContent>
        <h2>Proposer un parcours</h2>
        <p>
          En tant que mentor, tu peux créer des parcours de formation. Rends-toi dans
          <strong> Proposer un parcours</strong> depuis le menu pour commencer.
        </p>

        <h3>Structure d'un parcours</h3>
        <ul>
          <li><strong>Modules :</strong> grandes sections thematiques du parcours.</li>
          <li><strong>Lecons :</strong> unites d'apprentissage au sein d'un module.</li>
          <li><strong>Ressources :</strong> liens et references pour approfondir chaque lecon.</li>
          <li><strong>Quiz :</strong> questions a choix multiples pour valider les acquis.</li>
          <li><strong>Micro-projets :</strong> mises en pratique pour appliquer les concepts.</li>
        </ul>

        <h3>Validation et publication</h3>
        <p>
          Après avoir cree un parcours, tu peux le soumettre pour validation.
          Un administrateur verifie le contenu avant publication. Une fois approuvé,
          le parcours est visible par tous les apprenants.
        </p>

        <h3>Modifier un parcours existant</h3>
        <p>
          Tu peux modifier les parcours dont tu es l'auteur. Les modifications sont
          visibles immédiatement pour les apprenants (sauf si le parcours est en cours
          de validation).
        </p>
      </DocContent>
    </>
  );
}

